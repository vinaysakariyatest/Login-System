const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

dotenv.config({ path: './.env'})
require('./db/conn')

app.use(express.json())

// Link the Routes File
app.use(require('./router/user'))

const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log(`Server is running at PORT Number ${PORT}`)
})