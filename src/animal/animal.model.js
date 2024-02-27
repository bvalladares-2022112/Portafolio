import { Schema, model } from 'mongoose';

const animalSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        uppercase: true,
        required: true
    },
    keeper: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {
    versionKey: false //Desahabilitar el __v (version del documento)
})

export default model('animal', animalSchema)