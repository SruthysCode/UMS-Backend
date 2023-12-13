
const User=require('../model/userModel')
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken");
const secret =process.env.secret || 'whatiseeisnotusee' ;

const securePassword= async(password)=>{
    try{
        const passwordHash=await bcrypt.hash(password,10)
        return passwordHash

    }catch(error)
    {
        console.log(error.message)
    }
}


const loadLogin=async(req,res)=>{
    try{
        res.render('login')


    }catch(error)
    {
        console.log(error.message)
    }
}

const verifyLogin=async(req,res)=>{
    try{
        console.log("in adminloginnnnnnnn")
        const adminname=req.body.username
        // console.log(req.body)
        
        const password=req.body.password
        // console.log("ad > ", adminname,password)

        const adminData=await User.findOne({username:adminname})

        if(adminData)
        {
            // console.log("usrdt: "+adminData)
         const passwordMatch=await bcrypt.compare(password,adminData.password)
        //  console.log("B4  passmatch : "+ passwordMatch)
            if(passwordMatch)

            {
                // console.log("passmatch : "+ passwordMatch)
                if(adminData.status===false)
                {
                    // console.log("is asmin "+adminData)
                    // req.session.user_id=userData._id
                   // res.render('/admin/home',{user:userData.name})
                   const token = jwt.sign({adminname,password},secret ,{expiresIn:'2h'})
                //    console.log("token >>> ", token)
                   res.status(200).json({adminData, token : token});
           
                //    res.redirect('/admin/home')
                }
                else
                {
                    res.status(400).json({message : "failed"});
                    // res.render('login',{message:"Email and Password is wrong"})
                }
            }
            else
            {
                res.render('login',{message:"Email and Password is wrong"})
            }
        }
        else
        {
            res.render('login',{message:"Email and Password is wrong"})
        }
    }catch(error)
    {
        console.log(error.message)
    }
}

const loadDashboard=async(req,res)=>{
    try{
        const userData=await User.findById({_id:req.session.user_id})
        res.render('home',{admin:userData})
    }
    catch(error)
    {
        console.log(error.message)
    }
}

const logout=async(req,res)=>{
    try{
        req.session.destroy()
        res.redirect('/admin')

    }
    catch(error)
    {
        console.log(error.message)
    }
}

const adminDashboard=async(req,res)=>{
     console.log("in admin dassssssssssssh")
        var search=''
        if(req.query.search)
        {
            search=req.query.search
 
        }
        const userData=await User.find({
            status:true,
            $or:[
                { name:{$regex: '.*'+search+'.*',$options:'i' }},
                { email:{$regex: '.*'+search+'.*',$options:'i' }}
            ]
            },{username:1, name:1, email: 1, mobile:1, gender:1, _id:0})
                console.log("got as : ", userData)
                
                
                 obj =Object.values(userData);

                 obj=Object.entries(userData).map(([key, value]) => ({ [key]: value }));
                 console.log(obj,"MMMMMMMMMMMMMMMM",obj[1],"nnnnnnnnn", obj[2].email);
                // res.status(200).json({users : userData});
                try{
                    
                    // console.log(userData,"userback", JSON.stringify(userData))
                    //  res.send({ users:userData});
                     res.send({obj});
                     
               }
               catch(err){
                 console.log(err)
               }
          
    // }catch(error)
    // { 
    //     console.log("ERRR",error.message)
    //    return res.status(400).json({ error: error.message });
    // }
}

const newUserLoad=async(req,res)=>{
    try{

        res.render('new-user')
    }catch(error)
    {
        console.log(error.message)
    }
}

const addUser=async(req,res)=>{
    try{

        const name=req.body.name
        const email=req.body.email
        const mobile=req.body.mobile
        const password=req.body.password
        

        const spassword=await securePassword(password)
 
        const user=new User({
            name:name,
            email:email,
            mobile:mobile,
            password:spassword,
            is_admin:0
        })

        const userData=await user.save()
        if(userData)
        {
            res.redirect('/admin/dashboard')
        }
        else
        {
            res.render('new-user',{message : 'Something went wrong.'})
        }

    }catch(error)
    {
        console.log(error.message)
    }
}

const editUserLoad=async(req,res)=>{
    try{
        const id=req.query.id
        const userData=await User.findById({_id:id})
        if(userData)
        { 
        res.render('edit-user',{user:userData})
        }
        else
        {
            res.redirect('admin/dashboard')
        }
    }catch(error)
    {
        console.log(error.message)
    }
}

const updateUsers=async(req,res)=>{
    try{

        // const id=req.body._id

       const userData=await User.findByIdAndUpdate({_id:req.body.id},{ $set: { name:req.body.name, email:req.body.email, mobile:req.body.mobile, password: req.body.password}})

       res.redirect('/admin/dashboard ')
    }catch(error)
    {
        console.log(error.message)
    }
}

const deleteUser=async(req,res)=>{
    try{
        const id=req.query.id
        await User.deleteOne({_id:id})
        res.redirect('/admin/dashboard')

    }catch(error)
    {
        console.log(error.message)
    }
}

const newFunction=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error.message)
        
    }
}

module.exports={
    securePassword,
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser ,
    newFunction

}