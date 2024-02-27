'use strict' //Modo estricto

import User from './user.model.js'
import {    encrypt, 
            checkPassword, 
            checkUpdate 
        } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        //Capturar el formulario (body)
        let data = req.body
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'CLIENT'
        //Guardar la información en la BD
        let user = new User(data)
        await user.save() //Guardar en la BD
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const login = async(req, res)=>{
    try{
        //Capturar los datos (body)
        let { username, password } = req.body
        //Validar que el usuario exista
        let user = await User.findOne({username}) //buscar un solo registro
        //Verifico que la contraseña coincida
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Generar el Token
            let token = await generateJwt(loggedUser)
            //Respondo al usuario
            return res.send(
                {
                    message: `Welcome ${loggedUser.name}`, 
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async(req, res)=>{ //Datos generales (No password)
    try{
        //Obtener el id del usuario a actualizar
        let { id } = req.params
        //Obtener los datos a actualizar
        let data = req.body
        //Validar si data trae datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        //Validar si tiene permisos (tokenización) X Hoy No lo vemos X
        //Actualizar (BD)
        let updatedUser = await User.findOneAndUpdate(
            {_id: id}, //ObjectsId <- hexadecimales (Hora sys, Version Mongo, Llave privada...)
            data, //Los datos que se van a actualizar
            {new: true} //Objeto de la BD ya actualizado
        )
        //Validar la actualización
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})
        //Respondo al usuario
        return res.send({message: 'Updated user', updatedUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteU = async(req, res)=>{
    try{
        //Obtener el Id
        let { id } = req.params
        //Validar si está logeado y es el mismo X No lo vemos hoy X
        //Eliminar (deleteOne (solo elimina no devuelve el documento) / findOneAndDelete (Me devuelve el documento eliminado))
        let deletedUser = await User.findOneAndDelete({_id: id}) 
        //Verificar que se eliminó
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        //Responder
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`}) //status 200
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}