import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg component

// 全局注册svg-icon
Vue.component('svg-icon', SvgIcon)

// 将src/icons/svg目录下的所有.svg图片引入到项目中
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)