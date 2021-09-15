// 多语言实例化文件

import Vue from "vue"
import VueI18n from "vue-i18n"
import Cookie from "js-cookie"
// 导入element-ui语言包
import ElementEn from "element-ui/lib/locale/lang/en"
import ElementZh from "element-ui/lib/locale/lang/zh-CN"
import ElementJa from "element-ui/lib/locale/lang/ja"
// 导入自定义语言包
import CustomZh from "./zh"
import CustomEn from "./en"


Vue.use(VueI18n);
export default new VueI18n({
    // 当前语言是什么？
    // zh/en 名字随便
    locale: Cookie.get("lang") || "zh",

    // 当前语言对应加载哪个语言包?
    // 语言包应包括: 第三方组件库的语言包+自定义语言包
    messages: {
        // 中文
        zh: {
            ...ElementZh,
            ...CustomZh,
        },
        // 英文
        en: {
            ...ElementEn,
            ...CustomEn
        },
        // 日文
        ja: {
            ...ElementJa
        }
    }

});