const express = require('express');
const app = express()
const path = require('path');
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connectDB = require('./config/db')
const dotenv = require("dotenv");
const corsOptions = require('./config/corsOptions')
dotenv.config();
const PORT = process.env.PORT || 3500;

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

connectDB();

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/cars', require('./routes/carRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json( { message: '404 Not Found '})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))