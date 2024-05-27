<template>
  <div>
    <div :id="'dialog2-' + item.id" class="v-dialog2-div" v-for="item in s_dialog2" :key="item.id" :style="item.style" @mousedown="dialogMouseDown(item)">
      <div class="drag-handle" v-my-drag-handle>
      </div>
      <div class="close-btn-div" @click="close(item)"><i class="fa-solid fa-xmark hover close-btn"></i></div>

      <v-pyramid :item="item" :mapName="mapName" v-if="item.name === 'pyramid'" />
      <v-pyramid-estat :item="item" :mapName="mapName" v-if="item.name === 'pyramid-estat'" />
      <v-jinkosuii :item="item" :mapName="mapName" v-if="item.name === 'jinkosuii'" />
      <v-jinkopie :item="item" :mapName="mapName" v-if="item.name === 'jinkopie'" />
      <v-ssds-bar :item="item" :mapName="mapName" v-if="item.name === 'ssdsbsr'" />

      <v-erev :item="item" :mapName="mapName" v-if="item.name === 'erev'" />

    </div>
  </div>
</template>

<script>
import DialogPyramid from "@/components/Dialog-pyramid"
import DialogPyramidEstat from "@/components/Dialog-pyramid-estat"
import DialogJinkosuii from "@/components/Dialog-jinkosuii"
import Dialogpie from "@/components/Dialog-jinkopie"
import DialogSsdsBer from "@/components/Daialog-ssds-bar"
import DialogErev from "@/components/Daialog-erev"

export default {
  name: "v-dialog2",
  components: {
    'v-pyramid': DialogPyramid,
    'v-pyramid-estat':DialogPyramidEstat,
    'v-jinkosuii':DialogJinkosuii,
    'v-jinkopie':Dialogpie,
    'v-ssds-bar':DialogSsdsBer,
    'v-erev': DialogErev
  },
  props: ['mapName'],
  computed: {
    s_dialog2 () {
      return this.$store.state.base.dialogs2[this.mapName]
    },
  },
  methods: {
    close (item) {
      // const result = this.$store.state.base.dialogs2[this.mapName] .find(el => el.id === item.id);
      // result.style.display = 'none'
      this.$store.state.base.dialogs2[this.mapName] = this.$store.state.base.dialogs2[this.mapName].filter(v => v.id !== item.id);
    },
    dialogMouseDown (item) {
      const result = this.$store.state.base.dialogs2[this.mapName] .find(el => el.id === item.id);
      this.$store.commit('base/incrDialogMaxZindex');
      result.style["z-index"] = this.$store.state.base.dialogMaxZindex
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 0;
}
.v-dialog2-div{
  position: absolute;
  z-index: 10;
  background-color: #fff;
  box-shadow:2px 2px 5px #787878;
  border: 1px solid whitesmoke;
  border-radius: 4px;
  transition: opacity 1s;
  /*left: calc(50% - 250PX);*/
}
.drag-handle{
  height: 30px;
  padding: 5px;
  background-color: rgba(0,60,136,0.5);
  color: white;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  cursor: grab;
}
.close-btn-div{
  position: absolute;
  top: 0;
  right: 5px;
  cursor: pointer;
  color: #fff;
  z-index: 2;
}
.close-btn-div{
  font-size:1.5em;
}
.hover:hover{
  color: blue;
}
.info-content-div{
  padding: 10px;
  /*max-width: 350px;*/
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
