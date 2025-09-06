const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 5 }
}));

const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/auth', authRoutes);
app.use('/', reviewRoutes);

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

app.listen(port, () => {
    console.log(`Server is running`);
});
