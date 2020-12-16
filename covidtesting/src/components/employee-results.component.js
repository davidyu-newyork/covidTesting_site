import React, {Component} from 'react';
import auth from '../auth';
import axios from 'axios';
import { isThisTypeNode, textChangeRangeIsUnchanged } from 'typescript';

// employee_results.getResults

export default class EmployeeResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collectionDates: [],
            results: []
        }
    }

    componentDidMount() {
        const info = {
            method: 'employee_results.getResults',
            email: auth.getEmployeeEmail()
        }
        alert(auth.getEmployeeEmail())
        // I'm expecting an array of {collectionDate: '11/2/32', result: ['negative','positive']} objects for the employee corresponding to the email
        axios.post('http://localhost:5000/employee_results',info)
            .then(res => {
                console.log(res)
                if (res.status === 200 || res.status === 204) {
                    this.setState({
                        collectionDates: [res.data.collectionDate],
                        results: [[res.data.result]]
                    })
                }
            }).catch(error => alert(error));

        // this.setState({
        //     collectionDates: ['default1','default3','default5'],
        //     results: [['default2'],['default4'],['default6','default7']]
        // })
    }

    handleLogout() {
        auth.employeeLogout();
        this.props.history.push('/employee_login');
    }

    render() {
        return (
            <div>
                <p>Employee results.</p>
                <table>
                    <thead>
                        <tr>
                            <td>Collection Date</td>
                            <td>Result</td>
                        </tr>
                    </thead>
                    {
                        this.state.results.map((result,index) => {
                            return (
                                <tr>
                                    <td>{this.state.collectionDates[index]}</td>
                                    <td>{result.reduce((acc,x) => acc+', '+x, '').substring(2)}</td>
                                </tr>
                            )
                        })
                    }
                </table><br/>
                <button onClick={() => this.handleLogout()}>Logout</button>
            </div>
        )
    }
};