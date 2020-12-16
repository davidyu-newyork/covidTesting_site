let mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
    employeeID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    passcode:{
        type: String,
        required: true,
    },
    exists:{
        type: Boolean,
        required: true,
        default: true
    }

},{ collection: 'Employee' });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
