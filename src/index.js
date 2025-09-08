const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");

// express body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors middleware
app.use(cors());

app.get("/", (req, res) => {
  console.log(process.env.DB_URL);
  res.status(200).json({
    success: true,
    data: null,
    message: "Config Store Service is running",
  });
});

const routes = require("./routes");
app.use("/api/v1", routes);

let server;


db.authenticate()
  .then(() => {
    console.log("Database connected...");
    return db.sync();
  })
  .then(() => {
    console.log("Database synchronized");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Config Store service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err);
  server.close(() => {
    console.log("Shutting down server due to unhandled promise rejection");
    process.exit(1);
  });
});
