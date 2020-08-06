<template>
  <div class="preview-image" ref="img" />
</template>

<script>
export default {
  props: ['src'],
  watch: {
    src (next, prev) {
      console.log(next, prev)
      this.setImage(next)
    }
  },
  mounted () {
    this.setImage(this.src)
  },
  methods: {
    setImage (src) {
      this.$refs.img.style.backgroundImage = 'url(' + src + ')'
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-image {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  width: 100px;
  height: 100px;
}
</style>