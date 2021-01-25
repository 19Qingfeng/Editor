<template>
  <div class="event-base event-music">
    <div class="edit-btn clearfix">
      <div class="btn-wrapper">
        <div class="event-type">{{ parseEventType(eventType) }}</div>
        <el-button type="danger" size="mini" @click="hanldeDelete"
          >删除</el-button
        >
      </div>
    </div>
    <div class="event-wrapper">
      <div class="title">类型:</div>
      <el-input
        :disabled="true"
        size="mini"
        :value="getTypeName(type)"
      ></el-input>
    </div>
    <div class="event-wrapper">
      <div class="title">配音:</div>
      <el-select size="mini" v-model="curPlaySound">
        <el-option
          v-for="source in curAnimationBookSource"
          :key="source.id"
          :value="source.id"
          :label="source.name"
        />
      </el-select>
    </div>
    <div class="event-wrapper">
      <div class="title">延迟:</div>
      <el-input size="mini" v-model="curDelay">
        <template>
          <div slot="append">ms</div>
        </template>
      </el-input>
    </div>
    <div class="event-wrapper loop-play">
      <div class="title">循环播放</div>
      <el-checkbox v-model="curLoop" />
    </div>
  </div>
</template>

<script>
import CommonMixins from "./mixins";
export default {
  mixins: [CommonMixins]
};
</script>
<style lang="scss" scoped>
.event-music {
  .event-wrapper {
    display: flex;
    margin: 5px 0;
    .title {
      width: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .loop-play {
    .title {
      margin-right: 5px;
    }
  }
}
</style>
