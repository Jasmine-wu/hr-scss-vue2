// 自定义指令文件

// 指令对象
// 指令赋值是在指令作用元素初始化时
export const imgerror = {
    // 组件初始化时：
    // inserted: 指令作用的元素插入父节点之后执行，且只执行一次！有问题
    inserted: function(dom, options) {

        // 当图片src是空串""或者有值，但图片加载出错时，会触发img的onerror事件
        // 问题：src=null时并不会触发onerror事件
        // 因此需单独处理null值：
        dom.src = dom.src || options.value;

        // 监听onerror事件
        dom.onerror = function() {
            // 一旦出错，加载默认本地图片
            this.src = options.value;
        }

    },
    // componentUpdated:指令作用的组件数据更新完毕后调用
    // 假如在组件使用过程中，再次对img src赋值，这时inserted钩子函数不会被调用
    // 因为：inserted执行是在指令作用的元素插入父节点之后执行，且只执行一次

    // 组件初始化后，发生数据更新时，会调用
    componentUpdated(dom, options) {
        dom.src = dom.src || options.value;

    },
}