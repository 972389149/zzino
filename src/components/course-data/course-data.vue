<template>
<div id="course-data">
	<!-- 选择框 -->
	<div style="height:32px;">
		<select-group :selText="selTexts" :optData="optsArr"
       @returnSel="changeSel"></select-group>
       <div id="wrap-btn">
        <button @click="Analysis()">分析模式</button>
      </div>
	</div>

	<ul id="nav-bar">
	<router-link
		tag="li"
		v-for="tab in tabs"
		active-class="active"
		:to="tab.path"
		:key="tab.id">
		{{tab.name}}
	</router-link>
	</ul>
	<date-picker @dataFromPicker='setDateRange' id='date-picker'></date-picker>
	<div class="charts">
			<router-view :startDate='startDate' :endDate='endDate' :selected='selValues'></router-view>
	</div>
</div>
</template>

<script>
let tabs = [
	{name: '问题正确率', path: '/home/course-data/correct-rate', id: 'correct-rate'},
	{name: '回答总数', path: '/home/course-data/Q-A-total', id: 'Q-A-total'},
	{name: '问题类型', path: '/home/course-data/question-type', id: 'question-type'},
	{name: '应答时间', path: '/home/course-data/time-view', id: 'time-view'},
	{name: '应答热点', path: '/home/course-data/hotspot', id: 'hotspot'}
];
import DatePicker from '@/components/course-data/date-picker.vue'
import selectGroup from '@/components/common/select-group.vue'
export default {
	name: 'course-data',
	data () {
		return {
			tabs,
			startDate:'',
			endDate:'',
			selTexts: ['初一', '(1)班', '语文', '单选', '抢答'],
			optsArr: [],
			selValues: ['初一', '(1)班', '语文', '0', '0'],
      		subOptsArr: []
		}
	},
	methods: {
    changeSel: function (index, value) {
      // 等价于：this.selValues[index] = value
      this.$set(this.selValues, index, value)
    },
	setDateRange: function(data){
		this.startDate = data.substr(0,10);
		this.endDate = data.substr(13,10);
	},
	Analysis: function(){
		var item = this.selValues
		if(this.startDate=='' || this.endDate==''){
			alert('信息选择完整(包括日期选择)才能进入分析模式哟~')
			return
		}
		var item = this.selValues
		item.push(this.startDate + ' 至 ' + this.endDate)
		this.$router.push({path:'/home/course-analysis',query:item});
	}
	},
	mounted () {
    this.subOptsArr = {
      itemTypeOpts: [
        {
          text: '单选',
          value: '0'
        },{
          text: '多选',
          value: '1'
        }
      ],
      quizModeOpts: [
        {
          text: '抢答',
          value: '0'
        },{
          text: '齐答',
          value: '1'
        },{
          text: '抽答',
          value: '2'
        },{
          text: '点答',
          value: '3'
        },{
          text: '质疑',
          value: '4'
        }
      ]
    }
    this.optsArr.push(this.optionsArr.gradeOpts)
    this.optsArr.push(this.optionsArr.classOpts)
    this.optsArr.push(this.optionsArr.subjectOpts)
    this.optsArr.push(this.subOptsArr.itemTypeOpts)
    this.optsArr.push(this.subOptsArr.quizModeOpts)
	},
	components: {
		DatePicker: DatePicker,
        selectGroup: selectGroup
	}
}
</script>

<style scoped>
/*  @font-face{
		font-style:normal;
		font-family:'Microsoft YaHei Light';
		src:url('/src/font/Microsoft YaHei Light.ttc') format('truetype');
	}*/
#course-data{
	padding: 20px;
}
#date-picker{
	float: left;
	margin:0 5px 0 25%;
}
ul {
	list-style-type: none;
}
#nav-bar {
	display: flex;
	/*width:800px;*/
	height:43px;
	padding: 0;
	background: #2f3138;
	margin: 4px auto 21px auto;
	font-size: 0;
}
#nav-bar li {
	flex: 1;
	/*display: inline-block;*/
	padding:0 30px;
	width:100px;
	height: 40px;
	background: #2f3138;
	color: #fff;
	line-height: 40px;
	font-size: 14px;
	font-weight: bold;
	text-align: center;
	cursor: pointer;
}
#nav-bar li.active, #nav-bar li:hover {
	color: #00ab7a;
	background: #4d4d4d;
	border-bottom:3px solid #00ab7a;
}
#wrap-btn {
	float: right;
}
button {
	width: 64px;
	height: 32px;
	margin-left: 4px;
	background: #00aa7a;
	color: #ffffff;
	border: 0;
	padding: 0;
	cursor: pointer;
}
</style>
