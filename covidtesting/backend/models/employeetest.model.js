let mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeTest = new Schema({
    testBarcode: {
        type: String,
        required: true,
        unique: true,
    },
    employeeID: { // => Foregin key to employee.employeeID
        type: String,
        required: true,
    },
    collectionTime:{
        type: Date,
        required: true
    },
    labID:{ // FK to LabEmployee
        type: String,
        required: true
    },
    exists:{
        type: Boolean,
        required: true,
        default: true,
    }

},{ collection: 'EmployeeTest' });

const EmployeeTest = mongoose.model('EmployeeTest', employeeTest);

module.exports = EmployeeTest;
