const express = require('express');
const bodyParser = require('body-parser');
const UUID = require('uuid-js');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

let complaints = [];
let id = 0;

app.get('/api/complaints', (req, res) => {
  res.send(complaints);
});

app.post('/api/complaints', (req, res) => {
  let id = UUID.create().toString()
  let timestamp = new Date().toLocaleString();
  let complaint = {id:id, timestamp:timestamp, text:req.body.text, votes:0};
  complaints.push(complaint);
  res.send(complaint);
});

app.put('/api/complaints/:id', (req, res) => {
    let id = req.params.id;
    let index = complaints.map(complaint => {return complaint.id}).indexOf(id);
    if (index === -1) {
        res.status(404).send("Sorry, that item doesn't exist");
        return;
    }
    let complaint = complaints[index];
    complaint.votes = req.body.votes;
    res.send(complaint);
  });

app.delete('/api/complaints/:id', (req, res) => {
    let id = req.params.id
    let index = complaints.map(complaint => {return complaint.id}).indexOf(id);
    if (index === -1) {
      res.status(404).send("Sorry, that item doesn't exist");
      return;
    }
    complaints.splice(index, 1);
    res.sendStatus(200);
  });

app.listen(3000, () => console.log('Server listening on port 3000!'))