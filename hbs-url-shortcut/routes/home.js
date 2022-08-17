const express = require('express')
const { leerUrls, agregarUrl, eliminarUrls, editarUrlForm, editarUrl, redireccionamiento } = require('../controllers/homeController')
const urlValidar = require('../middlewares/urlValida')
const verificarUser = require('../middlewares/verificarUser')
const router = express.Router()

router.get("/", verificarUser, leerUrls)
router.post("/", urlValidar, agregarUrl)
router.get("/eliminar/:id", eliminarUrls)
router.get("/editar/:id", editarUrlForm)
router.post("/editar/:id", urlValidar, editarUrl)
router.get("/:shortURL", redireccionamiento)


module.exports = router
