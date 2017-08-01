<style scoped rel="stylesheet/scss" lang="scss">
  .meal_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .meal_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }
  .meal_page{
    line-height: 60px;
  }
</style>
<template>
  <div>
    <div class="meal_header">
      <div class="meal_title">
        餐饮
      </div>
      <div class="meal_search">
        <Input placeholder="请输入餐饮名称..." v-model="key" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
        <Button type="primary" icon="plus" @click="openModalHandler('add')">创建</Button>
      </div>
    </div>
    <Table :columns="mealColumns" :data="mealList"></Table>
    <div class="meal_page">
      <Page :total="page.total" :current="page.pageNo" :page-size="page.pageSize"
            @on-change="pageChangeHandler($event)"></Page>
    </div>
    <!--创建餐饮信息-->
    <Modal :title="detailTitle" v-model="mealAddModal" :mask-closable="false">
      <Form ref="mealForm" :model="mealForm" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="12">
          <Form-item label="名称" prop="name">
            <Input v-model="mealForm.name" placeholder="请输入名称"></Input>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="价格" prop="price">
            <Input v-model="mealForm.price" placeholder="请输入价格" number></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Form-item label="总量" prop="total">
            <Input v-model="mealForm.total" placeholder="请输入总量" number></Input>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="场馆" prop="stadiumId">
            <Select v-model="mealForm.stadiumId" placeholder="请选择场馆">
              <Option v-for="stadium in stadiumList" :value="stadium.id" :key="stadium.id">{{stadium.name}}</Option>
            </Select>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <Form-item label="简介" prop="content">
            <Input v-model="mealForm.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入..."></Input>
          </Form-item>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitHandler('mealForm')">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
    export default{
        data(){
            return {
                mealList: [],
                meal: {},
                mealAddModal: false,
                mealForm: {
                    name: '',
                    price: '',
                    content: '',
                    total: '',
                    stadiumId: ''
                },
                stadiumList: [],
                ruleValidate: {
                    name: [{required: true, message: '请填写名称', trigger: 'blur'}],
                    price: [{type:'number',required: true, message: '请填写价格', trigger: 'blur'}],
                    total: [{type:'number',required: true, message: '请填写总量', trigger: 'blur'}],
                    content: [{required: true, message: '请填写简介', trigger: 'change'}],
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
                detailTitle:'新增教练'

            }
        },
        methods: {
            search(){
                this.page.pageNo = 1;
                this.pageListHandler()
            },
          /*分页*/
            pageListHandler(){
                let url = '/meal/list?pageNo=' + this.page.pageNo + '&pageSize=' + this.page.pageSize + '&key=' + this.key;
                this.$http.get(url).then(res=> {
                    this.mealList = res.data;
                    this.page.total=res.total;
                })
            },
          /*打开模态*/
            openModalHandler(action,val){
                if(action=='add'){
                    this.action = action
                    this.detailTitle = '新增营养餐'
                  /*清空*/
                    this.$refs['mealForm'].resetFields()
                }else {
                    this.action = action
                    this.detailTitle = '修改营养餐'
                    let row = Object.assign({},val)
                    row.validDate = new Date(row.validDate)
                    this.mealForm = row
                }
                this.mealAddModal = !this.mealAddModal
            },
          /*获取所有场馆*/
            stadiumListHandler(){
                let self = this;
                let url = '/stadium/allStadium'
                this.$http.get(url).then(function (res) {
                    self.stadiumList = res.data
                })
            },
            submitHandler(val){
                let self = this;
                this.$refs[val].validate(function (valid) {
                    if (valid) {
                        self.save()
                    } else {
                        this.$Message.warning('数据校验失败')
                    }
                })
            },
            save(){
                let self = this;
                if(this.action=='add'){
                    this.$http.post('/meal/add', JSON.stringify(this.mealForm)).then(function(res){
                        if(res.result==1){
                            self.$Message.success('新增营养餐成功')
                            self.pageListHandler()
                            self.mealAddModal =!self.mealAddModal
                        } else {
                            self.$Message.error('新增营养餐失败')
                        }
                    })
                }else {
                    this.$http.post('/meal/update', JSON.stringify(this.mealForm)).then(function(res){
                        if(res.result==1){
                            self.$Message.success('修改营养餐成功')
                            self.pageListHandler()
                            self.mealAddModal =!self.mealAddModal
                        } else {
                            self.$Message.error('修改营养餐失败')
                        }
                    })
                }
            },
            pageChangeHandler(event){
                this.page.pageNo=event
            },
        },
        computed: {
            mealColumns(){
                let self =this;
                let columns = []
                columns.push({
                    title: '名称',
                    key: 'name',
                    align: 'center'
                });
                columns.push({
                    title: '价格',
                    key: 'price',
                    align: 'center'
                });
                columns.push({
                    title: '数量',
                    key: 'total',
                    align: 'center'
                });
                columns.push({
                    title: '简介',
                    key: 'content',
                    align: 'center'
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
        }
    }
</script>
