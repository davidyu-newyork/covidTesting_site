
const exp = require("express"); //Express
const app = exp();

let port = process.env.PORT || 3000;
app.listen(port, ()=> {});

app.get('/', function(request,response){

    login_page(request,response);

});

app.get('/labtech', function(request,response){

    labtech_page(request,response); //didnt do yet

});

app.get('/employee', function(request,response){

    employee_page(request,response); //didnt do yet

});

function login_page(req,res){
    res.writeHead(200, {'content-type':'text/html'});

    html_holder = `
    <!DOCTYPE html>
    <html lang="en">
    
    <style>
        h1 {text-align: center;}
        h2 {font-size: 15;}
        span {font-size: 14}
    
        </style>
    <h1> Login Page </h1>
    <body>
        <h2> Lab Login </h2>
        <span>Lab id: <form style="display:inline" method = "get">
            <input  type = "text" name = "lab_id" value = "">
            
         </form>
        </span>
        <br>
        <br>
    
        <span>Password: <form style="display:inline" method = "get" action = "/labtech"> <!-- action, what funct it goes to-->
            <input  type = "text" name = "lab_pass" value = "">
        </span>
          
        <br><br><input size = "15" type = "submit" value = "Lab Login">
         </form>
    
    
         <h2> Employee Login page for Results </h2>
         <span>Email: <form style="display:inline" method = "get">
             <input  type = "text" name = "email" value = "">
             
          </form>
         </span>
         <br>
         <br>
     
         <span>Password: <form style="display:inline" method = "get" action = "/employee"> <!-- action, what funct it goes to-->
             <input  type = "text" name = "lab_pass" value = "">
         </span>
           
         <br><br><input size = "15" type = "submit" value = "Login">
          </form>
    
        </body>
    
    </html>
    
    `
    res.write(html_holder);
    res.end();
}

