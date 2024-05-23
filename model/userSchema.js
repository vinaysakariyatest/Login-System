const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cpassword:{
        type: String,
        required: true
    },
    // tokens : [
    //     {
    //         token:{
    //             type: String,
    //             required: true
    //         }
    //     }
    // ]
})

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10)
        this.cpassword = await bcrypt.hash(this.cpassword,10)
    }
    next();
})

// userSchema.methods.generateAuthToken = async function(){
//     try {
//         let token = jwt.sign({ _id: this._id}, );
//         this.tokens = this.tokens.concat({ token: token });
//         await this.save();
//         return token;
//     } catch (error) {
//         error
//     }
// }

userSchema.methods.generateAuthToken = async function(){
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email
        },
        process.env.SECRET_KEY,
    );
    } catch (error) {
        console.log(error)
    }
}

const user = mongoose.model('USER', userSchema)

module.exports = user