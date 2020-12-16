const router = require('express').Router();
let Employee = require('../models/employee.model')
let EmployeeTest = require('../models/employeetest.model')
let poolMap = require('../models/pool.model')
let WellTesting = require('../models/welltesting.model')

router.route('/employee_results').post((req,res) => { 

    let employee_email = req.body.info.email;
    if(employee_email && req.body.info.method == `employee_results.getResults`){ 

        let collectedDate = req.body.info.collectionTime; //might need to format this --------------------

        let test = EmployeeTest.find({email: employee_email}); //gets corresponding item from table based on email
        let pool = poolMap.find({testBarcode : test.testBarcode}) //gets pool it's in
        let well = pool.find({poolBarcode : pool.poolBarcode}); //gets the well where results are

        let pool_result = [well.result]; //might need to format this ---------

        let return_results = {
            collectionDate : collectedDate,
            result : pool_result
        };
        res.json(return_results); //send json object with above info

        res.status(200); //ok status
    }
    else if(req.body.info.method == `employee_results.getResults`){
        res.status(204); //employee doesnt exist
    }

});

router.route('../test_collection').post((req,res) => { 
    let barcode = req.body.info.testBarcode;
    let id = req.body.info.employeeId;
    let by = req.body.info.collectedBy;
    let time = req.body.info.collectionTime;

    if(req.body.info == 'test_collection.addTest'){ //add test======================================

        if(!Employee.find({employeeId:id})){ //employee doesnt exist
            res.status(404);
        }
        if(EmployeeTest.find({testBarcode:barcode})){ //barcode already exists
            res.status(409);

        }
        //add barcode now
        else{
            const newTest = new EmployeeTest({ //might not be adding to table correctly ---------
                testBarcode : barcode, 
                employeeId : id,
                collectedTime : time,
                collectedBy : by
                });
            newTest.save(); // add to table , might have to use .insert but should be fine
        }

    }
    if(req.body.info == 'test_collection.deleteTest'){ //delete test --------------===============
        if(poolMap.find({testBarcode : barcode})){ //if its in pool don't delete
            res.status(409); //409 , can't be deleted
            return;
        }
        //isnt in pool so can delete
        EmployeeTest.remove({testBarcode: barcode}); //removes it, CHECK IF ACTUALLY WORKS -----



    }

    if(req.body.info == 'test_collection.getTests'){ //get tests
        // PROBABLY NEED TO REFORMAT how its returned 
        EmployeeTest.find(null, {testBarcode : true, employeeId : true}) // ================== CHECK TO MAKE SURE RETURNS MAPPINGS OF testbarcodes to id
            .then(barcodes_and_ids => res.json(barcodes_and_ids));

    }
});




module.exports = router;
