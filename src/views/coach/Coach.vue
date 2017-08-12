<style scoped rel="stylesheet/scss" lang="scss">
  .coach_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .coach_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }
  .coach_page{
    line-height: 60px;
  }
  /*图片*/
  img{
    display: inline-block;
    border: 1px solid #f1f1f1;
    margin-bottom: 2rem;
  }
</style>
<template>
  <div>
    <div class="coach_header">
      <div class="coach_title">
        教练
      </div>
      <div class="coach_search">
        <Input placeholder="请输入教练姓名..." v-model="key" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
        <Button type="primary" icon="plus" @click="openModalHandler('add')">创建</Button>
      </div>
    </div>
    <Table :columns="coachColumns" :data="coachList"></Table>
    <div class="coach_page">
      <Page :total="page.total" :current="page.pageNo" :page-size="page.pageSize"
            @on-change="pageChangeHandler($event)"></Page>
    </div>
    <!--创建教练信息-->
    <Modal :title="detailTitle" v-model="coachAddModal" :mask-closable="false">
      <Form ref="coachForm" :model="coachForm" :rules="ruleValidate" :label-width="80">
        <Upload :action="uploadUrl"  :on-success="picUoloadHandler" :show-upload-list="false" style="text-align: center">
          <img src="" alt="头像" ref="headerPic" style="height: 160px;width: 160px;">
        </Upload>
        <Row>
          <Col span="12">
          <Form-item label="姓名" prop="name">
            <Input v-model="coachForm.name" placeholder="请输入姓名"></Input>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="电话" prop="phone">
            <Input v-model="coachForm.phone" placeholder="请输入电话"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Form-item label="机构" prop="organization">
            <Input v-model="coachForm.organization" placeholder="请输入发证机构名称"></Input>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="有效期" prop="validDate">
            <Date-picker type="date" placeholder="选择日期" v-model="coachForm.validDate"></Date-picker>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Form-item label="状态">
            <Radio-group v-model="coachForm.status">
              <Radio label="1">在职</Radio>
              <Radio label="0">离职</Radio>
            </Radio-group>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="场馆" prop="stadiumId">
            <Select v-model="coachForm.stadiumId" placeholder="请选择场馆">
              <Option v-for="stadium in stadiumList" :value="stadium.id" :key="stadium.id">{{stadium.name}}</Option>
            </Select>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <Form-item label="描述" prop="description">
            <Input v-model="coachForm.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入..."></Input>
          </Form-item>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitHandler('coachForm')">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {imgBaseUrl} from '../../common/WebApi'
    export default{
        data(){
            return {
                coachList: [],
                coach: {},
                coachAddModal: false,
                coachForm: {
                    name: '',
                    phone: '',
                    coachImgUrl:'',
                    organization: '',
                    validDate: '',
                    status: '1',
                    stadiumId: '',
                    description: ''
                },
                stadiumList: [],
                ruleValidate: {
                    name: [{required: true, message: '请填写教练名称', trigger: 'blur'}],
                    phone: [{required: true, message: '请填写联系电话', trigger: 'blur'}],
                    organization: [{required: true, message: '请填写认证机构', trigger: 'blur'}],
                    status: [{required: true, message: '请填写认证机构', trigger: 'change'}],
                    validDate: [{type:'date',required: true, message: '请选择有效期', trigger: 'change'}],
                    stadiumId: [{type:'number',required: true, message: '请选择场馆', trigger: 'change'}],
                },
                page: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                key: '',
                action:'add',
              /*模态标题*/
                detailTitle:'新增教练',
              /*图片上传地址*/
                uploadUrl:''

            }
        },
        methods: {
            search(){
                this.page.pageNo = 1;
                this.pageListHandler()
            },
          /*分页*/
            pageListHandler(){
                let url = '/coach/list?pageNo=' + this.page.pageNo + '&pageSize=' + this.page.pageSize + '&key=' + this.key;
                this.$http.get(url).then(res=> {
                    this.coachList = res.data;
                    this.page.total=res.total;
                })
            },
          /*打开模态*/
            openModalHandler(action,val){
                if(action=='add'){
                    this.action = action
                    this.detailTitle = '新增教练'
                    this.$refs['headerPic'].src=''
                    this.coachForm.coachImgUrl=''
                  /*清空*/
                    this.$refs['coachForm'].resetFields()
                }else {
                    this.action = action
                    this.detailTitle = '修改教练'
                    let row = Object.assign({},val)
                    row.validDate = new Date(row.validDate)
                    this.coachForm = row
                    this.$refs['headerPic'].src=imgBaseUrl+row.coachImgUrl
                }
                this.coachAddModal = !this.coachAddModal
            },
          /*获取所有场馆*/
            stadiumListHandler(){
                let self = this;
                let url = '/stadium/allStadium'
                this.$http.get(url).then(res=> {
                    self.stadiumList = res.data
                })
            },
            submitHandler(val){
                let self=this
                this.$refs[val].validate(function(valid) {
                    if (valid) {
                        /*校验头像*/
                        if(self.coachForm.coachImgUrl==''||self.coachForm.coachImgUrl==undefined){
                            self.$Message.error('请选择头像照片')
                            return
                        }
                        self.save()
                    } else {
                        self.$Message.warning('数据校验失败')
                    }
                })
            },
            save(){
                let self = this;
                if(this.action=='add'){
                    this.$http.post('/coach/add', JSON.stringify(this.coachForm)).then(function(res){
                        if(res.result==1){
                            self.$Message.success('新增教练成功')
                            self.pageListHandler()
                            self.coachAddModal =!self.coachAddModal
                        } else {
                            self.$Message.error('新增教练失败')
                        }
                    })
                }else {
                    this.$http.post('/coach/update', JSON.stringify(this.coachForm)).then(function(res){
                        if(res.result==1){
                            self.$Message.success('修改教练成功')
                            self.pageListHandler()
                            self.coachAddModal =!self.coachAddModal
                        } else {
                            self.$Message.error('修改教练失败')
                        }
                    })
                }
            },
            pageChangeHandler(event){
                this.page.pageNo=event
            },
            /*头像上传回调*/
            picUoloadHandler(res){
                this.coachForm.coachImgUrl = res.data.url
                this.$refs['headerPic'].src=imgBaseUrl+res.data.url
            }
        },
        computed: {
            coachColumns(){
                let self =this;
                let columns = []
                columns.push({
                    title: '姓名',
                    key: 'name',
                    align: 'center'
                });
                columns.push({
                    title: '电话',
                    key: 'phone',
                    align: 'center'
                });
                columns.push({
                    title: '场馆',
                    key: 'stadiumName',
                    align: 'center'
                });
                columns.push({
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    render:(h,param)=>{
                        let status = param.row.status
                        let text = status =='1'?'在职':'离职'
                        return ('span',text)
                    }
                });
                columns.push({
                    title:'操作管理',
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
                                        self.openModalHandler('update',params.row)
                                    }
                                }
                            },'修改')
                            /*h('Button',{
                                props:{
                                    type:'error',
                                    size:'small'
                                },
                                style:{
                                    marginRight:'10px'
                                }
                            },'删除')*/
                        ])
                    }
                })
                return columns;
            }
        },
        created(){
            this.stadiumListHandler()
            this.pageListHandler()
            this.uploadUrl = this.$http.defaults.baseURL+'/img/upload'
        }
    }
</script>
