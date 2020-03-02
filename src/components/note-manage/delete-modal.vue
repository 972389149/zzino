<template id="delete-modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
           <h4>确定删除包括“{{deleteFileName}}”的{{count}}个文件吗?</h4>
        </div>
       <!--  <div class="modal-body">         
        </div> -->
        <div class="modal-footer">
          <button class="ok" @click="$emit('confirm')">确定</button>
          <button class="cancel" @click="$emit('cancel')">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-modal',
  components: {
  },
  props: ['deleteFileName','count'],
  data(){
    return{      
    } 
  },
  methods: {    
  },
  computed: {    
  },
  mounted(){
    if(this.deleteFileName.length>15){
      this.deleteFileName=this.deleteFileName.substring(0,15);
    }
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
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
  height: 160px;
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
.modal-header h4 {
  margin-top: 0;
  color: #fff;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
}
/*.modal-body {
  margin: 20px 0 10px 0;
}
*/.modal-body label {
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
  width: 64px;
  height: 28px;
  cursor: pointer;
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
  /*margin-top: 15px;*/
  background: #00ab7a;
  color: #ffffff;
  border: 0;
}
.cancel {
  /*margin-top: 15px;*/
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
