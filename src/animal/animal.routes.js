'use strict'

import { Router } from 'express'
import { 
    deleteA,
    get,
    save, 
    search, 
    test, 
    update
} from './animal.controller.js'

const api = Router()

api.get('/test', test)
api.post('/save', save)
api.get('/get', get)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteA)
api.post('/search', search)

export default api