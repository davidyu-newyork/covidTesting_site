import React, {Component} from 'react';
import axios from 'axios';
import auth from '../auth';

// employee_login.verifyEmployee

export default class EmployeeLogin extends Component {

    constructor(props) {
      super(props);
      this.state = {
        employee_email: '',
        employee_password: ''
      }
    }

    handleEmployeeEmailChange = (e) => {
      this.setState({employee_email: e.target.value});
    }

    handleEmployeePasswordChange = (e) => {
      this.setState({employee_password: e.target.value});
    }

    handleEmployeeSubmit = (e) => {
      e.preventDefault();
      const info = {
        method: 'employee_login.verifyEmployee',
        email: this.state.employee_email,
        password: this.state.employee_password
      }
      // I'm expecting a status of 200 for successful login and 401 for invalid login information
      axios.post('http://localhost:5000/employee_login', info)
        .then(res => {
          if (res.status === 200) {
            auth.employeeLogin(this.state.employee_email);
            this.props.history.push('/employee_results');
          }
          else if (res.status === 401){
            alert("Invalid login information.");
          }
        }).catch(error => alert(error));

      // if (true) { // temp
      //   auth.employeeLogin('lol@gmail.com');
      //   this.props.history.push('/employee_results');
      // }
      // else {
      //   alert("Invalid login information.");
      // }
    }

    render() {
        return (
          <div>
            <style dangerouslySetInnerHTML={{__html: "\n        h1 {text-align: center;}\n        h2 {font-size: 15;}\n        span {font-size: 14}\n    \n        " }} />
            <h1> Employee Login Page </h1>

            <h2> Employee Login</h2> <br />
            <form style={{display: 'inline'}} method="post" onSubmit={this.handleEmployeeSubmit}>
              Email:
              <input type="text" name="employee_email" onChange={this.handleEmployeeEmailChange} /> <br /><br />
              Password:
              <input type="text" name="employee_password" onChange={this.handleEmployeePasswordChange} /> <br /><br />
              <input size={15} type="submit" value="Employee Login" />
            </form>
          </div>
    
        )
    }
};