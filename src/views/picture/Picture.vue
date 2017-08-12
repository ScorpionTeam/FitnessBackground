<style scoped rel="stylesheet/scss" lang="scss">
    .content{
        .img_header {
            width: 100%;
            height: 56px;
            line-height: 56px;
            .img_title {
                float: left;
                font-size: 20px;
                padding-left: 34px;
            }
        }
        .img_page{
            line-height: 60px;
        }
        /*图片模态*/
        .displayImg{
            width: 300px;
            height: 300px;
            object-fit: cover;
        }
        .picAdress{
            display: inline-block;
            width:100%;
            padding: 20px;
            text-align: center;
        }
    }
    img{
        display: inline-block;
        border: 1px solid #f1f1f1;
        margin-bottom: 2rem;
    }
</style>
<template>
    <div class="content">
        <div class="img_header">
            <div class="img_title">
                图片
            </div>
            <div class="img_search">
                <Input placeholder="请输入餐饮名称..." v-model="key" style="width: 300px"></Input>
                <Button type="primary" icon="ios-search" @click="search()">搜索</Button>
                <Button type="primary" icon="plus" @click="openModalHandler('add')">创建</Button>
            </div>
        </div>
        <Table :columns="imgColumns" :data="imgList"></Table>
        <div class="img_page">
            <Page :total="page.total" :current="page.pageNo" :page-size="page.pageSize"
                  @on-change="pageChangeHandler($event)"></Page>
        </div>
        <!--创建餐饮信息-->
        <Modal :title="detailTitle" v-model="imgAddModal" :mask-closable="false">
                <Row v-if="picFlg">
                    <Col span="24">
                    <Upload :action="uploadUrl"  :on-success="picUoloadHandler" :show-upload-list="false" style="text-align: center">
                        <img src="" alt="头像" ref="headPic" style="height: 140px;width: 140px;">
                    </Upload>
                    </Col>
                </Row>
                <Row v-if="!picFlg">
                    <Col span="24" style="text-align: center">
                        <img src="" alt="头像" class="displayImg" ref="picDetail">
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <span class="picAdress">{{imgForm.url}}</span>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>
<script>
    import {imgBaseUrl}from'../../common/WebApi'
    export default{
        data(){
            return {
                imgList: [],
                imgAddModal: false,
                imgForm: {
                    url: ''
                },
                /*图片上传接口地址*/
                uploadUrl:'',
                /*图片显示标志*/
                picFlg:true,
                page: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                key: '',
                action:'add',
                /*模态标题*/
                detailTitle:'新增图片'

            }
        },
        methods: {
            search(){
                this.page.pageNo = 1;
                this.pageListHandler()
            },
            /*分页*/
            pageListHandler(){
                let url = '/img/pageList?pageNo=' + this.page.pageNo + '&pageSize=' + this.page.pageSize + '&key=' + this.key;
                this.$http.get(url).then(res=> {
                    this.imgList = res.data;
                    this.page.total=res.total;
                })
            },
            /*打开模态*/
            openModalHandler(action,val){
                this.imgAddModal = !this.imgAddModal
                if(action=='add'){
                    this.picFlg = true
                    this.action = action
                    this.detailTitle = '新增图片'
                    /*清空*/
                    this.imgForm.url = ''
                    this.$refs['headPic'].src=''
                }else {
                    this.action = action
                    this.picFlg = false
                    this.detailTitle = '图片详情'
                    let row = Object.assign({},val)
                    this.imgForm = row
                    this.$nextTick(function () {
                        this.$refs['picDetail'].src=row.url
                    })
                }
            },
            pageChangeHandler(event){
                this.page.pageNo=event
                this.pageListHandler();
            },
            /*图片上传成功回调*/
            picUoloadHandler(res){
                this.$refs['headPic'].src=imgBaseUrl+res.data.url
                this.imgForm.url = res.data.url
                /*上传成功提示*/
                this.$Message.success('上传成功')
                this.pageListHandler();
                this.imgAddModal =!this.imgAddModal
            }
        },
        computed: {
            imgColumns(){
                let self =this;
                let columns = []
                columns.push({
                    title: 'id',
                    key: 'id',
                    align: 'center',
                    width:'100'
                });
                columns.push({
                    title: '展示',
                    key: 'url',
                    align: 'center',
                    width:'150',
                    render:function (h,params) {
                        return h('img',{
                            style:{
                                width:'100px',
                                height:'100px',
                                objectFit:'cover'
                            },
                            attrs:{
                                src:params.row.url
                            }
                        })
                    }
                });
                columns.push({
                    title: '创建时间',
                    key: 'createDate',
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
                            },'详情')
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
            this.pageListHandler()
            /*初始化图片上传地址*/
            this.uploadUrl = this.$http.defaults.baseURL+'/img/upload'
        }
    }
</script>
