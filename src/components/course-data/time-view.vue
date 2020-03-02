<template id="time-view">
  <div>
    <div>
      <!-- <span style="margin-left:35px;color:#333333">已上课程：</span> -->
      <select style="height:32px;width:265px;border:solid #AEAEAE 2px;color:#333333;margin-left:35px;"  v-model="CourseGuids">
        <option v-for='item in courseID' :value="item.CourseGUID"><span>{{item.CourseName}} Time：{{item.StartTime}} 到 {{item.EndTime}}</span></option>
      </select>
    </div>
    <echart :options="chartOptions" style="width: 700px;height:450px;margin:40px auto 30px auto;"></echart>
  </div>
</template>

<script>
import {scatterEchart} from '@/components/common/js/my-echarts'
import { graphic } from 'echarts/lib/export'
export default {
  name: 'time-view',
  props:{
    startDate:String,
    endDate:String,
    selected: {}
  },
  data () {
    return {
      chartOptions: {},
      courseID: [{'CourseName':'无课','StartTime':0,'EndTime':0,'CourseGUID': false}],
      CourseGuids: null,
      StartTime: [],
      EndTime: []
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
    },
    CourseGuids: function(){
      if(this.CourseGuids){
        this.getData()
      }else{
        alert('请选择一门已上的科目~')
      }
    }
  },
  mounted () {
    // IS_DEV && console.log('timeView mounted开始日期'+this.startDate);
    // IS_DEV && console.log('timeView mounted结束日期'+this.endDate);
    // http://echarts.baidu.com/tutorial.html#%E5%BC%82%E6%AD%A5%E6%95%B0%E6%8D%AE%E5%8A%A0%E8%BD%BD%E5%92%8C%E6%9B%B4%E6%96%B0
    // 1.先展示loading和setOption一个空的图表框架
    // 2.再异步请求
    // 3.等拿到数据的时候，隐藏loading并且第二次setOption把数据补充上去
    // 4.而series会根据name找到对应的需要补充数据的地方

    this.chartOptions = {
      title: {
        text: '应答时间分布',
        x: 'center',
        y: 0
      },
      tooltip: {
        formatter: '({c})'
      },
      xAxis: [
        {
          gridIndex: 0,
          name: '时间',
          min: 0,
          max: 40,
          interval: 5,
          axisLabel: {
            interval: 'auto',
            formatter: '{value} 分钟'
          }
        }
      ],
      yAxis: [
        {
          gridIndex: 0,
          name: '应答个数',
          minInterval: 5,
          axisLabel: {
            interval: 'auto',
            formatter: '{value} 个'
          }
        }
      ],
      series: [
        {
          name: '应答个数',
          type: 'scatter',
          xAxisIndex: 0,
          yAxisIndex: 0,
          // data: dataAll[0]
          data: [] // 先设为空：
        }
      ]
    }
    this.getData();
  },
  methods:{
    setCourseId: function(e){
      console.log(e)
      // this.CourseGuids = id
    },
    getData: function() {
      let _this = this;
      this.$ajax.get(this.URLroot + '/ClassCourses/queryCoursesHistory/', {
        params: {
          Type: 1,
          dateTimefirst: _this.startDate,
          dateTimesecond: _this.endDate,
          grade: this.selected[0],
          class: this.selected[1]
        }
      }).then(res => {
        if(res.data.key1 == undefined){
          return 
        }
        _this.courseID = []
        _this.StartTime = []
        _this.EndTime = []

        for(var i in res.data){
          // _this.StartTime.push(res.data[i].StartTime)
          // _this.EndTime.push(res.data[i].EndTime)
          res.data[i].rowStart = res.data[i].StartTime
          res.data[i].rowEnd = res.data[i].EndTime
          res.data[i].StartTime = res.data[i].StartTime.slice(5,16)
          res.data[i].EndTime = res.data[i].EndTime.slice(5,16)
          _this.courseID.push(res.data[i])
        }
        console.log(_this.courseID)
      }).catch(error => {
        
      })

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
      for(var i=0;i<_this.courseID.length;i++){
        if(_this.courseID[i].CourseGUID == _this.CourseGuids){
           var start = _this.courseID[i].rowStart
           var end = _this.courseID[i].rowEnd
        }else{
          continue
        }
      }
      this.$ajax.get(this.URLroot + '/AnswersTime/', {
        params: {
          Type: 1,
          // CellPhone: sessionStorage.getItem('cellPhone'),
          // Cookie: 123,
          dateTimefirst: start,
          dateTimesecond: end,
          grade: this.selected[0],
          class: this.selected[1],
          // CourseName: this.selected[2],
          itemType: _this.selected[3],
          quizmodeType: _this.selected[4],
          CourseGuid: _this.CourseGuids
        }
      }).then(res => {
        var _data = res.data
        // _data = {"5": "10", "10": "20", "15": "30", "20": "40", "25": "40", "30": "20", "35": "11", "40": "15"}
        var _arr = []
        for (var key in _data) {
          _arr.push(new Array(Number(key), Number(_data[key])))
        }
        var dataAll = [_arr];

        // 如果用下面的hideLoading有bug：
        // chart.hideLoading()

        _this.chartOptions.series = [
          {
            name: '应答个数',
            type: 'scatter',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: dataAll[0]
          }
        ]
      }).catch(error => {
        // alert('服务器异常，请联系维护人员！')
        console.error(error)
      })
    }
  },
  components: {
    echart: scatterEchart
  }
}
</script>

<style scoped>

</style>
