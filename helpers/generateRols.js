import Rol from "../models/Rol.js";

const generateRols = async () => {

    try {
        const count = await Rol.estimatedDocumentCount();

        if (count > 0) return;
            
        const rols = await Promise.all([
            new Rol({nameRol: 'admin'}).save(),
            new Rol({nameRol: 'mesa'}).save(),
            new Rol({nameRol: 'mesonero'}).save(),
            new Rol({nameRol: 'cocina'}).save(),
            new Rol({nameRol: 'caja'}).save(),
        ])
        console.log(rols);
    } catch (error) {
        console.log(error);
    }
}
export default generateRols;