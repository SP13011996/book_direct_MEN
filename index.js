const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const booksRoute = require('./Server/Routes/bookroute')
const path = require('path')
const User = require('./Server/Models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const userRoute = require('./Server/Routes/userRoute')


const winston = require('winston')


const app = express();
const PORT = process.env.PORT || 3000;

//MIDDLEWARE
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


//ROUTES
app.use('/api/books', booksRoute);
app.use('/api/user', userRoute);

__dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
})

app.post('/api/register', async (req, res) => {
    //console.log(req.body)
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        res.json({ status: 'ok' })
    } catch (err) {
        res.json({ status: 'error', error: 'Duplicate email' })
    }
})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })

    if (!user) {
        return { status: 'error', error: 'Invalid login' }
    }

    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
    )

    if (isPasswordValid) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
                booksbought: user.booksbought
            },
            'secret123'
        )

        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }
})

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

//Connect to mongoose atlas
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).
    then(() => { logger.info("info", "Connected to DB") }).
    catch(error => { logger.error(error.message) });


//START SERVER
app.listen(PORT, () => { logger.warn(`SERVER STARTED at ${PORT}`,) })