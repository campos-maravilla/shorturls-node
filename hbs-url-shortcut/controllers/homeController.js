const Url = require('../models/Url')
const { nanoid } = require("nanoid")


const leerUrls = async (req, res) => {
    //console.log(req.user);
    try {
        //{ user: req.user.id } ->viene del modelo donde esta la pseuda relación
        //hace la busqueda y renderizamos solo las urls del usuario
        const urls = await Url.find({ user: req.user.id }).lean();

        res.render("home", { urls: urls })
    } catch (error) {
        //console.log('Algo salio mal');
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect('/')
    }
}

const agregarUrl = async (req, res) => {
    //console.log(req.body);
    const { origin } = req.body
    try {
        const url = new Url({ origin: origin, shortURL: nanoid(8), user: req.user.id })/* shortURL no se pone porque en el modelo se puso por defecto nanoID  */
        console.log(url);
        await url.save()
        req.flash("mensajes", [{ msg: 'URL agregada' }])
        return res.redirect('/')
        // res.redirect("/")
        //res.send("agregado")
    } catch (error) {
        //console.log(error);
        //res.send('!error!,algo salio mal',)
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect('/')
    }
}

const eliminarUrls = async (req, res) => {
    //console.log(req.user.id);
    const { id } = req.params
    try {
        //await Url.findByIdAndDelete(id)
        //para eliminar la que es solo del usuario y borre las demas
        const url = await Url.findById(id)
        if (!url.user.equals(req.user.id)) {//cuando no coincida
            throw new Error('No es tu url payaso')
        }
        await url.remove()
        req.flash("mensajes", [{ msg: 'URL eliminada' }])
        return res.redirect('/')

        res.redirect("/")
    } catch (error) {
        //console.log(error);
        //res.send('!error!,algo salio mal',)
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect('/')
    }
}

const editarUrlForm = async (req, res) => {
    //console.log(req.user.id);
    const { id } = req.params
    try {
        const url = await Url.findById(id).lean()
        //console.log(url);

        if (!url.user.equals(req.user.id)) {//cuando no coincida
            throw new Error('No puedes editar la url payaso')
        }
        res.render('home', { url })
    } catch (error) {
        //console.log(error);
        //res.send('!error!,algo salio mal',)
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect('/')
    }
}

const editarUrl = async (req, res) => {
    //console.log(req.user.id);
    const { id } = req.params
    const { origin } = req.body
    try {
        const url = await Url.findById(id)
        if (!url.user.equals(req.user.id)) {//cuando no coincida
            throw new Error('No es tu url payaso')
        }
        await url.updateOne({ origin })

        //await Url.findByIdAndUpdate(id, { origin: origin })
        req.flash("mensajes", [{ msg: 'URL editada' }])

        res.redirect("/")
    } catch (error) {
        //console.log(error);
        //res.send('!error!,algo salio mal',)
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect('/')
    }
}

const redireccionamiento = async (req, res) => {
    const { shortURL } = req.params
    console.log(shortURL);
    try {
        const urlDB = await Url.findOne({ shortURL: shortURL })
        res.redirect(urlDB.origin)
    } catch (error) {
        req.flash("mensajes", [{ msg: 'No existe esta url configurada' }])
        return res.redirect('/auth/login')
    }
}

module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrls,
    editarUrlForm,
    editarUrl,
    redireccionamiento,
}