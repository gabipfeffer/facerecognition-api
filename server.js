const express = require('express');
const app = express();

// Necessary NPM packages
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


// Exported Modules
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Connection to smart-brain database using PostgreSQL
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'smart-brain'
    }
});

// Middleware
app.use(express.json());
app.use(cors());

// GET users from database ~root
app.get('/', (req, res) => {
    return db.select('*')
            .from('users')
            .then(users => {
                res.json(users)
            })
})

// User login
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });

// User Registration
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

// Display Profile page if necessary
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

// Update user image entry 
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleAPICall(req, res) })

// Server connection to port
app.listen(process.env.PORT || 3000, console.log(`Your App is listening on port ${process.env.PORT}`));