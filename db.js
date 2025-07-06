const fs = require('fs');
const path = require('path');

const problemsDir = path.join(__dirname, 'problems');

async function getAllProblems() {
  const files = fs.readdirSync(problemsDir);
  return files.map(file => {
    const content = JSON.parse(fs.readFileSync(path.join(problemsDir, file)));
    return {
      id: file.replace('.json', ''),
      name: content.name,
      tags: content.tags,
      language: content.language,
      link: content.link,
      date: content.date
    };
  });
}

async function getProblemById(id) {
  const filePath = path.join(problemsDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath));
}

module.exports = { getAllProblems, getProblemById };