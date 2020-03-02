<template id="qna-total">
  <div>
  <echart :options="chartOptions" style="width: 700px;height:450px;margin:40px auto 30px auto;"></echart>
  <!-- <div style="position:absolute;top:0;left:0;">{{fortest}}</div> -->
  </div>
</template>

<script>
import {barEchart} from '@/components/common/js/my-echarts'
import { graphic } from 'echarts/lib/export'
export default {
  name: 'qna-total',
  props:{
    startDate:String,
    endDate:String,
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
  watch:{
    startDate: function(){
      this.getData();
      IS_DEV && console.log('QnATotal 开始日期改变了'+this.startDate);
    },
    endDate: function(){
      this.getData();
      IS_DEV && console.log('QnATotal 结束日期改变了'+this.endDate);
    },
    selected: function () {
      this.getData()
    }
  },
  mounted () {
    // http://echarts.baidu.com/tutorial.html#%E5%BC%82%E6%AD%A5%E6%95%B0%E6%8D%AE%E5%8A%A0%E8%BD%BD%E5%92%8C%E6%9B%B4%E6%96%B0
    // 1.先展示loading和setOption一个空的图表框架
    // 2.再异步请求
    // 3.等拿到数据的时候，隐藏loading并且第二次setOption把数据补充上去
    // 4.而series会根据name找到对应的需要补充数据的地方
    this.chartOptions = {
      title: {
        text: '提问和回答总数'
        // subtext: '副标题'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['提问数量', '回答数量']
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
          data: ['总数']
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} 个'
          }
        }
      ],
      series: [
        {
          name: '提问数量',
          type: 'bar',
          // data: [_qc], //先设为空：
          data: [],
          // data: [30, 42],
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
          // data: [_ac],
          data: [], // 先设为空：
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
      console.log( this.selected);
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


///QuestionTotal/?Type=1&CellPhone=10086&Cookie=123&dateTimefirst=2014-11-11&dateTimesecond=2018-11-11&grade初一&class=(1)班&CourseName=语文&itemType=单选&quizmodeType=齐答
      this.$ajax.get(`${this.URLroot}/QuestionTotal/`, {
        params: {
          Type: 1,
          CellPhone: sessionStorage.getItem('cellPhone'),
          Cookie: 123,
          dateTimefirst: _this.startDate,
          dateTimesecond: _this.endDate,
          grade: this.selected[0],
          class: this.selected[1],
          CourseName: this.selected[2],
          itemType: _this.selected[3],
          quizmodeType: _this.selected[4]
        }
      }).then(res => {
        var _data = res.data
        var _qc = Number(_data.QuestionCount)
        var _ac = Number(_data.AnswerCount)

        // 如果用下面的hideLoading有bug：
        // chart.hideLoading()
        this.chartOptions.series = [
          {
            name: '提问数量',
            type: 'bar',
            data: [_qc],
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
            data: [_ac],
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
