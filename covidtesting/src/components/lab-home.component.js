import React, {Component} from 'react';
import auth from '../auth';

export default class LabHome extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleLabLogout() {
        auth.labLogout();
        this.props.history.push('/lab_login');
    }

    render() {
        return (
            <div>
                <p>Lab Home</p> <br/>
                <button onClick={() => this.props.history.push('/test_collection')}>Test Collection</button> <br/>
                <button onClick={() => this.props.history.push('/pool_mapping')}>Pool Mapping</button> <br/>
                <button onClick={() => this.props.history.push('/well_testing')}>Well Testing</button> <br/>
                <button onClick={() => this.handleLabLogout()}>Logout</button>
            </div>
        )
    }

};
