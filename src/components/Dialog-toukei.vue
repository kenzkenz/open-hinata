<template>
    <v-dialog :dialog="S_toukei">
        <div :style="contentSize">
          
        </div>
    </v-dialog>
</template>

<script>

    export default {
    name: "mainInfo",
    data () {
      return {
        contentSize: {'height': 'auto', 'margin': '10px', 'overflow': 'auto', 'user-select': 'text'},
      }
    },
    computed: {
      S_toukei () {
        return this.$store.state.base.dialogs.toukei
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
