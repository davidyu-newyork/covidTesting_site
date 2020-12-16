class Auth {
    constructor() {
        this.employee_auth = false;
        this.lab_auth = false;
        this.email = '';
        this.lab_id = '';
    }

    employeeLogin(email) {
        this.employee_auth = true;
        this.email = email;
    }

    employeeLogout = () => {
        let old_email = this.email;
        this.employee_auth = false;
        this.email = '';
        alert('Logged out from ' + old_email);
    }

    getEmployeeAuth = () => {
        return this.employee_auth;
    }

    getEmployeeEmail = () => {
        return this.email;
    }

    getLabID = () => {
        return this.lab_id;
    }

    labLogin(lab_id) {
        this.lab_auth = true;
        this.lab_id = lab_id;
    }

    labLogout = () => {
        let old_lab_id = this.lab_id;
        this.lab_auth = false;
        this.lab_id = '';
        alert('Logged out from ' + old_lab_id);
    }

    getLabAuth = () => {
        return this.lab_auth;
    }
}

export default new Auth();