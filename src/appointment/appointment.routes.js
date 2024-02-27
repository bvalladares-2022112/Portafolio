'use strict'

import { Router } from 'express'
import { 
    test,
    save
} from './appointment.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

//Rutas públicas
api.get('/test', test)

//Rutas privadas - CLIENT
api.post('/save', [validateJwt], save)

export default api