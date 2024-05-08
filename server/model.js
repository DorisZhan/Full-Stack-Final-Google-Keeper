const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const NotesModel = mongoose.model("NM", NotesSchema);

module.exports = { NotesModel };