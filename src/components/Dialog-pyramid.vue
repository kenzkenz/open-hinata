
<template>
  <v-dialog :dialog="S_mainInfoDialog">
    <div :style="contentSize">



    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "Dialog-pyramid",
  data () {
    return {
      contentSize: {'height': 'auto', 'margin': '10px', 'overflow': 'auto', 'user-select': 'text'},
    }
  },
  computed: {
    S_mainInfoDialog () {
      return this.$store.state.base.dialogs.pyramidDialog
    }
  },
  methods: {
  },
  mounted () {
    this.$watch(function () {

    });
  }
}
</script>

<style scoped>

</style>
