<template>
  <div style="padding: 10px;">
    カラースケール上限値<br>
    <input type='number' @input="onInput" v-model="s_zyougen" style="width: 100px;">円<br><br>
    出典＝<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-L01-v3_1.html' target='_blank'>国土数値情報地価公示データ</a>
 </div>
</template>
<script>
import * as MvtLayers from '../../js/layers-mvt'
import * as permalink from '../../js/permalink'
export default {
  name: "Dialog-info-seamless",
  props: ['mapName', 'item'],
  data () {
    return {
      btnSize: 'sm',
      groupName:[],
      formationAge:[]
    }
  },
  computed: {
    s_zyougen: {
      get() {
        return this.$store.state.info.kouzi[this.mapName]
      },
      set(value) {
        this.$store.commit('base/updateListPart',{mapName: this.mapName, id:this.item.id, values: [value]});
        this.$store.commit('info/updateKouzi',{mapName: this.mapName, value: value})
        permalink.moveEnd()
      }
    },
  },
  methods: {
    onInput: function() {
      MvtLayers.kouziH19Obj[this.mapName].getSource().changed()
      MvtLayers.kouziH25Obj[this.mapName].getSource().changed()
      MvtLayers.kouziH30Obj[this.mapName].getSource().changed()
      MvtLayers.kouziR04Obj[this.mapName].getSource().changed()
    }
  },
  mounted ()  {

  },
  watch: {

  }
}
</script>

<style scoped>
.olbtn{
  background-color: rgba(0,60,136,0.5);
}
li {
  list-style-type: none;
}
#group-name-div{
  margin: 5px;
  border: 1px solid grey;
  padding: 5px;
}

</style>