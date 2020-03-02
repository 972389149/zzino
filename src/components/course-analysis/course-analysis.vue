<template>
    <div style="margin-left: 15px;">
      <div class="head">
        <div class="item">
          <!-- <ul>
            <li v-for='item in items'>{{item}}</li>
          </ul> -->
          <div id="wrap-btn">
              <button v-for='item in items'>{{item}}</button>
          </div>

        </div>
        <button style='float: right;background:#00aa7a;color: #fff;border: none;margin-right: 30px;cursor: pointer;' @click='quit()'>退出</button>
      </div>
      <div class='mid' >
        <div class="rate">
          <echart :options="chartOptions1" style="width: 650px;height:400px;margin:20px auto 20px auto;"></echart>
        </div>
        <div class='account' >
          <echart :options="chartOptions2" style="width: 650px;height:400px;margin:20px auto 20px auto;"></echart>
        </div>
        <div class='type'>
          <echart :options="chartOptions3" style="width: 650px;height:400px;margin:20px auto 20px auto;"></echart>
        </div>
        <div class='hotpot'>
          <echarts :options="chartOptions4" style="width: 650px;height:400px;margin:20px auto 20px auto;"></echarts>
          <!-- <div style="margin-left:400px;">面积系数：<input type="number" min="0.1" step="0.1" max="100" v-model="selectedRate" /></div> -->
        </div>
      </div>
    </div>
</template>
<script>
  import Router from 'vue-router'
  import {barEchart} from '@/components/common/js/my-echarts'
  import {scatterEchart} from '@/components/common/js/my-echarts'
  import { graphic } from 'echarts/lib/export'
  export default{
    name: 'course-analysis',
    data () {
      return{
          itemBug: [],
          items: [],
          chartOptions1: {}, //问题正确率
          chartOptions2: {}, //回答总数
          chartOptions3: {}, //问题类型
          chartOptions4: {}, //应答热点
          selectedRate: 1
        }
    },
    methods: {
      quit:function(){
        this.$router.push({path:'/home'});
      },
      getRate:function(){
        let _this = this;
        // 如果用下面的showLoading有bug：
        // chart.showLoading('default', {
        //   text: '正在加载中...',
        //   color: '#c23531',
        //   textColor: '#000',
        //   maskColor: 'rgba(255, 255, 255, 0)',
        //   zlevel: 0
        // })
        var timefirst = this.$route.query[5].slice(0,10)
        var timeend =  this.$route.query[5].slice(13,23)
        this.$ajax.get(`${this.URLroot}/QuestionCount/`, {
          params: {
            Type: 1,
            CellPhone: sessionStorage.getItem('cellPhone'),
            Cookie: 123,
            dateTimefirst: timefirst,
            dateTimesecond: timeend,
            grade: this.$route.query[0],
            class: this.$route.query[1],
            CourseName: this.$route.query[2],
            itemType: this.$route.query[3],
            quizmodeType: this.$route.query[4]
          }
        }).then(res => {
          console.log(res.data);
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
          this.chartOptions1.series = [
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
          console.error(error)
        })
      },
      getAccount:function(){
        let _this = this;
        var timefirst = this.$route.query[5].slice(0,10)
        var timeend =  this.$route.query[5].slice(13,23)
        this.$ajax.get(`${this.URLroot}/QuestionTotal/`, {
          params: {
            Type: 1,
            CellPhone: sessionStorage.getItem('cellPhone'),
            Cookie: 123,
            dateTimefirst: timefirst,
            dateTimesecond: timeend,
            grade: this.$route.query[0],
            class: this.$route.query[1],
            CourseName: this.$route.query[2],
            itemType: this.$route.query[3],
            quizmodeType: this.$route.query[4]
          }
        }).then(res => {
          var _data = res.data
          var _qc = Number(_data.QuestionCount)
          var _ac = Number(_data.AnswerCount)

          // 如果用下面的hideLoading有bug：
          // chart.hideLoading()
          this.chartOptions2.series = [
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
      },
      getType:function(){
        let _this = this;
        var timefirst = this.$route.query[5].slice(0,10)
        var timeend =  this.$route.query[5].slice(13,23)
        this.$ajax.get(`${this.URLroot}/QuestionCount/`, {
          params: {
            Type: 1,
            CellPhone: sessionStorage.getItem('cellPhone'),
            Cookie: 123,
            dateTimefirst: timefirst,
            dateTimesecond: timeend,
            grade: this.$route.query[0],
            class: this.$route.query[1],
            CourseName: this.$route.query[2],
            itemType: this.$route.query[3],
            quizmodeType: this.$route.query[4]
          }
        }).then(res => {
          var _data = res.data.QuestionType
          //本地测试数据
          // var _data = {
          //  Correct:{
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
          this.chartOptions3.series = [
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
      },
      getHotPot:function(){
        let _this = this;
        // 如果用下面的showLoading有bug：
        // echart.showLoading('default', {
        // text: '正在加载中...',
        // color: '#c23531',
        // textColor: '#000',
        // maskColor: 'rgba(255, 255, 255, 0)',
        // zlevel: 0
        // })
        var timefirst = this.$route.query[5].slice(0,10)
        var timeend =  this.$route.query[5].slice(13,23)
        this.$ajax.get(`${this.URLroot}/AnswersHotspot/`, {
          params: {
            Type: 1,
            CellPhone: sessionStorage.getItem('cellPhone'),
            Cookie: 123,
            dateTimefirst: timefirst,
            dateTimesecond: timeend,
            grade: this.$route.query[0],
            class: this.$route.query[1],
            CourseName: this.$route.query[2],
            itemType: this.$route.query[3],
            quizmodeType: this.$route.query[4]
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
          this.chartOptions4.series = [
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
      }
    },
    mounted () {
      // 不晓得为什么直接赋值给items不能渲染
      for(var i=0;i<6;i++){
        if(i==5){
          this.itemBug[i] = this.$route.query[i]
          this.itemBug[i] = ' ' + this.itemBug[i].slice(0,10) + ' ' + this.itemBug[i].slice(10,11) + ' ' + this.itemBug[i].slice(11) + ' '
        }else{
          this.itemBug[i] = this.$route.query[i]
        }
      }
      this.items = this.itemBug

    //问题正确率
    this.chartOptions1 = {
      title: {
        text: '不同类型问题回答正确率'
        // subtext: '副标题'
      },
      // tooltip: {
      //   trigger: 'axis'
      // },
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
          saveAsImage: {show: false}
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
      this.getRate();


      // ***************************************************
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
        // // IS_DEV && console.log(_data)
        // var _total = []
        // var _correct = []
        // var _correctRate = []
        // for (var key1 in _data.Total) {
        //   _total.push(Number(_data.Total[key1]))
        // }
        // for (var key2 in _data.Correct) {
        //   _correct.push(Number(_data.Correct[key2]))
        // }
        // for (var i = 0; i < _total.length; i++) {
        //   _correctRate[i] = (_correct[i] / _total[i] * 100).toFixed(2)
        // }
        // // 如果用下面的hideLoading有bug：
        // // chart.hideLoading()
        // this.chartOptions1.series = [
        //   {
        //     // 根据名字对应到相应的系列：
        //     name: '正确率',
        //     type: 'bar',
        //     data: _correctRate,
        //     markPoint: {
        //       data: [
        //         {type: 'max', name: '最大值'},
        //         {type: 'min', name: '最小值'}
        //       ]
        //     }
        //   },
        //   {
        //     name: '回答数量',
        //     type: 'bar',
        //     data: _total,
        //     yAxisIndex: 1
        //   }
        // ]
       // ***************************************************


      // 回答总数
      this.chartOptions2 = {
        title: {
          text: '提问和回答总数'
          // subtext: '副标题'
        },
        // tooltip: {
        //   trigger: 'axis'
        // },
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
      this.getAccount();
       // ***************************************************
       //本地测试数据
       // this.chartOptions2.series = [
       //    {
       //      name: '提问数量',
       //      type: 'bar',
       //      data: [10],
       //      markPoint: {
       //        data: [
       //          {type: 'max', name: '最大值'},
       //          {type: 'min', name: '最小值'}
       //        ]
       //      }
       //    },
       //    {
       //      name: '回答数量',
       //      type: 'bar',
       //      data: [8],
       //      markPoint: {
       //        data: [
       //          {type: 'max', name: '最大值'},
       //          {type: 'min', name: '最小值'}
       //        ]
       //      }
       //    }
       //  ]
      // ***************************************************

      // 问题类型
      this.chartOptions3 = {
        title: {
          text: '不同类型问题回答正确率'
          // subtext: '副标题'
        },
        // tooltip: {
        //   trigger: 'axis'
        // },
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

      this.getType();
      // ***************************************************
      //本地测试数据
        // var _data = {
        //  Correct:{
        //           1:'1',
        //           2:'3',
        //           3:'4',
        //           4:'5',
        //           5:'10'
        //         },
        //         Total:{
        //           1:'20',
        //           2:'15',
        //           3:'60',
        //           4:'19',
        //           5:'23',
        //         }
        // }
        // var _total = []
        // var _correct = []
        // var _correctRate = []
        // for (var key1 in _data.Total) {
        //   _total.push(Number(_data.Total[key1]))
        // }
        // for (var key2 in _data.Correct) {
        //   _correct.push(Number(_data.Correct[key2]))
        // }
        // for (var i = 0; i < _total.length; i++) {
        //   _correctRate[i] = (_correct[i] / _total[i] * 100).toFixed(2)
        // }
        // // 如果用下面的hideLoading有bug：
        // // chart.hideLoading()
        // this.chartOptions3.series = [
        //   {
        //     name: '正确率',
        //     type: 'bar',
        //     data: _correctRate,
        //     markPoint: {
        //       data: [
        //         {type: 'max', name: '最大值'},
        //         {type: 'min', name: '最小值'}
        //       ]
        //     }
        //   }
        // ]
      // ***************************************************


      // 应答热点
      this.chartOptions4 = {
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
      this.getHotPot();
      // ***************************************************
      //本地测试数据
      // var totalSeriesData = [
      //     // [x位置,y位置,该位置的回答总数]：
      //     [3, 1, 10],
      //     [3, 7, 12],
      //     [8, 6, 7],
      //     [2, 7, 6]
      //   ]
      //   var correctSeriesData = [
      //     // [x位置,y位置,正确回答数]：
      //     [3, 1, 4],
      //     [3, 7, 5],
      //     [8, 6, 4],
      //     [2, 7, 2],
      //     [1, 4, 6],
      //     [4, 1, 8],
      //     [2, 3, 4],
      //     [7, 7, 11]
      //   ]
      //   this.chartOptions4.series = [
      //     {
      //       name: '回答总数',
      //       data: totalSeriesData,
      //       type: 'scatter',
      //       symbolSize: function (data) {
      //         return data[2] * 1
      //       },
      //       label: {
      //         emphasis: {
      //           show: true,
      //           formatter: '{c}',
      //           position: 'top'
      //         }
      //       },
      //       itemStyle: {
      //         normal: {
      //           shadowBlur: 10,
      //           shadowColor: 'rgba(25, 100, 150, 0.5)',
      //           shadowOffsetY: 5,
      //           color: new graphic.RadialGradient(0.4, 0.3, 1, [{
      //             offset: 0,
      //             color: 'rgb(129, 227, 238)'
      //           }, {
      //             offset: 1,
      //             color: 'rgb(25, 183, 207)'
      //           }])
      //         }
      //       }
      //     }, {
      //       name: '正确回答数',
      //       data: correctSeriesData,
      //       type: 'scatter',
      //       z: 2,
      //       symbolSize: function (data) {
      //         return data[2] * 1
      //       },
      //       label: {
      //         emphasis: {
      //           show: true,
      //           formatter: '{c}',
      //           position: 'top'
      //         }
      //       },
      //       itemStyle: {
      //         normal: {
      //           shadowBlur: 10,
      //           shadowColor: 'rgba(120, 36, 50, 0.5)',
      //           shadowOffsetY: 5,
      //           color: new graphic.RadialGradient(0.4, 0.3, 1, [{
      //             offset: 0,
      //             color: 'rgb(251, 118, 123)'
      //           }, {
      //             offset: 1,
      //             color: 'rgb(204, 46, 72)'
      //           }])
      //         }
      //       }
      //     }
      //   ]

      // ***************************************************
    },
    // echarts + s 解决了不能同时引入两种表的问题
    components: {
      echart: barEchart,
      echarts: scatterEchart
    }
  }
</script>

<style>
.head{
  width: 100%;
  height: 50px;
/*  border:1px solid #000;*/
}
.item{
  float: left;
}
#wrap-btn {
  float: right;
}
button {
  min-width: 64px;
  height: 32px;
  margin-left: 8px;
  background: #ffffff;
  /*color: #ffffff;*/
  border: 2px solid #909090;
  padding: 0;
  /*cursor: pointer;*/
}
.mid{
  float: left;
  width: 100%;
  max-height: 800px; 
  /*border:1px solid #000; */
  overflow: hidden;
}
.mid div{
  float: left;
  width: 50%;
  height: 400px;
  /*background-color: #000;*/
  /*border:1px solid #E43C3C;*/
}

</style>