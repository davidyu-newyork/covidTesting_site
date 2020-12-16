let mongoose = require('mongoose')
const Schema = mongoose.Schema

const wellTestingSchema = new Schema({
    wellBarcode: { //FK to EmployeeTest
        type: String,
        required: true,
    },
    poolBarcode: {
        type: String,
        required: true,
    },
    testStartingTime:{
        type: Date,
    },
    testEndingTime:{
        type: Date,
    },
    result:{
        type: String, 
        enum: ['in progress', 'negative', 'positive'],
        required: true,
        default: 'in progress'
    },
    exists: {
        type: Boolean,
        required: true,
        default: true,
    }
},{ collection: 'WellTesting' });

const WellTesting = mongoose.model('WellTesting', wellTestingSchema);

module.exports = WellTesting;
