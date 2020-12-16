import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import auth from './auth';

const ProtectedRoute = ({component: Component, ...rest}) => {
    return (
        <Route 
            {...rest} 
            render = {props => {
                const employeeComponents = {
                    'EmployeeResults': true
                }
                const labComponents = {
                    'LabHome': true,
                    'TestCollection': true,
                    'PoolMapping': true,
                    'WellTesting': true
                }
                if ((employeeComponents[Component.name] == true && auth.getEmployeeAuth()) || 
                (labComponents[Component.name] == true && auth.getLabAuth())) {
                    {return <Component {...props}/>}
                }
                else {
                    return <Redirect to='/' />
                }
            }}
        />
    )
}

export default ProtectedRoute;