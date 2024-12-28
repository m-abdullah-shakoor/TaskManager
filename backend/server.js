require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const TaskRoutes = require("./routes/TaskRoutes");
const UserRoutes = require("./routes/UserRoutes");

const app = express();
connectDB();

const corsOptions = {
  origin: `${process.env.FEORIGIN}`,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use(express.json());
app.use(() => (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/tasks", TaskRoutes);
app.use("/api/users", UserRoutes);
app.get("/", (req, res) => {
  res.send("Hello, world!");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
