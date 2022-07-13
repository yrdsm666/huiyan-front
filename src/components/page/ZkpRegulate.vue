<template>
    <el-card class="box-card" style="height: 870px">
        <div slot="header" class="clearfix" style="font-size: 24px">
            <span>证明监管</span>
        </div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="私钥">
                <el-input v-model="sk" type="textarea" :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="离散对数相等性证明">
                <el-input v-model="reg" type="textarea" :rows="5" readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="密文">
                <el-input v-model="cipher" type="textarea" :rows="5" readonly="true"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="margin: auto 10px" @click="verifyEquality">验证相等性证明</el-button>
                <el-button type="primary" @click="extract(sk)">提取秘密</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="运算结果" :visible.sync="verifyVisible">
            <el-alert title="验证承诺与密文相等性成功,共计耗时:" type="success" show-icon
                ><h3>{{ timeverify }} ms</h3></el-alert
            >
            <el-alert title="验证结果:" type="info" show-icon
                ><h3>{{ res }}</h3></el-alert
            >
        </el-dialog>
        <el-dialog title="运算结果" :visible.sync="decVisible">
            <el-alert title="提取秘密成功,共计耗时:" type="success" show-icon
                ><h3>{{ timedec }} ms</h3></el-alert
            >
            <el-alert title="结果为:" type="info" show-icon
                ><h3>{{ plain }}</h3></el-alert
            >
        </el-dialog>
        <el-dialog title="运算结果" :visible.sync="decFailVisible">
            <el-alert title="解密失败，密钥错误:" type="warning" show-icon></el-alert>
        </el-dialog>
    </el-card>
</template>

<script>
import axios from 'axios';
import Header from '../common/Header.vue';
export default {
    components: { Header },
    props: {
        reg: {
            type: String,
            default: ''
        },
        cipher: {
            type: String,
            default: ''
        }
    },
    created() {
        axios.get(this.apiUrl + '/getReg').then((response) => {
            this.reg = JSON.stringify(response.data.reg);
            this.cipher = JSON.stringify(response.data.cipher);
        });
    },
    data() {
        return {
            sk: '',
            timeverify: 0,
            timedec: 0,
            plain: 0,
            res: false,
            verifyVisible: false,
            decVisible: false,
            decFailVisible: false
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
        },
        verifyEquality() {
            let data = {
                sk: JSON.parse(this.sk)
            };
            axios
                .post(this.apiUrl + '/verifyEq', data)
                .then((response) => {
                    this.res = JSON.stringify(response.data.res);
                    this.timeverify = JSON.stringify(response.data.time);
                    this.verifyVisible = true;
                })
                .catch((response) => alert(response));
        },
        extract() {
            let data = {
                sk: JSON.parse(this.sk)
            };
            axios
                .post(this.apiUrl + '/dec', data)
                .then((response) => {
                    this.plain = JSON.stringify(response.data.plain);
                    this.timedec = JSON.stringify(response.data.time);
                    this.decVisible = true;
                })
                .catch((response) => (this.decFailVisible = true));
        }
    }
};
</script>
