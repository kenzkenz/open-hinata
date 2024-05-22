<template>
  <div class="content-div">
    <p v-html="item.title"></p><hr>
    <div style="text-align: center;">赤色の上限値 {{ s_jinko }}人</div>
    <input type="range" min="100" :max="35100" :step="1000" class="jinko-range" v-model.number="s_jinko" @input="inputJinko" />
    出典 <span v-html="item.summary"></span>
  </div>
</template>

<script>
import * as LayersMvt from '../../js/layers-mvt'
import * as permalink from '../../js/permalink'
import * as MyMap from '../../js/mymap'

export default {
  name: "Dialog-info-jinko",
  props: ['mapName', 'item'],
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    s_jinko: {
      get() { return this.$store.state.info.jinko[this.mapName] },
      set(value) {
        this.$store.state.info.jinko[this.mapName] = value
        LayersMvt.mesh1kmObj[this.mapName].getSource().changed();
      }
    },
  },
  methods: {
    storeUpdate () {
      const jinko = this.s_jinko
      this.$store.commit('base/updateListPart',{mapName: this.mapName, id:this.item.id, values: [jinko]});
      permalink.moveEnd();
    },
    inputJinko () {
      MyMap.history ('人口')
      LayersMvt.mesh1kmObj[this.mapName].getSource().changed();
      permalink.moveEnd();
      this.storeUpdate()
    },
  },
  mounted ()  {
    this.$nextTick(function () {
      LayersMvt.mesh1kmObj[this.mapName].getSource().changed();
    })
  },
  watch: {
  }
}
</script>

<style scoped>
.content-div{
  width: 250px;
  height: 150px;
  padding: 10px;
}
</style>
