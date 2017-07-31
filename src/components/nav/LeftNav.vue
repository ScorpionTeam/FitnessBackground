<template>
  <div>
    <Menu :theme="theme3" active-name="member" @on-select="click">
      <Menu-item name="member">
        <Icon type="person" size="20"></Icon>
        会员
      </Menu-item>
      <Menu-item name="private-class">
        <Icon type="android-walk" size="20"></Icon>
        私教
      </Menu-item>
      <Menu-item name="group-class">
        <Icon type="android-bicycle" size="20"></Icon>
        团体
      </Menu-item>
      <Menu-item name="coach">
        <Icon type="ios-people" size="20"></Icon>
        教练
      </Menu-item>
      <Menu-item name="vip">
        <Icon type="card" size="20"></Icon>
        VIP
      </Menu-item>
      <Menu-item name="stadium">
        <Icon type="ios-home" size="20"></Icon>
        场馆
      </Menu-item>
      <Menu-item name="activity">
        <Icon type="ios-game-controller-b" size="20"></Icon>
        活动
      </Menu-item>
      <Menu-item name="news">
        <Icon type="chatbubble-working" size="20"></Icon>
        新闻
      </Menu-item>
      <Menu-item name="meal">
        <Icon type="fork" size="20"></Icon>
        餐饮
      </Menu-item>
      <Menu-item name="impression">
        <Icon type="star" size="20"></Icon>
        印象
      </Menu-item>
      <Menu-item name="statistics">
        <Icon type="stats-bars" size="20"></Icon>
        统计
      </Menu-item>
      <Menu-item name="picture">
        <Icon type="image" size="20"></Icon>
        图片
      </Menu-item>
    </Menu>
  </div>

</template>
<script>
  export default {
    data () {
      return {
        theme3: 'light'
      }
    },
    methods: {
      click(val){
        console.log(val)
        this.$router.push(val)
      }
    }
  }
</script>
