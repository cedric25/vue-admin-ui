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
  /* Not necessary as buefy.css is imported in main.js */
  /*@import "../node_modules/bulma/css/bulma.css";*/

  /* Syntax highlithing for code snippets in Markdown */
  @import "../node_modules/highlightjs/styles/github-gist.css";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
