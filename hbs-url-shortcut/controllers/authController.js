const User = require("../models/User");
const { validationResult } = require('express-validator')
const { nanoid } = require('nanoid')


const registerForm = (req, res) => {
    res.render('register', { mensajes: req.flash("mensajes") })
}


const registerUser = async (req, res) => {
    //console.log(req.body);
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        //return res.json(errors)
        req.flash("mensajes", errors.array())
        return res.redirect('/auth/register')
        //return res.json(errors.array())
    }

    const { userName, email, password } = req.body
    try {
        let user = await User.findOne({ email: email })
        if (user) throw new Error('Ya existe el usuario')
        //user = new User( req.body )
        user = new User({ userName, email, password, tokenConfirm: nanoid() })
        await user.save()

        // enviar correo electronico con la confirmación de la cuenta
        req.flash("mensajes",
            [{ msg: "Revisa tu correo electronico y válida tu cuenta" }])


        res.redirect('/auth/login')
        // console.log(user);
        //res.json(user)
    } catch (error) {
        //res.json({ error: error.message })
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect('/auth/login')
    }

}

const confirmarCuenta = async (req, res) => {
    const { token } = req.params

    try {
        const user = await User.findOne({ tokenConfirm: token })
        if (!user) throw new Error("No existe este usuario")

        user.cuentaConfirmada = true
        user.tokenConfirm = null

        await user.save()

        req.flash("mensajes",
            [{ msg: "Cuenta verificada,puedes iniciar sesión" }])


        res.redirect('/auth/login')

        res.json(user)
    } catch (error) {
        //res.json({ error: error.message })
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect('/auth/login')
    }

    //res.json(token)
}

const loginForm = (req, res) => {
    res.render('login', { mensajes: req.flash("mensajes") })
}

const loginUser = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array())
        //return res.json(errors.array())
        return res.redirect('/auth/login')
    }

    const { email, password } = req.body
    try {

        const user = await User.findOne({ email })
        if (!user) throw new Error('No existe este email')

        if (!user.cuentaConfirmada) throw new Error('Falta confirmar cuenta')

        if (!(await user.comparePassword(password)))
            throw new Error('Contraseña no correcta')

        //para saber si el usuario tiene sesión(me está creando la sesión a través de passport)
        req.login(user, function (err) {
            if (err) throw new Error('Error al crear la sesión')
            res.redirect('/')
        })


    } catch (error) {
        //console.log(error);
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect('/auth/login')
        // res.send(error.message)
        //return res.json(errors.array())
    }
}

const cerrarSesion = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.redirect('/auth/login')

    })
}

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarSesion,
}