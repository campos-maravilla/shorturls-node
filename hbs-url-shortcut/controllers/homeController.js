const Url = require('../models/Url')
const { nanoid } = require("nanoid")

const leerUrls = async (req, res) => {
    console.log(req.user);
    try {
        const urls = await Url.find().lean();

        res.render("home", { urls: urls })
    } catch (error) {
        console.log('Algo salio mal');
    }
}

const agregarUrl = async (req, res) => {
    //console.log(req.body);
    const { origin } = req.body
    try {
        const url = new Url({ origin: origin, shortURL: nanoid(8) })/* shortURL no se pone porque en el modelo se puso por defecto nanoID  */
        console.log(url);
        await url.save()
        res.redirect("/")
        //res.send("agregado")
    } catch (error) {
        console.log(error);
        res.send('!error!,algo salio mal',)
    }
}

const eliminarUrls = async (req, res) => {
    const { id } = req.params
    try {
        await Url.findByIdAndDelete(id)
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.send('!error!,algo salio mal',)
    }
}

const editarUrlForm = async (req, res) => {
    const { id } = req.params
    try {
        const url = await Url.findById(id).lean()
        //console.log(url);
        res.render('home', { url })
    } catch (error) {
        console.log(error);
        res.send('!error!,algo salio mal',)
    }
}

const editarUrl = async (req, res) => {
    const { id } = req.params
    const { origin } = req.body
    try {
        await Url.findByIdAndUpdate(id, { origin: origin })
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.send('!error!,algo salio mal',)
    }
}

const redireccionamiento = async (req, res) => {
    const { shortURL } = req.params
    console.log(shortURL);
    try {
        const urlDB = await Url.findOne({ shortURL: shortURL })
        res.redirect(urlDB.origin)
    } catch (error) {

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