const fs = require('fs')
const mecab = require('./mecab')

let text = fs.readFileSync('./keywords', 'utf8');
text = text.split('\n').filter(v => {
    v = v.trim()
    return v[0] !== '#' && v !== ''
}).join('\n')

const results = mecab.pos(text)
let keywords = []
let comment = []
let keyword = ''

for (const morpheme of results) {
    comment.push(morpheme[0])

    switch (morpheme[1]) {
        case 'NNP':
            keyword = morpheme[0]
            break
        case 'NNG':
            // 키워드 뒤에 원문 주석 추가
            const keywordsComment = comment.join(' ')
            comment = []

            keyword += (keyword !== '' ? ' ' : '') + morpheme[0]
            keywords.push(keyword + '\t# ' + keywordsComment)
            keyword = ''
            break
    }
}

fs.writeFileSync('./keywords.parsed', keywords.join('\n'))
