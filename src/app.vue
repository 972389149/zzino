<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body{
    height: 100%;
    width:100%;
    margin: 0;
    padding: 0;
}
#app {
    width:100%;
    height:100%;
}
</style>