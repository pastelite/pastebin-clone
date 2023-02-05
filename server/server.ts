import express, { ErrorRequestHandler } from "express";
import createError from "http-errors";
import { createServer } from "http";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
var debug = require("debug")("server:server");

const app = express();

// Middleware setup

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: false }));

// View engine setup

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', "your view engine");

// Route

import indexRouter from "./routes/index";
app.use("/", indexRouter);

// Error handling

let errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send the error
  res.status(err.status || 500);
  res.json({
    message: res.locals.message,
  });
  // or this if you have setup the view
  // res.render('error');
};

app.use(function (req, res, next) {
  next(createError(404, "not found"));
});

app.use(errorHandler);

// Create server

const server = createServer(app);
var port = process.env.PORT || "3000";
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// Event listener for HTTP server "error" event.

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr!.port;
  console.log("Listening on " + bind);
  debug("Listening on " + bind);
}
