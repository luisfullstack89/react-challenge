const mongoose = require('mongoose')

const Schema = mongoose.Schema

const employeeSchema = new Schema({
    name : {
        required : true,
        type : String
    },
    department : {
        type : String,
        required : true
    },
    email : {
       type: String,
       required : true
    },
    phoneNumber : {
      type : Number,
      required : true
    },
    
     gender: {
        type: String
    },    
    employmentStatus: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract']
    },
     experience: {
        type: Number
    },
     position: {
        type: String
    },

} , {
    timestamps :true
})

module.exports = mongoose.model('Employee' , employeeSchema)