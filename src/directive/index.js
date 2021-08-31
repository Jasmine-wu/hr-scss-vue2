// 自定义指令文件

// 指令对象
export const imgerror = {
    // inserted: 指令作用的元素插入父节点之后
    inserted: function(dom, options) {

        // 当图片src是空值或者有值，但图片加载出错时，会触发img的onerror事件
        // 监听onerror事件
        dom.onerror = function() {
            // 一旦出错，加载默认本地图片
            this.src = options.value;
        }

    }
}