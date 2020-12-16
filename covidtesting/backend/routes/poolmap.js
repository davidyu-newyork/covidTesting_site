const router = require('express').Router();
let EmployeeTest = require('../models/employeetest.model');
let poolMap = require('../models/pool.model');
let WellTesting = require('../models/welltesting.model');
let pool = require('../models/pool.model');
let well = require('../models/well.model');



router.route('/pool_mapping').post((req,res) => { 
    let method = req.body.info.method;
    let pool_barCode = req.body.info.poolBarcode;
    let testBarcodes_array = req.body.info.testBarcodes;
    if(method == 'pool_mapping.editPool'){ // EDIT POOL -----------------------------
        res.status(200); //if success we keep as 200, else if encounter barcode that doesnt exist set to 404
        for(let code in testBarcodes_array ){ //for code in array try to add
            if(EmployeeTest.find({testBarcode : code} &&  //if barcode exists and not already in poolmap, add
                !poolMap.find({testBarcode : code, poolBarcode : pool_barCode}))){ // might need to change -----------------------
                let codeToAdd = new poolMap({
                    testBarcode : code,
                    poolBarcode : pool_barCode
                });
                codeToAdd.save(); // add to table , might have to use .insert but should be fine
            }
            else{
                res.status(404) // the testBarcode didnt exist thus don't add and set status
            }
         }
         getAllPools(res);
    }
    if(method == 'pool_mapping.addPool'){ //add a new pool -------------------------------
        if(pool.find({poolBarcode:pool_barCode})){ //if exists set status
            res.status(404);
            getAllPools(res);
            return;
        }
        let poolToAdd = new pool({ //create new pool row
            poolBarcode : pool_barCode
        });
        poolToAdd.save(); //add it to table
        res.status(200); //if success we keep as 200, else if encounter barcode that doesnt exist set to 404
        let return_array = []
        for(let code in testBarcodes_array ){ //for code in array try to add
            if(EmployeeTest.find({testBarcode : code} &&  //if barcode exists and not already in poolmap, add
                !poolMap.find({testBarcode : code, poolBarcode : pool_barCode}))){ // might need to change -----------------------
                let codeToAdd = new poolMap({
                    testBarcode : code,
                    poolBarcode : pool_barCode
                });
                codeToAdd.save(); // add to table , might have to use .insert but should be fine
            }
            else{
                res.status(404) // the testBarcode didnt exist thus don't add and set status
            }
         }
         getAllPools(res); 
    }
    if(method == 'pool_mapping.deletePool'){ //delete pool ----------------------------
        if(WellTesting.find({poolBarcode:pool_barCode})){ //it's in a well set status to 409 and don't delete
            getAllPools(res);
            res.status(409);
            return;
        }
        else{ //delete pool
            //now delete it
            pool.remove({poolBarcode : pool_barCode}); //remove rows that have this pool_barCode
            WellTesting.remove({poolBarcode : pool_barCode});
            poolMap.remove({poolBarcode : pool_barCode});
            getAllPools(res);

        }      
    }
    if(method == 'pool_mapping.getPools'){ //get pools ---------------------------
        getAllPools(res);
    }
});


function getAllPools(res){ // probably need to fix this ----------------------------
    let pool_array = pool.find(null, {poolBarcode : true}); //only return poolBarcode element
    let return_map = {}; //json object
    pool_array.forEach(element => {
        let temp_array = [];
        for(var key in element){ //for each pool, get all barcodes mapped to pool then add to array
            let x = poolMap.find({poolBarcode : element[key]}).forEach(keys => {
                for(var key in keys){
                    temp_array.push(keys[key]); //add barcode to array          
                }
                
            });
        }
        return_map[element] = temp_array; // set distinct poolbarcode: array of corresponding barcodes      
    });
    res.json(return_map); //write response
    res.status(200); 
}



module.exports = router;