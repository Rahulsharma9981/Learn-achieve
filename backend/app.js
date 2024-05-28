// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

// Create Express application
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware setup
app.use(bodyParser.json());
app.use(cors()); // Allow CORS for all origins

// Error handling middleware
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

//Admin Api Middlewares
const adminRoutes = require("./middleware/admin.middleware");
app.use(adminRoutes);

//Web Api Middlewares
const webRoutes = require("./middleware/web.middleware");
app.use(webRoutes);

app.use("/uploads", express.static("uploads"));

// Start the server
app.listen(port, () => {
  console.log(`Server is starting at http://localhost:${port}`);
});
