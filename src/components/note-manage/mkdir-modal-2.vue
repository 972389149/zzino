<template id="mkdir-modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <div class="modal-header"><h3>新建文件夹</h3></div>
        <div class="modal-body">
          <!-- <label>文件名：</label>
          <input type="text" v-model="folderName">
          <br> -->
<!--            <label>日期：</label> -->
           <data-picker @ievent ="ievent"></data-picker>
        </div>
        <div class="modal-footer">
          <button class="ok" @click="mkDir()">创建</button>
          <button class="cancel" @click="$emit('cancelMkdir')">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNodeList } from '@/api/api'
import dataPicker from '@/components/note-manage/data-picker.vue'
export default {
  name: 'mkdir-modal',
  props: ['data','nowPlace'],
  data () {
    return {
      // folderName:''
     // selected:{}
       el:"mkdir-modal",
       selected:"",
    };
  },
  components: {
     dataPicker:dataPicker
  },
  methods: {
    ievent:function(value){
          this.selected=value+"note";
          // IS_DEV && console.log(value);
    },
    mkDir:function(){
      // this.nowPlace=this.nowPlace+"note";
      // let para = {
      //      Type:1,
      //      CellPhone:10086,
      //      UserName:'ftpUser',
      //      Order:'mkdir',
      //      NewFolder:this.nowPlace +'/'+this.selected
      // }
      this.$ajax.get(`${this.URLroot}/FileOperate/`, { 
          params:{
             Type:1,
             CellPhone:1,
             UserName:1,
             Order:'mkdir',
             path:this.nowPlace+"/"+this.selected,
          },
         }).then((res) => {
          if(1){
             this.$emit('finishMkdir');
          }
         })
      }
  },
  mounted () {},
  computed: {
    stuObj: function () {
      return Object.assign({}, this.data)
    }
  }
}
</script>

<style scoped>
/*来自：
*https://cn.vuejs.org/v2/examples/modal.html
*/
.modal-mask {
  position: fixed;
/*  z-index: 9998;*/
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  height: 170px;
  box-sizing: border-box;
  border: 2px solid #00ab7a;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}
.modal-header {
  background: #00ab7a;
}
.modal-header h3 {
  margin-top: 0;
  color: #fff;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
}

.modal-body {
  margin: 20px 0 10px 0;
}
.modal-body label {
  display: inline-block;
  width: 100px;
  height: 36px;

  text-align: right;
}
.modal-body input {
  width: 90px;
  font-size: 14px;
  height: 16px;
  vertical-align: text-bottom;
}
/*暂时的样式：*/
.modal-body select {
  width: 130px;
  height: 32px;
  cursor: pointer;
  border: 2px solid #00ab7a;
  appearance:none;
  -moz-appearance:none;
  -webkit-appearance:none;
  background: url("http://ourjs.github.io/static/2015/arrow.png") no-repeat scroll right center transparent;
  padding-right: 14px;
}
.modal-footer button {
  float: left;
  width: 80px;
  height: 36px;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
}
.ok {
  margin-left: 60px;
  background: #00ab7a;
  color: #ffffff;
  border: 0;
}
.cancel {
  margin-left: 20px;
  border: 2px solid #00ab7a;
  color: #00ab7a;
  background: #fff;
}
.name-tips, .stuNum-tips {
  color: #ccc;
}
input {  
  background:transparent;
  border-color:#ccc;
  border-style:solid;
  border-top-width:0px;
  border-right-width:0px;
  border-bottom-width:1px; 
  border-left-width:0px;
  outline:none;
}
</style>
