<!-- @author: Erin 郭冬虹 -->
<template>
	<div id='detail-list'>
		<table cellspacing='0'>
			<tbody>
				<tr>
					<th>节数</th>
					<th>课堂名称</th>
					<th>作答问题</th>
					<th>回答正误</th>
					<th>授课老师</th>
				</tr>
				<tr v-for='(obj,index) in listData'
					 @click='show(index)'
					 :class="{bg: isActive === index}"
					 :key='obj.id'>

					<td>{{obj.CourseNum}}</td>
					<td>{{obj.CourseName}}</td>
					<!-- 第三个单元格动态绑定的class控制内容的展开与收起 -->
					<td 
						:class="{active: !(isActive === index)}" 
						:key='obj.id'>
						{{obj.QuestionValue}}
					</td>
					<td v-if='show_'>{{obj.Correct?'正确':'错误'}}</td>
					<td>{{obj.TeacherName}}</td>

				</tr>
			</tbody>
		</table>
	</div>  
</template>
<script>
	export default{
		name:'detail-list',
		data () {

			return{
				isActive: '',	//记录被点中的行号
				bg: false,	//控制背景色
				dataFromFather:{},
				listData:[{     //表格的数据项定义
					Correct:'',
					CourseName:'',
					CourseNum:'',
					QuestionValue:'',
					TeacherName:'',
				}],
				// 用于控制显示
				show_: false
			}
		},
		methods: {
			show: function(index){	//设置被点中的行号,tr
				this.isActive = index
			},
			getData: function(data){	//获取后台数据，data来自父组件StudentDetail里面的dataToSend
				console.log(data)
				var _this = this;
				// alert('调用函数')
				var dateFirst = data.dateTimefirst
				var dateEnd = data.dateTimesecond
				this.$ajax.get(`${this.URLroot}/AnswerRecord/`, {
					params: {
						StudentID: data.stuId,
					    dateTimefirst: dateFirst,
					    dateTimesecond: dateEnd
					},
				}).then(res => {
					let listData = res.data;
					for(let i in listData){
						listData[i].id = i;
					}
					_this.listData = listData;
					if(_this.listData.length==0){
						_this.show_ = false
					}else{
						_this.show_ = true
					}
				}).catch(error => {
				  console.error(error)
				})

				this.$ajax.get(`${this.URLroot}/StuAnswerTotal/`, {
				  params: {
				  	Type:"1",
				    StudentID: data.stuId,
				    dateTimefirst: dateFirst,
					dateTimesecond: dateEnd 
				  }
				}).then(res => {
				  IS_DEV && console.log(res.data);
				  let detailC = res.data;
				  let CourseName = [];
				  let Count = [];
				  for(let key in detailC) {
				  	CourseName.push(detailC[key].CourseName);
				  	Count.push(detailC[key].Count);
				  }
				  this.detail.CourseName = CourseName;
				  this.detail.Count = Count;
				// 如果用下面的hideLoading有bug：
				// chart.hideLoading()
				// this.chartOptions.xAxis = [
				// 	{
				// 		name: '科目',
				// 		type : 'category',
				// 		// data : this.detail.CourseName
				// 		data: CourseName
				// 	}
				// ]
				this.chartOptions.series = [
				        {
				            name:'问题数量',
				            type:'bar',
							// data:this.detail.Count,
							data: Count,
				            markPoint : {
				                data : [
				                    {type : 'max', name: '最大值'},
				                    {type : 'min', name: '最小值'}
				                ]
				            },
				            itemStyle:{
                                    normal:{
                                        color:'#aaa2dd'
                                    }
                            }
				        }
				]			  
				}).catch(error => {
				  console.error(error)
				})
			}
		}
	}
</script>
<style scoped>
	*{
		margin: 0;
		box-sizing: border-box;
	}
	table{
		border: 1px solid #ccc;
		margin: 0 auto;
	}
	th{
		color: #fff;
		font-size: 14px;
		background-color: #00ab7a;
		height: 30px;
		line-height: 30px;
		border-right:1px solid #ccc;
	}
	td{
		color: #333;
		font-size: 14px;
		text-align: center;
		vertical-align: middle;
		height: 40px;
		line-height: 30px;
		border-right:1px solid #ccc;
		border-bottom:1px solid #ccc;

	}
	th:nth-child(1),td:nth-child(1){
		width: 60px;    
	}
	th:nth-child(2),td:nth-child(2){
		width: 80px;
	}
	th:nth-child(3),td:nth-child(3){
		width: 400px;

		/*省略号*/
		overflow: hidden;
		/*text-overflow:ellipsis;
		white-space: nowrap;*/
		/*overflow : hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;*/
	}
	.active{
		overflow : hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}
	th:nth-child(4),td:nth-child(4){
		width: 80px;
	}
	th:nth-child(5),td:nth-child(5){
		width: 80px;
	}
	.bg{
		background-color: rgba(202, 225, 245, 0.3);;
	}
</style>