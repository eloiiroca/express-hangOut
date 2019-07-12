const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const postSchema = new Schema(
    {   
        title: {type: String, required: true, max: 20},
        owner: {type: Schema.Types.ObjectId, ref:'User'},
        creationDate: {type: Date, required: true},
        expirationDate: {type: Date, required: true},
        description:{type: String, max: 250},
        loc: {
            type: {type: String, enum: ['Point'], required: true},
            coordinates: [Number],
        }
    }
);

postSchema.index({ "loc": "2dsphere" });

postSchema.virtual('url').get(function(){
    return '/posts/' + this._id;
});

module.exports = mongoose.model('Post', postSchema);