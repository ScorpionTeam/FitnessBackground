<!--会员注册页面-->

<style scoped rel="stylesheet/scss" lang="scss">
  .register_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #bbbec4;
    .register_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .content {
    margin-top: 20px;
    padding: 0 20px;
  }
</style>
<template>
  <div>
    <div class="register_header">
      <div class="register_title">
        注册
      </div>
    </div>
    <div class="content">
      <Form ref="memberForm" :model="memberForm" :rules="memberValidate" :label-width="80">
        <Row>
          <Col span="8">
          <img src="" alt="头像" style="height: 140px;width: 140px;">
          </Col>
          <Col span="8">
          <Form-item label="姓名" prop="name">
            <Input v-model="memberForm.name" placeholder="请输入姓名"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="手机" prop="phone">
            <Input v-model="memberForm.phone" placeholder="请输入手机"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="生日" prop="bornDate">
            <Date-picker style="width:250px;" type="date" placeholder="选择日期" v-model="memberForm.bornDate"></Date-picker>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="联系电话" prop="tel">
            <Input v-model="memberForm.tel" placeholder="请输入联系电话"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="年龄" prop="age">
            <Input v-model="memberForm.age" placeholder="请输入年龄"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="昵称" prop="mail">
            <Input v-model="memberForm.mail" placeholder="请输入昵称"></Input>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="状态" prop="status">
            <Select v-model="memberForm.status" placeholder="请选择状态">
              <Option value="1">正常</Option>
              <Option value="2">审核不通过</Option>
              <Option value="3">注销</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="场馆" prop="stadiumId">
            <Select v-model="memberForm.stadiumId" placeholder="请选择场馆" @on-change="stadiumChangeHandler()">
              <Option :value="stadium.id" :key="stadium.id" v-for="stadium in stadiumList">{{stadium.name}}</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="邮箱" prop="email">
            <Input v-model="memberForm.email" placeholder="请输入邮箱"></Input>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="证件号码" prop="identityCard">
            <Input v-model="memberForm.identityCard" placeholder="请输入证件号码"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="6">
          <Form-item label="会员卡" prop="memberCardId">
            <Select v-model="memberForm.memberCardId" placeholder="请选择会员卡">
              <Option :value="card.id" :key="card.id" v-for="card in memberCardList">{{card.typeName}}-{{card.money}}</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="性别" prop="sex">
            <Select v-model="memberForm.sex" placeholder="请选择性别">
              <Option value="1">男</Option>
              <Option value="0">女</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="备注" prop="remark">
            <Input v-model="memberForm.remark" placeholder="请输入备注"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <Form-item label="联系地址" prop="address">
            <Input v-model="memberForm.address" placeholder="请输入联系地址"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="8" offset="8">
          <Button type="primary" long @click="submitValidate('memberForm')">确定</Button>
          </Col>
        </Row>
      </Form>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        memberForm: {
          name:'',
          phone:'',
          tel:'',
          status:'1',
          sex:'1',
          stadiumId:'',
          memberCardId:''
        },
        memberValidate: {
          name:[{required:true,message:'请输入姓名',trigger:'blur'}],
          phone:[{required:true,message:'请输入手机号',trigger:'blur'}],
          tel:[{required:true,message:'请输入联系电话',trigger:'blur'}],
          status:[{required:true,message:'请选择状态',trigger:'change'}],
//          stadiumId:[{required:true,message:'请选择场馆',trigger:'change'}],
          identityCard:[{required:true,message:'请输入证件号码',trigger:'blur'}],
//          memberCardId:[{required:true,message:'请选择会员卡',trigger:'change'}],
          sex:[{required:true,message:'请选择性别',trigger:'change'}]
        },
        stadiumList: [],
        memberCardList: [],

      }
    },
    methods: {
      stadiumListHandler(){
        this.$http.get('/stadium/allStadium').then(res=> {
          this.stadiumList = res.data
        })
      },
      memberCardListHandler(){
        this.$http.get('/memberCard/cardList?stadiumId='+this.memberForm.stadiumId).then(res=>{
          this.memberCardList=res.data
        })
      },
      stadiumChangeHandler(){
        this.memberCardListHandler()
      },
      submitValidate(val){
        this.$refs[val].validate((valid)=>{
          if(valid){
            this.register()
          }
        })
      },
      register(){
        this.$http.post('/member/register',JSON.stringify(this.memberForm)).then(res=>{
          if(res.result==1){
            this.$Message.success('注册成功')
          }else{
            console.log(res)
          }
        })
      }
    },
    created(){
      this.stadiumListHandler()
    }
  }
</script>
