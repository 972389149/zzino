<template id="hotspot">
  <div>
    <echart :options="chartOptions" style="width: 700px;height:450px;margin:40px auto 30px auto;"></echart>
    <div style="margin-left:400px;">面积系数：<input type="number" min="0.1" step="0.1" max="100" v-model="selectedRate" /></div>
  </div>
</template>

<script>
import {scatterEchart} from '@/components/common/js/my-echarts'
import { graphic } from 'echarts/lib/export'
export default {
  name: 'hotspot',
  props:{
    startDate:String,
    endDate:String,
    selected: {}
  },
  data () {
    return {
      selectedRate: 1,
      chartOptions: {}
    }
  },
  mounted () {
    this.chartOptions = {
      // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
      //   offset: 0,
      //   color: '#f7f8fa'
      // }, {
      //   offset: 1,
      //   color: '#cdd0d5'
      // }]),
      title: {
        text: '回答总数和正确回答数'
      },
      legend: {
        right: 10,
        data: ['回答总数', '正确回答数']
      },
      xAxis: {
        type: 'value',
        name: '列',
        interval: 1
      },
      yAxis: {
        type: 'value',
        name: '行',
        interval: 1
      },
      series: [{
        name: '回答总数',
        data: [],
        type: 'scatter'
      }, {
        name: '正确回答数',
        data: [],
        type: 'scatter',
        z: 2
      }]
    }
    this.getData();
  },
  watch: {
    selectedRate: function () {
      var rate = this.selectedRate
      this.chartOptions.series[0].symbolSize = function (data) {
        return data[2] * rate
      }
      this.chartOptions.series[1].symbolSize = function (data) {
        return data[2] * rate
      }
    },
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
  methods:{
    getData: function() {
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
      // echart.showLoading('default', {
      // text: '正在加载中...',
      // color: '#c23531',
      // textColor: '#000',
      // maskColor: 'rgba(255, 255, 255, 0)',
      // zlevel: 0
      // })
      this.$ajax.get(`${this.URLroot}/AnswersHotspot/`, {
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
        IS_DEV && console.log(_data)
        var _Total = _data.Total
        var _Correct = _data.Correct
        var totalSeriesData = []
        var correctSeriesData = []
        for (var key1 in _Total) {
          let arrForAObj = []
          // arrForAObj.push(Number(_Total[key1].ColumnCount))
          // arrForAObj.push(Number(_Total[key1].RowCount))
          // arrForAObj.push(Number(_Total[key1].Count))
          // 该部分还不知道正不正确
          arrForAObj.push(Number(_Total[key1].x))
          arrForAObj.push(Number(_Total[key1].y))
          arrForAObj.push(Number(_Total[key1].value))

          totalSeriesData.push(arrForAObj)
        }
        for (var key2 in _Correct) {
          let arrForAObj = []
          // arrForAObj.push(Number(_Correct[key2].ColumnCount))
          // arrForAObj.push(Number(_Correct[key2].RowCount))
          // arrForAObj.push(Number(_Correct[key2].Count))
          // 该部分还不知道正不正确
          arrForAObj.push(Number(_Correct[key2].x))
          arrForAObj.push(Number(_Correct[key2].y))
          arrForAObj.push(Number(_Correct[key2].value))

          correctSeriesData.push(arrForAObj)
        }
        // var seriesData = [].push(totalSeriesData).push(correctSeriesData)
        // 如果用下面的showLoading有bug：
        // echart.hideLoading()
        /* 数据范例，后台接口有数据之后注释掉：*/
        // totalSeriesData = [
          // [x位置,y位置,该位置的回答总数]：
        //   [3, 1, 10],
        //   [3, 7, 12],
        //   [8, 6, 7],
        //   [2, 7, 6]
        // ]
        // correctSeriesData = [
          // [x位置,y位置,正确回答数]：
        //   [3, 1, 4],
        //   [3, 7, 5],
        //   [8, 6, 4],
        //   [2, 7, 2],
        //   [1, 4, 6],
        //   [4, 1, 8],
        //   [2, 3, 4],
        //   [7, 7, 11]
        // ]
        console.log(totalSeriesData)
        console.log(correctSeriesData)
        this.chartOptions.series = [
          {
            name: '回答总数',
            data: totalSeriesData,
            type: 'scatter',
            symbolSize: function (data) {
              return data[2] * 1
            },
            label: {
              emphasis: {
                show: true,
                formatter: '{c}',
                position: 'top'
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(25, 100, 150, 0.5)',
                shadowOffsetY: 5,
                color: new graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(129, 227, 238)'
                }, {
                  offset: 1,
                  color: 'rgb(25, 183, 207)'
                }])
              }
            }
          }, {
            name: '正确回答数',
            data: correctSeriesData,
            type: 'scatter',
            z: 2,
            symbolSize: function (data) {
              return data[2] * 1
            },
            label: {
              emphasis: {
                show: true,
                formatter: '{c}',
                position: 'top'
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: 5,
                color: new graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
                }, {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
                }])
              }
            }
          }
        ]
      }).catch(error => {
        // alert('服务器异常，请联系维护人员！')
        console.error(error)
      })
    },
  },
  components: {
    echart: scatterEchart
  }
}
</script>

<style scoped>

</style>
