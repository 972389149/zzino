<!-- <p>作者：22c<br>email: 535377683@qq.com<br>2017-8-26</p> -->
<template id="select-group">

  <div id="select-group">
    <div class="my-select" v-for="(selected,index) in SArr">
      <input type="button" v-model="SArr[index]"
       class="selected" @click="clickS(index)" @blur="showOpts = []">
      <ul v-show="showOpts[index] === true">
        <li v-for="option in OptsArr[index]"
         @mousedown="changeS(index, option.text, option.value)">{{ option.text }}</li>
      </ul>
    </div>

    <!-- <div style="position:absolute;top:0;left:0;">{{fortest}}</div>
    <div style="position:absolute;top:20px;left:0;">{{fortest2}}</div> -->
  </div>
</template>

<script>
export default {
  name: 'select-group',
  props: ['selText', 'optData'],
  data () {
    return {
      OptsArr: [],
      showOpts: [],
      SArr: []
    }
  },
  components: {
  },
  methods: {
    changeS: function (index, text, value) {
      // 等价于：this.SArr[index] = text
      this.$set(this.SArr, index, text)
      this.showOpts[index] = false
      this.$emit('returnSel', index, value)
    },
    clickS: function (index) {
      this.showOpts = []
      // 等价于：this.showOpts[index] = true
      this.$set(this.showOpts, index, true)
    }
  },
  mounted () {
    // 待加一些安全性的判断：
    this.SArr = this.selText
    this.OptsArr = this.optData
  },
  computed: {
    // fortest: function () {
    //   return JSON.stringify(this.showOpts)
    // },
    // fortest2: function () {
    //   return JSON.stringify(this.SArr)
    // }
  }
}

// 拓展阅读：
// http://blog.csdn.net/ligang2585116/article/details/51764828
// http://www.cnblogs.com/wmx--/p/4387651.html
// https://segmentfault.com/q/1010000002697363?_ea=181848
</script>

<style scoped>
.my-select {
  float: left;
  position: relative;
  display: inline-block;
  
  margin-right: 10px;

  /*为了不被后面创建的元素挡住：*/
  z-index: 9;
}
/*my-select的默认样式：*/
.my-select .selected {
  box-sizing: border-box;
  height: 32px;
  width: 100px;
  padding: 0 0 0 20px;
  margin: 0;
  border: 2px solid #aeaeae;
  font-size: 14px;
  color: #333;
  background: #fff url(./img/pull.png) no-repeat 80px 12px;
  cursor: pointer;
  line-height:22px;
  outline: none;
  text-align: left;
}
.my-select .selected:focus {
  border: 2px solid #00aa7a;
}
.my-select ul {
  /*在vue里面不行，数据传不到data那里，只能用v-show：*/
  /*display: none;*/
  /*visibility: hidden;*/
  overflow: hidden;
  width: 96px;
  padding: 5px 0;
  position: absolute;
  top: 34px;
  left: 0;
  color: #333;
  font-size: 14px;
  /*未设定：*/
  border: 1px solid #cecece;
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
  background: white;

  /*margin: 2px 0 0 0;*/
  margin: 0;
}
.my-select ul li {
  padding: 3px 20px;
  margin: 0;
  cursor: pointer;
}
.my-select ul li:hover {
  background-color: #e9f7fc;
}
</style>
