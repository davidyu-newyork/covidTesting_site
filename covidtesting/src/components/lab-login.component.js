import React, {Component} from 'react';
import axios from 'axios';
import auth from '../auth';

// lab_login.verifyLabEmployee

export default class LabLogin extends Component {

    constructor(props) {
      super(props);
      this.state = {
        lab_id: '',
        lab_password: ''
      }
    }

    handleLabIdChange = (e) => {
      this.setState({lab_id: e.target.value});
    }

    handleLabPasswordChange = (e) => {
      this.setState({lab_password: e.target.value});
    }

    handleLabSubmit = (e) => {
      e.preventDefault();
      const info = {
        method: 'lab_login.verifyLabEmployee',
        id: this.state.lab_id,
        password: this.state.lab_password
      }
      // I'm expecting a status of 200 for successful login and 401 for invalid login information
      axios.post('http://localhost:5000/lab_login', info)
        .then(res => {
          if (res.status === 200) {
            auth.labLogin(this.state.lab_id);
            this.props.history.push('/lab_home'); // this might refer to the function
          }
          else if (res.status === 401) {
            alert("Invalid login information.");
          }
        }).catch(error => alert(error));

      // if (true) {
      //   auth.labLogin('1234');
      //   this.props.history.push('/lab_home');
      // }
      // else {
      //   alert("Invalid login information.");
      // }
    }

    render() {
        return (
          <div>
            <style dangerouslySetInnerHTML={{__html: "\n        h1 {text-align: center;}\n        h2 {font-size: 15;}\n        span {font-size: 14}\n    \n        " }} />
            <h1> Lab Login Page </h1>

            <h2> Lab Login </h2> <br />
            <form style={{display: 'inline'}} method="post" onSubmit={this.handleLabSubmit}>
              Lab id: 
              <input type="text" name="lab_id" onChange={this.handleLabIdChange} /> <br /><br />
              Password:
              <input type="text" name="lab_password" onChange={this.handleLabPasswordChange} /> <br /><br />
              <input size={15} type="submit" value="Lab Login" />
            </form> <br /><br />
          </div>
    
        )
    }
};