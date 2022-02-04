import mongoose from "mongoose";
import validator from "validator";

const contatoSchema = mongoose.Schema({
   userId:  {type: String, required: true},
   nome: {type: String, required: true},
   sobrenome: {type: String, required: false, default: ''},
   telefone: {type: String, required: false, default: ''},
   email: {type: String, required: false, default: ''},
   dateTime: {type: Date, default: Date.now}
})

const contato = mongoose.model('contato', contatoSchema)

export default class ContatoModel {
   constructor(body, userId) {
      this.body = body
      this.userId = userId
      this.errors = []
      this.contato = null
   }

   static async searchContatos (query, userId) {
      const contatos =  await contato.find({ userId: userId, age: { $gte: 20 } }).sort({ dateTime: -1 }).exec()
      const filtro = contatos.filter((contato) => {
         if (contato.nome.toLowerCase().includes(query.toLowerCase()) || 
            contato.sobrenome.toLowerCase().includes(query.toLowerCase()) || 
            contato.email.toLowerCase().includes(query.toLowerCase()) ||
            contato.telefone.toLowerCase().includes(query.toLowerCase())) {
            return contato
         }
      })
      return filtro
   }

   static async delete (id, userId) {
      return await contato.findByIdAndDelete({ _id: id, userId: userId })
   }

   static async contatosIndex (userId) {
      return await contato.find({ userId: userId, age: { $gte: 10 } }).sort({ dateTime: -1 }).exec()
   }

   static async showIndex (id, userId) {
      return await contato.findOne({ userId: userId, _id: id })
   }

   async show (id) {
      this.valida()
      if(this.errors.length > 0) return
      const contatoUpdate = await contato.findOneAndUpdate({ userId: this.userId, _id: id }, this.body, { new: true })
      if(!contatoUpdate) return
      
      this.contato = contatoUpdate
      return
   }

   async register () {
      this.valida()
      if (this.errors.length > 0) return
      this.contato = await contato.create({
         userId: this.userId,
         nome: this.body.nome,
         sobrenome: this.body.sobrenome,
         telefone: this.body.telefone,
         email: this.body.email
      })
   }  

   valida() {
      this.cleanUp()
      if(!this.userId) return this.errors.push('User inválido')
      if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email inválido!')
      if(!this.body.nome) this.errors.push('Nome é um campo obrigatório!')
      if(!this.body.telefone && !this.body.email) this.errors.push('É obrigatório ter pelomenos um contato (E-mail ou Telefone)') 
   }

   cleanUp() {
      for(const key in this.body) {
         if(typeof this.body[key] !== 'string') 
            this.body[key] = ''
      }
      this.body = {
         nome: this.body.nome,
         sobrenome: this.body.sobrenome,
         telefone: this.body.telefone,
         email: this.body.email,
      }
   }
}