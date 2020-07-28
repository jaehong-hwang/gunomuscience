const fs = require('fs');
const { initialBrowser, resetBrowser, imageDownloadBySearch } = require('./imageDownloader').default;

const queries = fs.readFileSync('./keywords', 'utf8');
let index = 1;

(async () => {
  await initialBrowser();

  let promises = [];
  for (const query of queries.split('\n')) {
    if (query.trim() === '') continue;
    promises.push(imageDownloadBySearch(query.trim(), (index++) + '. '));
  }
  await Promise.all(promises);

  await resetBrowser();
})();
