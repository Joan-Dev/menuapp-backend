import Rol from "../models/Rol.js";



const isAdmin = async (req, res, next) => {
    try {
        const {user} = req;

        const rolAdmin = await Rol.findOne({_id: user.rol?._id})
        if (rolAdmin.nameRol === 'admin') return next();
            console.log('No es admin');
            return res.status(400).json({msg: 'Este user no es admin'});
        
    } catch (error) {
        return res.status(404).json({error: 'Hubo un error rol'});
    }
}

const isWaiter = async (req, res, next) => {
    try {
        const {user} = req;

        const rolAdmin = await Rol.findOne({_id: user.rol?._id})
        if (rolAdmin.nameRol === 'mesonero') return next();
            console.log('No es mesonero');
            return res.status(400).json({msg: 'Este user no es mesonero'});
        
    } catch (error) {
        return res.status(404).json({error: 'Hubo un error rol'});
    }
}

const isCaja = async (req, res, next) => {
    try {
        const {user} = req;
        const adminRole = await Rol.findById()
        const rolAdmin = await Rol.findOne({_id: user.rol?._id})
        if (rolAdmin.nameRol === 'caja') return next();
            console.log('No es caja');
            return res.status(400).json({msg: 'Este user no es caja'});
        
    } catch (error) {
        return res.status(404).json({error: 'Hubo un error rol'});
    }
}

const isCocina = async (req, res, next) => {
    try {
        const {user} = req;
        const adminRole = await Rol.findById()
        const rolAdmin = await Rol.findOne({_id: user.rol?._id})
        if (rolAdmin.nameRol === 'cocina') return next();
            console.log('No es cocina');
            return res.status(400).json({msg: 'Este user no es cocina'});
        
    } catch (error) {
        return res.status(404).json({error: 'Hubo un error rol'});
    }
}




export {isAdmin, isWaiter, isCaja, isCocina};