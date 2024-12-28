require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const TaskRoutes = require("./routes/TaskRoutes");
const UserRoutes = require("./routes/UserRoutes");

const app = express();
connectDB();

const corsOptions = {
  origin: ["http://localhost:3000", "https://task-manager-kuy0if4pw-m-abdullah-shakoors-projects.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(express.json());

app.use("/api/tasks", TaskRoutes);
app.use("/api/users", UserRoutes);
app.get("/", (req, res) => {
res.setHeader("Access-Control-Allow-Origin", "*")
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Max-Age", "1800");
res.setHeader("Access-Control-Allow-Headers", "content-type");
res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
res.send("Hello, world!")
 });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
