const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");
const routes = require("./src/routes");
const logger = require("./src/utils/logger");

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev")); // Logging requests
app.use(helmet()); // Security headers
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Serve static files from 'uploads' directory
app.use('/uploads', express.static('uploads'));


app.use("/api/v1", routes);

app.use(errorHandler);

module.exports = app;
