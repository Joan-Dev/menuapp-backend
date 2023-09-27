import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const url = `${db.connection.host} ${db.connection.port}`;
        console.log(`MongoDB conectado a ${url}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;