export default class LoginMiddleware {
   
   async loginRequired (req, res, next) {
      if (!req.session.user) {
         req.flash('errors', 'Você precisa fazer login')
         await req.session.save(() => res.redirect('/'))
         return
      }
      next()
   }
}