<!--Prompt提示框-->
<style>

</style>
<template>
  <div>
    <Modal v-model="show" width="360" :onCancel="cancel()">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    props:['show'],
    methods:{
      del(){

      },
      cancel(){
        console.log('取消')
        this.$emit('closeModal',false)
      }
    },
    computed:{

    }
  }
</script>
