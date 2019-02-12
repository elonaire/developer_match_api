const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const candidatesRouter = require("./api/routes/candidates");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));

app.use("/candidates", candidatesRouter);

// catch 404
app.use((req, res, next) => {
  res.status(404).json({
    message: "Resource not found"
  });
});

// catch 500
app.use((err, req, res, next) => {
  res.status(500).json({
    serverError: err
  });
});

module.exports = app;
