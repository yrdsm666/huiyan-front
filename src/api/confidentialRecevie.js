import request from '../utils/request';

export const getMyMessage=(query) => {
    console.log('get my message');
    return request({
        //url: '/register_fail.json',
        url: './confidentialReceive.json',
        method: 'get',
        async: false,
        params: query,
        // method: 'post',
        // data: query,
    })
}

export const deleteMyMessage=(query) => {
    console.log('delete my message');
    console.log(query);
    return request({
        //url: '/register_fail.json',
        url: './confidentialReceive.json',
        async: false,
        // method: 'delete',
        // params: query,
        method: 'get',
        params: query,
        // method: 'post',
        // data: query,
    })
}
