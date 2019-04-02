const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./data/dbConfig.js');

const server = express();

const sessionConfig = {
  secret: 'blah-blah.bittyblah~!',
  name: 'giles',
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 1,
  },
};

server.use(session(sessionConfig))
server.use(express.json());
server.use(cors());



server.listen(port, () => console.log(`\n==  Project rolling on port ${port} ==\n`))
