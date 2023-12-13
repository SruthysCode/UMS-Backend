const express=require("express")

const user_route=express()
const session=require("express-session")   

const path=require("path")

const config=require("../config/config")
const nocache = require('nocache');
user_route.use(nocache());
const upload= require('../config/multer')



// const nocache=(req,res,next)=>{
//         res.setHeader('Cache-Control','private,no-cache,no-Store,must-revalidate');
//         res.setHeader('Pragma','no-cache');
//         res.setHeader('Expires','-1')
//         // res.setHeader('Surrogate-Control','no-store')
//         next();
//     }
// user_route.use(nocache());

user_route.use(session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false 
}))

const auth=require('../middleware/auth')
user_route.set('view engine', 'ejs')
user_route.set('views',"./view/user")

user_route.use(express.json())
user_route.use(express.urlencoded({extended:true}))

const userController=require('../controller/userController')
user_route.get('/register',auth.isLogout,userController.loadRegister)
user_route.post('/register',auth.isLogout,userController.insertUser)

user_route.get('/',auth.isLogout, userController.loginLoad)

user_route.get('/login',auth.isLogout, userController.loginLoad)
user_route.post('/login',userController.verifyLogin)
user_route.get('/home',userController.loadHome)
user_route.post('/image',upload.single("image"), userController.uploadimage)
// upload.single("image"),upload.array("image", 3),

user_route.get('/logout',auth.isLogin,userController.userLogout)

module.exports=user_route