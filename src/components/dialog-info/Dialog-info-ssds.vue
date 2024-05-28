<template>
  <div class="content-div" id="ssds-div">
    <p v-html="statText"></p><hr>
    <div class="ssds-tree">
      <input type="text" placeholder="統計データを抽出します..." v-model="treeFilter" class="filter-field">
      <tree
          :filter="treeFilter"
          :data="treeData"
          :options="treeOptions"
          @node:selected="onNodeSelected"
      />
    </div>
  </div>
</template>

<script>
import LiquorTree from 'liquor-tree'
import * as LayersMvt from '@/js/layers-mvt'
// import * as permalink from '@/js/permalink'
// import * as MyMap from '@/js/mymap'
import axios from "axios";
import * as d3 from "d3";
import {treeDataPref} from "@/js/treeDataPref"
import {treeDataCity} from "@/js/treeDataCity"
import muni from '@/js/muni'

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
      // treeData: treeDataPref,
      treeOptions: {
        filter: {
          emptyText: '見つかりませんでした。'
        }
      },
    }
  },
  computed: {
    treeData () {
      if (this.item.id === 'ssdsPref') {
        return treeDataPref
      } else {
        return treeDataCity
      }
    },
  },
  methods: {
    onNodeSelected: function (node) {
      const vm = this
      if (node.children.length === 0) {
        d3.select('.loadingImg').style("display","block")
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
              // console.log(response)
              const data = response.data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE
              vm.$store.state.info.ssdsData00[vm.mapName] = data
              const maxTime = d3.max(data, function(d){ return d['@time']; })
              let maxTimeResult = data.filter((v)=>{
                return v['@time'] === maxTime
              })
              maxTimeResult = maxTimeResult.filter((v) =>{
                // console.log(v['@area'],v['@area'].slice(-1))
                let splitMuni
                if (muni[Number(v['@area'])]) {
                  splitMuni = muni[Number(v['@area'])].split(',')[3]
                  if (splitMuni.slice(-1) === '区' && v['@area'].slice(0,2) !== '13') {
                    // console.log(splitMuni)
                    return
                  }
                }
                return v['@area'] !== '00000'
                    && v['@area'] !== '13100'
              })
              maxTimeResult.sort(function(a, b) {
                if (Number(a['$']) < Number(b['$'])) {
                  return 1;
                } else {
                  return -1;
                }
              })
              // console.log(maxTimeResult)
              vm.$store.state.info.ssdsData[vm.mapName] = maxTimeResult
              LayersMvt.ssdsPrefObj[vm.mapName].getSource().changed()
              LayersMvt.ssdsCityObj[vm.mapName].getSource().changed()
              d3.select('.loadingImg').style("display","none")
        })
      }
    }
  },
  mounted ()  {
    console.log(this.item.id)
    const vm = this
    const parentElement = document.querySelector('#ssds-div').parentElement;
    const dragHandle = parentElement.querySelector('.drag-handle')
    dragHandle.innerHTML = this.item.title
  },
}
</script>

<style scoped>
.content-div{
  width: 350px;
  padding: 10px;
}
.ssds-tree{
  max-height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 10px;
  -webkit-overflow-scrolling:touch;
}
.drag-handle{
  color: white;
}
.tree{
  font-size: small!important;
}
</style>
