<style scoped rel="stylesheet/scss" lang="scss">
  .group_class_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .group_class_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .main_content {
    padding: 0 20px;
  }
  .group_class_add_btn{
    float: left;
    width: 100%;
    text-align: left;
    padding-left: 20%;
    padding-top: 20px;
  }
</style>
<template>
  <div>
    <div class="group_class_header">
      <div class="group_class_title">
        创建团课
      </div>
    </div>
    <div class="main_content">
      <Form ref="groupClassForm" :model="groupClassForm" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="8">
          <Form-item label="名称" prop="name">
            <Input v-model="groupClassForm.name" placeholder="请输入名称"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="总人数" prop="total">
            <Input v-model="groupClassForm.total" placeholder="请输入总人数" number></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="剩余人数" prop="surplusNum">
            <Input v-model="groupClassForm.surplusNum" placeholder="请输入剩余人数" number></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <Form-item label="课程时长" prop="timeTotal">
            <Input v-model="groupClassForm.timeTotal" placeholder="请输入课程时长" number></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="场馆" prop="stadiumId">
              <Select v-model="groupClassForm.stadiumId" placeholder="请选择场馆" @on-change="stadiumChangeHandler()">
                <Option :value="item.id" :key="item.id" v-for="item in stadiumList">{{item.name}}</Option>
              </Select>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="教练" prop="coachId">
            <Select v-model="groupClassForm.coachId" placeholder="请选择教练">
              <Option :value="item.id" :key="item.id" v-for="item in coachList">{{item.name}}</Option>
            </Select>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <Form-item label="选择日期">
            <Row>
              <Col span="11">
              <Form-item prop="startDate">
                <Date-picker type="date" placeholder="选择日期" v-model="groupClassForm.startDate"></Date-picker>
              </Form-item>
              </Col>
              <Col span="2" style="text-align: center">
              -</Col>
              <Col span="11">
              <Form-item prop="endDate">
                <Date-picker type="date" placeholder="选择日期" v-model="groupClassForm.endDate"></Date-picker>
              </Form-item>
              </Col>
            </Row>
          </Form-item>
          </Col>
          <Col span="16">
          <Form-item label="上课地址" prop="address">
            <Input v-model="groupClassForm.address" placeholder="请输入上课地址"></Input>
          </Form-item>
          </Col>
        </Row>
      </Form>
      <div class="group_class_add_btn">
        <Button type="primary" @click="submit('groupClassForm')">保存</Button>
      </div>
    </div>
  </div>
</template>
<script>
    export default{
        data(){
            return {
                groupClassForm: {
                    name:'',
                    total:'',
                    surplusNum:'',
                    timeTotal:'',
                    stadiumId:'',
                    startDate:'',
                    endDate:'',
                    address:''
                },
                ruleValidate: {
                    name:[{required:true,message:'请输入名称',trigger:'blur'}],
                    total:[{type:'number',required:true,message:'请输入人数',trigger:'blur'}],
                    surplusNum:[{type:'number',required:true,message:'请输入剩余人数',trigger:'blur'}],
                    timeTotal:[{type:'number',required:true,message:'请输入时长',trigger:'blur'}],
                    stadiumId:[{type:'number',required:true,message:'请选择场馆',trigger:'change'}],
                    coachId:[{type:'number',required:true,message:'请选择教练',trigger:'change'}],
                    startDate:[{type:'date',required:true,message:'请选择开课日期',trigger:'change'}],
                    endDate:[{type:'date',required:true,message:'请选择结束日期',trigger:'change'}]
                },
                stadiumList:[],
                coachList:[]
            }
        },
        methods:{
            //查询场馆列表
            stadiumListHandler(){
                this.$http.get('/stadium/allStadium').then(res=>{
                    this.stadiumList=res.data
                })
            },
            //根据场馆查询教练
            coachListHandler(){
                this.$http.get('/coach/coachListByStadiumId?stadiumId='+this.groupClassForm.stadiumId).then(res=>{
                    this.coachList=res.data
                })
            },
            //选择场馆事件
            stadiumChangeHandler(){
                this.coachListHandler()
            },
            //提交按钮事件
            submit(){
                let self = this;
                console.log(this.groupClassForm)
                self.$refs['groupClassForm'].validate(function (valid) {
                    if(valid){
                        self.$http.post('/groupClass/add',JSON.stringify(self.groupClassForm)).then(function (res) {
                            if(res.result==1){
                                self.$Message.success('创建团课成功')
                                self.$refs['groupClassForm'].resetFields();
                            }else{
                                self.$Message.error('创建团课失败')
                            }
                        })
                    }else {
                        self.$Message.error('请将表单填写完整')
                    }
                })
            }
        },
        created(){
            this.stadiumListHandler()
        }
    }
</script>
