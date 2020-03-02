<template id="data-picker">
<div>
  <div class="block">
    <span class="demonstration">日期:</span>
    <el-date-picker
      v-model="value"
      type="date"
      placeholder="选择日期"
      format="yyyy-MM-dd"
      @change="ChangeDate">
    </el-date-picker>
  </div>
</div>
</template>

<script>
  import { DatePicker } from 'element-ui'
  import Vue from 'vue'
  Vue.use(DatePicker);
  export default {
    name:'data-picker',  
    data() {
      return {
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        value: ''
      };
    },
    methods:{
        ChangeDate:function(date){
          this.value = date;
          this.$emit('ievent',this.value);
        }
    }
  };
</script>
<style scoped>    
/*当前样式仅作用于当前节点*/
.demonstration{
  display: inline-block;
  margin-left: 10px;
}
</style>