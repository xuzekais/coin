import axios, { AxiosRequestConfig } from 'axios';
import { Message } from '@arco-design/web-vue';

const service = axios.create({
    baseURL: '', // url = base url + request url

    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    timeout: 300000 // request timeout
});

// 请求拦截器
service.interceptors.request.use(
    //@ts-ignore
    (config: AxiosRequestConfig) => {
        if (!config?.headers) {
            throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
        }
        return config
    }, (error) => {
        return Promise.reject(error);
    }
)

export interface AjaxPromise<T = any> extends Promise<T> {
    cancel(): void;
}

export async function request<Req, Rsp>(data?: Req, options?: AxiosRequestConfig): Promise<Rsp> {

    if (options) {
        options.data = data;
    }

    try {
        const response: any = await service(options);
        console.log(response, '???')
        if (response.headers['content-type'] === 'application/json; charset=utf-8') {
            if (!response || response.data === undefined) {
                Message.error('请求异常!');
                return undefined;
            }
            if (response.data.code !== 0) {
                Message.error(response.data.message);
                return undefined;
            }
            return response?.data;
        }
        return response.data;
    } catch (err) {
        console.log(err);
        Message.error('请求异常: => ' + err?.response?.data?.message);
    }
    
}

export function get<Req, Rsp>(data?: Req, options?: AxiosRequestConfig): Promise<Rsp> {
    return request<Req, Rsp>(data, {
        method: 'GET',
        ...options,
    });
}
export function post<Req, Rsp>(data?: Req, options?: AxiosRequestConfig): Promise<Rsp> {
    return request<Req, Rsp>(data, {
        method: 'POST',
        ...options,
    });
}

export default {
    request,
    get,
    post,
};
