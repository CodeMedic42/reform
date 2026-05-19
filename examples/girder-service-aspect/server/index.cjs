const express = require('express');
const cors = require('cors')
const { LoremIpsum } = require('lorem-ipsum');
const shortid = require('shortid');
const map = require('lodash/map');

const app = express();

app.use(cors());
app.use(express.json());

const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 5,
    min: 2,
  }
});

const PORT = 3000;

const db = {};

for (let counter = 0; counter < 10; counter += 1) {
  db[shortid()] = {
    text: lorem.generateSentences(1),
    completed: false,
  };
}

app.get('/todos', (req, res) => {
  const list = map(db, (item, id) => {
    return {
      ...item,
      id,
    };
  });

  res.send(list);
});

app.post('/todos', (req, res) => {
  const { text, completed } = req.body;

  const id = shortid();

  const item = {
    id,
    text,
    completed,
  };

  db[id] = item;

  res.send(item);
});

app.put('/todos/toggle', (req, res) => {
  const { completed } = req.body;

  const list = map(db, (item, id) => {
    item.completed = completed;

    return {
      ...item,
      id,
    };
  });

  res.send(list);
});

app.put('/todos/:id', (req, res) => {
  const { text, completed } = req.body;

  const { id } = req.params;

  db[id] = { text, completed };

  res.send({ text, completed, id });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});