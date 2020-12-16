import React, {Component} from 'react';
import auth from '../auth';
import axios from 'axios';

// pool_mapping.getPools, pool_mapping.addPool, pool_mapping.deletePool, pool_mapping.editPool

export default class PoolMapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tentativePoolBarcode: '',
            tentativeTestBarcodes: [''],
            poolBarcodes: [],
            testBarcodes: [],
            selectedIndex: -1,
            editingIndex: -1
        }
    }

    handleLogout() {
        auth.labLogout();
        this.props.history.push('/lab_login');
    }

    handlePoolBarcodeChange(e) {
        this.setState({tentativePoolBarcode: e.target.value});
        if (this.state.editingIndex >= 0) {
            this.setState({
                editingIndex: -1,
                selectedIndex: -1
            })
        }
    }

    handleTTBChange(e,index) {
        let tTBsClone = [...this.state.tentativeTestBarcodes];
        tTBsClone[index] = e.target.value;
        this.setState({tentativeTestBarcodes: tTBsClone});
    }

    addTTB(e) {
        e.preventDefault();
        this.setState({tentativeTestBarcodes: [...this.state.tentativeTestBarcodes,'']})
    }

    deleteTTB(e,index) {
        e.preventDefault();
        let tTBsClone = [...this.state.tentativeTestBarcodes];
        tTBsClone.splice(index,1);
        this.setState({tentativeTestBarcodes: tTBsClone});
    }

    submitPool = (e) => {
        e.preventDefault();
        const properTTB = this.state.tentativeTestBarcodes.filter(x => x.length>0);
        if (properTTB.length>0 && this.state.tentativePoolBarcode.length>0) {
            if (this.state.editingIndex >= 0) { // edit
                const info = {
                    method: 'pool_mapping.editPool',
                    poolBarcode: this.state.tentativePoolBarcode,
                    testBarcodes: properTTB
                }
                // 200 for successful addition; include poolBarcode:testBarcodes mappings; testBarcodes is an array
                // 404 if a test barcode does not exist
                axios.post("http://localhost:5000/pool_mapping",info)
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({
                                poolBarcodes: res.data.map(pool => pool.poolBarcode),
                                testBarcodes: res.data.map(pool => pool.testBarcodes),
                                tentativePoolBarcode: '',
                                tentativeTestBarcodes: [''],
                                editingIndex: -1
                            })
                        }
                        else if (res.status === 404) {
                            alert("One or more of the test barcodes don't exist.");
                        }
                    }).catch(error => alert(error));

                // const testBarcodesClone = [...this.state.testBarcodes];
                // testBarcodesClone[this.state.editingIndex] = [...properTTB]
                // if (properTTB.length>0) {
                //     this.setState({
                //         testBarcodes: testBarcodesClone
                //     })
                //     this.setState({
                //         tentativePoolBarcode: '',
                //         tentativeTestBarcodes: [''],
                //         editingIndex: -1
                //     })
                // }
            }
            else {  // add
                let info = {
                    method: 'pool_mapping.addPool',
                    poolBarcode: this.state.tentativePoolBarcode,
                    testBarcodes: properTTB
                }
                // 200 for successful addition; include poolBarcode:testBarcodes mappings; testBarcodes is an array
                // 404 if a test barcode does not exist
                axios.post("http://localhost:5000/pool_mapping",info)
                    .then(res => {
                        info = {
                            method: "pool_mapping.getPools"
                        }
                        // 200 for successful get; include poolBarcode:testBarcodes mappings; testBarcodes is an array
                        axios.post("http://localhost:5000/pool_mapping",info)
                            .then(res => {
                                if (res.status === 200) {
                                    let poolHash = {};
                                    res.data.forEach(poolandtest => {
                                        if (poolHash[poolandtest.poolBarcode] === undefined) {
                                            poolHash[poolandtest.poolBarcode] = [];
                                        }
                                        poolHash[poolandtest.poolBarcode].push(poolandtest.testBarcode);
                                    });
                                    let poolBarcodesArray = [];
                                    let testBarcodesArray = [];
                                    for(var pool in poolHash) {
                                        poolBarcodesArray.push(pool)
                                        testBarcodesArray.push(poolHash[pool])
                                    }
                                    this.setState({
                                        poolBarcodes: poolBarcodesArray,
                                        testBarcodes: testBarcodesArray
                                    })
                                }
                            }).catch(error => alert(error));
                    }).catch(error => alert(error));


                   
    
                // this.setState({
                //     poolBarcodes: [...this.state.poolBarcodes,this.state.tentativePoolBarcode],
                //     testBarcodes: [...this.state.testBarcodes,properTTB]
                // })
                // this.setState({
                //     tentativePoolBarcode: '',
                //     tentativeTestBarcodes: ['']
                // })
            }
        }
    }

    deletePool(e) {
        e.preventDefault();
        const info = {
            method: 'pool_mapping.deletePool',
            poolBarcode: this.state.poolBarcodes[this.state.selectedIndex]
        }
        // 200 for successful deletion; include poolBarcode:testBarcodes mappings; testBarcodes is an array
        // 409 if target pool is in a well (do not delete pool)
        axios.post("http://localhost:5000/pool_mapping",info)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        poolBarcodes: res.data.map(pool => pool.poolBarcode),
                        testBarcodes: res.data.map(pool => pool.testBarcodes),
                        selectedIndex: -1
                    })
                }
                else if (res.status === 409) {
                    alert('Pool is in a well.');
                }
            }).catch(error => alert(error));

        // const poolBarcodesClone = [...this.state.poolBarcodes];
        // const testBarcodesClone = [...this.state.testBarcodes];
        // poolBarcodesClone.splice(this.state.selectedIndex,1);
        // testBarcodesClone.splice(this.state.selectedIndex,1);
        // this.setState({
        //     poolBarcodes: poolBarcodesClone,
        //     testBarcodes: testBarcodesClone,
        //     selectedIndex: -1
        // })
    }

    editPool(e) {   // doesn't change anything, just sets a pool up to be edited
        e.preventDefault();
        if(this.state.selectedIndex !== -1) {
            this.setState({
                tentativePoolBarcode: this.state.poolBarcodes[this.state.selectedIndex],
                tentativeTestBarcodes: [...this.state.testBarcodes[this.state.selectedIndex]],
                editingIndex: this.state.selectedIndex
            })
        }
    }

    editIndicator() {
        if (this.state.editingIndex !== -1) {
            return ' editing'
        }
    }

    componentDidMount() {
        const info = {
            method: "pool_mapping.getPools"
        }
        // 200 for successful get; include poolBarcode:testBarcodes mappings; testBarcodes is an array
        axios.post("http://localhost:5000/pool_mapping",info)
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    let poolHash = {};
                    res.data.forEach(poolandtest => {
                        if (poolHash[poolandtest.poolBarcode] === undefined) {
                            poolHash[poolandtest.poolBarcode] = [];
                        }
                        poolHash[poolandtest.poolBarcode].push(poolandtest.testBarcode);
                    });
                    let poolBarcodesArray = [];
                    let testBarcodesArray = [];
                    for(var pool in poolHash) {
                        poolBarcodesArray.push(pool)
                        testBarcodesArray.push(poolHash[pool])
                    }
                    this.setState({
                        poolBarcodes: poolBarcodesArray,
                        testBarcodes: testBarcodesArray
                    })
                }
            }).catch(error => alert(error));

        // this.setState({
        //     poolBarcodes: ['pl1','pl2'],
        //     testBarcodes: [['tb1','tb2'],['tb3']]
        // })
    }

    render() {
        return (
            <div>
                <p>Pool Mapping</p><br />
                <form onSubmit={this.submitPool}>
                    Pool Barcode: <input type='text' onChange={e => this.handlePoolBarcodeChange(e)} value={this.state.tentativePoolBarcode} /><br />
                    Test Barcodes:
                    <table>
                        <tbody>
                            {this.state.tentativeTestBarcodes.map((tTB,index) => {
                                return(
                                    <tr>
                                        <td><input type='text' onChange={e => this.handleTTBChange(e,index)} value={this.state.tentativeTestBarcodes[index]} /></td>
                                        <td><button onClick={e => this.deleteTTB(e,index)}>delete</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr><td><button onClick={e => this.addTTB(e)}>Add more rows</button></td></tr>
                        </tfoot>
                    </table>
                    <input type='submit' value='Submit pool' />{this.editIndicator()}
                </form> <br/>
                <form>
                    <table>
                        <thead>
                            <tr><td>Pool Barcode</td><td>Test Barcodes</td></tr>
                        </thead>
                        <tbody>
                            {
                                this.state.poolBarcodes.map((poolBarcode,index) => {
                                    return (
                                        <tr>
                                            <td><input type='radio' onChange={() => this.setState({selectedIndex: index})} checked={index===this.state.selectedIndex} />{poolBarcode}</td>
                                            <td>{this.state.testBarcodes[index].reduce((acc,x) => acc+', '+x, '').substring(2)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <button onClick={(e) => this.editPool(e)}>Edit Pool</button><button onClick={(e) => this.deletePool(e)}>Delete Pool</button>
                </form> <br/>
                <button onClick={() => this.handleLogout()}>Logout</button>
            </div>
        )
    }
}