<template>
    <v-dialog :dialog="s_dialogEdit0" id="dialog-edit0">
        <div :style="contentSize">
          <b-button :pressed.sync="s_togglePoint" class='olbtn' size="sm">{{ s_togglePoint ? 'ポイント描画ON' : 'ポイント描画OFF' }}</b-button>
          <br><br>
          <p>このダイアログが開いているときに編集モードになります。</p>
        </div>
    </v-dialog>
</template>

<script>
    import * as MyMap from '../js/mymap'

    export default {
    name: "mainInfo",
    data () {
      return {
        contentSize: {'height': 'auto', 'margin': '10px', 'overflow': 'auto', 'user-select': 'text'},
      }
    },
    computed: {
      s_dialogEdit0 () {
        return this.$store.state.base.dialogs.dialogEdit0
      },
      s_togglePoint: {
        get() {
          return this.$store.state.base.togglePoint
        },
        set(value) {
          this.$store.state.base.togglePoint = value
        }
      },
    },
    methods: {
    },
    mounted () {
      this.$watch(function () {
        return [this.s_togglePoint]
      }, function () {
        if (this.s_togglePoint) {
          this.$store.state.base.maps['map01'].addInteraction(MyMap.pointInteraction)
          // this.$store.state.base.maps['map01'].addInteraction(MyMap.modifyInteraction2)
        } else {
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.pointInteraction)
          // this.$store.state.base.maps['map01'].removeInteraction(MyMap.modifyInteraction2)
        }
      })
    }
  }
</script>

<style scoped>
.olbtn{
  background-color: rgba(0,60,136,0.5);
}
.olbtn:hover{
  background-color: rgba(0,60,136,0.7);
}
</style>
