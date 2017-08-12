<style scoped rel="stylesheet/scss" lang="scss">
    .private_class_header {
        width: 100%;
        height: 56px;
        margin-bottom: 50px;
        /*  line-height: 56px;*/
        .private_class_title {
            font-size: 20px;
            padding-left: 34px;
            margin-bottom: 10px;
        }
        .private_class_search{

        }
    }

    .private_class_page {
        line-height: 60px;
    }
    .page{
        padding-left: 34px;
        margin-top: 20px;
    }
    /*图片统一为行内快元素*/
    img{
        display:inline-block!important;
        border:solid #f1f1f1 1px;
        margin-bottom: 2rem;
    }
</style>
<template>
    <div>
        <div class="private_class_header">
            <div class="private_class_title">
                私教课程
            </div>
            <div class="private_class_search">
                <Row>
                    <Col span="7">
                    <Input placeholder="请输入课程名称..." v-model="key" width="100%"></Input>
                    </Col>
                    <Col span="6" offset="1">
                    <Button type="primary" icon="ios-search" @click="search">搜索</Button>
                    <Button type="primary" icon="plus" @click="privateClassAddHandler('add')">创建</Button>
                    </Col>
                </Row>
            </div>
        </div>
        <Table :columns="privateClassColumn" :data="privateList"></Table>
        <div class="page">
            <Page   :page-size="page.pageSize" :total="page.total" :current="page.pageNo" @on-change="pageChange"></Page>
        </div>
        <Modal :title="modalTitle" v-model="detailFlag" :width="1000"  :mask-closable="false">
            <Form ref="privateClassForm" :model="privateClassForm" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="8">
                    <Form-item label="名称" prop="name">
                        <Input v-model="privateClassForm.name" placeholder="请输入名称"></Input>
                    </Form-item>
                    </Col>
                    <Col span="8">
                    <Form-item label="课程时长" prop="classTime">
                        <Input v-model="privateClassForm.classTime" placeholder="请输入课程时长" number></Input>
                    </Form-item>
                    </Col>
                    <Col span="8">
                    <Form-item label="场馆" prop="stadiumId">
                        <Select v-model="privateClassForm.stadiumId" placeholder="请选择场馆" @on-change="coachListHandler">
                            <Option :value="item.id" :key="item.id" v-for="item in stadiumList">{{item.name}}</Option>
                        </Select>
                    </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                    <Form-item label="教练" prop="coachId">
                        <Select v-model="privateClassForm.coachId" placeholder="请选择教练">
                            <Option :value="item.id" :key="item.id" v-for="item in coachList">{{item.name}}</Option>
                        </Select>
                    </Form-item>
                    </Col>
                    <Col span="16">
                    <Form-item label="时间段" prop="timeList">
                        <Checkbox-group v-model="privateClassForm.timeList" @on-change="timeFormatter">
                            <Checkbox :label="time" v-for="(time,index) in timeList" :key="index">{{time}}</Checkbox>
                        </Checkbox-group>
                        <!--<Form ref='times' :model="privateClassForm.privateClassTimeList" :rules="ruleValidateTwo">
                          <Form-item prop="times">
                            <Checkbox-group v-model="privateClassForm.privateClassTimeList.times">
                              <Checkbox :label="time" v-for="(time,index) in timeList" :key="index">{{time}}</Checkbox>
                            </Checkbox-group>
                          </Form-item>
                        </Form>-->
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
                    <Button type="primary" @click="submitConfirm">提交</Button>
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
                privateList:[],
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
                /*时间*/
                date:'',
                /*修改模态对象*/
                privateClassForm: {
                    name:'',
                    classTime:'',
                    coachId:'',
                    privateClassTimeList:[],
                    mainImgUrl:'',
                    stadiumId:'',
                    imgList:[],
                    timeList:[]
                },
                ruleValidate: {
                    name:[{required:true,message:'请输入名称',trigger:'blur'}],
                    classTime:[{type:'number',required:true,message:'请输入时长',trigger:'blur'}],
                    stadiumId:[{type:'number',required:true,message:'请选择场馆',trigger:'change'}],
                    coachId:[{type:'number',required:true,message:'请选择教练',trigger:'change'}],
                    timeList:[{type:'array',required:true,message:'请选择时间段',trigger:'change'}]
                },
                ruleValidateTwo:{
                    times:[{type:'array',required:true,message:'请选择时间段',trigger:'change'}]
                },
                /*图片上传地址*/
                uploadUrl:'',
                /*Modal标题*/
                modalTitle:'新增私教',
                /*时间段集合*/
                timeList:['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'],
                /*操作*/
                action:'',
                /*全选标志*/
                allFlag:false
            }
        },
        methods:{
            init(){
                this.stadiumListHandler()
            },
            /*获取所有场馆,并且进行列表初始化查询*/
            stadiumListHandler(){
                let self = this;
                this.$http.get('/stadium/allStadium').then(res=>{
                    self.stadiumList=res.data
                    self.pageList()
                })
            },
            /*分页*/
            pageList(){
                let self = this;
                let url ='/privateClass/list?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+
                    '&key='+this.key
                self.$http.get(url).then(function (res) {
                    if(res.result==1){
                        console.log(res)
                        self.privateList = res.data
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
                let url ='/privateClass/list?pageNo=1&pageSize='+this.page.pageSize+
                    '&key='+this.key
                self.$http.get(url).then(function (res) {
                    if(res.result==1){
                        console.log(res)
                        self.privateList = res.data
                    }else {
                        self.$Message.error(res.error.message)
                    }
                })
            },
            /*获取教练列表*/
            coachListHandler(){
                let self = this
                if(this.privateClassForm.stadiumId==''||this.privateClassForm.stadiumId==undefined){
                    return
                }
                this.$http.get('/coach/coachListByStadiumId?stadiumId='+this.privateClassForm.stadiumId).then(function(res){
                    if(res.result==1){
                        self.coachList=res.data
                    }else {
                        self.$Message.error(res.error.message)
                        self.coachList = []
                    }

                })
            },
            /*新增*/
            privateClassAddHandler(action){
                this.detailFlag=!this.detailFlag
                this.modalTitle ='新增私教'
                /*数据初始化*/
                this.$refs['privateClassForm'].resetFields();
                this.privateClassForm.privateClassTimeList = []
                this.resetPicInfor()
                /*图片清空*/
                this.$refs['mainPic'].src=''
                this.$refs['scrollOne'].src=''
                this.$refs['scrollTwo'].src=''
                this.$refs['scrollThree'].src=''
                this.action = action
            },
            /*打开模态层*/
            openModal(val,action){
                this.action = action
                this.detailFlag = !this.detailFlag;
                this.privateClassForm = val
                /*初始化表单里时间段*/
                this.getTimeListModal(this.privateClassForm.privateClassTimeList)
                /*初始化图片*/
                this.privateClass(val.id)
            },
            /*私课详情*/
            privateClass(id){
                let self = this
                self.$http.get('/privateClass/classInfo?id='+id).then(function(res){
                    if(res.result==1){
                        self.privateClassForm.imgList = res.data.imgList
                        if(res.data.imgList.length==0||res.data.mainImgUrl==''){
                            self.$refs['mainPic'].src=''
                            self.$refs['scrollOne'].src=''
                            self.$refs['scrollTwo'].src=''
                            self.$refs['scrollThree'].src=''
                            return
                        }
                        self.$refs['mainPic'].src=imgBaseUrl+self.privateClassForm.mainImgUrl
                        self.$refs['scrollOne'].src=imgBaseUrl+self.privateClassForm.imgList[0].url
                        self.$refs['scrollTwo'].src=imgBaseUrl+self.privateClassForm.imgList[1].url
                        self.$refs['scrollThree'].src=imgBaseUrl+self.privateClassForm.imgList[2].url
                    }
                })
            },
            /*修改时间段数据格式*/
            timeFormatter(val){
                let timeArray = []
                for(let key in val){
                    let data = {}
                    key = Number(key)
                    data.times = val[key]
                    timeArray.push(data)
                }
                this.privateClassForm.privateClassTimeList  = timeArray
                console.log(this.privateClassForm)
            },
            getTimeListModal(arr){
                let arry = []
                for(let key in arr){
                    key = Number(key)
                    arry.push(arr[key].times)
                }
                this.privateClassForm.timeList = arr
            },
            /*提交*/
            submitConfirm(){
                let self = this
                self.$Modal.confirm({
                    title: '提交确认',
                    content: "确认提交么?",
                    onOk: function () {
                        self.submit()
                    }
                })
            },
            submit(){
                let self = this;
                console.log(this.privateClassForm)
                self.$refs['privateClassForm'].validate(function (valid) {
                    /*判断是否图片都上传了*/
                    if(self.privateClassForm.mainImgUrl==''||self.privateClassForm.mainImgUrl==undefined||self.privateClassForm.imgList.length!=3){
                        self.$Message.error('请上传图片')
                        return
                    }
                    if(valid){
                        /*判断操作*/
                        if(self.action='add'){
                            self.$http.post('/privateClass/add',JSON.stringify(self.privateClassForm)).then(function (res) {
                                if(res.result==1){
                                    self.$Message.success('新增私课成功')
                                    self.detailFlag = !self.detailFlag
                                    self.$refs['privateClassForm'].resetFields();
                                    self.resetPicInfor()
                                    self.pageList()
                                }else{
                                    self.$Message.error(res.error.message)
                                }
                            })
                        }else{
                            self.$http.post('/privateClass/update',JSON.stringify(self.privateClassForm)).then(function (res) {
                                if(res.result==1){
                                    self.$Message.success('修改私课成功')
                                    self.detailFlag = !self.detailFlag
                                    self.$refs['privateClassForm'].resetFields();
                                    self.resetPicInfor()
                                    self.pageList()
                                }else{
                                    self.$Message.error(res.error.message)
                                }
                            })
                        }
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
                let url = '/privateClass/del?id='+id
                this.$http.post(url).then(function(res){
                    if(res.result==1){
                        self.$Message.success('删除成功')
                        self.pageList()
                    }else{
                        self.$Message.error(res.error.message)
                    }
                })
            },
            /*情况图片字段信息*/
            resetPicInfor(){
                this.privateClassForm.mainImgUrl = ''
                this.privateClassForm.imgList =[]
            },
            /*图片上传成功回调*/
            /*主图回调*/
            picUoloadHandler(res){
                this.privateClassForm.mainImgUrl = res.data.url
                this.$refs['mainPic'].src=imgBaseUrl+res.data.url
            },
            /*轮播回调*/
            scrollOneHandler(res){
                let data = {}
                data.url = res.data.url
                this.privateClassForm.imgList[0] = data
                this.$refs['scrollOne'].src=imgBaseUrl+res.data.url
            },
            scrollTwoHandler(res){
                let data = {}
                data.url = res.data.url
                this.privateClassForm.imgList[1] = data
                this.$refs['scrollTwo'].src=imgBaseUrl+res.data.url
            },
            scrollThreeHandler(res){
                let data = {}
                data.url = res.data.url
                this.privateClassForm.imgList[2] = data
                this.$refs['scrollThree'].src=imgBaseUrl+res.data.url
            },
        },
        computed:{
            privateClassColumn(){
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
                        return h('Buttonprivate',[
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
