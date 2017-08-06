<style scoped rel="stylesheet/scss" lang="scss">
    .water_header {
        width: 100%;
        height: 56px;
        line-height: 56px;
        .water_title {
            float: left;
            font-size: 20px;
            padding-left: 34px;
        }
    }
    .water_page{
        line-height: 60px;
    }
</style>
<template>
    <div>
        <div class="water_header">
            <div class="water_title">
                水吧
            </div>
            <div class="water_search">
                <Input placeholder="请输入饮料名称..." v-model="key" style="width: 300px"></Input>
                <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
                <Button type="primary" icon="plus" @click="openModalHandler('add')">创建</Button>
            </div>
        </div>
        <Table :columns="waterColumns" :data="waterList"></Table>
        <div class="water_page">
            <Page :total="page.total" :current="page.pageNo" :page-size="page.pageSize"
                  @on-change="pageChangeHandler($event)"></Page>
        </div>
        <!--创建饮料信息-->
        <Modal :title="detailTitle" v-model="waterAddModal" :mask-closable="false">
            <Form ref="waterForm" :model="waterForm" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                    <Form-item label="名称" prop="name">
                        <Input v-model="waterForm.name" placeholder="请输入名称"></Input>
                    </Form-item>
                    </Col>
                    <Col span="12">
                    <Form-item label="价格" prop="price">
                        <Input v-model="waterForm.price" placeholder="请输入价格" number></Input>
                    </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <Form-item label="总量" prop="total">
                        <Input v-model="waterForm.total" placeholder="请输入总量" number></Input>
                    </Form-item>
                    </Col>
                    <Col span="12">
                    <Form-item label="容量 " prop="capacity">
                        <Input v-model="waterForm.capacity" placeholder="请输入容量" number></Input>
                    </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <Form-item label="状态" prop="status">
                        <Radio-group v-model="waterForm.status">
                            <Radio label="1">正常</Radio>
                            <Radio label="0">删除</Radio>
                        </Radio-group>
                    </Form-item>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="submitHandler('waterForm')">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                waterList: [],
                water: {},
                waterAddModal: false,
                waterForm: {
                    name: '',
                    price: '',
                    capacity: '',
                    total: '',
                    status: '1'
                },
                stadiumList: [],
                ruleValidate: {
                    name: [{required: true, message: '请填写名称', trigger: 'blur'}],
                    price: [{type:'number',required: true, message: '请填写价格', trigger: 'blur'}],
                    total: [{type:'number',required: true, message: '请填写总量', trigger: 'blur'}],
                    capacity: [{type:'number',required: true, message: '请填写容量', trigger: 'blur'}],
                },
                page: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                key: '',
                action:'add',
                /*模态标题*/
                detailTitle:'新增饮料'

            }
        },
        methods: {
            search(){
                this.page.pageNo = 1;
                this.pageListHandler()
            },
            /*分页*/
            pageListHandler(){
                let url = '/water/list?pageNo=' + this.page.pageNo + '&pageSize=' + this.page.pageSize + '&key=' + this.key;
                this.$http.get(url).then(res=> {
                    this.waterList = res.data;
                    this.page.total=res.total;
                })
            },
            /*打开模态*/
            openModalHandler(action,val){
                if(action=='add'){
                    this.action = action
                    this.detailTitle = '新增饮料'
                    /*清空*/
                    this.$refs['waterForm'].resetFields()
                }else {
                    this.action = action
                    this.detailTitle = '修改饮料'
                    let row = Object.assign({},val)
                    row.validDate = new Date(row.validDate)
                    this.waterForm = row
                }
                this.waterAddModal = !this.waterAddModal
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
                        self.$Message.warning('数据校验失败')
                    }
                })
            },
            save(){
                let self = this;
                console.log(this.waterForm)
                if(this.action=='add'){
                    this.$http.post('/water/add', JSON.stringify(this.waterForm)).then(function(res){
                        if(res.result==1){
                            self.$Message.success('新增饮料成功')
                            self.pageListHandler()
                            self.waterAddModal =!self.waterAddModal
                        } else {
                            self.$Message.error(res.error.message)
                        }
                    })
                }else {
                    this.$http.post('/water/update', JSON.stringify(this.waterForm)).then(function(res){
                        if(res.result==1){
                            self.$Message.success('修改饮料成功')
                            self.pageListHandler()
                            self.waterAddModal =!self.waterAddModal
                        } else {
                            self.$Message.error(res.error.message)
                        }
                    })
                }
            },
            pageChangeHandler(event){
                this.page.pageNo=event
            },
            /*删除*/
            delConfirm(id){
                let self = this;
                this.$Modal.error({
                    title:'删除提醒',
                    content:"确定要删除么",
                    onOk:function(){
                        self.delHandler(id)
                    }
                })
            },
            delHandler(id){
                let self = this;
                self.$http.post('/water/del?id='+id).then(function(res){
                    if(res.result==1){
                        self.$Message.success('删除成功')
                        self.pageListHandler()
                    } else {
                        self.$Message.error(res.error.message)
                    }
                })
            }
        },
        computed: {
            waterColumns(){
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
                    align: 'center',
                    width:100
                });
                columns.push({
                    title: '数量',
                    key: 'total',
                    align: 'center'
                });
                columns.push({
                    title: '容量',
                    key: 'capacity',
                    align: 'center',
                    width:100
                });
                columns.push({
                    title: '状态',
                    key: 'status	',
                    align: 'center',
                    render:function (h,params) {
                        let color,text;
                        color = params.row.status=='1'?'green':'red'
                        text = params.row.status=='1'?'正常':'删除'
                        return h('Tag',{
                            props:{
                                type:'dot',
                                color:color
                            }
                        },text)
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
                            },'修改'),
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
                                        self.delConfirm(params.row.id)
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
            this.stadiumListHandler()
            this.pageListHandler()
        }
    }
</script>
