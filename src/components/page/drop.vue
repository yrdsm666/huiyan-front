<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>删除节点</span>
      </div>
      <el-row :gutter="20" class="mgb20">
        <el-col :span="8">
          <el-slider v-model="peer" :max="100" show-input></el-slider>
        </el-col>
        <el-col :span="3">
          <el-button style="float: right; padding: 3px 0;font-size:20px"  @click="shotDown" type="text">确认删除</el-button>
        </el-col>
      </el-row>    
      <el-row :gutter="20" class="mgb20">
         <iframe src="http://124.160.125.206:3000/d/fVANWhE7k/fabric-blockchain-monitoring-via-prometheus?orgId=1" width="100%" height="1000px" frameborder="0"></iframe>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orderer: 0,
      peer: 10,
    }
  },
  methods: {
    shotDown() {


      let param = {
        orderer: this.orderer,
        peer:this.peer
      };
      console.log(param)
      console.log("click")
      axios
          .post(this.apiUrl + '/shotdown', param)
    },
  }
}
</script>
