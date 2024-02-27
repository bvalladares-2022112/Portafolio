'use strict'

import Animal from '../animal/animal.model.js'
import Appointment from './appointment.model.js'

export const test = (req, res)=>{
    return res.send({message: 'Function test is running | appointment'})
}

export const save = async(req, res)=>{
    try{
        //Capturar la data
        let data = req.body;
        data.user = req.user._id //Jalar el id del usuario logeado!!
        //Verificar que exista el animal
        let animal = await Animal.findOne({_id: data.animal})
        if(!animal) return res.status(404).send({message: 'Animal not found'})
        //Validar que la mascota no tenga una cita activa con esa persona
        //EJERCICIO: Que el usuario no pueda tener más de una cita por día.
        let existAppointment = await Appointment.findOne({
            $or: [
                {
                    animal: data.animal,
                    user: data.user
                },
                {
                    date: data.date,
                    user: data.user
                }
            ]
        })
        if(existAppointment) return res.send({message: 'Appointment already exist'})
        //Guardar
        let appointment = new Appointment(data)
        await appointment.save()
        return res.send({message: `Appointment saved successfully, for the date ${appointment.date}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error creating appointment', err})
    }
}