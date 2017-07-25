<style scoped rel="stylesheet/scss" lang="scss">
  .impression_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .impression_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .impression_page {
    line-height: 60px;
  }
</style>
<template>
  <div>
    <div class="impression_header">
      <div class="impression_title">
        印象
      </div>
      <div class="impression_search">
        <Input placeholder="请输入印象名称..." v-model="key" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
        <Button type="primary" icon="plus" @click="impressionAddHandler()">创建</Button>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        key:''
      }
    },
    methods:{
      search(){

      },
      impressionAddHandler(){

      }
    }
  }
</script>
