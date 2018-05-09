<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
  import Home from './components/Home.vue'

  export default {
    name: 'app',
    components: {
      Home,
    }
  }
</script>

<style>
  @import "../node_modules/highlightjs/styles/github-gist.css";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
