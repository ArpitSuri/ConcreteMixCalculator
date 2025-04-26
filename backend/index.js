import express from "express";
const app = express();
import dotenv from "dotenv";
import dbConnection from "./config/dbConnection.js";
dotenv.config();
import mixDesignRoutes from "./routes/mixDesignRoutes.js";
import authRouter from "./routes/authRouter.js";
import mixDesignInfoRoutes from "./routes/designInfoRoutes.js";
import cors from "cors";


dbConnection();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRouter);
app.use('/api/mix', mixDesignRoutes);
app.use('/api/mix-design', mixDesignInfoRoutes);

app.get('/', (req, res) => {
    res.send('Concrete Mix Design Calculator Backend Running');
});

app.listen(process.env.PORT , () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});