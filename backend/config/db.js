const config = require('../knexfile.js')
const knex = require('knex')(config)

knex.migrate.latest([config]) // criar a tabela quando chamar npm start (quando estiver em produção não utilizar)
module.exports=knex