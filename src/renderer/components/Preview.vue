<template>
  <section id="wrapper">
    <div v-for="(keyword, key) in keywords" :key="key">
      <div class="fields">
        <b-input
          class="fields-input"
          :value="keyword.keyword"
          @keyup.native.enter="updateKeywrod($event, key)"
        />
        <p class="fields-comment">{{ keyword.comment }}</p>
      </div>
    </div>
    <router-link :to="{ name: 'landing-page' }">
        <b-button type="is-warning">이전</b-button>
    </router-link>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['keywords'])
  },
  methods: {
    updateKeywrod ($event, key) {
      const val = $event.target.value
      this.setKeyword(key, val)
    },
    ...mapActions([
      'setKeyword'
    ])
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  padding: 20px 10px;
}

.fields {
  margin-bottom: 10px;

  &-input {
    width: 200px;
  }

  &-comment {
    font-size: 14px;
    color: #555;
  }
}
</style>