const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion:{
        type:String,
        unique:true,
        required:[true]},
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'},
    estado:{
        type:Boolean,
        required: true,
        default:true
    }
});

module.exports = mongoose.model('Categoria',categoriaSchema);