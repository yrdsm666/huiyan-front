<template>
    <el-card class="box-card" style="height: 870px">
        <div slot="header" class="clearfix" style="font-size: 24px">
            <span>验证范围证明</span>
        </div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="验证范围">
                <el-select v-model="range" placeholder="0~2^n-1">
                    <el-option label="0~255" value="8"></el-option>
                    <el-option label="0~65535" value="16"></el-option>
                    <el-option label="0~2^32-1" value="32"></el-option>
                    <el-option label="0~2^64-1" value="64"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="范围证明">
                <el-input v-model="zkp" type="textarea" :rows="5" readonly="true"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="verifyRange">验证范围证明</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="运算结果" :visible.sync="visible">
            <el-alert title="验证零知识范围证明成功,共计耗时:" type="success" show-icon
                ><h3>{{ time }} ms</h3></el-alert
            >
            <el-alert title="验证结果:" type="info" show-icon
                ><h3>{{ res }}</h3></el-alert
            >
        </el-dialog>
    </el-card>
</template>

<script>
import axios from 'axios';
import Header from '../common/Header.vue';
export default {
    components: { Header },
    props: {
        zkp: {
            type: String,
            default: ''
        }
    },
    created() {
        axios.get(this.apiUrl + '/getZkp').then((response) => {
            this.zkp = JSON.stringify(response.data.zkp);
        });
    },
    data() {
        return {
            range: 0,
            crs: 'asdf',
            time: 0,
            res: false,
            visible: false
        };
    },
    methods: {
        verifyRange() {
            let data = {
                range: parseInt(this.range),
                crs: this.crs
            };
            axios
                .post(this.apiUrl + '/verifyRange', data)
                .then((response) => {
                    this.res = JSON.stringify(response.data.res);
                    this.time = JSON.stringify(response.data.time);
                    this.visible = true;
                })
                .catch((response) => alert(response));
        }
    }
};
</script>