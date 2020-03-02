<template  id="data-picker">
<div>
  <div class="block">
    <span class="demonstration">开始上课时间：</span>
    <el-date-picker
      v-model="value"
      type="date"
      placeholder="选择日期"
      format="yyyy-MM-dd"
      @change="selectDate">
    </el-date-picker>
  </div>
</div>
</template>

<script>
   import { DatePicker } from 'element-ui'
   import Vue from 'vue'
   Vue.use(DatePicker);
  export default {
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
        value: '',
      };
    },
    mounted(){
      
    },
    methods:{
      selectDate:function(date){
         var dataTime=date
         // console.log(dataTime)
         this.$emit("ievent",dataTime)
      }
    }  
  };
</script>
<style scoped>
.block{
  height: 50px;
}
.demonstration{
  margin-left: 30px;
}
</style>