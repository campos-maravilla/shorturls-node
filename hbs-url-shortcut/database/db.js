const mongoose = require('mongoose')
require('dotenv').config()//config para herokux

//const clientDB(config para herokux)
const clientDB = mongoose.connect(process.env.URI)
    .then((m) => {//config para herokux
        console.log('DB conectada')
        return m.connection.getClient()//config para herokux
    })
    .catch((e) => console.log('falló la conexión ' + e))

module.exports = clientDB

