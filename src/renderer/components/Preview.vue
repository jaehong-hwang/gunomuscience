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
      <div class="images">
        <preview-image
          v-for="(link, ikey) in keyword.links"
          :key="ikey"
          :src="link"
        />
      </div>
    </div>
    <router-link :to="{ name: 'landing-page' }">
        <b-button type="is-warning">이전</b-button>
    </router-link>
  </section>
</template>

<script>
import PreviewImage from './PreviewImage'
import { mapState, mapActions } from 'vuex'
import { imageLinksBySearch } from '@/module/browser'

export default {
  components: {
    PreviewImage
  },
  computed: {
    ...mapState(['keywords'])
  },
  methods: {
    async updateKeywrod ($event, key) {
      const keyword = $event.target.value
      const links = await imageLinksBySearch(keyword)
      this.setKeyword({
        key,
        keyword: {
          keyword,
          links
        }
      })
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

.images {
  display: flex;

  img {
    width: 50px;
    height: 50px;
  }
}
</style>