// TODO: pagination, colored bubbles for tags and language, filtering by multiple categories 

const express = require('express');
const fs = require('fs');
const path = require('path');
const { getAllProblems, getProblemById } = require('./db');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/api/problems', async (req, res) => {
  const problems = await getAllProblems();
  res.json(problems);
});

app.get('/api/problems/:id', async (req, res) => {
  const problem = await getProblemById(req.params.id);
  if (!problem) return res.status(404).json({ error: 'Not found' });
  res.json(problem);
});

app.post('/api/problems', (req, res) => {
  const { name, link, language, tags, code, notes, date } = req.body;
  if (!name || !link || !language || !tags || !code || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}__${language.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const filePath = path.join(__dirname, 'problems', `${id}.json`);
  const problemData = { name, link, language, tags, code, notes, date };

  fs.writeFileSync(filePath, JSON.stringify(problemData, null, 2));
  // if (fs.existsSync(filePath)) return res.status(409).json({ error: 'Problem already exists' });
  res.status(201).json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
