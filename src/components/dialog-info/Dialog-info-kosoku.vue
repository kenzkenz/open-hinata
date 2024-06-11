<template>
  <div class="content-div">
    <p v-html="item.title"></p><hr>
    <div style="text-align: center;">{{ s_kosoku }}年</div>
    <input type="range" min="1962" :max="2024" :step="1" class="kosoku-range" v-model.number="s_kosoku" @input="inputKosoku" />
    <hr>
    出典 <span v-html="item.summary"></span>
  </div>
</template>

<script>
import * as LayersMvt from '@/js/layers-mvt'
import * as permalink from '@/js/permalink'
import * as MyMap from '@/js/mymap'

export default {
  name: "Dialog-info-kosoku",
  props: ['mapName', 'item'],
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    s_kosoku: {
      get() { return this.$store.state.info.kosoku[this.mapName] },
      set(value) {
        this.$store.state.info.kosoku[this.mapName] = value
        LayersMvt.kosoku2023Obj[this.mapName].getSource().changed()
      }
    },
  },
  methods: {
    storeUpdate () {
      const kosoku = this.s_kosoku
      this.$store.commit('base/updateListPart',{mapName: this.mapName, id:this.item.id, values: [kosoku]});
      permalink.moveEnd()
    },
    inputKosoku () {
      MyMap.history ('高速時系列')
      LayersMvt.kosoku2023Obj[this.mapName].getSource().changed();
      permalink.moveEnd();
      this.storeUpdate()
    },
  },
  mounted ()  {
    this.$nextTick(function () {
      LayersMvt.kosoku2023Obj[this.mapName].getSource().changed();
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
