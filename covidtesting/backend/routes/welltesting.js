const router = require('express').Router();
let EmployeeTest = require('../models/employeetest.model');
let poolMap = require('../models/pool.model');
let WellTesting = require('../models/welltesting.model');
let pool = require('../models/pool.model');
let well = require('../models/well.model');


router.route('/well_testing').post((req,res) => { 
    let method = req.body.info.method;
    let wellBarcodeq = req.body.info.tWellBarcode;
    let poolBarcodeq = req.body.info.tPoolBarcode;
    let resultsEdit = req.body.info.results;
    const query = {wellBarcode: wellBarcodeq, poolBarcode: poolBarcodeq};
    if(method=="well_testing.editWellTest"){
        WellTesting.find(query)
            .then(wellFound => {
                if(!wellFound.length){
                    res.status(404);
                }
                else{
                wellFound.results = resultsEdit; 
                wellFound.save()
                    .then(() => res.status(200))
                    .catch(err => res.status(400).json("Error: "+err));
                }
            })
            .catch(err => res.status(400).json("Error: "+err));;
    }
    if(method=="well_testing.addWellTest"){
        const wbc = wellBarcodeq;
        const pbc = poolBarcodeq;
        const newWellTest = new WellTesting({
            wellBarcode: wbc,
            poolBarcode: pbc
        }); 
        newWellTest.save()
        .then(() => res.status(200))
        .catch(err => res.status(400).json('Error: ' + err));
    }
    if(method=="well_testing.getWellTests"){
        WellTesting.find(query)
            .then(foundWell => res.status(200).json(foundWell))
            .catch(err => res.status(400).json('Error: '+err))
    }
    if(method=='well_testing.deleteWellTest'){
        WellTesting.findOneAndDelete(query)
        .then(() => res.status(200))
        .catch(err => res.status(400).json('Error: '+err));
    }
})

module.exports = router;