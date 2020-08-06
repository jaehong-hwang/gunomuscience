<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { initialBrowser, resetBrowser } from '@/module/browser'

  export default {
    name: 'gunomuscience',
    async beforeCreate () {
      await initialBrowser()
    },
    async beforeDestroy () {
      await resetBrowser()
    }
  }
</script>
