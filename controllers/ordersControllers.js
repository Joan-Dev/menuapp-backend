import Categories from "../models/Categories.js";
import Meals from "../models/Meals.js";
import Order from "../models/Order.js";
import Tables from "../models/Tables.js";

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { tableId, mealsId } = req.body;
    const { _id, userId } = req.user;
    // Verify meal
    const findMeal = await Meals.findOne({ _id: mealsId });
    if (!findMeal)
      return res.status(404).json({ msg: "Este platillo no existe" });
    // Verify table
    const findTable = await Tables.findOne({ _id: tableId });
    if (!findTable) return res.status(404).json({ msg: "Esta mesa no existe" });

    const newOrder = await new Order({
      tableId,
      meals: { mealId: findMeal._id, priceMeal: findMeal.price },
      userId,
      waiterId: _id,
    }).populate("tableId waiterId");

    // Total and subtotal
    newOrder.subtotal = findMeal.price;
    newOrder.total = findMeal.price;
    // Save order
    const orderSaved = await newOrder.save();
    return res.json(newOrder);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Hubo un error" });
  }
};

// Add more meals in the order by the waiter
const editOrder = async (req, res) => {
  try {
    const { tableId, mealsId } = req.body;
    const { _id, userId } = req.user;
    const { id } = req.params;
    // Verify Meal
    const findMeal = await Meals.findOne({ _id: mealsId });
    if (!findMeal)
      return res.status(404).json({ msg: "Este platillo no existe" });
    // Verify if table exist
    const findTable = await Tables.findOne({ _id: tableId });
    if (!findTable) return res.status(404).json({ msg: "Esta mesa no existe" });

    // Search order
    const findOrder = await Order.findOne({ _id: id }).populate("tableId");

    if (!findOrder)
      return res.status(403).json({ msg: "No se encuentra el pedido" });

    // Verify id category and id user
    if (findOrder?.userId.toString() !== req.user?.userId.toString())
      return res.status(401).json({ msg: "¡Acción inválida!" });

    // Modify meal
    const isRepeteated = findOrder.meals.some(
      (meal) => meal.mealId.toString() === mealsId.toString() && !meal.check
    );
    if (isRepeteated) {
      const mealUpdated = findOrder.meals.map((meal) => {
        if (meal.mealId.toString() === mealsId.toString() && !meal.check) {
      
            meal.amount++;

          
        } 
        return meal;
      });
      findOrder.meals = [...mealUpdated];
      console.log(mealUpdated)
    } else {
      findOrder.meals =
        [...findOrder.meals, { mealId: mealsId, priceMeal: findMeal.price }] 
    }
   
    
    

    findOrder.tableId = req.body.tableId || findOrder.tableId;

    // Calculate total and subtotal
    const calculateTotal = findOrder.meals.reduce(
      (acc, iterator) => iterator.priceMeal * iterator.amount + acc,
      0
    );
    findOrder.state = findOrder.state === 'listo' ?  'enviado' : findOrder.state
    findOrder.subtotal = calculateTotal || findOrder.subtotal;
    findOrder.total = calculateTotal || findOrder.total;

    //  Save meal
    const orderUpdated = await findOrder.save();
    const order = await orderUpdated.populate('tableId waiterId')
    return res.json(order);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Hubo un error" });
  }
};

const deleteOneMealOrder = async (req, res) => {
  try {
    const { tableId, mealsId } = req.body;
    const { _id, userId } = req.user;
    const { id } = req.params;


    // Verify if table exist
    const findTable = await Tables.findOne({ _id: tableId });
    if (!findTable) return res.status(404).json({ msg: "Esta mesa no existe" });

    // Search order
    const findOrder = await Order.findOne({ _id: id }).populate("meals");

    if (!findOrder)
      return res.status(403).json({ msg: "No se encuentra el pedido" });

   
    

    // Verify id category and id user
    if (findOrder?.userId.toString() !== req.user?.userId.toString())
      return res.status(401).json({ msg: "¡Acción inválida!" });

      if (findOrder.state === 'recibido' || findOrder.state === 'listo') return res.status(403).json({ msg: "El pedido fue recibido, no puedes eliminar" });
    
    // Modify meal
    const isRepeteated = findOrder.meals.find(
        (meal) => meal.mealId.toString() === mealsId.toString()
      );
      if (isRepeteated.amount > 1) {
        const mealUpdated = findOrder.meals.map((meal) => {
          if (meal.mealId.toString() === mealsId.toString()) {
            meal.amount--;
          }
          return meal;
        });
        findOrder.meals = [...mealUpdated];
      } else {
        // Delete meal
         findOrder.meals = findOrder.meals.filter( meal => meal.mealId.toString() !== mealsId )
      }
  
      findOrder.tableId = req.body.tableId || findOrder.tableId;
  
      // Calculate total and subtotal
      const calculateTotal = findOrder.meals.reduce(
        (acc, iterator) => iterator.priceMeal * iterator.amount + acc,
        0
      );
  
      findOrder.subtotal = calculateTotal || findOrder.subtotal;
      findOrder.total = calculateTotal || findOrder.total;
  
      const orderDeleted = await findOrder.save();
        
      const order = await orderDeleted.populate('tableId waiterId')
      return res.json(order);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Hubo un error" });
  }
};

const deleteMealOrder = async (req, res) => {
  try {
    const { tableId, mealsId } = req.body;
    const { _id, userId } = req.user;
    const { id } = req.params;

    // Verify if table exist
    const findTable = await Tables.findOne({ _id: tableId });
    if (!findTable) return res.status(404).json({ msg: "Esta mesa no existe" });

    // Search order
    const findOrder = await Order.findOne({ _id: id }).populate("meals");

    if (!findOrder)
      return res.status(403).json({ msg: "No se encuentra el pedido" });

    // Verify id category and id user
    if (findOrder?.userId.toString() !== req.user?.userId.toString())
      return res.status(401).json({ msg: "¡Acción inválida!" });

    // Delete meal
    findOrder.meals = findOrder.meals.filter( meal => meal.mealId.toString() !== mealsId )

    findOrder.tableId = req.body.tableId || findOrder.tableId;

    // Calculate total and subtotal
    const calculateTotal = findOrder.meals.reduce(
      (acc, iterator) => iterator.priceMeal * iterator.amount + acc,
      0
    );

    findOrder.subtotal = calculateTotal || findOrder.subtotal;
    findOrder.total = calculateTotal || findOrder.total;

    const orderDeleted = await findOrder.save();

    return res.json(orderDeleted);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Hubo un error" });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    // Find category by id
    const findOrder = await Order.findById(id);

    if (!findOrder)
      return res.status(401).json({ msg: "¡Pedido no encontrado!" });

      if (findOrder.state === 'recibido' || findOrder.state === 'listo') return res.status(403).json({ msg: "El pedido fue recibido, no puedes eliminar" });

    // Verify id category and id user
    if (findOrder?.userId.toString() !== req.user.userId.toString())
      return res.status(401).json({ msg: "¡Acción inválida!" });

    // Delete category
    await findOrder.deleteOne();
    res.json({ msg: "¡Pedido eliminado!" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "¡Hubo un error!" });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const getAllOrders = await Order.find()
      .where("userId")
      .equals(req.user)
      .populate("tableId waiterId");
    const getAllOrdersUser = await Order.find()
      .where("userId")
      .equals(req.user?.userId)
      .populate("tableId waiterId");

    if (getAllOrders.length) {
      return res.json(getAllOrders);
    }
    if (getAllOrdersUser.length) {
      return res.json(getAllOrdersUser);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ msg: "¡Hubo un error, vuelva a intentarlo!" });
  }
};

// Add more meals in the order by the waiter
const checkOrder = async (req, res) => {
  try {
    const {  mealsId, idMeal } = req.body;
    const { _id, userId } = req.user;
    const { id } = req.params;
    // Verify Meal
    const findMeal = await Meals.findOne({ _id: mealsId });
    if (!findMeal)
      return res.status(404).json({ msg: "Este platillo no existe" });

    // Search order
    const findOrder = await Order.findOne({ _id: id }).populate("tableId");

    if (!findOrder)
      return res.status(403).json({ msg: "No se encuentra el pedido" });

    // Verify id category and id user
    if (findOrder?.userId.toString() !== req.user?.userId.toString())
      return res.status(401).json({ msg: "¡Acción inválida!" });

      const verifyId = findOrder.meals.find(
        (meal) =>  meal._id.toString() === idMeal.toString()
      );

    // Modify meal
    const isRepeteated = findOrder.meals.some(
      (meal) => meal.mealId.toString() === mealsId.toString()
    );
    if (isRepeteated) {
      const mealUpdated = findOrder.meals.map((meal) => {
        if (meal.mealId.toString() === mealsId.toString() && !meal.check && verifyId._id.toString() === meal._id.toString() ) {
          meal.check = !meal.check
        }  else if (meal.mealId.toString() === mealsId.toString() && meal.check && verifyId._id.toString() === meal._id.toString()) {
          meal.check = !meal.check
        }
        return meal;
      });
      findOrder.meals = [...mealUpdated];
    } 

   const verifyCheck = findOrder.meals.find(
      (meal) => meal.check === false
    );

    if (verifyCheck) {
        findOrder.state = 'recibido' || findOrder.state
    } else {
      findOrder.state = 'listo'
    }

    //  Save meal
    const orderUpdated = await findOrder.save();
    const order = await orderUpdated.populate('tableId waiterId')
    return res.json(order);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Hubo un error" });
  }
};

const finishOrder = async (req,res) =>{
      try {
        const { id } = req.params;   
        // Search order
        const findOrder = await Order.findOne({ _id: id }).populate("tableId");
    
        if (!findOrder)
          return res.status(403).json({ msg: "No se encuentra el pedido" });
    
        // Verify id category and id user
        if (findOrder?.userId.toString() !== req.user?.userId.toString())
          return res.status(401).json({ msg: "¡Acción inválida!" });

        if (findOrder.state === 'listo') {
          findOrder.finished = true;
        } else {
          return res.status(403).json({ msg: "No puede finalizar la orden, todavía quedan pedidos pendientes" });
        }

         

          const orderUpdated = await findOrder.save();
          const order = await orderUpdated.populate('tableId waiterId')
          return res.json(order);
      } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: "Hubo un error" });
      }
}

const payOrder = async (req,res) =>{
  try {
    const { id } = req.params;  
    const { totalPay } = req.body;
    // Search order
    const findOrder = await Order.findOne({ _id: id }).populate("tableId");

    if (!findOrder)
      return res.status(403).json({ msg: "No se encuentra el pedido" });

    // Verify id category and id user
    if (findOrder?.userId.toString() !== req.user?.userId.toString())
      return res.status(401).json({ msg: "¡Acción inválida!" });

      if (findOrder.state !== 'listo') return res.status(401).json({ msg: "¡Acción inválida!" });
      if (!findOrder.finished) return res.status(401).json({ msg: "¡Acción inválida!" });
      const calculate = Number(findOrder.total) - Number(totalPay)

      if (calculate !== 0)  return res.status(403).json({ msg: "Debe ser el monto exacto" });

      findOrder.paid = true;

      const orderUpdated = await findOrder.save();
      const order = await orderUpdated.populate('tableId waiterId')
      return res.json(order);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Hubo un error" });
  }
}

export {
  createOrder,
  editOrder,
  deleteOneMealOrder,
  deleteMealOrder,
  deleteOrder,
  getOrders,
  checkOrder,
  finishOrder,
  payOrder
};
