import ContatoModel from "../models/ContatoModel.js"

export default class HomeController {
   async index (req, res) {
      if(!req.session.user) 
         return res.render('index', { contatos: {} })
         
      const contatos = await ContatoModel.contatosIndex(req.session.user._id)
      res.render('index', { contatos })
   }

}