
<!--会员页面-->
<style scoped rel="stylesheet/scss" lang="scss">
  .member_header {
    width: 100%;
    height: 56px;
    line-height: 56px;
    .member_title {
      float: left;
      font-size: 20px;
      padding-left: 34px;
    }
  }

  .page {
    line-height: 60px;
    float: left;
    padding-left: 40px;
  }
</style>
<template>
  <div>
    <div class="member_header">
      <div class="member_title">
        会员
      </div>
      <div class="member_search">
        <Input placeholder="请输入会员账号或姓名" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search">搜索</Button>
        <Button type="primary" icon="plus" @click="toRegister()">注册</Button>
      </div>
    </div>
    <Table :columns="memberColumns" :data="memberList"></Table>
    <div class="page">
      <Page :total="page.total" :current="page.pageNo" :page-size="page.pageSize"
            @on-change="pageChangeHandler($event)"></Page>
    </div>

    <!--选择会员卡-->
    <!--<Modal title="选择会员卡" width="200" v-model="memberCardModal" :closeable="false" :mask-closable="false">-->
      <!--<Select v-model="memberCard" placeholder="请选择">-->
        <!--<Option :value="item.id" :key="item.id" v-for="item in memberCardList">{{item.typeName}}-{{item.money}}</Option>-->
      <!--</Select>-->
      <!--<div slot="footer">-->
        <!--<Button type="primary" @click="bindMemberCard">确定</Button>-->
      <!--</div>-->
    <!--</Modal>-->


    <!--修改会员信息-->
    <Modal title="会员" v-model="memberInfoModal" :closeable="false" :mask-closable="false">
      <Form ref="member" :model="member" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="4">
          <img src="" alt="头像" style="width: 80px;height: 80px;">
          </Col>
          <Col span="10">
          <Form-item label="手机" prop="phone">
            <Input v-model="member.phone" placeholder="请输入手机号"></Input>
          </Form-item>
          </Col>
          <Col span="10">
          <Form-item label="姓名" prop="name">
            <Input v-model="member.name" placeholder="请输入姓名"></Input>
          </Form-item>
          </Col>
          <Row>
            <Col span="10">
            <Form-item label="场馆" prop="mail">
              <Input v-model="member.mail" placeholder="请输入邮箱"></Input>
            </Form-item>
            </Col>
          </Row>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" >确定</Button>
      </div>
    </Modal>

    <!--Prompt提示框-->
    <Modal v-model="open" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>注销确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续此操作？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="cancelMemberOkHandler()">删除</Button>
      </div>
    </Modal>



    <!--会员修改模态-->
    <Modal title="会员修改" v-model="modifyModal" width="1000">
      <Form ref="modifyMember" :model="modifyMember" :rules="modifyValidate" :label-width="80">
        <Row>
          <Col span="8">
          <img src="" alt="头像" style="height: 140px;width: 140px;">
          </Col>
          <Col span="8">
          <Form-item label="姓名" prop="name">
            <Input v-model="modifyMember.name" placeholder="请输入姓名"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="手机" prop="phone">
            <Input v-model="modifyMember.phone" placeholder="请输入手机"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="生日" prop="bornDate">
            <Date-picker style="width:250px;" type="date" placeholder="选择日期" v-model="modifyMember.bornDate"></Date-picker>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="联系电话" prop="tel">
            <Input v-model="modifyMember.tel" placeholder="请输入联系电话"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="年龄" prop="age">
            <Input v-model="modifyMember.age" placeholder="请输入年龄"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="昵称" prop="mail">
            <Input v-model="modifyMember.mail" placeholder="请输入昵称"></Input>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="状态" prop="status">
            <Select v-model="modifyMember.status" placeholder="请选择状态">
              <Option value="1">正常</Option>
              <Option value="2">审核不通过</Option>
              <Option value="3">注销</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="场馆" prop="stadiumId">
            <Select v-model="modifyMember.stadiumId" placeholder="请选择场馆" @on-change="stadiumChangeHandler()">
              <Option :value="stadium.id" :key="stadium.id" v-for="stadium in stadiumList">{{stadium.name}}</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="邮箱" prop="email">
            <Input v-model="modifyMember.email" placeholder="请输入邮箱"></Input>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="证件号码" prop="identityCard">
            <Input v-model="modifyMember.identityCard" placeholder="请输入证件号码"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="6">
          <Form-item label="会员卡" prop="memberCardId">
            <Select v-model="modifyMember.memberCardId" placeholder="请选择会员卡">
              <Option :value="card.id" :key="card.id" v-for="card in memberCardList">{{card.typeName}}-{{card.money}}</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="性别" prop="sex">
            <Select v-model="modifyMember.sex" placeholder="请选择性别">
              <Option value="1">男</Option>
              <Option value="0">女</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="备注" prop="remark">
            <Input v-model="modifyMember.remark" placeholder="请输入备注"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <Form-item label="联系地址" prop="address">
            <Input v-model="modifyMember.address" placeholder="请输入联系地址"></Input>
          </Form-item>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Row>
          <Col span="8" offset="8">
          <Button type="primary" long @click="submitValidate('memberForm')">确定</Button>
          </Col>
        </Row>

      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        memberList:[],
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        key:'',
        memberCardModal:false,
        memberCard:'',
        memberCardList:[],
        member:{},
        memberInfoModal:false,
        ruleValidate:{
        },
        open:false,
        stadiumList:[],
        memberValidate:{

        },
        modifyModal:false,
        modifyMember:{
        },
        modifyValidate: {
          name:[{required:true,message:'请输入姓名',trigger:'blur'}],
          phone:[{required:true,message:'请输入手机号',trigger:'blur'}],
          tel:[{required:true,message:'请输入联系电话',trigger:'blur'}],
          status:[{required:true,message:'请选择状态',trigger:'change'}],
          stadiumId:[{required:true,message:'请选择场馆',trigger:'change'},{type:'number'}],
          identityCard:[{required:true,message:'请输入证件号码',trigger:'blur'}],
//          memberCardId:[{required:true,message:'请选择会员卡',trigger:'change'}],
          sex:[{required:true,message:'请选择性别',trigger:'change'}]
        },
      }
    },
    methods:{
      //分页方法
      pageListHandler(){
        this.$http.get('/member/list?pageNo='+this.page.pageNo+"&pageSize="+this.page.pageSize+"&key="+this.key).then(res=>{
          console.log(res.data)
          this.memberList=res.data
          this.page.total=res.total
          this.page.pageNo=res.pageNo
        })
      },
      //页码改变事件
      pageChangeHandler(event){
        this.page.pageNo=event
        this.pageListHandler()
      },
      //打开选择会员卡模态
//      selectMemberCard(param){
//        this.member=param.row
//        this.$http.get('/memberCard/cardList?stadiumId='+param.row.stadiumId).then(res=>{
//          this.memberCardList=res.data
//        })
//        this.memberCardModal=true
//      },
      //绑定会员卡
//      bindMemberCard(){
//        console.log(this.member)
//        if(!this.memberCard){
//          this.$Message.warning('请选择会员卡类型')
//          return
//        }
//        this.member.memberCardId=this.memberCard
//        this.$http.post('/member/update',JSON.stringify(this.member)).then(res=>{
//          if(res.result==1){
//            this.$Message.success('绑卡成功')
//            this.pageListHandler()
//          }else{
//            this.$Message.error('绑卡失败')
//          }
//        })
//      },
      //跳转登录页面
      toRegister(){
        this.$router.push('register')
      },
      //注销会员打开prompt
      cancelHandler(param){
        this.member=param
        this.open=true
      },
      //确认注销操作
      cancelMemberOkHandler(){
        this.$http.post('/member/cancel?id='+this.member.id).then(res=>{
          if(res.result==1){
            this.$Message.success('注销会员成功')
            this.pageListHandler()
          }else{
            this.$Message.error('注销会员失败')
          }
        })
      },
      //修改提交先进行校验操作
      submitValidate(val){

      },
      //修改按钮操作  打开修改模态 赋值 查询场馆列表
      toModifyMember(param){
        this.memberInfoHandler(param.row.id)
        console.log('修改打印')
        console.log(param)
        this.stadiumListHandler()
        this.modifyModal=true
      },
      //选择场馆事件 调用查询会员卡事件
      stadiumChangeHandler(){
        this.memberCardListHandler()
      },
      //根据场馆id查询会员卡
      memberCardListHandler(){
        this.$http.get('/memberCard/cardList?stadiumId='+this.memberForm.stadiumId).then(res=>{
          this.memberCardList=res.data
        })
      },
      //查询场馆列表
      stadiumListHandler(){
        this.$http.get('/stadium/allStadium').then(res=> {
          this.stadiumList = res.data
        })
      },
      //根据会员id查询会员详情
      memberInfoHandler(id){
        this.$http.get('/member/memberInfo?id='+id).then(res=>{
          this.modifyMember = res.data
          console.log(this.modifyMember)
        })
      }

    },
    computed: {
      memberColumns(){
        let columns = []
        columns.push({
          title: '姓名',
          key: 'name',
          align:'center'
        });
        columns.push({
          title: '性别',
          key: 'sex',
          align:'center',
          render:(h,params)=>{
            const row = params.row
            const text = row.sex=='1'?'男':'女'
            return h('span',text)
          }
        });
        columns.push({
          title: '会员卡号码',
          key: 'memberCardNo',
          align:'center'
        });
        columns.push({
          title: '账号',
          key: 'phone',
          align:'center'
        });
        columns.push({
          title: '电话',
          key: 'tel',
          align:'center'
        });
        columns.push({
          title: '状态',
          key: 'status',
          align:'center',
          render:(h,params)=>{
            const value = params.row.status
            const text = value=='1'?'正常':value=='2'?'审核中':value=='3'?'审核不通过':'注销'
            return h('span',text)
          }
        });
        columns.push({
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (h, param)=> {
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
                    this.modifyModal=true
                    this.toModifyMember(param)
                  }
                }
              }, '修改'),
//              h('Button', {
//                props: {
//                  type: 'info',
//                  size: 'small'
//                },
//                style: {
//                  marginRight: '5px'
//                },
//                on: {
//                  click: ()=> {
//                    this.selectMemberCard(param)
//                  }
//                }
//              }, '绑卡'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.cancelHandler(param.row)
                  }
                }
              }, '注销')
            ]);
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
