require('dotenv').config();
const express=require('express');
const app=express();
const path=require('path');
const port=process.env.PORT||3000;
const hbs=require("hbs");
const mongoose=require("mongoose");
const bcrypt=require('bcryptjs');

app.use(express.json());
//important...............
app.use(express.urlencoded({extended:false}));

require("./source/db/conn.js");
const Register=require('./source/models/register.js');

// const viewpath=path.join(__dirname,"./templates/views");
const templatepath=path.join(__dirname,"./templates/views");
const partialpath=path.join(__dirname,"./templates/partials");

app.set('views',templatepath);

app.set("view engine","hbs");

hbs.registerPartials(partialpath);

console.log(process.env.SECRET);

app.get('/',(req,res)=>{
    res.render("index");
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.get('/register',(req,res)=>{
    res.render("register");
})

app.post('/register',async (req,res)=>{
    try{
       const password=req.body.password;
       const cpassword=req.body.confirmpassword;
       if(password===cpassword){
    //     res.status(201).send("password")
    const newuser=new Register({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        age:req.body.age,
        password:req.body.password,
        confirmpassword:req.body.confirmpassword
    })

    //before saving generate a token for this user
    const token = await newuser.generateToken();
    console.log(token);

    const insert = await newuser.save();
    res.status(200).send(req.body);
}
       else{
        res.status(401).send("password not matching");

       }

    //    console.log(insert);
    }
    catch(e){
        res.status(400).send(e);
    }
})

app.post('/login',async (req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        console.log(email);
        console.log(password);
       const find=await Register.findOne({email:email});

        //compare important
       const isMatch=await bcrypt.compare(password,find.password);

       //login token
       const ltoken=await find.generateToken();
        console.log(ltoken);

       if(isMatch){
       res.status(201).render("login");

       }
       else{
        res.status(401).send("Invalid credentials");
       }
    }
    catch{
        res.status(400).send("Invalid credentials");
    }
})



// const securepassword=async (password)=>{

//    const passwordhash= await bcrypt.hash(password,10);
//    console.log(passwordhash);
//     const check=await bcrypt.compare(password,passwordhash);
//    console.log(check);

// }

// securepassword("neha");

app.listen(port,()=>{
    console.log("listening");
})


//const token=jwt.sign({_id:"5262438"},"secrethaiyekey");
//jwt.verify(token,"secrethaiyekey");


