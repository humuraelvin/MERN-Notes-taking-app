const { Router } = require('express');
const { createNote, getNotes, getNote, editNote, deleteNote } = require('../controllers/notesController')
const router = Router();

router.post('/create', createNote)
router.get('/getNotes', getNotes);
router.get('/getNote/:id', getNote)
router.put('/edit/:id', editNote);
router.delete('/delete/:id', deleteNote);



module.exports = router;