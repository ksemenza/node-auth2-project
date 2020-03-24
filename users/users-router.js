const express = require('express');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/users',  restricted, (req, res) => {
    //console.log(req.token);
    console.log(req.token.department);
    //Users.findUsers()
    Users.findUsersByDepartment(req.token.department)
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({error: err, message: 'Failure to retrieve users'})
        });
});  
    

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;
    Users.addUser(user)
        .then(saved => {
            const token = generateToken(user);
            res.status(201).json({user: user, token: token})
        })
        .catch(err => {
            res.status(500).json({error: err, message: 'Failure to add user'})
        });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
    Users.findUserByUsername(username)
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user); 
                res.status(200).json({message: 'Logged in successfully', token: token, user: user})
            } else {
                res.status(401).json({message: 'Invalid credentials. You shall not pass!'})
            }
        })
        .catch(err => {
            res.status(500).json({error: err, message: 'Failure to log in'})
        });
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department
    }
    const secret = process.env.JWT_SECRET || 'so much to learn to set up a database';
    const options = {
        expiresIn: '8h'
    }
    return jwt.sign(payload, secret, options);
}

router.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    Users.removeUser(id)
        .then(response => {
            res.status(200).json({message: `Removed user with id ${id}`});
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

module.exports = router;