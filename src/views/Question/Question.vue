<style scoped rel="stylesheet/scss" lang="scss">
  .question_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .question_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }
  .question_page{
    line-height: 60px;
  }
  .question{
    padding: 2rem 0;
    font-size: 1.6rem;
  }
</style>
<template>
  <div>
    <div class="question_header">
      <div class="question_title">
        问答
      </div>
      <div class="question_search">
        <Input placeholder="请输入教练姓名..." v-model="key" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
      </div>
    </div>
    <Table :columns="questionColumns" :data="questionList"></Table>
    <div class="question_page">
      <Page :total="page.total" :current="page.pageNo" :page-size="page.pageSize"
            @on-change="pageChangeHandler($event)"></Page>
    </div>
    <!--回答模态-->
    <Modal title="回答" v-model="questionModal" :mask-closable="false">
      <p class="question">问:{{questionForm.question}}</p>
      <Input type="textarea" :autosize="{ minRows: 2, maxRows:5 }" v-model="questionForm.answer">
      </Input>
      <div slot="footer">
        <Button type="primary" @click="answerHandler">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
    export default{
        data(){
            return {
                questionList: [],
                question: {},
                questionModal: false,
                questionForm: {
                    answer:'',
                    question:''
                },
                page: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                key: ' '

            }
        },
        methods: {
            search(){
                this.page.pageNo = 1;
                this.pageListHandler()
            },
          /*分页*/
            pageListHandler(){
                let url = '/qa/bacList?pageNo=' + this.page.pageNo + '&pageSize=' + this.page.pageSize+'&key=' + this.key
                this.$http.get(url).then(res=> {
                    this.questionList = res.data;
                    this.page.total=res.total;
                })
            },
            pageChangeHandler(event){
                this.page.pageNo=event
            },
          /*打开模态*/
            openModalHandler(val){
                this.questionForm = val;
                this.questionModal = !this.questionModal
            },
          /*回答事件*/
            answerHandler(){
                let self=this;
              /*校验回答是否为空*/
                if(this.questionForm.answer==''||this.questionForm.answer==undefined){
                    this.$Message.error('回答不能为空')
                    return
                }
                this.$http.post('/qa/answer',JSON.stringify(this.questionForm)).then(function (res) {
                    if(res.result==1){
                        self.$Message.success('回答成功')
                        self.questionModal = !self.questionModal
                    }else {
                        self.$Message.error(res.error.message)
                    }
                })
            },
          /*删除*/
            delPromp(id){
                let self = this;
                self.$Modal.confirm({
                    title:'删除提示',
                    content:'确认删除么?',
                    onOk:function () {
                        self.delHandler(id)
                    }
                })
            },
            delHandler(id){
                let self = this;
                this.$http.post('/qa/del?id='+id).then(function (res) {
                    if(res.result==1){
                        self.$Message.success('删除成功')
                        self.pageListHandler()
                    }else {
                        self.$Message.error(res.error.message)
                    }
                })
            }
        },
        computed: {
            questionColumns(){
                let self =this;
                let columns = []
                columns.push({
                    title:'序号',
                    type:'index',
                    align: 'center',
                    width:60
                });
                columns.push({
                    title: '问题',
                    key: 'question',
                    align: 'center',
                    width:400,
                    render:function (h,params) {
                        let text = params.row.question
                        return h('span',{
                            style:{
                                overFlow:'hidden',
                                textOverFlow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                title:text
                            }
                        },text)
                    }
                });
                columns.push({
                    title: '提问时间',
                    key: 'createDate',
                    align: 'center',
                    width:150
                });
                columns.push({
                    title: '回答时间',
                    key: 'answerDate',
                    align: 'center',
                    width:150
                });
                columns.push({
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    width:120,
                    render:function (h,params) {
                        let text ='',color
                        text = params.row.status=='1'?'已回答':'未回答'
                        color=params.row.status=='1'?'green':''
                        return h('span',{
                            style:{
                                color:color
                            }
                        },text)
                    }
                });
                columns.push({
                    title:'操作管理',
                    align:'center',
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
                                        let row = Object.assign({},params.row)
                                        self.openModalHandler(row)
                                    }
                                }
                            },'回答'),
                            h('Button',{
                                props:{
                                    type:'error',
                                    size:'small'
                                },
                                style:{
                                    marginRight:'10px'
                                },
                                on:{
                                    click(){
                                       self.delPromp(params.row.id)
                                    }
                                }
                            },'删除')
                        ])
                    }
                })
                return columns;
            }
        },
        created(){
            this.pageListHandler()
        }
    }
</script>
