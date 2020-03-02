<template id="onload-modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
         <img src="./img/loading.png" class="loadPic">
         <h3 class="loadTitle">{{message}}</h3>
      </div> 
    </div>
  </div>
</template>

<script>
export default {
  name: 'onload-modal',
  props:['messages'],
  components: {
  },
  data(){
    return{   
      message:"文件正在上传"   
    } 
  },
  methods: {    
  },
  computed: {    
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
  background-color: rgba(0, 0, 0, 0.7);
  display: table;
  transition: opacity .3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.loadPic{
  display:block;
  margin: 0 auto;
  height: 120px;
  width: 120px;
}
.loadTitle{
  color: white;
  text-align: center;
}
</style>
