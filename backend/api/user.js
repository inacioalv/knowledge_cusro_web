const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{

    const {existsOrError,notExistsOrError,equalsOrError}= app.api.validation

    const encryptPassword = password =>{ // irar gerar um hash
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password,salt)
    }

    const save = async (req,res) =>{
        const user= {...req.body}
        if(req.params.id) user.id = req.params.id

        // Para cadastrar admin tem que ser admin
        if(!req.originalUrl.startsWith('/users')) user.admin = false // não pode cadastrar admin no signup
        if(!req.user || !req.user.admin) user.admin =false //não e admin ou não user não irar cadastradas atraves do signup

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password,'Senha não informada')
            existsOrError(user.confirmPassword,'Confirmação de senha inválida')
            equalsOrError(user.password,user.confirmPassword, 'Senhas não conferem')

            const userFromDB= await app.db('users')
                                    .where({email:user.email}).first()
            if(!user.id){
                notExistsOrError(userFromDB,'Usuário já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        user.password= encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id){
            app.db('users')
                  .update(user)
                  .where({id:user.id})
                  .whereNull('deletedAt')
                  .then(_ => res.status(204).send())
                  .catch(err => res.status(500).send(err))
        }else{
            app.db('users')
                  .insert(user)
                  .then(_  => res.status(204).send())
                  .catch(err => res.status(500).send(err))
            }
        }

        const get = (req,res)=>{
            app.db('users')
                 .select('id','name','email','admin')
                 .whereNull('deletedAt')//Deleta mais não no banco de dados
                 .then(users => res.json(users))
                 .catch(err => res.status(500).semd(err))
        }

        const getById = (req,res)=>{
            app.db('users')
                 .select('id','name','email','admin')
                 .where({id: req.params.id}).first()
                 .whereNull('deletedAt')
                 .then(user => res.json(user))
                 .catch(err => res.status(500).semd(err))
        }

        const remove = async (req,res) =>{
            try {
                const articles = await app.db('articles')
                    .where({userId: req.params.id})
                 notExistsOrError(articles, 'Usuário possui artigos')

                const rowsUpdated =await app.db('users')
                     .update({deletedAt: new Date()})
                     .where({id: req.params.id})
                    existsOrError(rowsUpdated,'Usuário não foi encontrado.')

                res.status(204).send()
            } catch (error) {
                res.status(400).send(error)
            }
        }

    const limit =3 // usado para paginação
    const getByPage = async (req,res) =>{//Buscar
            const page = req.query.page || 1

            const result = await app.db('users').count('id').first()
            const count = parseInt(result.count)

            app.db('users')
                .select('id', 'name', 'email','admin')
                .limit(limit).offset(page * limit - limit)
                .then(user => res.json({ data: user, count, limit }))
                .catch(err => res.status(500).send(err))
    }

    return {save,get,getById,remove,getByPage}
}