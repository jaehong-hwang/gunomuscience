import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import mecab from '@/module/mecab'
import { imageLinksBySearch } from '@/module/browser'

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
    clearKeywords (state) {
      state.keywords = []
    },
    addKeyword (state, keyword) {
      state.keywords.push({
        ...keyword
      })
    },
    setKeyword (state, { key, keyword, links }) {
      Vue.set(state.keywords, key, {
        ...state.keywords[key],
        keyword,
        links
      })

      console.log('set keyword complete')
    }
  },
  actions: {
    setScenario ({ commit }, scenario) {
      commit('clearKeywords')
      commit('setScenario', scenario)
    },
    setKeywordsByMorpheme ({ commit, state }) {
      const text = state.scenario.split('\n').filter(v => {
        v = v.trim()
        return v[0] !== '#' && v !== ''
      }).join('\n')

      const results = mecab.pos(text)
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
            commit('addKeyword', {
              keyword,
              comment: keywordsComment
            })

            keyword = ''
            break
        }
      }

      comment = comment.join(' ')
      commit('addKeyword', {
        keyword: comment,
        comment
      })
    },
    async setKeyword (context, { key, keyword }) {
      const links = await imageLinksBySearch(keyword)
      context.commit('setKeyword', { key, keyword, links })
    }
  },
  plugins: [
    createPersistedState()
  ]
})
