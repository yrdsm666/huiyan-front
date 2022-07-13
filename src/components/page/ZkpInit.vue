<template>
    <el-card class="box-card" style="height: 870px">
        <div slot="header" class="clearfix" style="font-size: 24px">
            <span>本地生成密钥</span>
        </div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="私钥">
                <el-input v-model="sk" type="textarea" :rows="5" readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="公钥">
                <el-input v-model="pk" type="textarea" :rows="5" readonly="true"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="initKey">初始化私钥及公钥</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="运算结果" :visible.sync="initKeyVisible">
            <el-alert title="初始化密钥成功,共计耗时:" type="success" show-icon
                ><h3>{{ timekey }} ms</h3></el-alert
            >
            <el-alert title="密钥大小:" type="info" show-icon
                ><h3>{{ sizekey }} bytes</h3></el-alert
            >
        </el-dialog>
    </el-card>
</template>

<script>
import axios from 'axios';
import Header from '../common/Header.vue';
export default {
    components: { Header },
    data() {
        return {
            sk: '',
            pk: '',
            timekey: '',
            sizekey: '',
            initKeyVisible: false
        };
    },
    methods: {
        initKey() {
            axios
                .get(this.apiUrl + '/initKey')
                .then((response) => {
                    this.pk = JSON.stringify(response.data.pk);
                    this.sk = JSON.stringify(response.data.sk);
                    this.timekey = JSON.stringify(response.data.time);
                    this.sizekey = JSON.stringify(response.data.size);
                    this.initKeyVisible = true;
                })
                .catch((response) => console.log(response));
            axios
                .get(this.apiUrl + '/initPcGen')
                .then(() => {})
                .catch((response) => alert(response));
        }
    }
};
</script>
