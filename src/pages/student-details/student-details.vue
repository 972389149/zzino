<!-- @author: Erin 郭冬虹 -->
<template id='student-details'>
	<div>
		<div>
			<!-- 头部 -->
			<div class='header'>
				<div @click='toHomePage' title='点击返回'>
					<span>返回</span>
				</div>
			</div>
			<!-- 主体内容 -->
			<div class='stu_details_container' :style="{height: height + 'px' }">
				<!-- 边栏信息 -->
				<div class='stu_details_sideBar' :style="{height: height-40 + 'px' }">
					<img class='stu_avatar' src=''>
					<table class='stu_info' cellspacing="10">
						<tr>
						  <th colspan="2">{{stuInfo.stuName}}</th>
						</tr>
						<tr>
							<td>班级</td>
							<td>{{stuInfo.stuClass}}</td>
						</tr>
						<tr>
							<td>学号</td>
							<td>{{stuInfo.stuId}}</td>
						</tr>
						<tr>
							<td>座位</td>
							<td>{{stuInfo.RowCount}}行 - {{stuInfo.ColumnCount}}列</td>
						</tr>
					</table>
				</div>
				<!-- 具体内容显示区 -->
				<div class='stu_details_content'>
					<!-- 日期选择器 -->
					<date-picker 
						class='datePicker'
						@dataFromPicker='setDateToSend'>
					</date-picker>

						<div 
							class='type_btn detail_cartogram' 
							@click="changeTab(1)"
							:class="{type_btn_active: isActive.active1}">
							<span class='btn_bg1'
								 :class="{changeBg1: isActive.changeBg1}" @click='change(1)'>
								回答分布
							</span>
						</div>
						<div 
							class='type_btn detail_list'
							@click="changeTab(2)"
							:class="{type_btn_active: isActive.active2}">
							<span 
								class='btn_bg2'
								:class="{changeBg2: isActive.changeBg2}" @click='change(0)'>
								回答记录
							</span>
						</div>
					<detail-cartogram 
						class='noView'
						:param='dataTosend'
						:class='{view:isActive.changeBg1}'
						ref='cartogram'>
					</detail-cartogram>
					<detail-list 
						class='noView' 
						:param='dataTosend' 
						:class='{view:isActive.changeBg2}'
						ref='list'>
					</detail-list>
				</div>
			</div>
		</div>
	</div>	
</template>


<script>
	import datePicker from '@/components/student-details/date-picker.vue'
	import detailCartogram from'@/components/student-details/detail-cartogram'
	import detailList from '@/components/student-details/detail-list'
	import Router from 'vue-router'
	export default{
		name: 'student-details',
		data () {
			return{
				height:'',
				stuInfo: [{
					stuName:'',
					stuClass:'',
					stuId:'',
					ColumnCount:'',	//座位的列号
					RowCount:''		//座位的行号
				}],
				isActive:{
					active1: true,
					active2: false,
					changeBg1: true,
					changeBg2: false
				},
				dataTosend:{	//获取详情信息需要的参数
					stuId:'',
					dateTimefirst:'',
					dateTimesecond:''
				},
				changes:'1'       //判断点击打开的内容
			}
		},
		methods: {
			change:function(s){
				this.changes=s
			},
			getStuInfo: function () {
				this.stuInfo.stuName = this.$route.query.stuName;
				this.stuInfo.stuId  = this.$route.query.stuId;
				this.stuInfo.ColumnCount  = this.$route.query.ColumnCount;
				this.stuInfo.RowCount  = this.$route.query.RowCount;
				//顺便将stuId写进dataTosend.stuId
				this.dataTosend.stuId  = this.$route.query.stuId;
				this.stuInfo.stuClass=this.$route.query.Grade + this.$route.query.Class;
			},
    		getShowHeight: function () {
    			//获取内容展示区的高度
    			// let header = document.getElementsByClassName('header')[0];
    			// let hearderH = header.clientHeight; 
      			this.height = window.innerHeight ;
    		},
    		changeTab: function(num){//改变按钮切换时的样式
    			let btn = document.getElementsByClassName('type_btn');
    			let actObj = this.isActive;
    			if(num === 1){
    				
    				actObj.active1 = true;
    				actObj.changeBg1 =true;
    				actObj.active2 = false;
    				actObj.changeBg2 =false;

    			}else if(num === 2){

    				actObj.active1 = false;
    				actObj.changeBg1 = false;
    				actObj.active2 = true;
    				actObj.changeBg2 = true;

    			}
    		},
    		setDateToSend: function(dateVal){
    		    dateVal=dateVal+""
    			//改变日期以后设置要传给后台的参数并触发子组件上的事件,加载数据
    			if(dateVal!=undefined){
    				console.log(1111)
    				console.log(typeof(dateVal))
    				console.log(dateVal)
    				this.dataTosend.dateTimefirst = dateVal.substring(0,10);
    				this.dataTosend.dateTimesecond = dateVal.substring(13,23);
    				console.log(this.dataTosend.dateTimefirst)
    				console.log(this.dataTosend.dateTimesecond)
    				// if(this.changes==1){
    				this.$refs.cartogram.getData(this.dataTosend);
    				// }else{
    				this.$refs.list.getData(this.dataTosend);
    				// }
    			}
    		},
    		toHomePage: function(){
    			this.$router.push('/home/student-manage');
    		},
    		getNowFormatDate:function(){
    			var date = new Date();
		        var seperator1 = "-";
		        var year = date.getFullYear();
		        var month = date.getMonth() + 1;
		        var strDate = date.getDate();
		        if (month >= 1 && month <= 9) {
		            month = "0" + month;
		        }
		        if (strDate >= 0 && strDate <= 9) {
		            strDate = "0" + strDate;
		        }
		        var currentdate = year + seperator1 + month + seperator1 + strDate;
		        return currentdate;
    		}
  		},
  		mounted () {
  			// IS_DEV && console.log(this.$route.query);
  			this.getStuInfo();
  			this.getShowHeight();
  		    this.dataTosend.dateTimefirst=this.getNowFormatDate();
  		    this.dataTosend.dateTimesecond=this.getNowFormatDate();
  			this.$refs.cartogram.getData(this.dataTosend);
  			this.$refs.list.getData(this.dataTosend);
  		},
  		components: {
  			datePicker: datePicker,
  			detailCartogram: detailCartogram,
  			detailList: detailList
  		}
	}
</script>

<style lang="css" scoped>
@import './student-details.css'
</style>