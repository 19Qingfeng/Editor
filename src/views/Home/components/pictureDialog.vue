<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    custom-class="home-body-dialog"
    :before-close="handleClose"
  >
    <div class="wrapper" v-loading="loading">
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
          <div class="replace-img button--itzel" @click="addCoverImg">替换</div>
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

<script lang="ts">
import Vue from "vue";
import { PictureBook, BaseInfo, Source } from "../../../types/index";
import { ipcRenderer } from "electron";
import { basename } from "path";
import { v4 } from "uuid";
import { parseExceltoJson } from "../../../utils/excel";
import { getAllSourcePath } from "../../../utils/zip";
import Component from "vue-class-component";

const GreetingProps = Vue.extend({
  props: {
    isShow: Boolean,
    id: String
  }
});

@Component
export default class PictureDialog extends GreetingProps {
  imgPath = ""; // 背景图路径
  zipPath = ""; // zip包资源file协议路径
  originZipPath = ""; // zip包资源原始路径
  unZipDirPath = ""; // 资源解压后的路径 非file协议
  loading = false;
  title = "添加绘本";
  form = {
    name: "1",
    author: "2",
    tag: [1],
    age: 0,
    category: 0,
    preview: "预览",
    guidance: "指导"
  };
  categoryList = [
    {
      value: 0,
      label: "基础认知"
    },
    {
      value: 1,
      label: "情绪与社交"
    },
    {
      value: 2,
      label: "行为习惯"
    }
  ];
  tagList = [
    { label: "动物", value: 1 },
    { label: "母爱", value: 2 }
  ];
  ageList = [
    { label: "1-2岁", value: 0 },
    { label: "2-4岁", value: 1 }
  ];
  rules = {
    name: [{ max: 32, message: "最多输入32位", trigger: "blur" }],
    author: [{ max: 20, message: "最多输入20位", trigger: "blur" }],
    preview: [{ max: 200, message: "最多输入200位", trigger: "blur" }],
    guidance: [{ max: 200, message: "最多输入200位", trigger: "blur" }],
    zip: [{ validator: this.validateZip, trigger: "blur" }]
  };
  get dialogVisible() {
    return this.isShow;
  }
  set dialogVisible(val) {
    this.$emit("update:isShow", val);
  }
  get formatZipPath() {
    return this.zipPath ? basename(this.zipPath) : "";
  }
  created() {
    this.initEvent();
    this.initData();
  }
  initData(): void {
    const id = this.id;
    const pictureList = this.$store.state.picture.pictureList;
    if (!id) return;
    const info = pictureList.find((i: any) => i.id === id);
    if (!info) return;
    this.backfillPicture(info);
  }
  backfillPicture(info: PictureBook): void {
    const {
      baseInfo: { name, author, tag, age, category, preview, guidance },
      cover,
      zip
    } = info;
    this.form = {
      name,
      author,
      tag,
      age,
      category,
      preview,
      guidance
    };
    this.imgPath = cover;
    this.zipPath = zip;
  }
  initEvent(): void {
    ipcRenderer.on("on-upload-cover-success", (event, params) => {
      this.uploadCoverSuccess(params);
    });
    ipcRenderer.on("on-upload-zip-success", (event, params) => {
      this.uploadZipSuccess(params);
    });
  }
  validateZip(value: any, rule: any, callback: any) {
    if (!this.zipPath) {
      callback(new Error("zip包必填"));
    } else {
      callback();
    }
  }
  uploadCoverSuccess({ filePath }: any): void {
    this.imgPath = filePath;
  }
  uploadZipSuccess({ filePath, originPath }: any): void {
    this.zipPath = filePath;
    this.originZipPath = originPath;
    // 解压之后
  }
  handleClose(): void {
    this.dialogVisible = false;
  }
  addCoverImg(): void {
    ipcRenderer.send("on-upload-cover-img");
  }
  onUploadZip() {
    ipcRenderer.send("on-upload-zip");
  }
  initWordListByXlsx(sourceList: Source[]): { data: any; output: string } {
    // 拿到所有的source然后查找是否name是xlsl结尾的文件
    // 如果存在格式化成json然后保存在本地
    const xlsl = sourceList.find((source: Source) => {
      return source.name.endsWith(".xlsx");
    });
    const obj: { data: any; output: string } = parseExceltoJson(xlsl);
    return obj;
    // 不是则给sourceList什么都不操作
  }
  getParams(
    sourceList: Source[],
    { data, output }: { data: any; output: string }
  ): PictureBook {
    const { name, author, tag, age, category, preview, guidance } = this.form;
    const baseInfo: BaseInfo = {
      name,
      author,
      tag,
      age,
      category,
      preview,
      guidance
    };
    const cover = this.imgPath;
    const zip = this.zipPath;
    return {
      id: v4(),
      baseInfo,
      cover,
      sourceList,
      zip,
      wordPath: output,
      wordList: data,
      animationBookList: []
    };
  }
  onSavePicture(picture: PictureBook) {
    this.$store.dispatch("picture/addPictureBook", picture);
  }
  async onSave() {
    try {
      this.loading = true;
      await (this.$refs["form"] as any).validate();
      const sourceList: Source[] = await getAllSourcePath(this.originZipPath);
      // 解析excel生成json保存在当前路径下
      const wordObj = this.initWordListByXlsx(sourceList);
      const params = this.getParams(sourceList, wordObj);
      // 接下来就应该保存当前绘本信息
      this.onSavePicture(params);
      console.log(params, "params");
      this.dialogVisible = false;
    } catch (err) {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
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
        margin-top: 5px;
        background: $bg-primary;
        color: $font-primary;
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
