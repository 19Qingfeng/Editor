<template>
  <div>canvas:{{ curAnimationBook }}</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("picture", ["curAnimationBook"])
  }
};
</script>

<style></style>
