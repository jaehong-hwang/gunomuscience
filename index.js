const fs = require('fs')
const keywords = require('./keywords.js')
const { initialBrowser, resetBrowser, imageDownloadBySearch } = require('./imageDownloader')

const queries = keywords.parse(fs.readFileSync('./keywords', 'utf8'))

const main = async () => {
  let index = 1

  await initialBrowser()

  for (const query of queries) {
    await imageDownloadBySearch(query.trim(), (index++) + '. ')
  }

  await resetBrowser()
}

main()
