const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/website",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("database connection succesful");
}).catch((err)=>{
    console.log("No connection");
});
