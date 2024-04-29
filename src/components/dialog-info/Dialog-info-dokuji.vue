<template>
  <div style="padding: 10px;">
    タイルURL<br>
    <input type='text' @input="onInput" v-model="s_dokujiUrl" style="width: 300px;"><br><br>
    URLは記録されません。テスト用です。
 </div>
</template>
<script>
import * as permalink from '../../js/permalink'
import store from "@/js/store";
export default {
  name: "Dialog-info-dokuji",
  props: ['mapName', 'item'],
  data () {
    return {
      picked: '',
      btnSize: 'sm',
      groupName:[],
      formationAge:[]
    }
  },
  computed: {
    s_layerList: {
      get () {return store.getters['base/layerList'](this.mapName)},
      set (value) { store.commit('base/updateList', {value: value, mapName: this.mapName}) }
    },
    s_dokujiUrl:{
        get() {
          return this.$store.state.info.dokujiUrl[this.mapName].url
        },
        set(value) {
          this.$store.commit('base/updateListPart',{mapName: this.mapName, id:this.item.id, values: [{url:value}]});
          this.$store.commit('info/updateDokujiUrl',{mapName: this.mapName, value: {url:value}})
          permalink.moveEnd()
        }
    },
  },
  methods: {
    // changeRadio: function() {
    //   console.log(this.picked)
    // },
    onInput: function() {
      console.log(this.s_dokujiUrl)
      const map = store.state.base.maps[this.mapName];
      const result = this.s_layerList.find((el) => el.id === 'dokuji');
      console.log(result.layer.getSource())
      result.layer.getSource().setUrl(this.s_dokujiUrl)
      result.layer.getSource().changed()
      map.render();
    }
  },
  mounted ()  {
    this.onInput()
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