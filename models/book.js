const mongoose = require("mongoose");
const comment = require("./comment");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, default: 0},
  comments: []
});


// Export model
module.exports = mongoose.model("Book", BookSchema);