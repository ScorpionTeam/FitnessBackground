<style scoped rel="stylesheet/scss" lang="scss">
  .activity_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .activity_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .activity_page {
    line-height: 60px;
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
  <div class="activity_header">
    <div class="activity_title">
      创建活动
    </div>
  </div>
  <div>
    <Form ref="activityForm" :model="activityForm" label-position="right" :rules="ruleValidate" :label-width="80">
      <Row>
        <Col span="8">
        <Form-item label="名称" prop="name">
          <Input v-model="activityForm.name" placeholder="请输入名称"></Input>
        </Form-item>
        </Col>
        <Col span="8">
        <Form-item label="场馆" prop="stadiumId">
          <Select v-model="activityForm.stadiumId" placeholder="请选择场馆">
            <Option :value="item.id" :key="item.id" v-for="item in stadiumList">{{item.name}}</Option>
          </Select>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="8">
        <Form-item label="开始">
          <Row>
            <Col span="16">
            <Form-item prop="startDate">
              <Date-picker type="date" placeholder="选择日期" v-model="activityForm.startDate"></Date-picker>
            </Form-item>
            </Col>
          </Row>
        </Form-item>
        </Col>
        <Col span="8">
        <Form-item label="结束">
          <Row>
            <Col span="16">
            <Form-item prop="endDate">
              <Date-picker type="date" placeholder="选择日期" v-model="activityForm.endDate"></Date-picker>
            </Form-item>
            </Col>
          </Row>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="8">
        <Form-item label="排序" prop="sort">
          <Input v-model="activityForm.sort" placeholder="请输入名称"></Input>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="8">
        <Form-item label="状态" prop="status">
          <!--
          1进行中  0 已结束  2 未开始
          -->
          <Radio-group v-model="activityForm.status">
            <Radio label="1">正常</Radio>
            <Radio label="0">失效</Radio>
          </Radio-group>
        </Form-item>
        </Col>
        <Col span="6">
        <Form-item label="置顶" prop="showHome">
          <Radio-group v-model="activityForm.showHome">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </Radio-group>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="15" offset="1">
        <!--富文本编辑-->
        <quill-editor :content="activityForm.content"
                      :options="editorOption"
                      @change="onEditorChange($event)">
        </quill-editor>
        </Col>
      </Row>
    </Form>
  </div>
  <div class="stadium_add_btn">
    <Button type="primary" size="large" @click="submit('activityForm')">保存</Button>
  </div>
</div>
</template>
<script>
  export default{
    data(){
      return {
        activityForm:{
          status:'2',
          showHome:'0'
        },
        ruleValidate:{},
        editorOption:{},
        stadiumList:[]
      }
    },
    methods:{
      //富文本改变事件
      onEditorChange({editor, html, text}){
        this.activityForm.content=text
        this.activityForm.contentHtml=html
      },
      //查询场馆列表
      stadiumListHandler(){
        this.$http.get('/stadium/allStadium').then(res=>{
          this.stadiumList=res.data
        })
      },
      submit(val){
        this.$http.post('/activity/add',JSON.stringify(this.activityForm)).then(res=>{
          console.log(res)
        })
      }
    },
    created(){
      this.stadiumListHandler()
    }
  }
</script>
