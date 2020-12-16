let mongoose = require('mongoose')
const Schema = mongoose.Schema

const poolSchema = new Schema({
    poolBarcode: {
        type: String,
        required: true,
        unique: true,
    },
    exists:{
        type: Boolean,
        required: true,
        default: true,
    }
},{ collection: 'Pool' });

const Pool = mongoose.model('Pool', poolSchema);

module.exports = Pool;
