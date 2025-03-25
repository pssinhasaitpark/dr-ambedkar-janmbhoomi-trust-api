var router = require('express').Router()
const path = require("path")

module.exports = app => {
    router.get('/media/:name', (req, res) => {
        const { type, name } = req.params

        console.log('__dirname>>>>>>>>',__dirname);
        
        res.sendFile(path.join(__dirname, `../uploads/${name}`,))
    })

    app.use('/', router)
};