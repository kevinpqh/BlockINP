var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    author: {type: String, required: true},
    reviewText: {type: String, required: true},
    createdOn: {type: Date,"default": Date.now}
});

var blockSchema = new mongoose.Schema({
    titulo: {type: String,required: true},
    resumen: {type: String,required: true},
    cuerpo: {type: String,required: true},
    reviews: [reviewSchema]
});

mongoose.model('Block', blockSchema);