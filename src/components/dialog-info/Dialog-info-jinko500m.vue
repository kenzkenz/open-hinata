<template>
  <div class="content-div">
    <p v-html="item.title"></p><hr>
    <div style="text-align: center;">赤色の上限値 {{ s_jinko }}人</div>
    <input type="range" min="10" :max="30110" :step="100" class="jinko-range" v-model.number="s_jinko" @input="inputJinko" />

    <div style="text-align: center;font-size: small">
      <label for="paint-check-500m">塗りつぶし</label><input id="paint-check-500m" type="checkbox" v-model="s_paint" @change="paintChangge">
    </div>
    <hr>
    出典 <span v-html="item.summary"></span>
  </div>
</template>

<script>
import * as LayersMvt from '@/js/layers-mvt'
import * as permalink from '@/js/permalink'
import * as MyMap from '@/js/mymap'

export default {
  name: "Dialog-info-jinko500m",
  props: ['mapName', 'item'],
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    s_paint: {
      get() {
        return this.$store.state.info.paintCheck500m[this.mapName]
      },
      set(value) {
        this.$store.state.info.paintCheck500m[this.mapName] = value
        LayersMvt.mesh500Obj[this.mapName].getSource().changed()
      }
    },
    s_jinko: {
      get() { return this.$store.state.info.jinko500m[this.mapName] },
      set(value) {
        this.$store.state.info.jinko500m[this.mapName] = value
        LayersMvt.mesh500Obj[this.mapName].getSource().changed();
      }
    },
  },
  methods: {
    paintChangge (value) {
      console.log(this.s_paint)
      LayersMvt.mesh500Obj[this.mapName].getSource().changed()
      this.storeUpdate()
    },
    storeUpdate () {
      const jinko = this.s_jinko
      const paint = this.s_paint
      this.$store.commit('base/updateListPart',{mapName: this.mapName, id:this.item.id, values: [jinko,paint]});
      permalink.moveEnd();
    },
    inputJinko () {
      MyMap.history ('500mmesh人口')
      LayersMvt.mesh500Obj[this.mapName].getSource().changed();
      permalink.moveEnd();
      this.storeUpdate()
    },
  },
  mounted ()  {
    this.$nextTick(function () {
      LayersMvt.mesh500Obj[this.mapName].getSource().changed();
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
