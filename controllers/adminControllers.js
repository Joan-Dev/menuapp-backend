// Import jsonwebtoken
import generateJWT from "../helpers/generateJWT.js";
// Import models
import Admin from "../models/Admin.js";
import Rol from "../models/Rol.js";
import User from "../models/User.js";
// Import helpers
import generateUniqueId from "../helpers/generateUniqueId.js";
import emailRegister from "../helpers/emailRegister.js";
import emailForgotPassword from "../helpers/emailForgotPassword.js";

// Register main user admin
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Prevent duplicated users with email
    const findUser = await Admin.findOne({ email: email.toLowerCase() });
    if (findUser) return res.status(400).json({ msg: "¡Usuario existente!" });

    // Find admin rol and put
    const findAdminRol = await Rol.findOne({ nameRol: "admin" });

    // Create and save user admin
    const createAdmin = await new Admin({
      username,
      email,
      password,
      rol: findAdminRol,
    });

    const adminSaved = await createAdmin.save();

    // Send email
    emailRegister({
      email,
      username,
      token: adminSaved.token,
    });

    res.status(200).json({ msg: "Creado correctamente, revisa tu email" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "¡Hubo un error, !vuelve a intentarlo!" });
  }
};

// Verify tokenId by mail
const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const findUserToVerify = await Admin.findOne({ token });

    // Search user by token
    if (!findUserToVerify)
      return res.status(401).json({ msg: "¡Token no válido!" });

    findUserToVerify.token = null;
    findUserToVerify.verified = true;
    await findUserToVerify.save();

    return res.status(200).json({ msg: "¡Usuario confirmado correctamente!" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "¡Hubo un error, !vuelve a intentarlo!" });
  }
};

// Login
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Comprobate if user exist
    const findUser = await Admin.findOne({
      email: email.toLowerCase(),
    }).populate("rol");

    const findUserStaff = await User.findOne({
      email: email.toLowerCase(),
    }).populate("rol");

    if (!findUser && !findUserStaff)
      return res.status(404).json({ msg: "¡Usuario inexistente!" });

    if (findUser) {
      // Comprobate if user is verified
      if (!findUser?.verified)
        return res.status(403).json({ msg: "¡Debe confirmar cuenta!" });
        // Auth user password
        const verifyPass = await findUser.verifyPassword(password);
        if (!verifyPass)
        return res.status(403).json({ msg: "¡Email o contraseña erroneos" });

        return res.json({
            _id: findUser._id,
            rol: findUser.rol,
            token: generateJWT(findUser._id),
            email: findUser.email,
            username: findUser.username,
            profile: findUser.profile,
          });
    }



    if (findUserStaff) {
        const verifyPassStaff = await findUserStaff.verifyPassword(password);
        if (!verifyPassStaff)
        return res.status(403).json({ msg: "¡Email o contraseña erroneos" });
        return res.json({
            _id: findUserStaff._id,
            rol: findUserStaff.rol,
            token: generateJWT(findUserStaff._id),
            email: findUserStaff.email,
            username: findUserStaff.username,
          });

    }

  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "¡Hubo un error, !vuelve a intentarlo!" });
  }
};

/*********************Controllers to change password*************************/
// Put token in the user
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Comrobate if user exist
    const findUser = await Admin.findOne({ email: email.toLowerCase() });
    if (!findUser)
      return res.status(400).json({ msg: "¡Este usuario no existe!" });

    // Generate a token
    findUser.token = generateUniqueId();
    // Save user changes and send a message
    await findUser.save();

    // Send email
    emailForgotPassword({
      email,
      username: findUser.username,
      token: findUser.token,
    });

    res.json({ msg: "Le hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ msg: "¡Hubo un error, vuelve a intentarlo!" });
  }
};
// Verify if the user token exist
const verifyPassword = async (req, res) => {
  try {
    const { token } = req.params;
    // Validate if user token exist
    const validateToken = await Admin.findOne({ token });

    if (!validateToken)
      return res.status(400).json({ msg: "¡Token inválido!" });

    return res.json({ msg: "Token válido" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "¡Hubo un error!" });
  }
};
// Send and change
const newPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    // Find user by token
    const findUser = await Admin.findOne({ token });
    if (!findUser) return res.status(400).json({ msg: "¡Token inválido!" });
    // Modified password and token
    findUser.token = null;
    findUser.password = password;
    // Save changes
    await findUser.save();
    return res.json({ msg: "¡Contraseña modificada correctamente!" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "¡Hubo un error!" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { originalname } = req.file;
    console.log(req.file);
    const fullNameImage = `/images/${originalname}`;

    const { id } = req.params;
    const { nameRest, description } = req.body;
    console.log(nameRest, description);
    // Find user by id
    const findUser = await Admin.findById(id);

    if (!findUser)
      return res.status(401).json({ msg: "Usuario no encontrado" });

    // Verify id user and id user
    if (findUser?._id.toString() !== req.user._id.toString())
      return res.status(401).json({ msg: "¡Acción inválida!" });

    // Update table
    findUser.profile.nameRest = nameRest || findUser.profile.nameRest;
    findUser.profile.description = description || findUser.profile.description;
    findUser.profile.imageLogo = fullNameImage || findUser.profile.imageLogo;

    const tableUpdated = await findUser.save();
    res.json({
      nameRest: tableUpdated.profile.nameRest,
      imageIcon: tableUpdated.profile.imageIcon,
      imageLogo: tableUpdated.profile.imageLogo,
      description: tableUpdated.profile.description,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "¡Hubo un error!" });
  }
};

// Get profile user
const getProfile = async (req, res) => {
  const { user } = req;

  return res.json(user);
};
export {
  registerUser,
  getProfile,
  verifyAccount,
  authUser,
  forgotPassword,
  verifyPassword,
  newPassword,
  updateProfile,
};
