let mongoose = require('mongoose')
const Schema = mongoose.Schema

const labEmployeeSchema = new Schema({

    labID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password:{
        type: String,
        required: true,
    }

},{ collection: 'LabEmployee' });

const labEmployee = mongoose.model('labEmployee', labEmployeeSchema);

module.exports = labEmployee;