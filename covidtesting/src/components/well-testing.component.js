import React, {Component} from 'react';
import auth from '../auth';
import axios from 'axios';

// well_testing.getWellTests, well_testing.addWellTest, well_testing.deleteWellTest, well_testing.editWellTest

export default class WellTesting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tWellBarcode: '',
            tPoolBarcode: '',
            tResult: 'in-progress',
            wellBarcodes: [],
            poolBarcodes: [],
            results: [],
            selectedIndex: -1,
            editingIndex: -1
        }
    }

    handleLogout() {
        auth.labLogout();
        this.props.history.push('/lab_login');
    }

    handleWellChange(e) {
        this.setState({tWellBarcode:e.target.value});
        if (this.state.editingIndex >= 0) {
            this.setState({
                editingIndex: -1
            })
        }
    }

    handlePoolChange(e) {
        this.setState({tPoolBarcode:e.target.value});
        if (this.state.editingIndex >= 0) {
            this.setState({
                editingIndex: -1
            })
        }
    }

    addWell(e) {
        e.preventDefault();
        if (this.state.tWellBarcode.length > 0 && this.state.tPoolBarcode.length > 0) {
            if (this.state.editingIndex >= 0) {
                const info = {
                    method: "well_testing.editWellTest",
                    wellBarcode: this.state.tWellBarcode,
                    poolBarcode: this.state.tPoolBarcode,
                    result: this.state.tResult
                }
                axios.post("http://localhost:5000/well_testing",info)
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({
                                wellBarcodes: res.data.map(well => well.wellBarcode),
                                poolBarcodes: res.data.map(well => well.poolBarcode),
                                results: res.data.map(well => well.result),
                                tWellBarcode: '',
                                tPoolBarcode: '',
                                tResult: 'in-progress',
                                editingIndex: -1
                            })
                        }
                        else if (res.status === 404) {
                            alert('Well or pool does not exist.')
                        }
                    }).catch(error => alert(error));

                // const resultsClone = [...this.state.results];
                // resultsClone[this.state.editingIndex] = this.state.tResult;
                // this.setState({
                //     results: resultsClone
                // })
                // this.setState({
                //     tWellBarcode: '',
                //     tPoolBarcode: '',
                //     tResult: 'in-progress',
                //     editingIndex: -1
                // })
            }
            else {
                const info = {
                    method: "well_testing.addWellTest",
                    wellBarcode: this.state.tWellBarcode,
                    poolBarcode: this.state.tPoolBarcode,
                    result: this.state.tResult
                }
                axios.post("http://localhost:5000/well_testing",info)
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({
                                wellBarcodes: res.data.map(well => well.wellBarcode),
                                poolBarcodes: res.data.map(well => well.poolBarcode),
                                results: res.data.map(well => well.result),
                                tWellBarcode: '',
                                tPoolBarcode: '',
                                tResult: 'in-progress'
                            })
                        }
                        else if (res.status === 404) {
                            alert('Pool does not exist.')
                        }
                    }).catch(error => alert(error));

                // this.setState({
                //     wellBarcodes: [...this.state.wellBarcodes,this.state.tWellBarcode],
                //     poolBarcodes: [...this.state.poolBarcodes,this.state.tPoolBarcode],
                //     results: [...this.state.results,this.state.tResult]
                // })
                // this.setState({
                //     tWellBarcode: '',
                //     tPoolBarcode: '',
                //     tResult: 'in-progress'
                // })
            }
        }
    }

    componentDidMount() {
        const info = {
            method: "well_testing.getWellTests"
        }
        axios.post("http://localhost:5000/well_testing",info)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        wellBarcodes: res.data.map(well => well.wellBarcode),
                        poolBarcodes: res.data.map(well => well.poolBarcode),
                        results: res.data.map(well => well.result)
                    })
                }
            }).catch(error => alert(error));

        // this.setState({
        //     wellBarcodes: ['w1','w2'],
        //     poolBarcodes: ['p1','p2'],
        //     results: ['negative','positive']
        // })
    }

    editWell(e) {
        e.preventDefault();
        if (this.state.selectedIndex !== -1) {
            this.setState({
                tWellBarcode: this.state.wellBarcodes[this.state.selectedIndex],
                tPoolBarcode: this.state.poolBarcodes[this.state.selectedIndex],
                tResult: this.state.results[this.state.selectedIndex],
                editingIndex: this.state.selectedIndex
            })
        }
    }

    deleteWell(e) {
        e.preventDefault();
        const info = {
            method: "well_testing.deleteWellTest",
            wellBarcode: this.state.wellBarcodes[this.state.selectedIndex],
            poolBarcode: this.state.poolBarcodes[this.state.selectedIndex], // idk
            result: this.state.results[this.state.selectedIndex]    // idk
        }
        axios.post("http://localhost:5000/well_testing",info)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        wellBarcodes: res.data.map(well => well.wellBarcode),
                        poolBarcodes: res.data.map(well => well.poolBarcode),
                        results: res.data.map(well => well.result),
                        selectedIndex: -1
                    })
                }
                else if (res.status == 404) {
                    alert("(Well, pool, result) not found.");
                }
            }).catch(error => alert(error));

        // const wellBarcodesClone = [...this.state.wellBarcodes];
        // const poolBarcodesClone = [...this.state.poolBarcodes];
        // const resultsClone = [...this.state.results];
        // wellBarcodesClone.splice(this.state.selectedIndex,1);
        // poolBarcodesClone.splice(this.state.selectedIndex,1);
        // resultsClone.splice(this.state.selectedIndex,1);
        // this.setState({
        //     wellBarcodes: wellBarcodesClone,
        //     poolBarcodes: poolBarcodesClone,
        //     results: resultsClone,
        //     selectedIndex: -1
        // })
    }

    editIndicator() {
        if (this.state.editingIndex != -1) {
            return ' editing'
        }
    }

    render() {
        return (
            <div>
                <p>Well Testing</p><br/>
                <form onSubmit={e => this.addWell(e)}>
                    Well Barcode: <input type='text' onChange={e => this.handleWellChange(e)} value={this.state.tWellBarcode} /><br/>
                    Pool Barcode: <input type='text' onChange={e => this.handlePoolChange(e)} value={this.state.tPoolBarcode} /><br/>
                    Result: <select value={this.state.tResult} onChange={e => this.setState({tResult:e.target.value})}>
                        <option value='in progress'>in progress</option>
                        <option value='negative'>negative</option>
                        <option value='positive'>positive</option>
                    </select><br/>
                    <input type='submit' value='Add' />{this.editIndicator()}
                </form><br/>
                <form>
                    <table>
                        <thead>
                            <tr><td>Well Barcode</td><td>Pool Barcode</td><td>Result</td></tr>
                        </thead>
                        <tbody>
                            {
                                this.state.wellBarcodes.map((wellBarcode,index) => {
                                    return (
                                        <tr>
                                            <td><input type='radio' onChange={() => this.setState({selectedIndex: index})} checked={index==this.state.selectedIndex} />{wellBarcode}</td>
                                            <td>{this.state.poolBarcodes[index]}</td>
                                            <td>{this.state.results[index]}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <button onClick={e => this.editWell(e)}>Edit</button><button onClick={e => this.deleteWell(e)}>Delete</button>
                </form><br/>
                <button onClick={() => this.handleLogout()}>Logout</button>
            </div>
        )
    }
}