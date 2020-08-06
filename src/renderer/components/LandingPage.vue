<template>
  <section id="wrapper">
    <b-field label="내용">
        <b-input v-model="contents" type="textarea"></b-input>
    </b-field>
    <b-button type="is-primary" size="is-medium" expanded @click="submit">
      형태소 분석
    </b-button>
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
    async submit () {
      this.setScenario(this.contents)
      this.setKeywordsByMorpheme()

      this.showingLoading = true
      for (this.loading = 0; this.loading < this.keywords.length; this.loading++) {
        const keyword = this.keywords[this.loading]
        const links = await imageLinksBySearch(keyword.keyword)
        this.setLinks({ key: this.loading, links })
      }
      this.showingLoading = false

      this.$router.push('/preview')
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
</style>
