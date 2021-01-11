<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    custom-class="home-body-dialog"
    :before-close="handleClose"
  >
    <div class="wrapper">
      <div class="left">
        <div
          class="no-img"
          v-if="!imgPath"
          @click="addCoverImg"
          title="添加图片"
        >
          +
        </div>
        <template v-if="imgPath">
          <img class="img" :src="imgPath" alt="" />
          <div class="replace-img button--itzel" @click="replaceImg">替换</div>
        </template>
      </div>
      <div class="right">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="绘本名称" prop="name">
            <el-input
              v-model.trim="form.name"
              placeholder="请输入绘本名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="作者姓名">
            <el-input v-model="form.author" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="选择分类">
            <el-radio-group v-model="form.category">
              <el-radio
                v-for="radio in categoryList"
                :key="radio.value"
                :label="radio.value"
              >
                {{ radio.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择标签">
            <el-select v-model="form.tag" multiple placeholder="请选择标签">
              <el-option
                v-for="tag in tagList"
                :label="tag.label"
                :value="tag.value"
                :key="tag.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择年龄">
            <el-select v-model="form.age" placeholder="请选择年龄">
              <el-option
                v-for="age in ageList"
                :label="age.label"
                :value="age.value"
                :key="age.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简介" prop="preview">
            <el-input type="textarea" v-model="form.preview"></el-input>
          </el-form-item>
          <el-form-item label="早教指导" prop="guidance">
            <el-input type="textarea" v-model="form.guidance"></el-input>
          </el-form-item>
          <el-form-item label="压缩包" prop="zip">
            <el-button v-if="!zipPath" @click="onUploadZip">上传</el-button>
            <div class="zip-wrapper" v-else>
              <div>{{ formatZipPath }}</div>
              <div class="tip" @click="onUploadZip">更换</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div slot="footer">
      <el-button type="primary" @click="onSave" :loading="loading"
        >创 建</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "HomeDialog",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit("update:isShow", val);
      },
    },
    formatZipPath() {
      return "";
      // return (this as any).zipPath ? basename(this.zipPath) : "";
    },
  },
  data() {
    const validateZip = (value, rule, callback) => {
      if (!this.zipPath) callback(new Error("zip包必填"));
      else callback();
    };
    return {
      imgPath: "", // 背景图路径
      zipPath: "", // zip包资源file协议路径
      originZipPath: "", // zip包资源原始路径
      unZipDirPath: "", // 资源解压后的路径 非file协议
      loading: false,
      title: "添加绘本",
      form: {
        name: "1",
        author: "2",
        tag: [1],
        age: 0,
        category: 0,
        preview: "预览",
        guidance: "指导",
      },
      categoryList: [
        {
          value: 0,
          label: "基础认知",
        },
        {
          value: 1,
          label: "情绪与社交",
        },
        {
          value: 2,
          label: "行为习惯",
        },
      ],
      tagList: [
        { label: "动物", value: 1 },
        { label: "母爱", value: 2 },
      ],
      ageList: [
        { label: "1-2岁", value: 0 },
        { label: "2-4岁", value: 1 },
      ],
      rules: {
        name: [{ max: 32, message: "最多输入32位", trigger: "blur" }],
        author: [{ max: 20, message: "最多输入20位", trigger: "blur" }],
        preview: [{ max: 200, message: "最多输入200位", trigger: "blur" }],
        guidance: [{ max: 200, message: "最多输入200位", trigger: "blur" }],
        zip: [{ validator: validateZip, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    addCoverImg() {
      //  nothing
    },
    onUploadZip() {
      //  nothing
    },
    onSave() {
      // nothing
    },
  },
};
</script>

<style lang='scss'>
.home-body-dialog {
  min-width: 675px;
  .wrapper {
    display: flex;
    .left {
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .no-img,
      img {
        width: 100%;
        height: 100%;
      }
      .no-img {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        border: 1px solid rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 48px;
        cursor: pointer;
      }
      .img {
        flex: 1;
      }
      .replace-img {
        height: 26px;
        color: #ddd;
        line-height: 26px;
        cursor: pointer;
        text-align: center;
        width: 100%;
        border-radius: 10px;
        transition: all 0.5s;
        &:hover {
          color: #4a5a6a;
          background: #cafedb;
        }
      }
    }
    .right {
      flex: 1;
      .zip-wrapper {
        display: flex;

        .tip {
          cursor: pointer;
          color: #606266;
          font-size: 12px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>