const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://Vthor:VthorDev@notesappvthordev.rdswc.mongodb.net/NotesAppVthorDev?retryWrites=true&w=majority', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));