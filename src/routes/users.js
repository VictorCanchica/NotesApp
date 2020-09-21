const express = require('express')
const router = express.Router();

const User= require('../models/User');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
})
router.get('/users/signup', (req, res) => {
    res.render('users/signup');
})

//RECIBIR REGISTRO------------------------------------------------
router.post('/users/signup', async(req, res) => {
    const {
        name,
        email,
        password,
        confirmpassword
    } = req.body;
    const errors = [];
    if (name.length<1){
        errors.push({text:'El nombre no Puede estar Vacio'})
    }
    if (password != confirmpassword) {
        errors.push({
            text: 'Las contraseñas no coinciden'
        });
    }
    if (password.length < 4) {
        errors.push({
            text: 'Contraseña debe ser al menos de 4 caracteres'
        })
    }
    if (errors.length > 0) {
        res.render('users/signup', {
            errors,
            name,
            email,
            password,
            confirmpassword
        });
    } else {
        const emailUser=await User.findOne({email:email});
        if(emailUser){
            req.flash('errors_msg','El email proporcionado ya esta en uso');
            res.redirect('/users/signup')
        }
        const newUser= new User({name,email,password});
        newUser.password= await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg','Te has registrado exitosamente! Bienvenido!');
        res.redirect('/users/signin');
        
    }
})

module.exports = router;