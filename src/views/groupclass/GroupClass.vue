<style scoped rel="stylesheet/scss" lang="scss">
  .group_class_header {
    width: 100%;
    height: 56px;
    margin-bottom: 50px;
    /*  line-height: 56px;*/
    .group_class_title {
      font-size: 20px;
      padding-left: 34px;
      margin-bottom: 10px;
    }
    .group_class_search{

    }
  }

  .group_class_page {
    line-height: 60px;
  }
  .page{
    padding-left: 34px;
    margin-top: 20px;
  }
  /*图片样式*/
  img{
    display: inline-block;
    border: solid 1px #f1f1f1;
    margin-bottom: 2rem;
  }
</style>
<template>
  <div>
    <div class="group_class_header">
      <div class="group_class_title">
        团体课程
      </div>
      <div class="group_class_search">
        <Row>
          <Col span="7">
          <Input placeholder="请输入课程名称..." v-model="key" width="100%"></Input>
          </Col>
          <!--<Col span="4"  offset="1">
          <Select v-model="stadiumId" placeholder="请选择场馆">
            <Option :value="item.id" :key="item.id" v-for="item in stadiumList">{{item.name}}</Option>
          </Select>
          </Col>
          <Col span="3" offset="1">
          <Date-picker type="date" placeholder="选择日期" v-model="date" @on-change="getTimeString"></Date-picker>
          </Col>-->
          <Col span="6" offset="1">
          <Button type="primary" icon="ios-search" @click="search">搜索</Button>
          <Button type="primary" icon="plus" @click="groupClassAddHandler()">创建</Button>
          </Col>
        </Row>
      </div>
    </div>
    <Table :columns="groupClassColumn" :data="groupList"></Table>
    <div class="page">
      <Page   :page-size="page.pageSize" :total="page.total" :current="page.pageNo" @on-change="pageChange"></Page>
    </div>
    <Modal title="团课详情" v-model="detailFlag" :width="1000"  :mask-closable="false">
      <Form ref="groupClassForm" :model="groupClassForm" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="8">
          <Form-item label="名称" prop="name">
            <Input v-model="groupClassForm.name" placeholder="请输入名称"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="总人数" prop="total">
            <Input v-model="groupClassForm.total" placeholder="请输入总人数" number></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="剩余人数" prop="surplusNum">
            <Input v-model="groupClassForm.surplusNum" placeholder="请输入剩余人数" number></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <Form-item label="课程时长" prop="timeTotal">
            <Input v-model="groupClassForm.timeTotal" placeholder="请输入课程时长" number></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="场馆" prop="stadiumId">
            <Select v-model="groupClassForm.stadiumId" placeholder="请选择场馆" @on-change="coachListHandler">
              <Option :value="item.id" :key="item.id" v-for="item in stadiumList">{{item.name}}</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="教练" prop="coachId">
            <Select v-model="groupClassForm.coachId" placeholder="请选择教练">
              <Option :value="item.id" :key="item.id" v-for="item in coachList">{{item.name}}</Option>
            </Select>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="16">
          <Form-item label="选择日期">
            <Row>
              <Col span="11">
              <Form-item prop="startDate">
                <Date-picker type="datetime" placeholder="选择日期" v-model="groupClassForm.startDate" style="width:100%"></Date-picker>
              </Form-item>
              </Col>
              <Col span="2" style="text-align: center">
              -</Col>
              <Col span="11">
              <Form-item prop="endDate">
                <Date-picker type="datetime" placeholder="选择日期" v-model="groupClassForm.endDate" style="width:100%"></Date-picker>
              </Form-item>
              </Col>
            </Row>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="上课地址" prop="address">
            <Input v-model="groupClassForm.address" placeholder="请输入上课地址"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Upload :action="uploadUrl"  :on-success="picUoloadHandler" :show-upload-list="false" style="text-align: center">
            <img src="" alt="主图" ref="mainPic" style="height: 160px;width: 160px;">
          </Upload>
          </Col>
          <Col span="12">
          <Upload :action="uploadUrl"  :on-success="scrollOneHandler" :show-upload-list="false" style="text-align: center">
            <img src="" alt="轮播图" ref="scrollOne" style="height: 160px;width: 160px;">
          </Upload>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Upload :action="uploadUrl"  :on-success="scrollTwoHandler" :show-upload-list="false" style="text-align: center">
            <img src="" alt="轮播图" ref="scrollTwo" style="height: 160px;width: 160px;">
          </Upload>
          </Col>
          <Col span="12">
          <Upload :action="uploadUrl"  :on-success="scrollThreeHandler" :show-upload-list="false" style="text-align: center">
            <img src="" alt="轮播图" ref="scrollThree" style="height: 160px;width: 160px;">
          </Upload>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <div style="text-align: center">
          <Button type="primary" @click="updateConfirm">提交</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
    import {imgBaseUrl} from'../../common/WebApi'
    export default{
        data(){
            return {
                key:'',
                groupList:[],
                coachList:[],
                page:{
                    pageNo:1,
                    pageSize:5,
                    total:0
                },
              /*模态*/
                detailFlag:false,
              /*场馆*/
                stadiumList:[],
                stadiumId:'',
              /*时间*/
                date:'',
              /*修改模态对象*/
                groupClassForm: {
                    name:'',
                    total:'',
                    surplusNum:'',
                    timeTotal:'',
                    stadiumId:'',
                    startDate:'',
                    endDate:'',
                    address:'',
                    mainImgUrl:'',
                    imgList:[]
                },
                ruleValidate: {
                    name:[{required:true,message:'请输入名称',trigger:'blur'}],
                    total:[{type:'number',required:true,message:'请输入人数',trigger:'blur'}],
                    surplusNum:[{type:'number',required:true,message:'请输入剩余人数',trigger:'blur'}],
                    timeTotal:[{type:'number',required:true,message:'请输入时长',trigger:'blur'}],
                    stadiumId:[{type:'number',required:true,message:'请选择场馆',trigger:'change'}],
                    coachId:[{type:'number',required:true,message:'请选择教练',trigger:'change'}],
                    startDate:[{type:'date',required:true,message:'请选择开课日期',trigger:'change'}],
                    endDate:[{type:'date',required:true,message:'请选择结束日期',trigger:'change'}]
                },
              /*图片上传地址*/
                uploadUrl:''
            }
        },
        methods:{
            init(){
                let date = new Date()
                this.date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
                this.stadiumListHandler()
            },
          /*获取所有场馆,并且进行列表初始化查询*/
            stadiumListHandler(){
                let self = this;
                this.$http.get('/stadium/allStadium').then(res=>{
                    self.stadiumList=res.data
                    self.stadiumId = res.data[0].id
                    self.pageList()
                })
            },
          /*获取时间字符串格式*/
            getTimeString(val){
                this.date = val
            },
          /*分页*/
            pageList(){
                let self = this;
                let url ='/groupClass/list?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+
                    '&key='+this.key
                self.$http.get(url).then(function (res) {
                    if(res.result==1){
                        console.log(res)
                        self.groupList = res.data
                        self.page.total = res.total
                    }else {
                        self.$Message.error(res.error.message)
                    }
                })
            },
            pageChange(val){
                this.page.pageNo= val;
                this.pageList()
            },
          /*搜索*/
            search(){
                let self = this;
                let url ='/groupClass/list?pageNo=1&pageSize='+this.page.pageSize+
                    '&key='+this.key
                self.$http.get(url).then(function (res) {
                    if(res.result==1){
                        console.log(res)
                        self.groupList = res.data
                    }else {
                        self.$Message.error(res.error.message)
                    }
                })
            },
          /*获取教练列表*/
            coachListHandler(){
                let self = this
                this.$http.get('/coach/coachListByStadiumId?stadiumId='+this.groupClassForm.stadiumId).then(function(res){
                    if(res.result==1){
                        self.coachList=res.data
                    }else {
                        self.$Message.error(res.error.message)
                    }

                })
            },
            groupClassAddHandler(){
                this.$router.push('group-class-add')
            },
          /*打开模态层*/
            openModal(val){
                this.detailFlag = !this.detailFlag;
                this.groupClassForm = val
                this.groupClassForm.startDate = new Date(this.groupClassForm.startDate)
                this.groupClassForm.endDate = new Date(this.groupClassForm.endDate)
              /*初始化图片*/
                this.groupClass(val.id)
            },
          /*团课详情*/
            groupClass(id){
                let self = this
                self.$http.get('/groupClass/classInfo?id='+id).then(function(res){
                    if(res.result==1){
                        self.groupClassForm.imgList = res.data.imgList
                        if(res.data.imgList.length==0||res.data.mainImgUrl==''){
                            self.$refs['mainPic'].src=''
                            self.$refs['scrollOne'].src=''
                            self.$refs['scrollTwo'].src=''
                            self.$refs['scrollThree'].src=''
                            return
                        }
                        self.$refs['mainPic'].src=imgBaseUrl+self.groupClassForm.mainImgUrl
                        self.$refs['scrollOne'].src=imgBaseUrl+self.groupClassForm.imgList[0].url
                        self.$refs['scrollTwo'].src=imgBaseUrl+self.groupClassForm.imgList[1].url
                        self.$refs['scrollThree'].src=imgBaseUrl+self.groupClassForm.imgList[2].url
                    }
                })
            },
          /*修改*/
            updateConfirm(){
                let self = this
                self.$Modal.confirm({
                    title: '修改确认',
                    content: "确认修改么?",
                    onOk: function () {
                        self.update()
                    }
                })
            },
            update(){
                let self = this;
                self.$refs['groupClassForm'].validate(function (valid) {
                  /*判断是否图片都上传了*/
                    if(self.groupClassForm.mainImgUrl==''||self.groupClassForm.mainImgUrl==undefined||self.groupClassForm.imgList.length!=3){
                        self.$Message.error('请上传图片')
                        return
                    }
                    if(valid){
                        self.$http.post('/groupClass/update',JSON.stringify(self.groupClassForm)).then(function (res) {
                            if(res.result==1){
                                self.$Message.success('修改团课成功')
                                self.detailFlag = !self.detailFlag
                                self.$refs['groupClassForm'].resetFields();
                                self.pageList()
                            }else{
                                self.$Message.error(res.error.message)
                            }
                        })
                    }else {
                        self.$Message.error('请将表单填写完整')
                    }
                })
            },
          /*删除*/
            deleteConfirm(id){
                let self = this
                self.$Modal.confirm({
                    title:'删除确认',
                    content:"确认删除么?",
                    onOk:function(){
                        self.delete(id)
                    }
                })
            },
            delete(id){
                let self = this;
                let url = '/groupClass/del?id='+id
                this.$http.post(url).then(function(res){
                    if(res.result==1){
                        self.$Message.success('删除成功')
                        self.pageList()
                    }else{
                        self.$Message.error(res.error.message)
                    }
                })
            },
          /*图片上传成功回调*/
          /*主图回调*/
            picUoloadHandler(res){
                this.groupClassForm.mainImgUrl = res.data.url
                this.$refs['mainPic'].src=imgBaseUrl+res.data.url
            },
          /*轮播回调*/
            scrollOneHandler(res){
                let data = {}
                data.url = res.data.url
                this.groupClassForm.imgList[0] = data
                this.$refs['scrollOne'].src=imgBaseUrl+res.data.url
            },
            scrollTwoHandler(res){
                let data = {}
                data.url = res.data.url
                this.groupClassForm.imgList[1] = data
                this.$refs['scrollTwo'].src=imgBaseUrl+res.data.url
            },
            scrollThreeHandler(res){
                let data = {}
                data.url = res.data.url
                this.groupClassForm.imgList[2] = data
                this.$refs['scrollThree'].src=imgBaseUrl+res.data.url
            },
        },
        computed:{
            groupClassColumn(){
                let self = this;
                let columns = []
                columns.push({
                    title:'课程名称',
                    key:'name',
                    width:150,
                    align:'center'
                })
                columns.push({
                    title:'开课场馆',
                    key:'stadiumName',
                    width:150,
                    align:'center'
                })
                columns.push({
                    title:'教练',
                    key:'coachName',
                    width:100,
                    align:'center'
                })
                columns.push({
                    title:'总人数',
                    key:'total',
                    width:100,
                    align:'center'
                })
                columns.push({
                    title:'剩余人数',
                    key:'surplusNum',
                    width:100,
                    align:'center'
                })
                columns.push({
                    title:'时长',
                    key:'timeTotal',
                    width:100,
                    align:'center'
                })
                columns.push({
                    title:'开课时间',
                    key:'startDate',
                    width:150,
                    align:'center'
                })
                columns.push({
                    title:'结束时间',
                    key:'endDate',
                    width:150,
                    align:'center'
                })
                columns.push({
                    title:'操作管理',
                    key:'name',
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
                                        let  row  = Object.assign({},params.row)
                                        self.openModal(row)
                                    }
                                }
                            },'修改'),
                            h('Button',{
                                props:{
                                    type:'error',
                                    size:'small'
                                },
                                on:{
                                    click:function () {
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
            this.uploadUrl = this.$http.defaults.baseURL+'/img/upload'
            this.init()
        }
    }
</script>
