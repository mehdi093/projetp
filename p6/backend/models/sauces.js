const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number,default:0, required: true },
    likes: { type: Number,default:0,  required: false },
    dislikes: { type: Number,  required: false },
    usersLiked: { type: [String], required: false },
    usersDislikes: { type: [String], required: false },
    userId: {type: String, required: true},
    
});
   


module.exports = mongoose.model('Sauce', sauceSchema);