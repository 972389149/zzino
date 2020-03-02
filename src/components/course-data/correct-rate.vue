<template id="correct-rate" ref='a'>
  <div>
    <echart :options="chartOptions" style="width: 700px;height:450px;margin:40px auto 30px auto;"></echart>
    <!-- <div style="position:absolute;top:0;left:0;">{{fortest}}</div> -->
  </div>
</template>

<script>
import {barEchart} from '@/components/common/js/my-echarts'
import { graphic } from 'echarts/lib/export'
export default {
  name: 'correct-rate',
  props: {
    startDate: String,
    endDate: String,
    selected: {}
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
  watch: {
    startDate: function () {
      this.getData()
    },
    endDate: function () {
      this.getData()
    },
    selected: function () {
      this.getData()
    }
  },
  mounted () {
    // http://echarts.baidu.com/tutorial.html#%E5%BC%82%E6%AD%A5%E6%95%B0%E6%8D%AE%E5%8A%A0%E8%BD%BD%E5%92%8C%E6%9B%B4%E6%96%B0
    // 1.先展示loading动画和setOption一个空的图表框架
    // 2.再异步请求
    // 3.等拿到数据的时候，隐藏loading动画并且第二次setOption把数据补充上去
    // 4.而series会根据name找到对应的需要补充数据的地方
    // IS_DEV && console.log('correctRate mounted开始日期' + this.startDate)
    // IS_DEV && console.log('correctRate mounted结束日期' + this.endDate)

    this.chartOptions = {
      title: {
        text: '不同类型问题回答正确率'
        // subtext: '副标题'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['正确率', '回答数量']
      },
      toolbox: {
        show: true,
        right: '16',
        feature: {
          dataView: {show: true, readOnly: false},
          magicType: {show: false, type: ['line', 'bar']},
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
          name: '正确率',
          position: 'left',
          axisLabel: {
            interval: 'auto',
            formatter: '{value} %'
          }
        },
        {
          type: 'value',
          name: '回答数量',
          position: 'right',
          axisLabel: {
            formatter: '{value} 个'
          }
        }
      ],
      series: [
        {
          name: '正确率',
          type: 'bar',
          // data: _correct, //先设为空：
          data: []
        },
        {
          name: '回答数量',
          type: 'bar',
          // data: _total //先设为空：
          data: []
        }
      ]
    }
    this.getData();
  },
  methods: {
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
        console.log(res.data);
        // console.log(1111);
        var _data = res.data.QuestionType;
        //本地测试数据
        // var _data = {
        //   Correct:{
        //     1:'1',
        //     2:'3',
        //     3:'0',
        //     4:'5',
        //     5:'10'
        //   },
        //   Total:{
        //     1:'20',
        //     2:'15',
        //     3:'60',
        //     4:'19',
        //     5:'23',
        //   }
        // }
        // IS_DEV && console.log(_data)
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
            // 根据名字对应到相应的系列：
            name: '正确率',
            type: 'bar',
            data: _correctRate,
            markPoint: {
              data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
              ]
            }
          },
          {
            name: '回答数量',
            type: 'bar',
            data: _total,
            yAxisIndex: 1
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
