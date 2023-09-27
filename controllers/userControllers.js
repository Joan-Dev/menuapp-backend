// Import jsonwebtoken
import generateJWT from "../helpers/generateJWT.js";
// Import model User
import User from "../models/User.js";
// Import model Rol
import Rol from "../models/Rol.js";
// Import helpers
import generateUniqueId from "../helpers/generateUniqueId.js";


// Agregate a new user
const addUser = async (req, res) => {
    try {
        const { username, email, password, nameRol } = req.body;

        // Verify exist user
        const findUserByName = await User.findOne({username});
        if (findUserByName) return res.status(401).json({msg: 'Este usuario ya existe'});

        const findUserByEmail = await User.findOne({email});
        if (findUserByEmail) return res.status(401).json({msg: 'Este email ya existe'});

        // Find rol
        const findRol = await Rol.findOne({nameRol});
        if (!findRol) return res.status(401).json({msg: '¡Rol incorrecto!'});

        // Create new user
        const newUser = await new User(req.body);
        newUser.userId = req.user._id;
        newUser.rol = findRol._id;

        const savedUser = await newUser.save();

        return res.json({ username: savedUser.username, email: savedUser.email, available: savedUser.available, rol: findRol, _id:  savedUser._id})

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error' });
    }
}

// Get all users
const getUsers = async (req, res) => {
    try {
        const getAllUsers = await User.find().where('userId').equals(req.user).populate('rol');
        console.log(getAllUsers);
        return res.json(getAllUsers);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error, vuelva a intentarlo!' });
    }
}

// Edit user
const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nameRol } = req.body;
        // Find table by id
        const findUser = await User.findById(id);
        
        if(!findUser) return res.status(401).json({ msg: 'Mesa no encontrada' });

         // Find rol
         const findRol = await Rol.findOne({nameRol});
         if (!findRol) return res.status(401).json({msg: '¡Rol incorrecto!'});

        // Verify id table and id user
        if(findUser?.userId.toString() !== req.user._id.toString() ) return res.status(401).json({ msg: '¡Acción inválida!' });

        // Update table
        findUser.username = req.body.username || findUser.username;
        findUser.email = req.body.email || findUser.email;
        findUser.password = req.body.password || findUser.password;
        findUser.rol = findRol._id || findUser.rol;
        findUser.available = req.body.available || findUser.available;

        const userUpdated = await findUser.save();
        console.log(userUpdated);
        res.json({ username: userUpdated.username, email: userUpdated.email, available: userUpdated.available, rol: findRol, _id: userUpdated._id });

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error!' });
    }


}

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Find table by id
        const findUser = await User.findById(id);
        if(!findUser) return res.status(401).json({ msg: 'Mesa no encontrada' });

        // Verify id table and id user
        if(findUser?.userId.toString() !== req.user._id.toString() ) return res.status(401).json({ msg: '¡Acción inválida!' });

        // Delete table
        await findUser.deleteOne();
        res.json({ msg: '¡Usuario eliminado!' });

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error!' });
    }
}


export { addUser, getUsers, editUser, deleteUser };
