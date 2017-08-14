<style scoped rel="stylesheet/scss" lang="scss">
    .notice_header {
        width: 100%;
        height: 56px;
        line-height: 56px;
        .notice_title {
            float: left;
            font-size: 20px;
            padding-left: 34px;
        }
    }
    .notice_page{
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
        <div class="notice_header">
            <div class="notice_title">
                消息
            </div>
            <div class="notice_search">
                <Input placeholder="请输入消息名称..." v-model="key" style="width: 300px"></Input>
                <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
                <Button type="primary" icon="plus" @click="openModalHandler('add')">创建</Button>
            </div>
        </div>
        <Table :columns="noticeColumns" :data="noticeList"></Table>
        <div class="notice_page">
            <Page :total="page.total" :current="page.pageNo" :page-size="page.pageSize"
                  @on-change="pageChangeHandler($event)"></Page>
        </div>
        <!--创建消息-->
        <Modal :title="detailTitle" v-model="noticeAddModal" :mask-closable="false" :width="600">
            <Form ref="noticeForm" :model="noticeForm" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                    <Form-item label="消息名称" prop="name">
                        <Input v-model="noticeForm.name" placeholder="请输入消息名称"></Input>
                    </Form-item>
                    </Col>
                    <Col span="24">
                    <Form-item label="内容" prop="content">
                        <!--富文本编辑-->
                        <vue-html5-editor :content="noticeForm.content" :height="300"
                                          :z-index="2" @change="onEditorChange">
                        </vue-html5-editor>
                    </Form-item>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="submitHandler('noticeForm')">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {imgBaseUrl} from '../../common/WebApi'
    export default{
        data(){
            return {
                noticeList: [],
                notice: {},
                noticeAddModal: false,
                noticeForm: {
                    name:'',
                    content:''
                },
                ruleValidate: {
                    name: [{required: true, message: '请填写消息名称', trigger: 'blur'}],
                    content: [{required: true, message: '请填写消息内容', trigger: 'change'}]
                },
                page: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                key: '',
                action:'add',
                /*模态标题*/
                detailTitle:'新增消息',

            }
        },
        methods: {
            search(){
                this.page.pageNo = 1;
                this.pageListHandler()
            },
            /*分页*/
            pageListHandler(){
                let url = '/message/list?pageNo=' + this.page.pageNo + '&pageSize=' + this.page.pageSize + '&key=' + this.key;
                this.$http.get(url).then(res=> {
                    this.noticeList = res.data;
                    this.page.total=res.total;
                })
            },
            /*打开模态*/
            openModalHandler(action,val){
                if(action=='add'){
                    this.action = action
                    this.detailTitle = '新增消息'
                    /*清空*/
                    this.$refs['noticeForm'].resetFields()
                }else {
                    this.action = action
                    this.detailTitle = '修改消息'
                    let row = Object.assign({},val)
                    row.validDate = new Date(row.validDate)
                    this.noticeForm = row
                }
                this.noticeAddModal = !this.noticeAddModal
            },
            submitHandler(val){
                let self=this
                this.$refs[val].validate(function(valid) {
                    if (valid) {
                        self.save()
                    } else {
                        self.$Message.warning('数据校验失败')
                    }
                })
            },
            save(){
                let self = this;
                if(this.action=='add'){
                    this.$http.post('/message/add', JSON.stringify(this.noticeForm)).then(function(res){
                        if(res.result==1){
                            self.$Message.success('新增消息成功')
                            self.pageListHandler()
                            self.noticeAddModal =!self.noticeAddModal
                        } else {
                            self.$Message.error('新增消息失败')
                        }
                    })
                }else {
                    this.$http.post('/message/update', JSON.stringify(this.noticeForm)).then(function(res){
                        if(res.result==1){
                            self.$Message.success('修改消息成功')
                            self.pageListHandler()
                            self.noticeAddModal =!self.noticeAddModal
                        } else {
                            self.$Message.error('修改消息失败')
                        }
                    })
                }
            },
            pageChangeHandler(event){
                this.page.pageNo=event
            },
            /*富文本内容变化监听事件*/
            onEditorChange(html) {
                console.log(html)
                this.content = html
                this.noticeForm.content = html
            },
            /*删除*/
            delConfirm(id){
                let self = this;
                self.$Modal.confirm({
                    title:'删除确认',
                    content:'删除确认？',
                    onOk:function(){
                        self.deleteHandler(id);
                    }
                })
            },
            deleteHandler(id){
                console.log('删除')
                let self =this;
                self.$http.post('/message/del?id='+id).then(function(res){
                    if(res.result==1){
                        self.$Message.success('删除成功')
                    }
                })
            }
        },
        computed: {
            noticeColumns(){
                let self =this;
                let columns = []
                columns.push({
                    title: '消息名称',
                    key: 'name',
                    align: 'center'
                });
                columns.push({
                    title: '消息内容',
                    key: 'content',
                    align: 'center'
                });
                columns.push({
                    title: '创建时间',
                    key: 'createDate',
                    align: 'center'
                });
                columns.push({
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    render:(h,param)=>{
                        let status = param.row.status
                        let text = status =='1'?'已读':'未读'
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
                                        self.deleteConfirm(params.row.id)
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
