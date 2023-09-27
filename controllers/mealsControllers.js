import Categories from "../models/Categories.js";
import Meals from "../models/Meals.js";

// Create a new meal
const addMeal = async (req, res) => {
    try {
        const { nameMeal, category, price, currency, available, ingredients } = req.body;
        const { originalname } = req.file;
        const fullNameImage = `/images/${originalname}`;

        // Verify if camps are fill
        if (!nameMeal || !category || !price || !currency || !available || !originalname) return res.status(401).json({ msg: 'Debes llenar todos los campos' });
        // Verify if currency is dolar
        if (currency !== '$') return res.status(400).json({ msg: 'Debe ser $ la moneda' }); 

        // Find category
        const findCategory = await Categories.findOne({ nameCategory: category }) 
        if (!findCategory) return res.status(400).json({ msg: '¡Elija una categoria válida!' });

        // Add new meal and sav
        const newMeal = new Meals({ nameMeal, price, currency, available, imageMeal: fullNameImage, ingredients });
        newMeal.userId = req.user._id;
        newMeal.category = findCategory;
        // newMeal.category = category;
        const saveMeal = await newMeal.save();

        return res.json(saveMeal);

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error' });
    }
}

// Get all meals
const getMeals = async (req, res) => {
    try {
        const getAllMeals = await Meals.find().where('userId').equals(req.user).populate('category');

         const getAllMealsUser = await Meals.find().where('userId').equals(req.user.userId).populate('category');

         if (getAllMeals.length) {
            return res.json(getAllMeals);
         }
    
         if (getAllMealsUser.length) {
            return res.json(getAllMealsUser);
         }
    
    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error, vuelva a intentarlo!' });
    }
}

// Edit a specific meal
const editMeal = async (req, res) => {
    try { 
        const { id } = req.params;
        const { originalname } = req.file;
        const fullNameImage = `/images/${originalname}`;

        // Find table by id
        const findMeal = await Meals.findById(id);
        
        if(!findMeal) return res.status(401).json({ msg: 'Platillo no encontrado' });

        // Verify id table and id user
        if(findMeal?.userId.toString() !== req.user._id.toString() ) return res.status(401).json({ msg: '¡Acción inválida!' });

        // Find category
        const findCategory = await Categories.findOne({ nameCategory: req.body.category }) 
        if (!findCategory) return res.status(400).json({ msg: '¡Elija una categoria válida!' });

        // Update table
        findMeal.nameMeal = req.body.nameMeal || findMeal.nameMeal;
        findMeal.available = req.body.available || findMeal.available;
        findMeal.price = req.body.price || findMeal.price;
        findMeal.currency = req.body.currency || findMeal.currency;
        findMeal.category = findCategory || findMeal.category;
        findMeal.ingredients = req.body.ingredients || findMeal.ingredients
        findMeal.imageMeal = fullNameImage || findMeal.imageMeal;

        const tableUpdated = await findMeal.save();
        res.json(tableUpdated);
    } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: '¡Hubo un error!' });
    }
}

// Delete a meal
const deleteMeal = async (req, res) => {
    try {
        const { id } = req.params;
        // Find table by id
        const findMeal = await Meals.findById(id);
        if(!findMeal) return res.status(403).json({ msg: 'Platillo no encontrado' });

        // Verify id table and id user
        if(findMeal?.userId.toString() !== req.user._id.toString() ) return res.status(401).json({ msg: '¡Acción inválida!' });

        // Delete table
        await findMeal.deleteOne();
        res.json({ msg: '¡Platillo eliminado!' });

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: '¡Hubo un error!' });
    }
}

export { addMeal, getMeals, editMeal, deleteMeal };