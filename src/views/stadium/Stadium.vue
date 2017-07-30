<!--场馆页面-->
<style scoped rel="stylesheet/scss" lang="scss">
  .stadium_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .stadium_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .stadium_page {
    line-height: 60px;
  }
</style>
<template>
  <div>
    <div class="stadium_header">
      <div class="stadium_title">
        场馆
      </div>
      <div class="member_search">
        <Input v-model="key" placeholder="请输入场馆名" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search" @click="searchHandler()">搜索</Button>
        <Button type="primary" icon="plus" @click="stadiumAddHandler()">创建</Button>
      </div>
    </div>
    <Table :columns="stadiumColumns" :data="stadiumList"></Table>
    <div class="stadium_page">
      <Page :total="page.total" :current="page.pageNo" :page-size="page.pageSize"
            @on-change="pageChangeHandler($event)"></Page>
    </div>
    <!--修改模态-->
    <Modal title="修改场馆" v-model="detailFlag" >
      <Form ref="stadiumForm" :model="stadiumForm" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="16">
          <Form-item label="名称" prop="name">
            <Input v-model="stadiumForm.name" placeholder="清输入场馆名称"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="18">
          <Form-item label="地址" prop="address">
            <Input v-model="stadiumForm.address" placeholder="清输入场馆地址"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="10">
          <Form-item label="城市" prop="city">
            <Select v-model="stadiumForm.city" placeholder="请选择所在地">
              <Option value="110000">北京市</Option>
              <Option value="310000">上海市</Option>
              <Option value="440300">深圳市</Option>
            </Select>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="10">
          <Form-item label="状态" prop="status">
            <Radio-group v-model="stadiumForm.status">
              <Radio label="1">启用</Radio>
              <Radio label="0">停用</Radio>
            </Radio-group>
          </Form-item>
          </Col>
        </Row>
        <Form-item :label-width="1" prop="content">
          <!--富文本编辑-->
          <quill-editor :content="stadiumForm.content"
                        @change="onEditorChange($event)">
          </quill-editor>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" @click="submit('stadiumForm')">保存</Button>
      </div>
    </Modal>
    <!--Prompt提示框-->
    <Modal v-model="open" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="removeConfirmHandler()">删除</Button>
      </div>
    </Modal>
  </div>

</template>
<script>
    export default {
        data(){
            return {
                stadiumList: [],
                key: '',
                page: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                open: false,
                removeId: '',
              /*场馆详情表单对象*/
                stadiumForm: {
                    status: '1',
                    name: '',
                    address: '',
                    city: '',
                    content: '<h2>场馆描述</h2>'
                },
                ruleValidate: {
                    name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    address: [{required: true, message: '地址不能为空', trigger: 'blur'}],
                    city: [{required: true, message: '请选择城市', trigger: 'change'}],
                    status: [{required: true, message: '请选择状态', trigger: 'change'}]
                },
                detailFlag:false
            }
        },
        computed: {
            stadiumColumns(){
                let self =this;
                let columns = []
                columns.push({
                    title: '名称',
                    key: 'name'
                });
                columns.push({
                    title: '场馆地址',
                    key: 'address',
                    width: 300
                });
                columns.push({
                    title: '创建时间',
                    key: 'createDate'
                });
                columns.push({
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.status === '1' ? 'blue' : 'red';
                        const text = row.status === '1' ? '启用' : '停用';
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
                    width: 250,
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
                                        self.openModal(params.row)
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.removeHandler(params.row.id)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                })
                return columns;
            }
        },
        methods: {
          /*打开详情模态*/
            openModal(val){
                console.log(val)
                let row = Object.assign({},val)
                row.city = String(row.city)
                this.detailFlag = !this.detailFlag
                this.stadiumForm = row;
            },
          /*富文本内容变化监听事件*/
            onEditorChange({editor, html, text}) {
                console.log(html)
                this.content = html
                this.stadiumForm.content = html
            },
          /*校验表单*/
            submit(val){
                let self = this
                //提交表单校验
                this.$refs[val].validate(function(valid){
                    if (valid) {
                        self.save()
                    } else {
                        self.$Message.error('表单验证失败')
                    }
                })
            },
            save(){
                //提交修改场馆信息
                let  self = this;
                console.log(this.stadiumForm)
                this.$http.post('/stadium/update', JSON.stringify(this.stadiumForm)).then(function (res) {
                    let data = res;
                    if (data.result == 1) {
                        self.$Message.success('修改场馆成功')
                        self.detailFlag =!self.detailFlag
                        self.pageListHandler();
                    } else {
                        self.$Message.error('修改场馆失败')
                    }
                })
            },
          /*分页*/
            pageListHandler(){
                let self = this;
                //查询列表事件
                let url = "/stadium/list?pageNo=" + this.page.pageNo + "&pageSize=" + this.page.pageSize + "&key=" + this.key;
                this.$http.get(url).then(res=> {
                    self.stadiumList = res.data;
                    self.page.total = res.total
                })
            },
            pageChangeHandler(event){
                //分页事件
                this.page.pageNo = event
                this.pageListHandler()
            },
            searchHandler(){
                //搜索事件
                this.pageListHandler();
            },
          /*创建场馆*/
            stadiumAddHandler(){
                //创建场馆事件
                this.$router.push('stadiumAdd');
            },
            removeHandler(data){
                //删除事件
                console.log(data)
                this.removeId = data
                this.open = true
            },
            removeConfirmHandler(){
                let self = this;
                this.open = !this.open
                this.$http.post('/stadium/del?id=' + this.removeId).then(res=> {
                    console.log('返回结果')
                    if(res.result==1){
                        self.$Message.success(res.data)
                        self.pageListHandler()
                    }else{
                        self.$Message.error(res.data)
                    }
                })
            }
        },
        created(){
            this.pageListHandler();
        }
    }
</script>
