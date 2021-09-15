const mongoose = require("mongoose");
const bcrypt=require("bcrypt")
const jwt= require("jsonwebtoken");
const { response } = require("express");
const employeesSchema =new mongoose.Schema({
    firstname:{
       type:String,
       require:true
    },
    lastname:{
        type:String,
        require:true
     },
    email:{
        type:String,
        require:true,
        unique:true
     },
     gender:{
        type:String,
        require:true
     },
     phone:{
        type:String,
        require:true,
        unique:true
     },
     age:{
        type:String,
        require:true
     },
     password:{
        type:String,
        require:true
     },
     confirmpassword:{
        type:String,
        require:true
     },
     tokens:[{
        token:{
         type:String,
         require:true
        }
     }]
})
// generating token
employeesSchema.methods.generateAuthtoken= async function(){
    try {
       console.log(this._id);
       const token =jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
       this.tokens= this.tokens.concat({token:token})
       await this.save();
       return token;
      } catch (error) {
       res.send("the error part"+error);
       console.log("the error part"+error);
    }
}
// convert password into hash
employeesSchema.pre("save",async function(next){
   if(this.isModified("password")){
    
      this.password= await bcrypt.hash(this.password,10);
    
       this.confirmpassword=await bcrypt.hash(this.password,10);
   }
   next();
})







const Register =new mongoose.model("Register",employeesSchema);
module.exports=  Register;