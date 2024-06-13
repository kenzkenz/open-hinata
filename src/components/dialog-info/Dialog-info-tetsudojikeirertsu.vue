<template>
  <div class="content-div">
    <p v-html="item.title"></p><hr>
    <div style="text-align: center;">{{ s_jikeiretsu }}年</div>
    <input type="range" min="1950" :max="2024" :step="1" class="jikeiretsu-range" v-model.number="s_jikeiretsu" @input="inputJikeiretsu" />
    <hr>
    出典 <span v-html="item.summary"></span>
  </div>
</template>

<script>
import * as LayersMvt from '@/js/layers-mvt'
import * as permalink from '@/js/permalink'
import * as MyMap from '@/js/mymap'
import {tetsudojikeiretsuObj} from "@/js/layers-mvt";

export default {
  name: "Dialog-info-tetsudojikeiretsu",
  props: ['mapName', 'item'],
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    s_jikeiretsu: {
      get() { return this.$store.state.info.tetsudoJikeiretsu[this.mapName] },
      set(value) {
        this.$store.state.info.tetsudoJikeiretsu[this.mapName] = value
        LayersMvt.tetsudojikeiretsuObj[this.mapName].getSource().changed()
      }
    },
  },
  methods: {
    storeUpdate () {
      const jikeiretsu = this.s_jikeiretsu
      this.$store.commit('base/updateListPart',{mapName: this.mapName, id:this.item.id, values: [jikeiretsu]});
      permalink.moveEnd()
    },
    inputJikeiretsu () {
      MyMap.history ('鉄道時系列')
      LayersMvt.tetsudojikeiretsuObj[this.mapName].getSource().changed();
      permalink.moveEnd();
      this.storeUpdate()
    },
  },
  mounted ()  {
    this.$nextTick(function () {
      LayersMvt.tetsudojikeiretsuObj[this.mapName].getSource().changed();
    })
  },
  watch: {
  }
}
</script>

<style scoped>
.content-div{
  width: 250px;
  /*height: 390px;*/
  padding: 10px;
}
</style>
