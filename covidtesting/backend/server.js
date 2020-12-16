const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
if(uri!==undefined)
    mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
else
  console.log("MongoDB uri not defined in process.env.ATLAS_URI");
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
let Employee = require('./models/employee.model')
let EmployeeTest = require('./models/employeetest.model')
let PoolMap = require('./models/poolmap.model')
let WellTesting = require('./models/welltesting.model')
let labEmployee = require('./models/labemployee.model')
let Pool = require('./models/pool.model');
const { time } = require('console');

// const employeeRouter = require('./routes/employee.js');
// const employeeTestRouter = require('./routes/employeetest.js');
// const poolRouter = require('./routes/pool.js');
// const poolMapRouter = require('./routes/poolmap.js');
// const wellRouter = require('./routes/well.js');
// const wellTestingRouter = require('./routes/welltesting.js');

// app.use('/employee', employeeRouter);
// app.use('/employeeTestRouter', employeeTestRouter);
// app.use('/poolRouter', poolRouter);
// app.use('/poolMapRouter', poolMapRouter);
// app.use('/wellRouter', wellRouter);
// app.use('/wellTestingRouter', wellTestingRouter);




// employee_login ----------------------------------
// employee_login ----------------------------------
// employee_login ----------------------------------
// employee_login ----------------------------------
app.post('/employee_login', function(req,res) {
    Employee.count({email : req.body.email, passcode : req.body.password}).then( 
        
        function(valid_employee){
            console.log(valid_employee);
            if(valid_employee){
              res.status(200);
              console.log("employee login");
              console.log("Login succcess");
              res.end();
  
          }
          else{
              res.status(401);
              console.log("Login failed");
              res.end();
          }
  })
})

// lab_login ------------------------------------------------
// lab_login ------------------------------------------------
// lab_login ------------------------------------------------
// lab_login ------------------------------------------------
app.post('/lab_login', function(req,res) {
  console.log("Function entered /lab_login");
  labEmployee.find({email : req.body.email, passcode : req.body.password})
        .then(
            function(x){
                if(x){
                    res.status(200);
                    console.log("Login succcess");
                    res.end();
                }
                else{
                    console.log("Login failed");
                    res.status(401);
                    res.end();
                }

            }

        )
})

// employee_results ------------------------------------------
// employee_results ------------------------------------------
// employee_results ------------------------------------------
// employee_results ------------------------------------------
app.post('/employee_results', function(req,res) {
    console.log("Function entered /employee_results");
    console.log(req.body.collectionTime);
    let employee_email = req.body.email;
    if(req.body.method === `employee_results.getResults`){ 
        let return_json = [];
        Employee.findOne({email: employee_email})
        .then(employee =>{
            EmployeeTest.findOne({employeeID: employee.employeeID})
            .then(employeeTest =>{
                //console.log(employeeTest)
                PoolMap.findOne({testBarcode : employeeTest.testBarcode})
                .then(pool_map => {
                    //console.log(pool_map)
                    WellTesting.findOne({poolBarcode:pool_map.poolBarcode})
                    .then(well_test => {         
                        let temp_json = {
                            "collectionDate" : employeeTest.collectionTime,
                            "result" : well_test.result
                        }
                        res.json(temp_json)
                        res.status(200)
                        res.end
                    })
                })
            })
        })
            }
        //  else if(req.body.method === `employee_results.getResults`){
        //      res.status(204).end(); //employee doesnt exist
        //  }

    // res.json(
    //     {collectionDate: new Date(),
    //     result : "positive"
    // })
    // .then(
    //     res.status(200).end()
    // )
    
});


// test_collection -------------------------------------------
// test_collection -------------------------------------------
// test_collection -------------------------------------------
// test_collection -------------------------------------------
app.post('/test_collection', function(req,res) {
    let method = req.body.method;
    let code = req.body.testBarcode;
    let id = req.body.employeeID;
    let by = req.body.collectedBy;
    if(method === 'test_collection.addTest'){
        let test_to_add = new EmployeeTest({
            testBarcode : code,
            employeeID : id,
            collectionTime : new Date(),
            collectedBy : by,
            labID : 1
        });

        test_to_add.save()
        .then(() => 
        EmployeeTest.find()
        .then(test => res.status(200).json(test).end())
        .catch(err => res.status(400).json('Error: '+err).end())
        )
    }
    else{

        EmployeeTest.find()
        .then(test => res.status(200).json(test).end())
        .catch(err => res.status(400).json('Error: '+err).end())

    }

    


});


// pool_mapping --------------------------------------
// pool_mapping --------------------------------------
// pool_mapping --------------------------------------
// pool_mapping --------------------------------------
app.post('/pool_mapping', function(req,res) {
 console.log("Function entered /pool_mapping");

  let method = req.body.method;
  
  console.log(method);
  if(method === 'pool_mapping.addPool'){
      console.log("in add pool");
    let pool_barCode = req.body.poolBarcode;
    let testBarcodes_array = req.body.testBarcodes;
    console.log(testBarcodes_array);
    //  let new_pool = new Pool({
      //   poolBarcode : pool_barCode
      //});
      //console.log("trying to save");
      //res.status(200)
        
            console.log("in then");
            for (testbarcode in testBarcodes_array){
                console.log(testbarcode);
                let new_poolMap = new PoolMap({
                    poolBarcode : pool_barCode,
                    testBarcode : testBarcodes_array[testbarcode]
                })
                new_poolMap.save()
                .then(()=>{
                    PoolMap.find()
                    .then(test => res.status(200).json(test).end())
                .catch(err => res.status(400).json('Error: '+err).end())

                })

                
               
            }
        
        
  }
  else{
    console.log("trying to find");

    PoolMap.find()
    .then(test => res.status(200).json(test).end())
    .catch(err => res.status(400).json('Error: '+err).end())

  }


  
})



// well_testing ---------------------------------------
// well_testing ---------------------------------------
// well_testing ---------------------------------------
// well_testing ---------------------------------------
app.post('/well_testing', function(req,res) {
  let method = req.body.method;
  console.log(method);
  if(method==="well_testing.editWellTest"){
    console.log("in edit");
    let wellBarcodeq = req.body.wellBarcode;
    let poolBarcodeq = req.body.poolBarcode;
    let resultsEdit = req.body.result;
      WellTesting.findOne({wellBarcode :wellBarcodeq, poolBarcode :poolBarcodeq })
          .then(wellFound => {
              
                console.log(wellFound);
                console.log("werewew");
                wellFound['result'] = resultsEdit;
                console.log("after edit");
                console.log(wellFound['result']);        
                wellFound
                  .save()
                  .then(() => {
                      console.log("after update");
                    WellTesting.find()
                    .then(foundWell => res.status(200).json(foundWell).end())
                    .catch(err => res.status(400).json('Error: '+err).end())
                  })
              
          })
          .catch(err => res.status(400).json("Error: "+err).end());;
  }
  else if(method==="well_testing.addWellTest"){
      console.log("in add");
    let wellBarcodeq = req.body.wellBarcode;
    let poolBarcodeq = req.body.poolBarcode;
      const wbc = wellBarcodeq;
      const pbc = poolBarcodeq;
      const newWellTest = new WellTesting({
          wellBarcode: wbc,
          poolBarcode: pbc
      }); 
      newWellTest.save()
      .then(() => res.status(200))
      .then(()=>{
        WellTesting.find()
        .then(foundWell => res.status(200).json(foundWell).end())
        .catch(err => res.status(400).json('Error: '+err).end())
      })
      .catch(err => res.status(400).json('Error: ' + err).end());
  }
  else{
      WellTesting.find()
          .then(foundWell => res.status(200).json(foundWell).end())
          .catch(err => res.status(400).json('Error: '+err).end())
  }
})

app.route('/add').post((req,res)=>{
    const x = req.body.id;
    const y = req.body.email;
    const a = req.body.first;
    const b = req.body.last;
    const bb = req.body.pass;
    const newE = new Employee({
        employeeID : x,
        email : y,
        firstName :a,
        lastName :b,
        passcode : bb
       
    });

    newE.save()
    .then(()=> res.json('added!').end())
    .catch(err => res.status(400).json('Error' + err).end());
});



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});