const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    const urls = [
        { origin: "www.google.com/mauro1", shortURL: "sgfgfg-1" },
        { origin: "www.google.com/mauro2", shortURL: "sgfgfg-2" },
        { origin: "www.google.com/mauro3", shortURL: "sgfgfg-3" },
        { origin: "www.google.com/mauro4", shortURL: "sgfgfg-4" },
    ]
    res.render("home", { urls: urls })
})



module.exports = router
