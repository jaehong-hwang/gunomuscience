const cp = require('child_process')
const sq = require('shell-quote')

const MECAB_PATH = '/usr/local/bin/mecab'

const buildCommand = text => {
  return sq.quote(['echo', text]) + ' | ' + MECAB_PATH
}

const execMecab = text => {
  return cp.execSync(buildCommand(text)).toString()
}

const parseFunctions = {
  pos (result, elems) {
    result.push([elems[0]].concat(elems[1].split(',')[0]))
    return result
  },

  morphs (result, elems) {
    result.push(elems[0])
    return result
  },

  nouns (result, elems) {
    const tag = elems[1].split(',')[0]

    if (tag === 'NNG' || tag === 'NNP') {
      result.push(elems[0])
    }

    return result
  }
}

const parse = function (text, method) {
  let result = execMecab(text)

  result = result.split('\n').reduce(function (parsed, line) {
    const elems = line.split('\t')

    if (elems.length > 1) {
      return parseFunctions[method](parsed, elems)
    } else {
      return parsed
    }
  }, [])

  return result
}

const pos = text => {
  return parse(text, 'pos')
}

const morphs = text => {
  return parse(text, 'morphs')
}

const nouns = text => {
  return parse(text, 'nouns')
}

module.exports = {
  pos,
  morphs,
  nouns
}
