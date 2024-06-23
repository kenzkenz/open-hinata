<template>
  <div class="content-div">
    <p v-html="item.title"></p><hr>
    <div style="text-align: center;">
      <label :for="'paint-check-'+ item.component.name">塗りつぶし</label><input :id="'paint-check-'+ item.component.name" type="checkbox" v-model="s_paint" @change="paintChange">
      <label style="margin-left: 20px;" :for="'text-check-'+ item.component.name">学校名</label><input :id="'text-check-'+ item.component.name" type="checkbox" v-model="s_text" @change="textChange">

    </div>
    <hr>
    出典 <span v-html="item.summary"></span>
  </div>
</template>

<script>
import * as LayersMvt from '@/js/layers-mvt'
import * as permalink from '@/js/permalink'

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
    textGetSet: {
      get() {
        switch (this.item.component.name) {
          case 'syogakkoR05':
            return this.$store.state.info.textCheckSyogakkoR05[this.mapName]
            break
          case 'syogakkoR03':
            return this.$store.state.info.textCheckSyogakkoR03[this.mapName]
            break
          case 'tyugakkoR05':
            return this.$store.state.info.textCheckTyugakkoR05[this.mapName]
            break
          case 'tyugakkoR03':
            return this.$store.state.info.textCheckTyugakkoR03[this.mapName]
            break
        }
      },
      set(value) {
        switch (this.item.component.name) {
          case 'syogakkoR05':
            this.$store.state.info.textCheckSyogakkoR05[this.mapName] = value
            break
          case 'syogakkoR03':
            this.$store.state.info.textCheckSyogakkoR03[this.mapName] = value
            break
          case 'tyugakkoR05':
            this.$store.state.info.textCheckTyugakkoR05[this.mapName] = value
            break
          case 'tyugakkoR03':
            this.$store.state.info.textCheckTyugakkoR03[this.mapName] = value
            break
        }
      }
    },
    s_text: {
      get() {
        return this.textGetSet
      },
      set(value) {
        this.textGetSet = value
        this.layer.getSource().changed()
      }
    },
  },
  methods: {
    textChange (value) {
      this.layer.getSource().changed()
      this.storeUpdate()
    },
    paintChange (value) {
      this.layer.getSource().changed()
      this.storeUpdate()
    },
    storeUpdate () {
      const paint = this.s_paint
      const text = this.s_text
      this.$store.commit('base/updateListPart',{mapName: this.mapName, id:this.item.id, values: [paint,text]});
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
