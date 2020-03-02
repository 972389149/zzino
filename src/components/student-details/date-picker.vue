<!--author: Erin 郭冬虹-->
<template>
	<div id='data-picker'>
		<div class="block">
			<span class="demonstration">日期</span>
			<el-date-picker
				v-model="value"
				align="right"
				type="daterange"
				placeholder="选择日期"
				:picker-options="pickerOptions"
				@change='sendValToFather'>
			</el-date-picker> 
		 </div>
	</div>
</template>
<script>
	import { DatePicker } from 'element-ui'
	import Vue from 'vue'
	Vue.use(DatePicker);
	export default {
		name: 'data-picker',
		props:['date'],
		data() {
			return {
				pickerOptions: {
					shortcuts: [
						{
			            text: '最近一周',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
			              picker.$emit('pick', [start, end]);
			            }
			          }, {
			            text: '最近一个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
			              picker.$emit('pick', [start, end]);
			            }
			          }, {
			            text: '最近三个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
			              picker.$emit('pick', [start, end]);
			            }
			          }
					]
				},
				value: '',
				date:"ssss"
			};
		},
		methods:{
			sendValToFather: function(val){  
				this.$emit('dataFromPicker',val);	//将日期值传到父组件StudentDetails
			}
		}
	};
</script>
