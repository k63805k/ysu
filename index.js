import express, { text } from "express";
import path from "path";
import bcrypt from "bcrypt";
import fs from "fs";

let userdata = [];
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.send("Get Request Success!!!!");
});

app.post("/",  (req,res)=>{
    let log_data = req.body;
    const filePath = path.resolve("userdata.json");
    fs.promises.readFile(filePath,'utf-8').then(async(data)=>{
        const parsedData = JSON.parse(data);
        const checkPwd = await bcrypt.hash(log_data.password,10);
        bcrypt.compare(log_data.password,parsedData[0].password,(err)=>{
            if(!err){
                console.error('Error comparing passwords:', err);
                return;
            }
        })
        console.log(checkPwd);
        console.log(parsedData[0].password);
    });

});
app.get("/register",(req,res)=>{
    res.sendFile(path.resolve("public/register/register.html"));
});
app.get("/login",(req,res)=>{
    res.sendFile(path.resolve("public/login/login.html"));
});

app.post("/login",async (req,res)=>{
    const {firstName,lastName,email,password} = req.body;
    const hashPwd = await bcrypt.hash(password,10);
    userdata.push({
        firstName,
        lastName,
        email,
        password:hashPwd
    });
    fs.writeFile(path.resolve("userData.json"),JSON.stringify(userdata),err => {
        if (err) throw err;
    });
    res.redirect(path.resolve("/login"));
});

app.listen(3001);