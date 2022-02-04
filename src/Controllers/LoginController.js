import LoginModel from "../models/LoginModel.js"

export default class LoginController {
   index (req, res) {
      res.render('login')
   }

   async store (req, res) {
      try {
         const login = new LoginModel(req.body)
         await login.register()
   
         if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            await req.session.save(() => res.redirect('back'))
            return
         }
         req.flash('succes', 'Usuario cadastrado com sucesso!')
         await req.session.save(() => res.redirect('back'))

      } catch (error) {
         console.log(error)
         res.render('404')
      }
   }

   async login (req, res) {
      try {
         const login = new LoginModel(req.body)
         await login.login()
   
         if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            await req.session.save(() => res.redirect('back'))
            return
         }

         req.flash('succes', 'Logado com sucesso!')
         req.session.user = login.user
         await req.session.save(() => res.redirect('/'))

      } catch (error) {
         res.render('404')
      }
   }

   async logout (req, res) {
      await req.session.destroy()
      res.redirect('back')
   }
}