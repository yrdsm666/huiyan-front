import request from '../utils/request';

export const fetchData = query => {


    console.log("发送的消息：" + query)
    return request({
        url: 'http://10.130.157.175:8080/login1',
        method: 'POST',
        params: query
    });
};
