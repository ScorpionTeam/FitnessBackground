<!--新增场馆-->
<style scoped rel="stylesheet/scss" lang="scss">
  .stadium_add_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .stadium_add_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .stadium_add_content {
    overflow: hidden;
    .content {
      width: 50%;
      float: left;
    }
    .preview {
      width: 50%;
      float: left;
    }
  }

  .stadium_add_btn {
    float: left;
    width: 100%;
    text-align: left;
    padding-left: 20%;
    padding-top: 20px;
  }
</style>
<template>
  <div>
    <div class="stadium_add_header">
      <div class="stadium_add_title">
        创建场馆
      </div>
    </div>
    <div class="stadium_add_content">
      <div class="content">
        <div class="stadium_form">
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
              <vue-html5-editor :content="stadiumForm.content" :height="300"
                                :z-index="2" @change="onEditorChange">

              </vue-html5-editor>
            </Form-item>
          </Form>
        </div>
      </div>
      <div class="preview">
        <div class="html ql-editor" v-html="stadiumForm.content"></div>
      </div>
    </div>
    <div class="stadium_add_btn">
      <Button type="primary" size="large" @click="submit('stadiumForm')">保存</Button>
    </div>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                name: 'base-example',
                editorOption: {},
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
                }
            }
        },
        methods: {
            onEditorChange(html) {
                console.log(html);
                this.content = html
                this.stadiumForm.content = html
            },
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
                //保存场馆信息
                let  self = this;
                console.log(this.stadiumForm)
                this.$http.post('/stadium/add', JSON.stringify(this.stadiumForm)).then(function (res) {
                    let data = res;
                    if (data.result == 1) {
                        self.$Message.success('创建场馆成功')
                        self.$refs['stadiumForm'].resetFields()
                    } else {
                        self.$Message.error('创建场馆失败')
                    }
                })
            }
        }
    }
</script>
