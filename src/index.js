const express = require("express");
const app = express();
const cors = require("cors");

// express body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors middleware
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: null,
    message: "Config Store Service is running",
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Config Store service running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err);
  server.close(() => {
    console.log("Shutting down server due to unhandled promise rejection");
    process.exit(1);
  });
});
