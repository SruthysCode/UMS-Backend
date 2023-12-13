const express=require("express")

const admin_route=express()
const session=require("express-session")   

const config=require("../config/config")
admin_route.use(session({
    secret: config.sessionSecret,
    resave: false, 
    saveUninitialized: false 
}))

const auth=require('../middleware/adminAuth')

admin_route.set('view engine', 'ejs')
admin_route.set('views',"./view/admin")


admin_route.use(express.json())
admin_route.use(express.urlencoded({extended:true}))

const adminController=require('../controller/adminController')
admin_route.get('/',auth.isLogout,adminController.loadLogin)
admin_route.post('/',adminController.verifyLogin)

admin_route.get('/home',auth.isLogin, adminController.loadDashboard)
admin_route.get('/logout',auth.isLogout, adminController.logout)
admin_route.post('/dashboard',adminController.adminDashboard)

admin_route.get('/new-user',auth.isLogin, adminController.newUserLoad)

admin_route.post('/new-user',auth.isLogin,adminController.addUser)

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad)
admin_route.post('/edit-user',adminController.updateUsers)

admin_route.get('/delete-user',adminController.deleteUser)

admin_route.get('/route',adminController.newFunction)
admin_route.get('*',function(rq,res){
    res.redirect('/admin')
})
module.exports=admin_route