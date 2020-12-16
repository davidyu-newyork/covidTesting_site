let mongoose = require('mongoose')
const Schema = mongoose.Schema

const wellSchema = new Schema({
    wellBarcode: {
        type: String,
        required: true,
        unique: true,
    },
    exists:{
        type: Boolean,
        required: true,
        default: true,
    }
},{ collection: 'Well' });

const Well = mongoose.model('Well', wellSchema);

module.exports = Well;
