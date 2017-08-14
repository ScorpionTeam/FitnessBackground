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
    <Modal title="活动详情" v-model="modalFlag" :width="800" :mask-closable="false">
      <Form ref="detail" :model="activityForm" label-position="right" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="8">
          <Form-item label="名称" prop="name">
            <Input v-model="activityForm.name" placeholder="请输入名称"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="场馆" prop="stadiumId">
            <Select v-model="activityForm.stadiumId" placeholder="请选择场馆">
              <Option :value="item.id" :key="item.id" v-for="item in stadiumList">{{item.name}}</Option>
            </Select>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <Form-item label="开始">
            <Row>
              <Col span="16">
              <Form-item prop="startDate">
                <Date-picker type="date" placeholder="选择日期" v-model="activityForm.startDate"></Date-picker>
              </Form-item>
              </Col>
            </Row>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="结束">
            <Row>
              <Col span="16">
              <Form-item prop="endDate">
                <Date-picker type="date" placeholder="选择日期" v-model="activityForm.endDate"></Date-picker>
              </Form-item>
              </Col>
            </Row>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <Form-item label="排序" prop="sort">
            <Input v-model="activityForm.sort" placeholder="请输入名称"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <Form-item label="状态" prop="status">
            <!--
            1进行中  0 已结束  2 未开始
            -->
            <Radio-group v-model="activityForm.status">
              <Radio label="1">正常</Radio>
              <Radio label="0">失效</Radio>
            </Radio-group>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="置顶" prop="showHome">
            <Radio-group v-model="activityForm.showHome">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </Radio-group>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="15" offset="1">
          <!--富文本编辑-->
          <Form-item prop="content" :label-width="1">
            <vue-html5-editor :content="activityForm.content" :height="300"
                              :z-index="2" @change="onEditorChange">
            </vue-html5-editor>
          </Form-item>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="8" offset="8">
        <Button type="primary" @click="updateConfirm">修改</Button>
        </Col>
      </Row>
      <div slot="footer"></div>
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
                modalFlag :false,
                /*详情表单对象*/
                activityForm:{
                    status:'1',
                    showHome:'0',
                    name:'',
                    stadiumId:'',
                    startDate:'',
                    endDate:'',
                    content:''
                },
                /*规则*/
                ruleValidate:{
                    name:[{required:true,message:'必填',trigger:'blur'}],
                    stadiumId:[{type:'number',required:true,message:'必填',trigger:'blur'}],
                    startDate:[{type:'date',required:true,message:'必填',trigger:'blur'}],
                    endDate:[{type:'date',required:true,message:'必填',trigger:'blur'}],
                },
                editorOption:{},
                stadiumList:[]
            }
        },
        methods:{
            init(){
                this.pageList();
                this.stadiumListHandler()
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
            /*修改活动详情*/
            updateConfirm(){
                let self = this;
                self.$Modal.confirm({
                    title:'修改确认',
                    content:'确认修改么?',
                    onOk:function(){
                        self.update()
                    }
                })
            },
            update(){
                let self = this;
                this.$refs['detail'].validate(function(valide){
                    if(valide){
                        if(!self.activityForm.content){
                            self.$Message.error('请填写富文本内容')
                            return
                        }
                        self.$http.post('/activity/update',JSON.stringify(self.activityForm)).then(function(res){
                            if(res.result==1){
                                self.$Message.success('修改成功')
                                self.$refs['detail'].resetFields();
                                self.pageList()
                                self.modalFlag = !self.modalFlag
                            }else {
                                self.$Message.error(res.error.message)
                            }
                        })
                    }else {
                        self.$Message.error('请将表单填写完整')
                    }
                })
            },
          /*打开活动详情模态*/
          openModal(val,action){
              console.log(val)
              this.activityForm = val
              this.activityForm.startDate = new Date(this.activityForm.startDate)
              this.activityForm.endDate = new Date(this.activityForm.endDate)
              this.modalFlag = !this.modalFlag
          },
            //富文本改变事件
            onEditorChange(html){
                this.activityForm.content=''
                this.activityForm.contentHtml=html
            },
            //查询场馆列表
            stadiumListHandler(){
                this.$http.get('/stadium/allStadium').then(res=>{
                    this.stadiumList=res.data
                })
            },
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
//                columns.push({
//                    title:'结束时间',
//                    key:'endDate',
//                    align:'center',
//                    width:200
//                })
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
