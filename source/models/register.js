// require('dotenv').config();

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken");

const dataSchema=new mongoose.Schema({
    firstname:{
        type:String,
        // required:true
        
    },
    lastname:{
        type:String
        // required:true
        
    },
    
    email:{ 
        type:String,
        // required:true,
        unique:true
    },
    age:{
        type:Number
        // required:true
    },
    password:{
        type:String
        // required:true
    },
    confirmpassword:{
        type:String
        // required:true
    },
    tokens:[{
        token:{
            type:String
           
        }


    }]


})


//authentication purpose
dataSchema.methods.generateToken= async function(){
    try{
        const token = await jwt.sign({_id:this._id},process.env.SECRET);
        console.log(token);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        //actually return kiya to fir vha se access ho jaata h :)
        return token;

    }
    catch(e){
        res.send(e);
        console.log(e);
    }
}


//security purpose
dataSchema.pre("save", async function(next){
    if(this.isModified("password")){
    this.password= await bcrypt.hash(this.password,10);
    console.log(`Password is ${this.password}`);
    this.confirmpassword=undefined;
    }
    next();

})



const Register=new mongoose.model('Register',dataSchema);

module.exports=Register;