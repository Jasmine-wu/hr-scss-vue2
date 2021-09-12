<template>
  <!-- file-list：上传的文件列表： [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] -->
  <!--limit="1"： 限制上传图片的数量-->
  <!-- 注意：upload显示的是 fileList里的内容-->
  <div>
    <!-- 上传组件 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      :before-upload="onBeforeUpload"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :file-list="fileList"
      action="#"
      :http-request="uploadToCos"
      :class="{ disabled: isShow }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <!-- 上传进度条 -->
    <el-progress
      v-if="showProgess"
      :percentage="percent"
      style="width: 180px"
    ></el-progress>

    <!-- 图片预览弹层 -->
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="previewImgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>
<script>
// 限制图片上传的个数
// 缩略图预览/删除
// 根据图片上传的数量控制是否显示上传+号:计算属性
//  - 问题：删除图片至0张，上传+号并没有显示出来
// -  问题：上传的图片未显示
// 上传之前限制图片上传的数量和size
// 上传至腾讯云
//  - 上传至腾讯云成功以后，fileList里对应图片的url也应该替换成远程url
//  - 并且需要标记该图已上传（已上传的图片才允许用户点击保存）
// 上传进度显示
// 上传成功后处理返回数据

import COS from "cos-js-sdk-v5";
const cos = new COS({
  SecretId: "AKIDQfeNq2ye6J0RbU7TN4UdW9VaOyLTM0PZ",
  SecretKey: "wc4GDuNaXEfrpY2HH1VmnY3IJ4aswlLf",
});
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      previewImgUrl: "", //预览图片地址
      curFileUid: "", //当前上传图片的uid
      percent: 0, //上传进度百分比
      showProgess: false,
    };
  },
  methods: {
    // 上传之前限制文件的类型和大小
    onBeforeUpload(file) {
      // file.type
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式!");

        return false;
      }
      // file.size
      const maxSize = 5 * 1024 * 1024;
      if (maxSize < file.size) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }

      // 记录当前上传图片的uid
      this.curFileUid = file.uid;

      // 显示进度条
      this.showProgess = true;

      return true;
    },
    // 点击预览时触发
    onPreview(file) {
      this.previewImgUrl = file.url;
      this.showDialog = true;
    },

    // 点击删除时触发
    onRemove(file, fileList) {
      // file：要删除的文件
      // fileList：删除文件过后的fileList

      // 手动在vdata fileList里删除删除的图片
      //   this.fileList = this.fileList.filter((item) => item.uid !== file.uid);

      // 或者：
      this.fileList = fileList;
    },

    // 添加文件、上传成功和上传失败时都会被调用
    // 这也是问题，on-change钩子函数会多次被调用
    onChange(file, fileList) {
      this.fileList = fileList.map((item) => item);
    },

    // 上传至腾讯云
    uploadToCos(params) {
      if (params.file) {
        // 上传
        cos.putObject(
          {
            Bucket: "1992sss-1307402657", // 存储桶
            Region: "ap-chengdu", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可

            // 监听上传进度
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },

          // 上传之后的回调函数
          (err, data) => {
            // console.log(err || data);

            // 上传成功后处理返回数据
            if (!err && data.statusCode === 200) {
              // 获取上传成功的返回地址
              // 将fileList中的url地址，替换成上传成功后的服务器返回的url地址，因为fileList才是显示的内容
              // 标记该图片已上传

              // 问题：如何知道上传成功后的远程url对应fileList中的哪个？
              this.fileList.map((item) => {
                if (item.uid === this.curFileUid) {
                  // 替换url
                  item.url = "https://" + data.Location;
                  // 标记该图片已上传: 后续根据这个状态，判断是否可以点击保存。未上传完毕是不允许用户保存图片的
                  item.upload = true;
                }
                return item;
              });
            }
            // 成功或失败都隐藏进度条
            setTimeout(() => {
              this.showProgess = false;
              this.percent = 0;
            }, 1000);
          }
        );
      }
    },
  },
  computed: {
    // 根据图片上传的数量控制是否显示上传+号
    // =1 ,说明以上传了一张图片，不再显示+号上传
    isShow() {
      return this.fileList.length === 1;
    },
  },
};
</script>
<style  >
.disabled .el-upload--picture-card {
  display: none;
}
</style>