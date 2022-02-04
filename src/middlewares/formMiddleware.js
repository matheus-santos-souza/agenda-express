export default class formMiddleware {

   checkError (err, req, res, next) {
      if(err) {
         return res.render('404');
      }
      next()
   }

   csrfMiddleware (req, res, next) {
      res.locals.csrfToken = req.csrfToken();
      next();
   }

}