const fs = require('fs');
const { initialBrowser, resetBrowser, imageDownloadBySearch } = require('./imageDownloader');

const queries = fs.readFileSync('./keywords', 'utf8');
let index = 1;

(async () => {
  await initialBrowser();

  for (const query of queries.split('\n')) {
    if (
      query.trim() === ''
      || query.trim()[0] === '#'
    ) continue;
    
    await imageDownloadBySearch(query.trim(), (index++) + '. ');
  }

  await resetBrowser();
})();
