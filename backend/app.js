require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoutes/authRoutes")

const app = express();
const port = 3000;


// middlewares
app.use(express.json())

//routers
app.use("/auth", authRouter)
app.get("/", (req, res) => {
  res.send({ msg: "Request successfull!" })
})

async function start() {
  const DB = process.env.DB
  const DB_USER = process.env.DB_USER
  const DB_PASSWORD = process.env.DB_PASSWORD
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB}.ck1bp.mongodb.net/?retryWrites=true&w=majority&appName=ticket-system-db`);
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Error starting server:", error);
  }
}

start();
