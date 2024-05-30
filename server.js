import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";

//configure env
dotenv.config();

//database config
connectDb();

//rest object
const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
app.get("/", (req, resp) => {
  resp.send("<h1>Welcome to E-commerce app </h1>");
});

//port
const PORT = process.env.PORT || 8000;

//run listen
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`.bgCyan.white);
});
