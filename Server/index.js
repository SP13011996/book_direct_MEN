const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const booksRoute = require('./Routes/bookroute')

const winston = require('winston')


const app = express();
const PORT = process.env.PORT || 3000;

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//ROUTES
app.use('/api/books', booksRoute);

//CREATE A LOGGER
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true })
            )
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
    ]
});

console.log(process.env.MONGO_URL);
//Connect to mongoose atlas
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).
    then(() => { logger.info("info", "Connected to DB") }).
    catch(error => { logger.error(error.message) });


//START SERVER
app.listen(PORT, () => { logger.warn(`SERVER STARTED at ${PORT}`,) })