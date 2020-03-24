require('dotenv').config();
const server = require('./api/server.js');

const port =  process.env.PORT || 5000;

server.get('/', (req, res) => res.status(200).send(`API up and running on port ${port}`))

server.listen(port, console.log(`Server up and running on port ${port}`));