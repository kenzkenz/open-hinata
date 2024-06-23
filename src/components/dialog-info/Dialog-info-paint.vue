<template>
  <div class="content-div">
    <p v-html="item.title"></p><hr>
    <div style="text-align: center;">
      <label :for="'paint-check-'+ item.component.name">塗りつぶし</label><input :id="'paint-check-'+ item.component.name" type="checkbox" v-model="s_paint" @change="paintChange">
    </div>
    <hr>
    出典 <span v-html="item.summary"></span>
  </div>
</template>

<script>
import * as LayersMvt from '@/js/layers-mvt'
import * as permalink from '@/js/permalink'
import {syougakkoukuObj, tyugakkokuR05MvtObj, tyuugakkoukuObj} from "@/js/layers-mvt";

export default {
  name: "Dialog-info-paint",
  props: ['mapName', 'item'],
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    layer () {
      console.log(this.item.component.name)
      switch (this.item.component.name) {
        case 'syogakkoR05':
          return LayersMvt.syougakkoukuR05MvtObj[this.mapName]
          break
        case 'syogakkoR03':
          return LayersMvt.syougakkoukuObj[this.mapName]
          break
        case 'tyugakkoR05':
          return LayersMvt.tyugakkokuR05MvtObj[this.mapName]
          break
        case 'tyugakkoR03':
          return LayersMvt.tyuugakkoukuObj[this.mapName]
          break
      }
    },
    paintGetSet: {
      get() {
          switch (this.item.component.name) {
            case 'syogakkoR05':
              return this.$store.state.info.paintCheckSyogakkoR05[this.mapName]
              break
            case 'syogakkoR03':
              return this.$store.state.info.paintCheckSyogakkoR03[this.mapName]
              break
            case 'tyugakkoR05':
              return this.$store.state.info.paintCheckTyugakkoR05[this.mapName]
              break
            case 'tyugakkoR03':
              return this.$store.state.info.paintCheckTyugakkoR03[this.mapName]
              break
          }
      },
      set(value) {
        switch (this.item.component.name) {
          case 'syogakkoR05':
            this.$store.state.info.paintCheckSyogakkoR05[this.mapName] = value
            break
          case 'syogakkoR03':
            this.$store.state.info.paintCheckSyogakkoR03[this.mapName] = value
            break
          case 'tyugakkoR05':
            this.$store.state.info.paintCheckTyugakkoR05[this.mapName] = value
            break
          case 'tyugakkoR03':
            this.$store.state.info.paintCheckTyugakkoR03[this.mapName] = value
            break
        }
      }
    },
    s_paint: {
      get() {
        return this.paintGetSet
      },
      set(value) {
        this.paintGetSet = value
        this.layer.getSource().changed()
      }
    },
  },
  methods: {
    paintChange (value) {
      this.layer.getSource().changed()
      this.storeUpdate()
    },
    storeUpdate () {
      const paint = this.s_paint
      this.$store.commit('base/updateListPart',{mapName: this.mapName, id:this.item.id, values: [paint]});
      permalink.moveEnd();
    },
  },
  mounted ()  {
    this.$nextTick(function () {
      this.layer.getSource().changed()
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
