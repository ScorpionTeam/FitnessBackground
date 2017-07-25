<style scoped rel="stylesheet/scss" lang="scss">
    .header{
        height: 60px;
        width: 100%;
        background: #1c2438;
      span{
        display: inline-block;
        color: #fff;
        font-size: 30px;
        line-height: 56px;
        float: left;
        margin-left: 30px;
        font-weight: bold;
      }
    }
</style>
<template>
    <div class="header">
        <span>互动健身</span>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                theme1: 'dark'
            }
        }
    }
</script>
