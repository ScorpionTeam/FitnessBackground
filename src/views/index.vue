<style scoped rel="stylesheet/scss" lang="scss">
  .index {
    width: 100%;
    height: 100%;
  }

  .index_header {
    position: fixed;
    width: 100%;
    z-index: 10;
  }

  .index_layout {
    width: 100%;
    height: 100%;
    padding-top: 60px;
    .index_menu {
      position: fixed;
      height: calc(100% - 60px);
      overflow-y: scroll;
    }
    .index_content {
      margin-left: 257px;
      position:relative;
      /*height: 100%;*/
      .contain {
        width: 100%;
      }
    }
  }

</style>
<template>
  <div class="index">
    <div class="index_header">
      <header-bar></header-bar>
    </div>
    <div class="index_layout">
      <div class="index_menu">
        <left-nav></left-nav>
      </div>
      <div class="index_content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import Nav from '../components/nav/LeftNav.vue'
  import Header from '../components/nav/Header.vue'
  export default {
    methods: {},
    components: {
      "left-nav": Nav,
      "header-bar": Header
    },
    created(){

    }
  }
</script>
