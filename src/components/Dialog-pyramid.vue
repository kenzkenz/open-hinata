
<template>
  <v-dialog :dialog="S_mainInfoDialog">
    <div :style="contentSize">



    </div>
  </v-dialog>
</template>

<script>
import store from "@/js/store";

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
    },
    S_cityCode () {
      return this.$store.state.base.cityCode
    },
  },
  methods: {
  },
  watch: {
    S_cityCode: {
      handler: function () {
        alert()
      },
    }
  },
  mounted () {
    console.log(this.$store.state.base.cityCode)
    this.$watch(function () {

    });
  }
}
</script>

<style scoped>

</style>
