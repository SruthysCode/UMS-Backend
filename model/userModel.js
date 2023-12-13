const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({

    username:{
        type: String
    },
    name:{
        type: String        
    },
    email:{
        type: String   
    },
    mobile:{
        type: String      
    },
     password:{
        type: String   
    },
    gender:{
        type : String
    },
    status:{
        type: Boolean      
    },
    image:{
        type: String
    }
 
})
module.exports=mongoose.model('User',userSchema)
