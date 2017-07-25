<style scoped rel="stylesheet/scss" lang="scss">
  .group_class_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .group_class_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .group_class_page {
    line-height: 60px;
  }
</style>
<template>
  <div>
    <div class="group_class_header">
      <div class="group_class_title">
        团体课程
      </div>
      <div class="group_class_search">
        <Input placeholder="请输入课程名称..." v-model="key" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
        <Button type="primary" icon="plus" @click="groupClassAddHandler()">创建</Button>
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
      groupClassAddHandler(){
        this.$router.push('group-class-add')
      }
    }
  }
</script>
