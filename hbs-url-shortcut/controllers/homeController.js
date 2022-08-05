const Url = require('../models/Url')
const { nanoid } = require("nanoid")

const leerUrls = async (req, res) => {
    const urls = [
        { origin: "www.google.com/mauro1", shortURL: "sgfgfg-1" },
        { origin: "www.google.com/mauro2", shortURL: "sgfgfg-2" },
        { origin: "www.google.com/mauro3", shortURL: "sgfgfg-3" },
        { origin: "www.google.com/mauro4", shortURL: "sgfgfg-4" },
    ]
    res.render("home", { urls: urls })
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

module.exports = {
    leerUrls,
    agregarUrl,
}