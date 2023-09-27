import Rol from "../models/Rol.js";

const getRols = async (req, res) => {
    try {
        const findRols = await Rol.find();
        const filterRols = findRols.filter( rol => rol.nameRol !== 'admin' && rol.nameRol !== 'mesa' );
        return res.json(filterRols);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error!' });
    }

}

const getTableRol = async (req, res) => {
    try {
        const findTableRol = await Rol.find().where('nameRol').equals('table');
        return res.json(findTableRol);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error!' });
    }

}


export { getRols, getTableRol };