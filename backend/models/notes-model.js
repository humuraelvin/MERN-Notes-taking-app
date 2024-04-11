const mongoose = require('mongoose');

const notesModel = new mongoose.Schema({
    title: String,
    description: String
});

const Notes = mongoose.model("Notes", notesModel);

module.exports = Notes;
