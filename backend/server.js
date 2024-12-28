require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const TaskRoutes = require("./routes/TaskRoutes");
const UserRoutes = require("./routes/UserRoutes");

const app = express();
connectDB();

app.use(
  cors({
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.use("/api/tasks", TaskRoutes);
app.use("/api/users", UserRoutes);
app.get("/", (req, res) => {
    res.send("Hello World");
  });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
