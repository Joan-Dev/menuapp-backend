import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
// Import Routes
import adminRoutes from './routes/adminRoutes.js';
import tablesRoutes from './routes/tablesRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import rolRoutes from './routes/rolRoutes.js';
import mealsRoutes from './routes/mealsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
// Helper to generate rols when the first time app charge
import generateRols from './helpers/generateRols.js';

const app = express();
app.use(express.json());
generateRols();
dotenv.config();
connectDB();
// Setting cors
const domainsAllowed = ['http://localhost:5173'];

const corsOptions = {
    origin: function(origin, callback){
        if(domainsAllowed.indexOf(origin) !== -1) {
            // Request allowed
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}

app.use(cors());


// Routes backend 
app.use("/api/admin", adminRoutes);
app.use("/api/table", tablesRoutes);
app.use("/api/category", categoriesRoutes);
app.use("/api/rol", rolRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", ordersRoutes);


import path from 'path';
import { fileURLToPath } from 'url';

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

app.use('/images'  ,express.static(path.join(__dirname, 'public', 'uploads')))


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Servidor funcionando en el puerto ${PORT}`));


