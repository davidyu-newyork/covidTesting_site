let mongoose = require('mongoose')
const Schema = mongoose.Schema

const poolMapSchema = new Schema({
    testBarcode: { //FK to EmployeeTest
        type: String,
        required: true,
    },
    poolBarcode: {
        type: String,
        required: true,
    },
    exists:{
        type: Boolean,
        required: true,
        default: true,
    }
},{ collection: 'PoolMap' });

const PoolMap = mongoose.model('PoolMap', poolMapSchema);

module.exports = PoolMap;
