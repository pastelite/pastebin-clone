"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const http_1 = require("http");
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
var debug = require('debug')('server:server');
const app = (0, express_1.default)();
// Middleware setup
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.urlencoded({ extended: false }));
// View engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', "your view engine");
// Route
const index_1 = __importDefault(require("./routes/index"));
app.use('/', index_1.default);
// Error handling
let errorHandler = (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // send the error
    res.status(err.status || 500);
    res.json({
        message: res.locals.message
    });
    // or this if you have setup the view
    // res.render('error'); 
};
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404, "not found"));
});
app.use(errorHandler);
// Create server
const server = (0, http_1.createServer)(app);
var port = process.env.PORT || '3000';
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
// Event listener for HTTP server "error" event.
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
// Event listener for HTTP server "listening" event.
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
    debug('Listening on ' + bind);
}
