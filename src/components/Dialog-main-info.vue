<template>
    <v-dialog :dialog="S_mainInfoDialog">
        <div :style="contentSize">
          <p>製作者＝kenzkenzです。</p>
          <p><a href="https://github.com/kenzkenz/open-hinata" target="_blank" >github</a>です。</p>
          <p><a href="https://twitter.com/kenzkenz" target="_blank">twitter</a>です。</p>
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
      S_mainInfoDialog () {
        return this.$store.state.base.dialogs.mainInfoDialog
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
