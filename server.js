import {config} from 'dotenv'
import routes from './routes.js'
import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import helmet from 'helmet'
import csrf from 'csurf'
import formMiddleware from './src/middlewares/formMiddleware.js'
import globalMiddeware from './src/middlewares/globalMiddleware.js'
import flash from 'connect-flash' 

config()

const app = express()

mongoose.connect(process.env.CONECTION_DB)
.then(() => {
   app.emit('database')
})
.catch((error) => {
   console.log(error)
})

//app.use(helmet())

const sessionOptions = session({
   secret:'12322ff2321c311x2121c5yjuk7i8779',
   store: MongoStore.create({ mongoUrl: process.env.CONECTION_DB }),
   resave: false,
   saveUninitialized: false,
   cookie: {
      maxAge: 1000*60*60,
      httpOnly: true
   }
})

app.use(sessionOptions)
app.use(flash())

app.set('views', path.resolve('src', 'views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.resolve('public')))

app.use(csrf())
app.use(globalMiddeware.prototype.messages)
app.use(formMiddleware.prototype.checkError)
app.use(formMiddleware.prototype.csrfMiddleware)
app.use(routes)

app.on('database', () => {
   app.listen(3000, () => console.log('Rodando na porta 3000'))
})