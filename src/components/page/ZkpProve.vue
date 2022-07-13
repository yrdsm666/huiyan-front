<template>
    <el-card class="box-card" style="height: 870px">
        <div slot="header" class="clearfix" style="font-size: 24px">
            <span>证明生成</span>
        </div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="待证明秘密数">
                <el-input v-model="secret"></el-input>
            </el-form-item>
            <el-form-item label="证明范围">
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
            <el-form-item label="离散对数相等性证明">
                <el-input v-model="reg" type="textarea" :rows="5" readonly="true"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="genZkProof">生成范围证明</el-button>
                <el-button type="primary" @click="genRegulation">离散对数相等性证明</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="运算结果" :visible.sync="genZkpVisible">
            <el-alert title="生成零知识范围证明成功,共计耗时:" type="success" show-icon
                ><h3>{{ timezkp }} ms</h3></el-alert
            >
            <el-alert title="证明大小:" type="info" show-icon
                ><h3>{{ sizezkp }} bytes</h3></el-alert
            >
        </el-dialog>
        <el-dialog title="运算结果" :visible.sync="genRegVisible">
            <el-alert title="生成离散对数相等性证明成功,共计耗时:" type="success" show-icon
                ><h3>{{ timereg }} ms</h3></el-alert
            >
            <el-alert title="证明大小:" type="info" show-icon
                ><h3>{{ sizereg }} bytes</h3></el-alert
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
            secret: 0,
            range: 0,
            crs: 'asdf',
            zkp: '',
            reg: '',
            commit: '',
            cipher: '',
            timezkp: 0,
            sizezkp: 0,
            timereg: 0,
            sizereg: 0,
            genZkpVisible: false,
            genRegVisible: false
        };
    },
    methods: {
        stringToBytes(str) {
            var ch,
                st,
                re = [];
            for (var i = 0; i < str.length; i++) {
                ch = str.charCodeAt(i); // get char
                st = []; // set up "stack"
                do {
                    st.push(ch & 0xff); // push byte to stack
                    ch = ch >> 8; // shift value down by 1 byte
                } while (ch);
                // add stack contents to result
                // done because chars have "wrong" endianness
                re = re.concat(st.reverse());
            }
            // return an array of bytes
            return re;
        },
        genZkProof() {
            let data = {
                secret: parseInt(this.secret),
                range: parseInt(this.range),
                crs: this.crs
            };
            axios
                .post(this.apiUrl + '/genZkp', data)
                .then((response) => {
                    this.zkp = JSON.stringify(response.data.rangeproof);
                    this.commit = JSON.stringify(response.data.commitment);
                    this.timezkp = JSON.stringify(response.data.time);
                    this.sizezkp = JSON.stringify(response.data.size);
                    this.genZkpVisible = true;
                })
                .catch((response) => alert(response));
        },
        genRegulation() {
            let data = {
                secret: parseInt(this.secret),
                range: parseInt(this.range),
                crs: this.crs
            };
            axios
                .post(this.apiUrl + '/genEq', data)
                .then((response) => {
                    this.reg = JSON.stringify(response.data.equality);
                    this.cipher = JSON.stringify(response.data.cipher);
                    this.timereg = JSON.stringify(response.data.time);
                    this.sizereg = JSON.stringify(response.data.size);
                    this.genRegVisible = true;
                })
                .catch((response) => alert(response));
        }
    }
};
</script>