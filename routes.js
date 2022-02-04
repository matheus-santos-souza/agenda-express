import express from 'express'
import LoginController from './src/Controllers/loginController.js'
import ContatoController from './src/Controllers/ContatoController.js'
import LoginMiddleware from './src/middlewares/loginMiddleware.js'
import HomeController from './src/Controllers/HomeController.js'

const route = express.Router()

//home
route.get('/', HomeController.prototype.index)

//Login
route.get('/login', LoginController.prototype.index)
route.post('/login/register', LoginController.prototype.store)
route.post('/login/logged', LoginController.prototype.login)
route.get('/login/logout', LoginController.prototype.logout)

//Contato
route.get('/contato', LoginMiddleware.prototype.loginRequired, ContatoController.prototype.index)
route.post('/contato/register', LoginMiddleware.prototype.loginRequired, ContatoController.prototype.store)
route.get('/contato/:id', LoginMiddleware.prototype.loginRequired, ContatoController.prototype.showIndex)
route.post('/contato/show/:id', LoginMiddleware.prototype.loginRequired, ContatoController.prototype.show)
route.get('/contato/delete/:id', LoginMiddleware.prototype.loginRequired, ContatoController.prototype.destroy)
route.get('/search', LoginMiddleware.prototype.loginRequired, ContatoController.prototype.search)


export default route