import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import mecab from '@/module/mecab'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scenario: '',
    keywords: []
  },
  mutations: {
    setScenario (state, scenario) {
      state.scenario = scenario
    },
    setKeyword (state, key, keywrod) {
      state.keywords[key].keywrod = keywrod
    },
    setKeywordsByMorpheme (state) {
      const text = state.scenario.split('\n').filter(v => {
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
            keywords.push({
              keyword,
              comment: keywordsComment
            })

            keyword = ''
            break
        }
      }

      comment = comment.join(' ')
      keywords.push({
        keyword: comment,
        comment
      })

      state.keywords = keywords
    }
  },
  actions: {
    setScenario (context, scenario) {
      context.commit('setScenario', scenario)
      context.commit('setKeywordsByMorpheme')
    }
  },
  plugins: [
    createPersistedState()
  ]
})
