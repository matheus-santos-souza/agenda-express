import mongoose from 'mongoose'
import validator from 'validator'
import bcrypit from 'bcryptjs'

const loginSchema = new mongoose.Schema({
   email: {type: String, required: true},
   password: {type: String, required: true}
})

const login = mongoose.model('login', loginSchema)

export default class LoginModel {
   constructor(body) {
      this.body = body
      this.errors = []
      this.user = null
   }

   async register() {
      this.valida()
      if(this.errors.length > 0) return
      await this.userExists() 
      if(this.errors.length > 0) return
      const salt = bcrypit.genSaltSync()
      this.body.password = bcrypit.hashSync(this.body.password, salt)
      this.user = await login.create(this.body)  
   }

   async login() {
      this.valida()
      if(this.errors.length > 0) return
      this.user = await login.findOne({email: this.body.email})
      if(!this.user) {
         this.errors.push('Email ou senha inválidos')
         return
      }

      if(!bcrypit.compareSync(this.body.password, this.user.password)) {
         this.errors.push('Email ou senha inválidos')
         this.user = null
         return
      }  
   }

   valida() {
      this.cleanUp()
      if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido!')
      
      if(this.body.password.length < 3 || this.body.password.length > 50) {
         this.errors.push('Senha inválida!')
      }
   }

   cleanUp() {
      for(const key in this.body) {
         if(typeof this.body[key] !== 'string') 
            this.body[key] = '';       
      }
      this.body = {
         email: this.body.email,
         password: this.body.password
      }
   }

   async userExists() {
      this.user = await login.findOne({email: this.body.email})
      if (this.user) this.errors.push('Usuário já existe na base de dados')
   }
}