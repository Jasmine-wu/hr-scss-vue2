import PageTools from "@/components/PageTools"
import UploadExcel from "@/components/UploadExcel"
import UploadImage from "@/components/UploadImage"
import Print from "vue-print-nb"


export default {
    install(Vue) {
        Vue.component("PageTools", PageTools);
        Vue.component("UploadExcel", UploadExcel);
        Vue.component("UploadImage", UploadImage);
        Vue.use(Print);
    }
}