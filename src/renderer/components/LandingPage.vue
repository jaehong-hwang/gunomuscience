<template>
  <section id="wrapper">
    <b-field label="내용">
        <b-input v-model="contents" type="textarea"></b-input>
    </b-field>
    <b-button type="is-primary" size="is-medium" expanded @click="submit">
      형태소 분석
    </b-button>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  created () {
    this.contents = this.scenario
  },
  data () {
    return {
      contents: ''
    }
  },
  computed: {
    ...mapState(['scenario'])
  },
  methods: {
    submit () {
      this.setScenario(this.contents)
      this.$router.push('/preview')
    },
    ...mapActions([
      'setScenario'
    ])
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  padding: 20px 10px;
}
</style>
