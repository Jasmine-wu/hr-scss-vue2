import PageTools from "@/components/PageTools"
import UploadExcel from "@/components/UploadExcel"
import UploadImage from "@/components/UploadImage"


export default {
    install(Vue) {
        Vue.component("PageTools", PageTools);
        Vue.component("UploadExcel", UploadExcel);
        Vue.component("UploadImage", UploadImage);
    }
}