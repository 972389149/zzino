<template id="qusetion-type">
	<div>
		<echart :options="chartOptions" style="width: 700px;height:450px;margin:40px auto 30px auto;"></echart>
		<!-- <div style="position:absolute;top:0;left:0;">{{fortest}}</div> -->
	</div>
</template>

<script>
import {barEchart} from '@/components/common/js/my-echarts'
import { graphic } from 'echarts/lib/export'
export default {
	name: 'qusetion-type',
	props:{
		startDate:String,
		endDate:String,
		selected:{}
	},
  computed: {
    // fortest: function () {
    //   return JSON.stringify(this.selected)
    // }
  },
	data () {
		return {
			chartOptions: {}
		}
	},
	watch:{
		startDate: function(){
			this.getData();
		},
		endDate: function(){
			this.getData();
		},
    selected: function () {
      this.getData()
    }
	},
	mounted () {
		IS_DEV && console.log(this.selected);
		this.chartOptions = {
			title: {
				text: '不同类型问题回答正确率'
				// subtext: '副标题'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['正确率']
			},
			toolbox: {
				show: true,
				right: '16',
				feature: {
					dataView: {show: true, readOnly: false},
					magicType: {show: true, type: ['line', 'bar']},
					restore: {show: true},
					saveAsImage: {show: true}
				}
			},
			calculable: true,
			xAxis: [
				{
					type: 'category',
					data: ['判断性问题', '叙述性问题', '述理性问题', '扩散性问题', '计算性问题']
				}
			],
			yAxis: [
				{
					type: 'value',
					axisLabel: {
						formatter: '{value} %'
					}
				}
			],
			series: [
				{
					name: '正确率',
					type: 'bar',
					data: [],
					// data: [30, 42, 15, 33, 42],
					markPoint: {
						data: [
							{type: 'max', name: '最大值'},
							{type: 'min', name: '最小值'}
						]
					}
				}
			]
		}

		this.getData();
	},
	methods:{
		getData: function(){
			 let _this = this;
			 if(this.selected[3]==0){
		          this.selected[3]="单选";
		      }
		      if(this.selected[3]==1){
		          this.selected[3]="多选";
		      }
		      if(this.selected[4]==0){
		          this.selected[4]="抢答";
		      }
		      if(this.selected[4]==1){
		          this.selected[4]="齐答";
		      }
		      if(this.selected[4]==2){
		          this.selected[4]="抽答";
		      }
		      if(this.selected[4]==3){
		          this.selected[4]="点答";
		      }
		      if(this.selected[4]==4){
		          this.selected[4]="质疑";
		      }
      // 如果用下面的showLoading有bug：
      // chart.showLoading('default', {
      //   text: '正在加载中...',
      //   color: '#c23531',
      //   textColor: '#000',
      //   maskColor: 'rgba(255, 255, 255, 0)',
      //   zlevel: 0
      // })

			this.$ajax.get(`${this.URLroot}/QuestionCount/`, {
				params: {
					Type: 1,
					CellPhone: sessionStorage.getItem('cellPhone'),
					Cookie: 123,
					dateTimefirst: _this.startDate,
					dateTimesecond: _this.endDate,
					grade: _this.selected[0],
					class: this.selected[1],
					CourseName: this.selected[2],
					itemType: _this.selected[3],
					quizmodeType: _this.selected[4]
				}
			}).then(res => {
				var _data = res.data.QuestionType
				//本地测试数据
				// var _data = {
				// 	Correct:{
			 //            1:'1',
			 //            2:'3',
			 //            3:'4',
			 //            4:'5',
			 //            5:'10'
			 //          },
			 //          Total:{
			 //            1:'20',
			 //            2:'15',
			 //            3:'60',
			 //            4:'19',
			 //            5:'23',
			 //          }
				// }
        var _total = []
        var _correct = []
        var _correctRate = []
        for (var key1 in _data.Total) {
          _total.push(Number(_data.Total[key1]))
        }
        for (var key2 in _data.Correct) {
          _correct.push(Number(_data.Correct[key2]))
        }
        for (var i = 0; i < _total.length; i++) {
          _correctRate[i] = (_correct[i] / _total[i] * 100).toFixed(2)
        }
        // 如果用下面的hideLoading有bug：
        // chart.hideLoading()
				this.chartOptions.series = [
					{
						name: '正确率',
						type: 'bar',
						data: _correctRate,
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						}
					}
				]
			}).catch(error => {
				// alert('服务器异常，请联系维护人员！')
				console.error(error)
			})
		}
	},
  components: {
    echart: barEchart
  }
}
</script>

<style scoped>
</style>
