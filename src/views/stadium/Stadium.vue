<!--场馆页面-->
<style scoped rel="stylesheet/scss" lang="scss">
  .stadium_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .stadium_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .stadium_page {
    line-height: 60px;
  }
</style>
<template>
  <div>
    <div class="stadium_header">
      <div class="stadium_title">
        场馆
      </div>
      <div class="member_search">
        <Input v-model="key" placeholder="请输入场馆名" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search" @click="searchHandler()">搜索</Button>
        <Button type="primary" icon="plus" @click="stadiumAddHandler()">创建</Button>
      </div>
    </div>
    <Table :columns="stadiumColumns" :data="stadiumList"></Table>
    <div class="stadium_page">
      <Page :total="page.total" :current="page.pageNo" :page-size="page.pageSize"
            @on-change="pageChangeHandler($event)"></Page>
    </div>
    <!--Prompt提示框-->
    <Modal v-model="open" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="removeConfirmHandler()">删除</Button>
      </div>
    </Modal>
  </div>

</template>
<script>
  export default {
    data(){
      return {
        stadiumList: [],
        key: '',
        page: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        open: false,
        removeId: ''
      }
    },
    computed: {
      stadiumColumns(){
        let columns = []
        columns.push({
          title: '名称',
          key: 'name'
        });
        columns.push({
          title: '场馆地址',
          key: 'address',
          width: 300
        });
        columns.push({
          title: '创建时间',
          key: 'createDate'
        });
        columns.push({
          title: '状态',
          key: 'status',
          render: (h, params) => {
            const row = params.row;
            const color = row.status === '1' ? 'blue' : 'red';
            const text = row.status === '1' ? '启用' : '停用';
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text);
          }
        });
        columns.push({
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (h, params)=> {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: ()=> {
                    this.update(params.row.id)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.removeHandler(params.row.id)
                  }
                }
              }, '删除')
            ]);
          }
        })
        return columns;
      }
    },
    methods: {
      pageListHandler(){
        //查询列表事件
        let url = "/stadium/list?pageNo=" + this.page.pageNo + "&pageSize=" + this.page.pageSize + "&key=" + this.key;
        this.$http.get(url).then(res=> {
          this.stadiumList = res.data;
          this.page.pageNo = res.pageNo
          this.page.total = res.total
        })
      },
      stadiumAddHandler(){
        //创建场馆事件
        this.$router.push('stadiumAdd');
      },
      searchHandler(){
        //搜索事件
        this.pageListHandler();
      },
      pageChangeHandler(event){
        //分页事件
        this.page.pageNo = event
        this.pageListHandler()
      },
      removeHandler(data){
        //删除事件
        console.log(data)
        this.removeId = data
        this.open = true
      },
      removeConfirmHandler(){
        this.open = !this.open
        this.$http.post('/stadium/del?id=' + this.removeId).then(res=> {
          console.log('返回结果')
          if(res.result==1){
            this.$Message.success(res.data)
            this.pageListHandler()
          }else{
            this.$Message.error(res.data)
          }
        })
      }
    },
    created(){
      this.pageListHandler();
    }
  }
</script>
