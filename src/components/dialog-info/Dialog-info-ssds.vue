<template>
  <div class="content-div" id="ssds-div">
    <p v-html="statText"></p><hr>
<!--    <select v-model="selectNumber" :change="selectIndex(item.value)" style="width:100%;">-->
<!--      <option v-for="item in valueList" :value="item.value">{{item.title}}</option>-->
<!--    </select>-->
    <div style="max-height: 400px;overflow: auto;overflow-x: hidden;margin-bottom: 10px;">
    <input type="text" placeholder="統計データを抽出します..." v-model="treeFilter" class="filter-field">
    <tree
        :filter="treeFilter"
        :data="treeData"
        :options="treeOptions"
        @node:selected="onNodeSelected"
    />
    </div>
    e-stat
<!--    <div style="text-align: center;">赤色の上限値 {{ s_jinko }}人</div>-->
<!--    <input type="range" min="10" :max="6110" :step="100" class="jinko-range" v-model.number="s_jinko" @input="inputJinko" />-->
<!--    出典 <span v-html="item.summary"></span>-->
  </div>
</template>

<script>
import LiquorTree from 'liquor-tree'
import * as LayersMvt from '@/js/layers-mvt'
import * as permalink from '@/js/permalink'
import * as MyMap from '@/js/mymap'
import axios from "axios";
import * as d3 from "d3";
import * as Layers from '@/js/layers'
import {treeDataPref} from "@/js/treeData";

export default {
  name: "Dialog-info-ssds",
  props: ['mapName', 'item'],
  components: {
    [LiquorTree.name]: LiquorTree
  },
  data () {
    return {
      statText:'',
      treeFilter: '',
      treeData: treeDataPref,
      treeOptions: {
        filter: {
          emptyText: '見つかりませんでした。'
        }
      },
      selectNumber: 1,
      valueList: [
        {title:"one", value:1},
        {title:"two", value:2}
      ],
    }
  },
  computed: {
    // s_jinko: {
    //   get() { return this.$store.state.info.jinko250m[this.mapName] },
    //   set(value) {
    //     this.$store.state.info.jinko250m[this.mapName] = value
    //     LayersMvt.mesh250Obj[this.mapName].getSource().changed()
    //   }
    // },
  },
  methods: {
    storeUpdate () {
      const jinko = this.s_jinko
      this.$store.commit('base/updateListPart',{mapName: this.mapName, id:this.item.id, values: [jinko]});
      permalink.moveEnd();
    },
    inputJinko () {
      MyMap.history ('250mmesh人口')
      LayersMvt.mesh250Obj[this.mapName].getSource().changed();
      permalink.moveEnd();
      this.storeUpdate()
    },
    onNodeSelected: function (node) {
      const vm = this
      if (node.children.length === 0) {
        console.log(node.data.text)
        vm.$store.state.base.ssdsStatName = node.data.text
        vm.statText = node.data.text
        axios
            .get('https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData', {
              params: {
                appId: '5797c9f94cb117eca0c4e72ca1bd3dddad95c4a5',
                // statsDataId: '0000010101',
                statsDataId: node.data.id,
                cdCat01: node.data.cat01,
                metaGetFlg: 'Y',
                annotationGetFlg: 'Y',
                sectionHeaderFlg: '1',
                replaceSpChars: '0'
              }
            }).then(function (response) {
              console.log(response)
              const data = response.data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE
              vm.$store.state.info.ssdsData00[vm.mapName] = data
              const maxTime = d3.max(data, function(d){ return d['@time']; })
              let maxTimeResult = data.filter((v)=>{
                return v['@time'] === maxTime
              })
              maxTimeResult = maxTimeResult.filter((v) =>{
                return v['@area'] !== '00000'
              })
              maxTimeResult.sort(function(a, b) {
                if (Number(a['$']) < Number(b['$'])) {
                  return 1;
                } else {
                  return -1;
                }
              })
              vm.$store.state.info.ssdsData[vm.mapName] = maxTimeResult
              LayersMvt.ssdsPrefObj[vm.mapName].getSource().changed();
        })
      }
    }
  },
  mounted ()  {
    const vm = this
    const parentElement = document.querySelector('#ssds-div').parentElement;
    const dragHandle = parentElement.querySelector('.drag-handle')
    dragHandle.innerHTML = '社会・人口統計体系'
    this.$nextTick(function () {
      LayersMvt.ssdsPrefObj[this.mapName].getSource().changed();
    })
  },
  watch: {
  }
}
</script>

<style scoped>
.content-div{
  width: 350px;
  /*height: 400px;*/
  /*max-height: 400px;*/
  padding: 10px;
  overflow:hidden;
}
.drag-handle{
  color: white;
}
.tree{
  font-size: small!important;
}
</style>
