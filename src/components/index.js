import PageTools from "@/components/PageTools"
import UploadExcel from "@/components/UploadExcel"
import UploadImage from "@/components/UploadImage"
import Print from "vue-print-nb"
import ScreenFull from '@/components/ScreenFull'
import LangSwitch from "@/components/LangSwitch"
import TagsView from "@/components/TagsView"


export default {
    install(Vue) {
        Vue.component("PageTools", PageTools);
        Vue.component("UploadExcel", UploadExcel);
        Vue.component("UploadImage", UploadImage);
        Vue.use(Print);
        Vue.component('ScreenFull', ScreenFull) // 注册全屏切换组件
        Vue.component('LangSwitch', LangSwitch) // 注册多语言切换组件
        Vue.component('TagsView', TagsView) // 注册多页签切换组件


    }
}