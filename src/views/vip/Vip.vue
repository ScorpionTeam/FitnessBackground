<style scoped rel="stylesheet/scss" lang="scss">
  .vip_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .vip_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }
</style>
<template>
  <div>
    <div class="vip_header">
      <div class="vip_title">
        会员卡
      </div>
      <div class="vip_search">
        <Input placeholder="请输入vip卡号" style="width: 300px" v-model="key"></Input>
        <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
        <Button type="primary" icon="plus" @click="openModalHandler('add')">创建</Button>
      </div>
    </div>
    <Table :columns="vipColumns" :data="vipList"></Table>
    <!--vip新增模态-->
    <Modal
            v-model="vipAddModal"
            :title="detailTitle" :mask-closable="false">
      <Form ref="vipForm" :model="vipForm" :rules="vipValidate" :label-width="80">
        <Form-item label="场馆" prop="stadiumId">
          <Select v-model="vipForm.stadiumId" placeholder="请选择场馆">
            <Option v-for="stadium in stadiumList" :value="stadium.id" :key="stadium.id" :label="stadium.name"></Option>
          </Select>
        </Form-item>
        <Row>
          <Col span="12">
          <Form-item label="课时" prop="classTotal">
            <Input v-model="vipForm.classTotal" placeholder="请输入课程数" number></Input>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="类型" prop="type">
            <!--1.月卡-->
            <!--2.季卡-->
            <!--3.半年卡-->
            <!--4.年卡-->
            <!--5.次卡-->
            <Select v-model="vipForm.type" placeholder="请选择会员卡类型">
              <Option value="1">月卡</Option>
              <Option value="2">季卡</Option>
              <Option value="3">半年卡</Option>
              <Option value="4">年卡</Option>
              <Option value="5">次卡</Option>
            </Select>
          </Form-item>
          </Col>
        </Row>
        <Form-item label="有效期">
          <Row>
            <Col span="12">
            <Form-item prop="startDate">
              <Date-picker type="date" placeholder="选择日期" v-model="vipForm.startDate"></Date-picker>
            </Form-item>
            </Col>
            <Col span="1" style="text-align: center">
            -</Col>
            <Col span="10">
            <Form-item prop="endDate">
              <Date-picker type="date" placeholder="选择日期" v-model="vipForm.endDate"></Date-picker>
            </Form-item>
            </Col>
          </Row>
        </Form-item>
        <Row>
          <Col span="12">
          <Form-item label="金额" prop="money">
            <Input v-model="vipForm.money" placeholder="请输入金额" number></Input>
          </Form-item>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitHandler('vipForm')">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
    export default{
        data(){
            return {
                vipList: [],
                vipAddModal: false,
                vipForm: {
                },
                key: '',
                page: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                vipValidate: {
                    stadiumId: [{type:'number',required: true, message: '请选择场馆', trigger: 'change'}],
                    type: [{required: true, message: '请选择会员卡类型', trigger: 'change'}],
                    startDate: [{type:'date',required: true, message: '请选择有效期', trigger: 'change'}],
                    endDate: [{type:'date',required: true, message: '请选择有效期', trigger: 'change'}],
                    classTotal: [{type:'number',required: true, message: '请输入课程数', trigger: 'blur'}],
                    money: [{type:'number',required: true, message: '请输入金额', trigger: 'blur'}]
                },
              /*模态标题*/
                detailTitle:'创建会员卡',
              /*模态动作*/
                action:'add',
                /*场馆列表*/
                stadiumList:[]
            }
        },
        computed: {
            vipColumns(){
                let self= this;
                let columns = []
                columns.push({
                    title: '卡号',
                    key: 'cardNo',
                    align: 'center',
                    width:'140',
                    render: (h, param)=> {
                        return h('Button',{
                            style:{
                                background:'#dddee1',
                            }
                        },param.row.cardNo)
                    }
                });
                columns.push({
                    title: '类型',
                    key: 'type',
                    align: 'center',
                    width:'130',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.type === '1' ? 'blue' : row.type === '2' ? 'red' : row.type === '3' ? 'yellow' : row.type === '4' ? 'green' : row.type == '5' ? 'green' : '';
                        const text = row.type === '1' ? '月卡' : row.type === '2' ? '季卡' : row.type === '3' ? '半年卡' : row.type === '4' ? '年卡' : row.type == '5' ? '此卡' : '';
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                });
                columns.push({
                    title: '课程(次)',
                    key: 'classTotal',
                    align: 'center',
                    width:'80'
                });
                columns.push({
                    title: '金额(元)',
                    key: 'money',
                    align: 'center',
                    width:'80'
                });
                columns.push({
                    title:'场馆',
                    key:'stadiumName',
                    align:'center'
                })
                columns.push({
                    title: '有效期',
                    key: 'validDate',
                    align: 'center',
                    width:130
                });
                columns.push({
                    title:'状态',
                    key:'status',
                    align:'center',
                    render:(h,params)=>{
                        const row = params.row;
                        const color = row.status === '1' ? 'green' : 'red'
                        const text = row.status === '1' ? '未绑' : '已绑'
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
                                        self.openModalHandler('update',params.row)
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: ()=> {
                                        this.selectMemberCard(param)
                                    }
                                }
                            }, '删除'),

                        ]);
                    }
                })
                return columns;
            }
        },
        methods: {
            openModalHandler(action,val){
              /*判断模态打开操作状态*/
                this.action = action
                if(action=='update'){
                    this.detailTitle ='修改会员卡'
                    let row = Object.assign({},val)
                    row.startDate = new Date(row.startDate)
                    row.endDate = new Date(row.endDate)
                    console.log(row)
                    this.vipForm = row
                }else {
                  /*清空表单*/
                    this.$refs['vipForm'].resetFields()
                    this.detailTitle ='创建会员卡'
                }
                this.vipAddModal = !this.vipAddModal
            },
            pageList(){
                let url = '/memberCard/list?pageNo=' + this.page.pageNo + '&pageSize=' + this.page.pageSize + '&key=' + this.key;
                this.$http.get(url).then(res=> {
                    this.vipList = res.data;
                    console.log(res.data);
                })
            },
            submitHandler(val){
                //提交校验
                this.$refs[val].validate((valid)=> {
                    if (valid) {
                        this.save()
                    } else {
                        this.$Message.warning('数据校验失败')
                    }
                })
            },
          /*保存信息*/
            save(){
                let self =this;
              /*判断操作状态*/
                if(this.action=='add'){
                    //保存会员卡
                    this.$http.post('/memberCard/add', JSON.stringify(this.vipForm)).then(res=> {
                        if (res.result == 1) {
                            self.$Message.success('创建会员卡成功');
                            self.vipAddModal = !self.vipAddModal
                            self.pageList()
                        } else {
                            self.$Message.error('创建会员卡失败');
                        }
                    })
                }else if(this.action=='update'){
                  this.$http.post('/memberCard/update',JSON.stringify(this.vipForm)).then(function (res) {
                      if(res.result==1){
                          self.$Message.success('修改会员卡成功');
                          self.vipAddModal = !self.vipAddModal
                          self.pageList()
                      }else {
                          self.$Message.error('修改会员卡失败');
                      }
                  })
                }
            },
          /*获取所有场馆*/
            stadiumListHandler(){
                let self = this;
                this.$http.get('/stadium/allStadium').then(res=>{
                    self.stadiumList=res.data
                })
            },
            search(){

            }
        },
        created(){
            this.stadiumListHandler()
            this.pageList();
        }
    }
</script>
