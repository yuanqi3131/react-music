/**
 * @description 封装axios
 */
import axios from 'axios';

const http = axios.create({
  timeout: 30000 // 请求超时时间   
})
// 添加request拦截器 
http.interceptors.request.use(config => {
  config.headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  }
  return config
}, error => {
  Promise.reject(error)
})
// 添加respone拦截器
http.interceptors.response.use(
  response => {
    let data = response.data
    if (data.code !== 200) {
      return Promise.reject(response)
    }
    return Promise.resolve(data)
  },
  error => {
    let response = error.response
    if (response) {
      switch (response.status) {
        case 401:
          localStorage.removeItem('userInfo')
          break;
        case 403:
          console.log(403)
          break;
        case 404:
          console.log(404)
          break;
        case 500:
          console.log(500)
          break;
        case 504:
          break;
        default:
          break;
      }
    }
    return Promise.reject(response)
  }
)
export function get(url: string, params = {}) {
  return http({
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params
  })
}

//封装post请求
export function post(url: string, data = {}) {
  return http({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function put(url: string, data = {}) {
  return http({
    url,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function del(url: string, data = {}) {
  return http({
    url,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

