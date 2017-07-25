<style scoped rel="stylesheet/scss" lang="scss">
    .login_header {
        height: 200px;
        line-height: 200px;
        background: #2d8cf0;
    }

    .login_header .login_title {
        text-align: center;
        font-size: 30px;
        color: #fff;
    }

    .login_body .login_form {
        padding: 40px 40%
    }

</style>
<template>
    <div>
        <div class="login_header">
            <div class="login_title">
                互动健身
            </div>
        </div>
        <div class="login_body">
            <div class="login_form">
                <Form ref="formInline" :model="formInline" :rules="ruleInline">
                    <Form-item prop="account">
                        <Input type="text" v-model="formInline.account" placeholder="账号">
                        <Icon type="ios-person-outline" slot="prepend" size="20"></Icon>
                        </Input>
                    </Form-item>
                    <Form-item prop="password">
                        <Input type="password" v-model="formInline.password" placeholder="密码">
                        <Icon type="ios-locked-outline" slot="prepend" size="20"></Icon>
                        </Input>
                    </Form-item>
                    <Form-item>
                        <Button size="large" type="primary" @click="handleSubmit('formInline')" long>登录</Button>
                    </Form-item>
                </Form>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                formInline: {
                    account: '',
                    password: ''
                },
                ruleInline: {
                    account: [
                        {required: true, message: '请填写用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请填写密码', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                let self = this;
                this.$refs[name].validate((valid)=>{
                    if (valid) {
//                        self.$http.post('/sys/user/login', JSON.stringify(self.formInline)).then(function (res) {
//                            if (res.result==1){
//                                self.$store.commit('login',res.data);
//                                self.$router.push({path:'/'})
//                            }else {
//                                self.$Message.error(res.error.message);
//                            }
//                        })
                      this.loginCheck()
                    } else {
                        self.$Message.error('请将账号密码填写完整!');
                    }
                })
            },
            /*登录校验*/
            loginCheck(){
              this.$router.push('/index')
//                if(localStorage.getItem('oauth')){
//                    this.$router.push({name:'index'})
//                }
            }
        },
        created(){
        }
    }
</script>
