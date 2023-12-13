const User=require('../model/userModel')
const bcrypt=require('bcrypt')
var jwt=require('jsonwebtoken');
const { token } = require('morgan');
const secret= process.env.secret || 'whatiseeisnotusee' ;
const multer= require('multer');

function generatetoken(payload){
    return jwt.sign(payload,secret,{expiresIn:'2h'})
}

const securePassword= async(password)=>{
    try{
        const passwordHash=await bcrypt.hash(password,10)
        return passwordHash

    }catch(error)
    {
        console.log(error.message)
    }
}

const loadRegister=async(req,res)=>{
    try{ 
        
        res.render('registration')
    }
    catch(error){
        console.log(error.message)
    }
}

const insertUser=async(req,res)=>{
    try{
         console.log("inside user ")
         const spassword=await securePassword(req.body.password)  
         const user=new User({
            username: req.body.username,
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            password:spassword,
            gender: req.body.gender,
            status : req.body.status,
            image:""
        })
    
        const userData=await user.save()
        if(userData)
        {
            // res.render('registration',{message:"Your registration has been success"})
            // res.redirect('/login');
            res.status(200).json({message : "success"});
            
        }
        else
        {
            res.status(400).json({message : "failed"});
            // res.render('registration',{message:"Your registration has failed"});        
        }

    }catch(error)
    {
        console.log(error.message)
    }
}

//login user method starts

const loginLoad=async(req,res)=>{
    try{
        res.render('login')

    }catch(error)
    {
        console.log(error.message)
    }
}

const verifyLogin= async(req,res)=>{
    try{
        console.log("in verify login ")

        const username=req.body.username
        
        const password=req.body.password
        console.log(username,password);

        // const username=req.query.username
        // console.log(username)
        // const password=req.query.password
        // console.log(password)
        // // const userData=await User.findOne({username:username})
         var userData=await User.findOne({ username: username },
         { username: 1, name: 1, mobile: 1, email: 1,password:1, image :1 ,_id:0} 
        );

        // console.log(req.body)
        console.log(userData)
        console.log("A")
        var passwordMatch=await bcrypt.compare(password,userData.password)
        console.log("A",passwordMatch)
          
        if( (userData) && (passwordMatch) )
        {
        {
            console.log("BB",userData)
           
             var sendData={}
             sendData.name=userData.name;
             sendData.username=userData.username;
             sendData.email=userData.email;
             sendData.mobile=userData.mobile;
             sendData.image=userData.image;

            var token = jwt.sign({username,password},secret,{expiresIn:'2h'});
            console.log(" Token : >>" , token);

            // const {pass, ...userData } = sendData;
            // const { username,name,email,mobile } = userData;
            // console.log("CCc",sendData,userData)
            // req.session.user_id=userData._id
            // res.render('home',{user:userData})    

            // res.status(200).json({userData:sendData});
            res.status(200).json({userData:sendData,token:token});
           }
        //    else
        //    {
        //     // console.log("EEE")
        //     // res.render('login',{message: "Incorrect Username & Password"}) 
        //     res.status(400).json({message : "failed"});
        //    }
        }
        else{
            console.log("F")
            // res.render('login',{message: "Incorrect User & Password"})
            res.status(400).json({message : "failed"});    
        }

    }catch(error)
    {
        console.log(error.message)
    }

}

const loadHome=async(req,res)=>{
    try{
        const userData=User.findById({_id:req.session.user_id})
        res.render('home',{user: userData})
        

    }catch(error)
    {
        console.log(error.message)
    }


}

const uploadimage =async(req,res)=>{
    try{

        // console.log("in image upload");
        user= req.query.username;
        filename= req.file.filename
        // console.log("FILE > ", filename, "UN >", user);
        if(!filename || !user)
        {
            return res.status(401).json({ message: "Something went wrong!" })
        }
        
        const updateImg = await User.updateOne(
            {username: user},
            {
                $set:{
                    image: filename
                }
            }
        );

        if(updateImg) {
            console.log("DB updated with image")

            return res.status(401).json({ message: "Something went wrong!", file:filename })}
        else{
            console.log("FAILED updation")

        return res.status(200).json({ message: 'Image Uploaded Successfully' })
        }

        
    }catch(error)
    {
        console.log(error.message)
    }
}

const userLogout=async(req,res)=>{
    try{

        req.session.destroy()
        res.redirect('/')

    }catch(error)
    {
        console.log(error.message)
    }
}
module.exports={
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    uploadimage,
    userLogout      
}