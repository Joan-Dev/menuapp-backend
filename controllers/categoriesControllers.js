import Categories from "../models/Categories.js";

// Create a category
const addCategory = async (req, res) => {
    try {
        const { nameCategory } = req.body;

        // Add new t¿category and save
        const newCategory = new Categories(req.body);
        newCategory.userId = req.user._id;
        const saveCategory = await newCategory.save();

        return res.json(saveCategory);

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error' });
    }
}

// Get all Categories
const getCategories = async (req, res) => {
    try {
        const getAllCategories = await Categories.find().where('userId').equals(req.user);
        const getAllCategoriesUser = await Categories.find().where('userId').equals(req.user?.userId);

        
        if (getAllCategories.length) {
            return res.json(getAllCategories);
        }
        if (getAllCategoriesUser.length) {
            return res.json(getAllCategoriesUser);
        }
        
    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error, vuelva a intentarlo!' });
    }
}

// Edit a category
const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Find category by id
        const findCategory = await Categories.findById(id);
        
        if(!findCategory) return res.status(401).json({ msg: 'Mesa no encontrada' });

        // Verify id category and id user
        if(findCategory?.userId.toString() !== req.user._id.toString() ) return res.status(401).json({ msg: '¡Acción inválida!' });

        // Update category
        findCategory.nameCategory = req.body.nameCategory || findCategory.nameCategory;
        findCategory.available = req.body.available || findCategory.available;

        const categoryUpdated = await findCategory.save();
        res.json(categoryUpdated);

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error!' });
    }
}

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Find category by id
        const findCategory = await Categories.findById(id);
        console.log(findCategory);
        console.log(req.user._id.toString());
        console.log(findCategory.userId.toString() );
        if(!findCategory) return res.status(401).json({ msg: 'Categoria no encontrada' });

        // Verify id category and id user
        if(findCategory?.userId.toString() !== req.user._id.toString() ) return res.status(401).json({ msg: '¡Acción inválida!' });

        // Delete category
        await findCategory.deleteOne();
        res.json({ msg: '¡Categoria eliminada!' });

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error!' });
    }
}
export { addCategory, getCategories, editCategory, deleteCategory };