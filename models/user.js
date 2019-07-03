const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: {type: String, required: true, max: 20},
        surname: {type: String, required: false, max: 20},
        username: {type: String, required: true, unique: true, max: 20},
        email:{type: String, required: true, unique: true, max: 100},
        birthdate: {type:Date, required: true},
        hash: String,
        salt: String,
        friends: [{type: Schema.Types.ObjectId, ref:'user'}]
    }
);

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};
  
UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};
  
UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
  
    return jwt.sign({
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
};
  
UserSchema.methods.toAuthJSON = function() {
    return {
      _id: this._id,
      email: this.email,
      token: this.generateJWT(),
    };
};

UserSchema.virtual('birthdate_formatted')
.get(function(){
    return moment(this.birthdate).format('Do MMMM, YYYY');
});

UserSchema.virtual('full_name')
.get(function(){
    return this.name + ' ' + this.surname;
});
  
module.exports = mongoose.model('User', UserSchema);