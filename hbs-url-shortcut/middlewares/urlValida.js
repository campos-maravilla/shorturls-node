const { URL } = require('url')

const urlValidar = (req, res, next) => {
    try {
        const { origin } = req.body
        const urlFrontend = new URL(origin)
        if (urlFrontend.origin !== "null") {
            if (
                urlFrontend.protocol === "http:" ||
                urlFrontend.protocol === "https:"
            ) {
                return next()
            }
            throw new Error("tiene que tener https://")
        }
        throw new Error("no válida 🤔")

    } catch (error) {
        //console.log(error);
        //return res.send('URL no válida')
        if (error.message === "Invalid URL") {
            req.flash("mensajes", [{ msg: "url no válida" }])
        } else {
            req.flash("mensajes", [{ msg: error.message }])
        }
        return res.redirect('/')
    }
}
module.exports = urlValidar