import mongoose from 'mongoose'
import {config} from '../config/config.js';

const usersCollection = config.USERS_COLLECTION

const userSchema = new mongoose.Schema ({
    name : String,
    email: {type: String, unique:true},
    password : String,
    cartId : {required : true, type:mongoose.Schema.Types.ObjectId},
    typeofuser : String,
    age : Number,
    last_name : String,
    last_login : {
        type: Date,
        default: Date.now
      }
})

export const userModel = mongoose.model (usersCollection, userSchema)