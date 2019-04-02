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

server.post('/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 10);
  creds.password = hash;

  db('users')
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res
        .status(201)
        .json({ newUserId: id });
    })
    .catch(err => {
      res
        .status(500)
        .json(err);
    });
});

server.post('/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res
          .status(200)
          .json({ welcome: user.username });
      } else {
        res
          .status(401)
          .json({ message: 'XX nope, your not getting in with that password XX'})
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ err });
    })
})

server.listen(port, () => console.log(`\n==  Project rolling on port ${port} ==\n`))
