const express = require('express');
const bodyParser = require('body-parser');
const UUID = require('uuid-js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

app.get('/api/complaints', (req, res) => {
  knex('complaints').select('id', 'timestamp', 'text', 'votes').then(complaints => {
    res.send(complaints);
  }).catch(error => {
    res.status(500).json({ error });
  });
});

app.post('/api/complaints', (req, res) => {
  if (!req.body.text) return res.status(400).send();
  let id = UUID.create().toString()
  let timestamp = new Date().toLocaleString();
  let complaint = { id: id, timestamp: timestamp, text: req.body.text, votes: 0 };
  knex('complaints').insert(complaint).then(compl => {
    res.send(compl);
  }).catch(error => {
    res.status(500).json({ error });
  });

});

app.put('/api/complaints/:id', (req, res) => {
  if (!req.params.id) return res.status(400).send();
  knex('complaints').where('id', req.params.id).first().update({ votes: req.body.votes }).then(update_count => {
    if (update_count !== 1) res.status(404).send("Sorry, that item doesn't exist");
    return knex('complaints').where('id', req.params.id).select('id', 'timestamp', 'text', 'votes').first();
  }).then(complaint => {
    res.send(complaint);
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

app.delete('/api/complaints/:id', (req, res) => {
  if (!req.params.id) return res.status(400).send();
  knex('complaints').where('id', req.params.id).first().del().then(delete_count => {
    if (delete_count !== 1) res.status(404).send("Sorry, that item doesn't exist");
    res.sendStatus(200);
  }).catch(error => {
    res.status(500).json({ error });
  });
});

app.listen(3000, () => console.log('Server listening on port 3000!'))