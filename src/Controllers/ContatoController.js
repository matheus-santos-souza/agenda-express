import ContatoModel from "../models/ContatoModel.js"

export default class ContatoController {

   async index (req, res) {
      res.render('contato', { contato: {}, user: req.session.user })
   }

   async store (req, res) {
      try {
         const contato = new ContatoModel(req.body, req.session.user._id)
         await contato.register()
   
         if(contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            await req.session.save(() => res.redirect('back'))
            return
         }

         req.flash('succes', 'Contato registrado com sucesso!')
         await req.session.save(() => res.redirect(`/contato/${contato.contato._id}`))
         
      } catch (error) {
         console.log(error)
         return res.render('404')
      }
   }

   async showIndex (req, res) {
      if(!req.params.id) return res.render('404');
      const contato = await ContatoModel.showIndex(req.params.id, req.session.user._id);
      if(!contato) return res.render('404');
      res.render('contato', { contato });
   }

   async show (req, res) {
      try {
         if(!req.params.id) return res.render('404');
         const contato = new ContatoModel(req.body, req.session.user._id)
         await contato.show(req.params.id)
   
         if(contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            await req.session.save(() => res.redirect('back'))
            return
         }
   
         req.flash('succes', 'Contato editado com sucesso!')
         await req.session.save(() => res.redirect(`/contato/${contato.contato._id}`))
         
      } catch (error) {
         console.log(error)
         res.render('404')
      }
   }

   async destroy (req, res) {
      if(!req.params.id) return res.render('404');
      const contato = await ContatoModel.delete(req.params.id, req.session.user._id);
      if(!contato) return res.render('404');
      
      req.flash('succes', 'Contato apagado com sucesso!')
      await req.session.save(() => res.redirect('back'))
   }

   async search (req, res) {
      if(!req.query || !req.session.user) return 

      const search = await ContatoModel.searchContatos(req.query.nameSearch, req.session.user._id)
      
      if(!search.length) {
         search.push(true)   
         res.render('index', { contatos: search, user: req.session.user })
         return
      } 
      res.render('index', { contatos: search, user: req.session.user })
   }
}