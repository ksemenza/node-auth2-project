const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const usersRouter = require('../users/users-router.js');
const port = process.env.PORT || 5000;

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('tiny'));
server.use(cors());
server.use('/api', usersRouter);

server.get('/', (req, res) => res.status(200).json({message: `API up and running on port ${port}`}))

module.exports = server;