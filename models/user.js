const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {type: String, required: true, max: 20},
        surname: {type: String, required: false, max: 20},
        username: {type: String, required: true, unique: true, max: 20},
        email:{type: String, required: true, unique: true, max: 100},
        birthdate: {type:Date, required: true},
        biography: {type: String, max: 1000},
        hash: String,
        salt: String,
        friends: [{type: Schema.Types.ObjectId, ref:'user'}]
    }
);

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};
  
userSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};
  
userSchema.virtual('getName')
.get(function(){
    return this.name;
})

userSchema.virtual('birthdate_formatted')
.get(function(){
    return moment(this.birthdate).format('Do MMMM, YYYY');
});

userSchema.virtual('full_name')
.get(function(){
    return this.name + ' ' + this.surname;
});
  
module.exports = mongoose.model('User', userSchema);