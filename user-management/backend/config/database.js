const mongoose=require('mongoose')
require ('dotenv').config()
const connectDatabase=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB)
    } catch (error) {
        console.log('error occured during database connection',error)
    }
}
module.exports =connectDatabase