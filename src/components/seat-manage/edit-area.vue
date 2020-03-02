<template id="edit-area">
  <div id="edit-area">
    <div class="wrap-edit-area">
      <fieldset>
        <label for="name">姓名：</label>
        <input id="name" type="text" v-model="stuObj.name"><br>
        <label for="name">学号：</label>
        <input id="name" type="text" v-model="stuObj.stuNum"><br>
        <label for="name">性别：</label>
        <input id="name" type="text" v-model="stuObj.sex"><br>
      </fieldset>
      <slot name="ok"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit-area',
  props: ['data'],
  data () {
    return {
      stuObj: this.data
    }
  },
  components: {
  },
  methods: {
    // formatNemit: function (stuObj) {
    //   IS_DEV && console.log('fotmat the data')
    //   this.$emit('submitEdit', stuObj)
    // }
  },
  mounted () {
  }
}
</script>

<style scoped>
/*.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}*/
.wrap-edit-area {
  position: relative;
  /*父元素的宽高由子元素来决定：*/
  /*https://segmentfault.com/q/1010000005654981*/
  float: left;
  overflow: hidden;
}
label {
  font-size: 10px;
}
fieldset {
  border: 0;
  padding: 0;
  width: 120px;
  height: 60px;
}
input[type="text"] {
  width: 54px;
  box-sizing:border-box;
  background:transparent;
  font-size:10px;
  color:red;
  text-align:center;
}
button {
  width: 14px;
  height: 14px;
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
