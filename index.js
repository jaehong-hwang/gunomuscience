const fs = require('fs')
const { initialBrowser, resetBrowser, imageDownloadBySearch } = require('./imageDownloader')

const main = async (queries) => {
  let index = 1

  await initialBrowser()

  for (const query of queries) {
    await imageDownloadBySearch(query.trim(), (index++) + '. ')
  }

  await resetBrowser()
}

try {
  const queries = fs.readFileSync('./keywords.parsed', 'utf8')
  main(queries.split('\n'))
} catch (error) {
  console.error('parse 명령어를 먼저 수행해주세요.')
}
