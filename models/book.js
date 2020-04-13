
// models/book.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  description: String,
  author: [{
    type: Schema.Types.ObjectId,
    ref: 'Author'
  }],
  rating: Number,
  reviews: [ 
    {
      user: String,
      comments: String
    } 
  ],
  location: {
    type: {
      type: String
    },
    coordinates: [Number]
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  path: String, // points to the path of the image
  originalName: String // images original name
}, {
  timestamps: true
});

bookSchema.index({
  location: '2dsphere'
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;