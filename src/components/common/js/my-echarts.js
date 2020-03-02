// import echart from 'vue-echarts/components/ECharts'
// const echart = () => import(/* webpackChunkName: "vue-echarts" */ 'vue-echarts/components/ECharts')

// const echart = require('vue-echarts/components/ECharts')
// const echart = require.ensure([], function(require){
//     require('vue-echarts/components/ECharts');
// });

// https://www.cnblogs.com/alan2kat/p/7298933.html  :
// https://cn.vuejs.org/v2/guide/components.html#%E5%BC%82%E6%AD%A5%E7%BB%84%E4%BB%B6
export const scatterEchart = resolve => require.ensure([], () => {
    require('echarts/lib/chart/scatter')
    require('echarts/lib/component/title')
    require('echarts/lib/component/grid')
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/legend')
    resolve(require('vue-echarts/components/ECharts'))
}, "scatter-echarts");

export const barEchart = resolve => require.ensure([], () => {
    require('echarts/lib/chart/bar')
    require('echarts/lib/component/title')
    require('echarts/lib/component/grid')
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/legend')
    require('echarts/lib/component/markPoint.js')
    resolve(require('vue-echarts/components/ECharts'))
}, "bar-echarts");