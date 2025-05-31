const mongoose = require('mongoose')
const shortid = require('shortid');

const codeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  authorid: { type: Number, required: true },
  avatar: { type: String, required: true },
  id: { type: String, default: shortid.generate, unique: true },
  createdAt: { type: Date, default: Date.now },
  like: { type: Number, default: 0 },
  updatedAt: { type: Date },
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;
