<template>
  <div class="loading-wrapper">
    <div class="loading-box">
      <b-progress type="is-info" :value="value" show-value format="percent"></b-progress>
      <p class="loading-info">{{ loading }} / {{ size }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['loading', 'size'],
  computed: {
    value () {
      return this.loading === 0 ? 0 : (this.loading / this.size * 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  &-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.2)
  }

  &-box {
    width: 400px;
    padding: 30px 60px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1)
  }

  &-info {
    text-align: center;
    font-size: 13px;
    color: #444;
  }
}
</style>