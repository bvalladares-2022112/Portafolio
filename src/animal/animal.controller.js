'use strict'

import User from '../user/user.model.js'
import { checkUpdate } from '../utils/validator.js'
import Animal from './animal.model.js'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test function is running' })
}

export const save = async (req, res) => {
    try {
        //Capturar la data
        let data = req.body
        //Validar que el Keeper Exista
        let user = await User.findOne({ _id: data.keeper })
        if (!user) return res.status(404).send({ message: 'Keeper not found' })
        //Crear la instancia del 'animal'
        let animal = new Animal(data)
        //Guardar el animal
        await animal.save()
        //Responder si todo sale bien
        return res.send({ message: 'Animal saved successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving animal' })
    }
}

export const get = async (req, res) => {
    try {
        let animals = await Animal.find()
        return res.send({ animals })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting animals' })
    }
}

export const update = async (req, res) => {
    try {
        //Capturar la data
        let data = req.body
        //Capturar el id del animal a actualizar
        let { id } = req.params
        //Validar que vengan datos
        let update = checkUpdate(data, false)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        //Actualizar
    let updatedAnimal = await Animal.findOneAndUpdate(
        {_id: id},
        data,
        {new: true}
        ).populate('keeper', ['name', 'phone']) //Eliminar la información sensible
        //Validar la actualización
        if(!updatedAnimal) return res.status(404).send({message: 'Animal not found and not updated'})
        //Responder si todo sale bien
        return res.send({message: 'Animal updated successfully', updatedAnimal})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating animal' })
    }
}

export const deleteA = async(req, res)=>{
    try{
        //X Verificar si tiene una reunión en proceso. X
        //Capturar el id del 'animal' a eliminar
        let { id } = req.params
        //Eliminar
        let deletedAnimal = await Animal.deleteOne({_id: id})
        //Validar que se eliminó
        if(deletedAnimal.deletedCount === 0) return res.status(404).send({message: 'Animal not found and not deleted'})
        //Responder
        return res.send({message: 'Deleted animal successfully'})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error deleting animal'})
    }
}

export const search = async(req, res)=>{
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Buscar
        let animals = await Animal.find(
            {name: search}
        ).populate('keeper', ['name', 'phone'])
        //Validar la respuesta
        if(!animals) return res.status(404).send({message: 'Animals not found'})
        //Responder si todo sale bien
        return res.send({message: 'Animals found', animals})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching animals'})
    }
}