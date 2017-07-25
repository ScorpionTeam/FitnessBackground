<style scoped rel="stylesheet/scss" lang="scss">
  .activity_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .activity_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .activity_page {
    line-height: 60px;
  }
</style>
<template>
  <div>
    <div class="activity_header">
      <div class="activity_title">
        场馆活动
      </div>
      <div class="activity_search">
        <Input placeholder="请输入活动名称..." v-model="key" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
        <Button type="primary" icon="plus" @click="activityAddHandler()">创建</Button>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        key:'',

      }
    },
    methods:{
      search(){
        console.log('搜索')
      },
      activityAddHandler(){
        this.$router.push('activity-add')
      }
    }
  }
</script>
