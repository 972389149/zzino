<template>
<div id="home">
  <div id="sidebar">
    <div id="logo">
      <img src="./img/logo_2.png" height="73" width="149" alt="logo无法加载" style='margin-left: 55px;margin-top: 15px;'>
    </div>
    <ul class="navItem">
      <router-link tag="li" v-for="tab in sidebarTabs" active-class="active" :to="tab.path" :key="tab.id">{{tab.name}}</router-link>
    </ul>
  </div>
  <div id="main">
    <header><i></i><span>{{userName}}&nbsp;&nbsp;<a href="#" @click='backHome'>退出</a></span></header>
    <router-view></router-view>
  </div>
</div>
</template>

<script>
let sidebarTabs = [
  {name: '课程观测', path: '/home/course-data', id: 'course-data'},
  {name: '课程管理', path: '/home/course-manage', id: 'course-manage'},
  // {name: '学校管理', path: 'xxxx'},
  {name: '教师管理', path: '/home/teacher-manage', id: 'teacher-manage'},
  {name: '班级管理', path: '/home/class-manage', id: 'class-manage'},
  {name: '学生管理', path: '/home/student-manage', id: 'student-manage'},

  //new
  {name: '笔记管理', path: '/home/note-manage', id: 'note-manage'},

  {name: '课件管理', path: '/home/slide-manage', id: 'slide-manage'},
  {name: '座位管理', path: '/home/seat-manage', id: 'seat-manage'}
]
export default {
  name: 'home',
  data () {
    return {
      sidebarTabs,
      userName: '',
    }
  },
  methods: {
    backHome: function(){
      this.$router.push('/login')
    }
  },
  mounted() {
    this.userName=sessionStorage.getItem('userName')
  }
}
</script>
<style>
body {
  background-color:#f5f5f5;
  padding: 0;
  margin: 0;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
}
header {
  height: 54px;
  background: #fff;
}
header span {
  position: absolute;
  color: #333;
  /*(54-16)/2 = 19*/
  top: 19px;
  right: 30px;
  font-size: 16px;
  line-height: 16px;
}
header span a {
  color: #00ab77;
  text-decoration: none;
}
</style>
<style scoped>
/*@font-face{
  font-style:normal;
  font-family:'Microsoft YaHei Light';
  src:url('/src/font/Microsoft YaHei Light.ttc') format('truetype');
}
#sidebar li,#nav-bar {
  font-family:"Microsoft YaHei Light",sans-serif;
}*/
#sidebar {
  position: fixed;
  left: 0;
  bottom: 0;
  top: 0;
  box-sizing: border-box;
  width: 260px;
  background: #26282f;
}
#sidebar ul {
  margin-top: 50px;
  padding: 0;
}
#sidebar li {
  height:50px;
  line-height: 50px;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  color: #fff;/*无效*/
  cursor: pointer;
}
#sidebar li:hover {
  background: #4d4d4d;
  border-left: 4px solid #00ab7a; 
}
#sidebar li.active {
  background: #4d4d4d;
  border-left: 4px solid #00ab7a; 
}
#sidebar #logo {
  box-sizing: border-box;
  background: #00ab7a;
  height: 100px;
  width: 100%;
}
#main {
  position: absolute;
  top: 0;
  left: 260px;
  right: 0px;
  width: auto;
}
</style>
