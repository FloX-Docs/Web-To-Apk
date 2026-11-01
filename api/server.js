require("dotenv").config();

const express = require("express");
const path = require("path");

const buildRouter = require("./routes/build");

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(
  express.static(
    path.join(process.cwd(), "public")
  )
);

app.get("/api", (req, res) => {
  res.status(200).json({
    name: "FloX Web2APK API",
    version: "1.0.0",
    status: "online"
  });
});

app.use("/api", buildRouter);

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Endpoint Tidak Ditemukan"
  });
});

module.exports = app;
