const fs = require('fs')
const keywords = require('./keywords.js')

const queries = keywords.parse(fs.readFileSync('./keywords', 'utf8'))

fs.writeFileSync('./keywords.parsed', queries.join('\n'))
