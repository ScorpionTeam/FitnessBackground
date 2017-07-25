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
  .page{
    margin-left: 34px;
    margin-top: 20px;
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
    <Table :columns="activityColumn" :data="activityList"></Table>
    <div class="page">
      <Page   :page-size="page.pageSize" :total="page.total" :current="page.pageNo" @on-change="pageChange"></Page>
    </div>
    <Modal title="活动详情" >

    </Modal>
  </div>
</template>
<script>
    export default{
        data(){
            return {
                key:'',
                activityList:[],
                page:{
                    pageNo:1,
                    pageSize:10,
                    totla:0
                },
                /*详情表单对象*/
                detailItem:{}
            }
        },
        methods:{
            init(){
                this.pageList();
            },
          /*分页*/
            pageList(){
                let self = this;
                let url = '/activity/list?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize
                self.$http.get(url).then(function (res) {
                    console.log(res)
                    if(res.result){
                        self.activityList = res.data
                    }else {
                        self.$Message.error(res.error.message)
                    }
                })
            },
            pageChange(page){
                this.page.pageNo = page
                this.pageList()
            },
            search(){
                console.log('搜索')
            },
            activityAddHandler(){
                this.$router.push('activity-add')
            },
          /*删除活动*/
            deleteConfirm(id){
                let self = this;
                self.$Modal.confirm({
                    title:'删除确认',
                    content:'确认删除活动么?',
                    onOk:function () {
                        self.deleteAct(id)
                    }
                })
            },
            deleteAct(id){
                console.log(id)
                let self = this;
                self.$http.post('/activity/del?id='+id).then(function (res) {
                    if(res.result){
                        self.$Message.success('删除成功')
                        self.pageList()
                    }else {
                        self.$Message.error(res.error.message)
                    }
                })
            },
          /*打开活动详情模态*/
          openModal(val,action){
              console.log(val)
          }
        },
        computed:{
            activityColumn(){
                let  self = this;
                let columns =[]
                columns.push({
                    title:'活动名称',
                    key:'name',
                    align:'center',
                    width:200
                })
                columns.push({
                    title:'访问量',
                    key:'visitTotal',
                    align:'center',
                    width:100
                })
                columns.push({
                    title:'报名人数',
                    key:'applyTotal',
                    align:'center',
                    width:100
                })
                columns.push({
                    title:'开始时间',
                    key:'startDate',
                    align:'center',
                    width:200
                })
                columns.push({
                    title:'结束时间',
                    key:'endDate',
                    align:'center',
                    width:200
                })
                columns.push({
                    title:'状态',
                    key:'status',
                    align:'center',
                    render:function (h,params) {
                        let color,text ;
                        color = params.row.status=='1'?'green':'red';
                        text = params.row.status=='1'?'有效':'无效';
                        return h('Tag',{
                            props:{
                                type:'dot',
                                color:color
                            }
                        },text)
                    }
                })
                columns.push({
                    title:'场馆名称',
                    key:'stadiumName',
                    align:'center'
                })
                columns.push({
                    title:'操作管理',
                    width:160,
                    render:function (h,params) {
                        return h('ButtonGroup',[
                            h('Button',{
                                props:{
                                    type:'primary',
                                    size:'small'
                                },
                                style:{
                                    marginRight:'10px'
                                },
                                on:{
                                    click:function () {
                                        let  row = Object.assign({},params.row)
                                        self.openModal(row,'update')
                                    }
                                }
                            },'修改'),
                            h('Button',{
                                props:{
                                    type:'error',
                                    size:'small'
                                },
                                on:{
                                    click(){
                                        self.deleteConfirm(params.row.id)
                                    }
                                }
                            },'删除')
                        ])
                    }
                })
                return columns
            }
        },
        created:function () {
            this.init()
        }
    }
</script>
