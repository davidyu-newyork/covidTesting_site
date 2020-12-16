const router = require('express').Router();
let Employee = require('../models/employee.model')
let labEmployee = require('../models/labemployee.model')


router.route('../employee_login').post((req,res) => { //finds if there's an employee with this email/pass   
    let valid_employee = Employee.find({email : req.info.email, passcode : req.info.password}); 
    if(valid_employee){
        res.status(200);
    }
    else{
        res.status(401);
    }
    
});


router.route('../lab_login').post((req,res) => { //finds if there's an lab employee with this email/pass   
    let valid_labEmployee = labEmployee.find({email : req.info.email, passcode : req.info.password}); 
    if(valid_labEmployee){
        res.status(200);
    }
    else{
        res.status(401);
    }
    
});

module.exports = router;