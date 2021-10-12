module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const category = {
            id: req.body.id,//Maneira com mais segurança por trazer os paramentros certos
            name: req.body.name,
            parentId: req.body.parentId
        }
        
        if(req.params.id) category.id = req.params.id

        try {
            existsOrError(category.name, 'Nome não informado')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(category.id) {
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código da Categoria não informado.')

            //Verificar se tem subcategoria
            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id })
            notExistsOrError(subcategory, 'Categoria possui subcategorias.')

            //Verificar se tem artigos
            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Categoria possui artigos.')

             //Deletar linha
            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Categoria não foi encontrada.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    //Caminho
    const withPath = categories => {
        //Categoria pai
        const getParent = (categories, parentId) => {
            // vincular com a categoria
            const parent = categories.filter(parent => parent.id === parentId)
            // se tamanho maior que zero retorna verdadeiro e colocar com index zero, se não retorna null
            return parent.length ? parent[0] : null
        }

        // Caminho com categorias
        const categoriesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }
        })

        //Colocar em ordem
        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    //Estrutura de arvore
    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId)//Pegar o pai e setar ela com categoria
        tree = tree.map(parentNode => {//Pegar os filhos e setar como subcategoria
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))//Pegar os filhos e setar como subcategoria
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(categories)))//Converter para arvore
            .catch(err => res.status(500).send(err))
    }

    const limit =3 // usado para paginação
    const getPage = async (req,res) =>{//Buscar
            const page = req.query.page || 1

            const result = await app.db('categories').count('id').first()
            const count = parseInt(result.count)

            app.db('categories')
                .select('id', 'name', 'parentId')
                .limit(limit).offset(page * limit - limit)
                .then(categories => res.json({ data: categories, count, limit }))
                .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree,getPage }
}
