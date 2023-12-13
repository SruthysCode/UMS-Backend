
const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/webBACK")

const express=require("express")
const app=express()
const cors=require("cors")
const morgan=require("morgan")

app.use(cors('*'))
app.use(morgan('dev'))


// path 
const path=require("path")
app.use('/static',express.static(path.join(__dirname,'public')))

// user route
const userRoute=require('./routes/userRoute')
app.use('/',userRoute)


// admin
const adminRoute=require('./routes/adminRoute')

app.use('/admin',adminRoute)



app.listen(5000, function(){
    console.log("Server runnnnning.....at http://localhost:5000")
})

