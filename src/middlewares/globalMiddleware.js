
export default class globalMiddeware {
   async messages (req, res, next) {
      res.locals.errors = req.flash('errors')
      res.locals.succes = req.flash('succes')
      res.locals.user = req.session.user
      next()
   }
}