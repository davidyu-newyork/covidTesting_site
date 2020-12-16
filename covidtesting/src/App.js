import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Route,Switch,Redirect} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import ProtectedRoute from './protected-route';
import EmployeeLogin from "./components/employee-login.component";
import LabLogin from "./components/lab-login.component";
import EmployeeResults from "./components/employee-results.component";
import LabHome from "./components/lab-home.component";
import TestCollection from "./components/test-collection.component";
import PoolMapping from "./components/pool-mapping.component.js";
import WellTesting from "./components/well-testing.component";

function App() {
  return (
    <div className="container">
      <Router>
        <Route exact path="/" component={EmployeeLogin} />
        <Route exact path="/employee_login" component={EmployeeLogin} />
        <Route exact path="/lab_login" component={LabLogin} />
        <ProtectedRoute exact path="/employee_results" component={EmployeeResults} />
        <ProtectedRoute exact path="/lab_home" component={LabHome} />
        <ProtectedRoute exact path="/test_collection" component={TestCollection} />
        <ProtectedRoute exact path="/pool_mapping" component={PoolMapping} />
        <ProtectedRoute exact path="/well_testing" component={WellTesting} />
      </Router>
    </div>
  );
}

export default App;
