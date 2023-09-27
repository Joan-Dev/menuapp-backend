import Rol from "../models/Rol.js";
import Tables from "../models/Tables.js";

// Agregate tables
const addTable = async (req, res) => {
  try {
    // Find rol
    const findRol = await Rol.findOne({ nameRol: 'mesa' });
    if (!findRol) return res.status(401).json({ msg: "¡Rol incorrecto!" });

    // Add new table and save
    const newTable = new Tables(req.body);
    newTable.userId = req.user._id;
    newTable.rol = findRol._id;
    const saveTable = await newTable.save();

    return res.json(saveTable);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "¡Hubo un error" });
  }
};

// Get all tables
const getTables = async (req, res) => {
  try {
    const getAllTables = await Tables.find().where("userId").equals(req.user);
    const getAllTablesUser = await Tables.find().where("userId").equals(req.user?.userId);
    if (getAllTables.length) {
      return res.json(getAllTables);
    }

    if (getAllTablesUser.length) {
      return res.json(getAllTablesUser);
    }
    
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ msg: "¡Hubo un error, vuelva a intentarlo!" });
  }
};

// Edit table
const editTable = async (req, res) => {
  try {
    const { id } = req.params;
    // Find table by id
    const findTable = await Tables.findById(id);

    if (!findTable) return res.status(401).json({ msg: "Mesa no encontrada" });

    // Verify id table and id user
    if (findTable?.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ msg: "¡Acción inválida!" });

    // Update table
    findTable.numberTable = req.body.numberTable || findTable.numberTable;
    findTable.urlTable = req.body.urlTable || findTable.urlTable;
    findTable.available = req.body.available || findTable.available;

    const tableUpdated = await findTable.save();
    res.json(tableUpdated);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "¡Hubo un error!" });
  }
};

// Delete table
const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    // Find table by id
    const findTable = await Tables.findById(id);
    if (!findTable) return res.status(401).json({ msg: "Mesa no encontrada" });

    // Verify id table and id user
    if (findTable?.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ msg: "¡Acción inválida!" });

    // Delete table
    await findTable.deleteOne();
    res.json({ msg: "¡Mesa eliminada!" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "¡Hubo un error!" });
  }
};

export { addTable, getTables, editTable, deleteTable };
