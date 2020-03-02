import axios from '@/global-utils/interceptor.js'
import {URLroot} from '../meta.js'

let base = URLroot + '/FileOperate/';
// let base = this.URLroot + '/FileOperate/';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { 
	return axios.get(`${base}`, { params: params }) 
}

export const delFile = params =>{
	return axios.get(`${base}`, { params: params })
}
export const downloadFile = params =>{
  return axios.get(`${base}`, { params: params })
}

// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); }

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }) }

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }) }

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }) }

// 模仿user写slide的：
export const getSlideList = params => { 
	return axios.get(`${base}`, { params: params }) 
}
// 模仿user写teacher的：
export const getTeacherList = params => { return axios.get(`${base}/teacher/list`, { params: params }) }

export const getStudentList = params => { return axios.get(`${base}/student/list`, { params: params }) }

//L
export const getNodeList = params => { 
	/*IS_DEV && console.log(`${base}`);*/
	// return this.$ajax.get(`${base}`, { params: params }) 
}
