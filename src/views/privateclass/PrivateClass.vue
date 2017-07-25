<style scoped rel="stylesheet/scss" lang="scss">
  .private_class_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .private_class_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .private_class_page {
    line-height: 60px;
  }
</style>
<template>
  <div>
    <div class="private_class_header">
      <div class="private_class_title">
        私教课程
      </div>
      <div class="private_class_search">
        <Input placeholder="请输入课程名称..." v-model="key" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
        <Button type="primary" icon="plus" @click="privateClassAddHandler()">创建</Button>
      </div>
    </div>
    <Table :columns="privateClassColumns" :data="privateClassList"></Table>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        key: '',
        privateClassList: [],
      }
    },
    methods: {
      //创建私教课程
      privateClassAddHandler(){

      }
    },
    computed: {
      privateClassColumns(){
        let columns = []
        columns.push({
          title:'名称',
          key:'name',
          align:'center'
        });
        columns.push({
          title:'教练',
          key:'coachName',
          align:'center'
        });
        columns.push({
          title:'时长',
          key:'classTime',
          align:'center'
        });
        return columns;
      }
    }
  }
</script>
