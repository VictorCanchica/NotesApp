const express = require('express')
const router = express.Router();
const Note = require('../models/Note');
const {isAuthenticated}=require('../helpers/auth');

//CREAR---------------------------------------------------------
router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/add');
})

router.post('/notes/new-note',isAuthenticated, async (req, res) => {
    const {
        title,
        description
    } = req.body;
    const errors = [];
    if (!title) {
        errors.push({
            text: 'Please Write a Title'
        });
    }
    if (!description) {
        errors.push({
            text: 'Please Write a Description'
        });

    }
    if (errors.length > 0) {
        res.render('notes/add', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({
            title,
            description
        });
        await newNote.save();
        req.flash('success_msg', 'Nota Agregada Exitosamente!');
        res.redirect('/notes');

    }
})

//LEER------------------------------------------------------
router.get('/notes', isAuthenticated, async (req, res) => {
    await Note.find().sort({
            date: 'desc'
        })
        .then(documentos => {
            const contexto = {
                notes: documentos.map(documento => {
                    return {
                        title: documento.title,
                        description: documento.description,
                        _id: documento._id
                    }
                })
            }
            res.render('notes/all-notes', {
                notes: contexto.notes
            })
        })
})

//UPDATE----------------------------------------------------
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id).lean()
    res.render('notes/edit', {
        note
    });
});
router.put('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const {
        title,
        description
    } = req.body;
    console.log(title);
    await Note.findByIdAndUpdate(req.params.id, {
        title,
        description
    });

    req.flash('success_msg', 'Nota Editada Exitosamente!');
    res.redirect('/notes');
});
//DELETE----------------------------------------------------
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota Eliminada Exitosamente!');
    res.redirect('/notes')
})



module.exports = router;