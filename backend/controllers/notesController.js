const Notes = require('../models/notes-model');

const createNote = async (req, res) => {
    try {
        const { title, description } = req.body;

        const newNote = new Notes({
            title, description
        });

        await newNote.save();
        res.status(200).json({ success: true, message: "Note added successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getNotes = async (req, res) => {
    try {
        const notes = await Notes.find();
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getNote = async (req, res) => {
    try {
        const noteId = req.params.id; 
        const note = await Notes.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const editNote = async (req, res) => {
    try {
        const NoteId = req.params.id; 

        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(422).json("Some fields are empty"); 
        }

        // No need to check for user here since you're not using it

        const newInfo = await Notes.findByIdAndUpdate(NoteId, { title, description }, { new: true }); 

        return res.status(200).json({ message: "Note updated successfully", newInfo });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" }); 
    }
}


const deleteNote = async (req, res) => {
    try {

        const NoteId = req.params.id;
        const deletedNote = await Notes.findByIdAndDelete(NoteId)
        if (!deletedNote) {
            res.status(404).json({message:"User not found"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

module.exports = { createNote, getNotes, getNote, editNote, deleteNote }