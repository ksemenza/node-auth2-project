require('dotenv').config();
const server = require('./api/server');

const port =  process.env.PORT || 8000;

server.get('/', (req, res) => res.status(200).send(`API up and running on port ${port}`))

server.listen(port, console.log(`Server up and running on port ${port}`));