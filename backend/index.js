const app = require('express')()
const consign = require('consign')
const db = require ('./config/db')
const mongoose = require('mongoose')

require('./config/mongodb')

app.db=db // app.db tem como disposição o select,delete,post,put
app.mongoose = mongoose



consign()// ira carregar totos esse arquivos
            .include('./config/passport.js')
            .then('./config/middlewares.js')
            .then('./api/validation.js')
            .then('./api')
            .then('./schedule')
            .then('./config/routes.js')
            .into(app)

app.listen(3000,()=>{
    console.log('Backend Executando');
})