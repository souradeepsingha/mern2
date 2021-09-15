require('dotenv').config();
const express = require("express");
const path =require("path");
const app = express();
const hbs= require("hbs");
require("./db/conn");
const bcrypt=require("bcrypt")
const Register=require("./models/registers");

const { error } = require("console");
const { __express } = require("hbs");
// const Register = require("./models/registers");
const port =process.env.PORT || 3000;
const static_path =path.join(__dirname,"../public");

const template_path =path.join(__dirname,"../templates/views");
const partials_path =path.join(__dirname,"../templates/partials");
app.use(express.json());
app.use(express . urlencoded({extended:false}))

// console.log(path.join(__dirname,"../public"));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path)

console.log(process.env.SECRET);

app.get("/", (req,res)=>{
res.render("index")
});
app.get("/register", (req,res)=>{
    res.render("register")
    });
    app.get("/login", (req,res)=>{
        res.render("login")
        });
    
// create a new user in our ndatabase
    app.post("/Register",async (req,res)=>{
        try{
          const password =req.body.password;
          const cpassword=req.body.confirmpassword;
         if (password===cpassword) {
             const registerEmployee= new Register({
                 firstname:req.body.firstname,
                lastname:req.body.lastname,
                 email:req.body.email,
                 gender:req.body.gender,
                 phone:req.body.phone,
                 age:req.body.age,
                 password:req.body.password,
                 confirmpassword:req.body.confirmpassword,
             })
            console.log("the success part"+ registerEmployee)
            const token =await registerEmployee.generateAuthtoken();
            console.log("the token part"+token)
            const registered= await registerEmployee.save()
            console.log("the token part"+registered);
            res.status(201).render("index");
         }
         else{
            res.send("password are not maching")
         }
        }
        catch(error){
            res.status(400).send(error); 
            console.log("the error part page") 
        }
       
        });
        app.post("/login", async(req,res)=>{
            try {
             const email=req.body.email;
             const password=req.body.password;
              const useremail= await Register.findOne({email:email});
            const isMatch = await bcrypt.compare(password,useremail.password);
            
            const token =await useremail.generateAuthtoken();
            console.log("the token part"+token)
              if (isMatch) {
                 res.status(201).render("index");
             }
             else{
                res.send("password are not matching")
             }
               console.log(`${email} and${password}`)

        } catch (error) {
                res.status(400).send("invalid email vviii");  
                // console.log("the error part page")
            }
          
            });

    const jwt=require("jsonwebtoken");
  const createToken = async() =>{
   const token= await jwt.sign({_id:"612e7c532e578b519c1aeb64"},"iamahajakalakajahagarauauajajajaja",{
expiresIn:"2 seconds"
   }); 
     console.log(token);
     const userVer=await jwt.verify(token,"iamahajakalakajahagarauauajajajaja");
    console.log(userVer);
    }
createToken();
app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})