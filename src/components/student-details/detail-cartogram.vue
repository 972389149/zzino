<!-- @author: Erin 郭冬虹 -->
<template>
	<div id='detail-cartogram'>
		<echart :options="chartOptions" style="width: 600px;height:400px;margin:20px auto 30px;"></echart>	
	</div>
	
</template>
<script>
	import {barEchart} from '@/components/common/js/my-echarts'
	export default{
		name:'detail-cartogram',
		props:['param'],
		data(){
			return{
				detail:{
					CourseName:[],
					Count:[]
				},
				dataFromFather:{},
				chartOptions: {},
				stuId:""
			}
		},
		methods:{
			showChart: function(){
				this.chartOptions = {
				    title : {
				        text: '各科目问题分布数量分数情况',
				        subtext: ''
				    },
				    tooltip : {
				        trigger: 'axis'
				    },
				    legend: {
				        data:['问题数量']
				    },
				    toolbox: {
				        show : true,
				        feature : {
				            dataView : {show: true, readOnly: false},
				            // magicType : {show: true, type: ['line', 'bar']},
				            restore : {show: true},
				            saveAsImage : {show: true}
				        }
				    },
				    calculable : true,
				    xAxis : [
				        {
				        	name: '科目',
				            type : 'category',
				            data : []
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            name: '回答数量'
				        }
				    ],
				    series : [
				        {
				            name:'问题数量',
				            type:'bar',
				            data:[],
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
				}
			},
			getData:function(data){		//获取后台数据，data来自父组件StudentDetail里面的dataToSend
				console.log(data)
				var _this = this;
				var dateFirst = data.dateTimefirst
				var dateEnd = data.dateTimesecond
				// 如果用下面的showLoading有bug：
				// chart.showLoading('default', {
				//   text: '正在加载中...',
				//   color: '#c23531',
				//   textColor: '#000',
				//   maskColor: 'rgba(255, 255, 255, 0)',
				//   zlevel: 0
				// })
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
				this.chartOptions.xAxis = [
					{
						name: '科目',
						type : 'category',
						// data : this.detail.CourseName
						data: CourseName
					}
				]
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
		},
		mounted () {
			this.showChart();
			this.stuId=this.$route.query.stuId
		},
		components: {
			echart: barEchart
		}
	}
</script>
<style scoped>
	
</style>
