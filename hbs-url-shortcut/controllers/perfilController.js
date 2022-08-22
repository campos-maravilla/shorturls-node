const formidable = require('formidable')
var Jimp = require('jimp');
const fs = require('fs')
const path = require('path')
const User = require('../models/User')

module.exports.formPerfil = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        return res.render("perfil", { user: req.user, imagen: user.imagen })
    } catch (error) {
        req.flash("mensajes", [{ msg: 'Error al leer el usuario' }])
        return res.redirect('/perfil')
    }
}

module.exports.editarFotoPerfil = async (req, res) => {
    //console.log(req.user);
    //return res.json({ ok: true })
    const form = new formidable.IncomingForm()
    form.maxFileSize = 50 * 1024 * 1024 // 50mb

    form.parse(req, async (err, fields, files) => {
        try {
            if (err) {
                throw new Error('falló la subida de la imagen')
            }
            //console.log(fields);
            //console.log(files);
            console.log(files.myFile);
            const file = files.myFile

            if (file.originalFilename === "") {
                throw new Error('Por favor agrega una imagen')
            }

            const imageTypes = ['imagen/jpeg', 'image/png', 'image/jpeg']

            if (!imageTypes.includes(file.mimetype)) {
                throw new Error('Por favor agrega una imagen con extension .jpeg o .png')
            }

            /* if (!['imagen/jpeg', 'imagen/png'].includes(file.mimetype)) {
                throw new Error('Solo se permiten imagenes con extension .jpeg o .png')
            }
 */
            if (file.size > 50 * 1024 * 1024) {
                throw new Error('La imagen debe tener menos de 50mb')
            }

            const extension = file.mimetype.split("/")[1]
            const dirFile = path.join(__dirname, `../public/img/perfiles/${req.user.id}.${extension}`)
            //console.log(dirFile);
            fs.renameSync(file.filepath, dirFile)

            const image = await Jimp.read(dirFile)
            image.resize(200, 200).quality(90).writeAsync(dirFile)

            const user = await User.findById(req.user.id)
            user.imagen = `${req.user.id}.${extension}`
            await user.save()

            req.flash("mensajes", [{ msg: "ya se subió la imagen" }])
            //return res.redirect('/perfil')

        } catch (error) {
            req.flash("mensajes", [{ msg: error.message }])
        } finally {

            return res.redirect('/perfil')
        }
    })
}