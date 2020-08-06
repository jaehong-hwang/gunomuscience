<template>
  <section id="wrapper">
    <b-field label="내용">
        <b-input v-model="contents" type="textarea"></b-input>
    </b-field>
    <ul class="button-list">
      <li>
        <b-button type="is-primary" size="is-medium" expanded @click="keywordSetup">
          형태소 분석
        </b-button>
      </li>
      <li>
        <b-button type="is-success" size="is-medium" expanded :disabled="keywords.length === 0" @click="submit">
          이미지 다운로드
        </b-button>
      </li>
      <li>
        <b-button type="is-info" size="is-medium" expanded :disabled="keywords.length === 0" @click="$router.push('/preview')">
          다음
        </b-button>
      </li>
    </ul>
    <loading v-if="showingLoading" :loading="loading" :size="keywords.length" />
  </section>
</template>

<script>
import Loading from './Loading'
import { mapState, mapActions } from 'vuex'
import { imageLinksBySearch } from '@/module/browser'

export default {
  created () {
    this.contents = this.scenario
  },
  components: {
    Loading
  },
  data () {
    return {
      contents: '',
      loading: 0,
      showingLoading: false
    }
  },
  computed: {
    ...mapState(['scenario', 'keywords'])
  },
  methods: {
    keywordSetup () {
      this.setScenario(this.contents)
      this.setKeywordsByMorpheme()
    },
    async submit () {
      this.showingLoading = true
      for (this.loading = 0; this.loading < this.keywords.length; this.loading++) {
        const keyword = this.keywords[this.loading]
        if (keyword.links && keyword.links.length === 5) continue

        const links = await imageLinksBySearch(keyword.keyword)
        this.setLinks({ key: this.loading, links })
      }
      this.showingLoading = false
    },
    ...mapActions([
      'setScenario',
      'setKeywordsByMorpheme',
      'setLinks'
    ])
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  padding: 20px 10px;
}

.button-list {
  li {
    margin-bottom: 10px;
  }
}
</style>
