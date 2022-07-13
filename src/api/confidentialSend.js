import request from '../utils/request';
// import {env} from '../config/index'

export const confidentialSendText=(Data) => {
    console.log('confidentialSend');
    console.log(Data);
    return request({
        //url: '/register_fail.json',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // },
        url: './confidentialSendText.json',
        method: 'get',
        params: Data,
        // method: 'post',
        // data: Data,
    })
}
