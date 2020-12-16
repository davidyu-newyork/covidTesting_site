import axios from 'axios';
import React, {Component} from 'react';
import auth from '../auth';

// test_collection.getTests, test_collection.addTest, test_collection.deleteTest

export default class TestCollection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tentativeTestBarcode: '',
            tentativeEmployeeID:'',
            testBarcodes: [],
            employeeIDs: [],
            selectedIndex: -1
        }
    }

    handleLogout() {
        auth.labLogout();
        this.props.history.push('/lab_login');
    }

    addTest = (e) => {
        e.preventDefault();
        if (this.state.tentativeEmployeeID !== '' && this.state.tentativeTestBarcode !== '') {
            let info = {
                method: 'test_collection.addTest',
                testBarcode: this.state.tentativeTestBarcode,
                employeeID: this.state.tentativeEmployeeID,
                collectedBy: auth.getLabAuth(),
                collectionTime: new Date()
            }
            // 200 for successful addition; include testBarcode:employeeID mappings in this case
            // 404 if employee does not exist
            // 409 if test barcode already exists
            axios.post('http://localhost:5000/test_collection',info)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            testBarcodes: res.data.map(test => test.testBarcode),
                            employeeIDs: res.data.map(test => test.employeeID)
                        })
                    }
                  
                }).catch(error => alert(error));

                info = {
                    method: 'test_collection.getTests'
                }
                // 200 for successful get; include testBarcode:employeeID mappings in this case
                axios.post('http://localhost:5000/test_collection',info)
                    .then((res) => {
                        if (res.status === 200) {
                            this.setState({
                                testBarcodes: res.data.map(test => test.testBarcode),
                                employeeIDs: res.data.map(test => test.employeeID)
                            })
                        }
                    }).catch(error => alert(error));

            // this.setState({
            //     testBarcodes: [...this.state.testBarcodes, this.state.tentativeTestBarcode],
            //     employeeIDs: [...this.state.employeeIDs, this.state.tentativeEmployeeID]
            // });
            // this.setState({
            //     tentativeTestBarcode: '',
            //     tentativeEmployeeID: ''
            // })
            // e.target.reset();
        }      
    }

    deleteTest = (e) => {
        e.preventDefault();
        if (this.state.selectedIndex >= 0) {
            const info = {
                method: 'test_collection.deleteTest',
                testBarcode: this.state.testBarcodes[this.state.selectedIndex]
            }
            // 200 for successful deletion; include testBarcode:employeeID mappings in this case
            // 409 if test barcode can't be deleted (test barcode is in pool)
            axios.post('http://localhost:5000/test_collection',info)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            testBarcodes: res.data.map(test => test.testBarcode),
                            employeeIDs: res.data.map(test => test.employeeID),
                            selectedIndex: -1
                        })
                    }
                    else if (res.status === 409) {
                        alert("Test barcode is in pool.");
                    }
                }).catch(error => alert(error));

            // const employeeIDsClone = [...this.state.employeeIDs];
            // const testBarcodesClone = [...this.state.testBarcodes];
            // employeeIDsClone.splice(this.state.selectedIndex,1);
            // testBarcodesClone.splice(this.state.selectedIndex,1);
            // this.setState({
            //     employeeIDs: employeeIDsClone,
            //     testBarcodes: testBarcodesClone,
            //     selectedIndex: -1
            // })
        }
    }

    componentDidMount() {
        const info = {
            method: 'test_collection.getTests'
        }
        // 200 for successful get; include testBarcode:employeeID mappings in this case
        axios.post('http://localhost:5000/test_collection',info)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({
                        testBarcodes: res.data.map(test => test.testBarcode),
                        employeeIDs: res.data.map(test => test.employeeID)
                    })
                }
            }).catch(error => alert(error));

        // this.setState({
        //     testBarcodes: ['bc1','bc2'],
        //     employeeIDs: ['eID1','eID2'],
        // })
    }

    render() {
        return (
            <div>
                <p>Test Collection</p> <br />
                <form onSubmit={this.addTest}>
                    Employee ID: <input type='text' onChange={(e) => this.setState({tentativeEmployeeID: e.target.value})} /> <br />
                    Test Barcode: <input type='text' onChange={(e) => this.setState({tentativeTestBarcode: e.target.value})} /> <br />
                    <input type='submit' value='Add' />
                </form> <br />
                <form onSubmit={this.deleteTest}>
                    <table>
                        <thead>
                            <tr>
                                <td>Employee ID</td>
                                <td>Test Barcode</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.testBarcodes.map((testBarcode,index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <input type='radio' onChange={() => this.setState({selectedIndex: index})} checked={index===this.state.selectedIndex} />{this.state.employeeIDs[index]}
                                                </td>
                                                <td>{testBarcode}</td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                    </table>
                    <input type='submit' value='Delete' />
                </form><br/>
                <button onClick={() => this.handleLogout()}>Logout</button>
            </div>
        )
    }
}
