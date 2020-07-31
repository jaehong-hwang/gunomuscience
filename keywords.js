const mecab = require('./mecab')

module.exports = {
    parse (text) {
        text = text.split('\n').filter(v => {
            v = v.trim()
            return v[0] !== '#' && v !== ''
        }).join('\n')

        const results = mecab.pos(text)
        let keywords = []
        let keyword = ''

        for (const morpheme of results) {
            switch (morpheme[1]) {
                case 'NNP':
                    keyword = morpheme[0]
                    break
                case 'NNG':
                    keyword += (keyword !== '' ? ' ' : '') + morpheme[0]
                    keywords.push(keyword)
                    keyword = ''
                    break
            }
        }

        return keywords
    }
}
