<template>
  <div class="content-div" id="ssds-div">
    <p v-html="statText"></p>
    <vue-slider style="width: 90%; margin-left: 16px;"
                v-model="sliderValue"
                :adsorb="true"
                :drag-on-click="true"
                :data="sliderData"
    ></vue-slider>
    <hr>
    <div class="ssds-tree">
      <input type="text" placeholder="統計データを抽出します..." v-model="treeFilter" class="filter-field">
      <tree
          :filter="treeFilter"
          :data="treeData"
          :options="treeOptions"
          @node:selected="onNodeSelected"
      />
    </div>
    <span class="estat-summary">
      <a href="https://www.e-stat.go.jp/api/" target="_blank"> e-Stat</a>
      「このサービスは、政府統計総合窓口(e-Stat)のAPI機能を使用していますが、サービスの内容は国によって保証されたものではありません。」
    </span>
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
      month:'',
      ssdsData: [],
      ssdsText: '',
      sliderValue: '',
      sliderData: [],
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
        vm.ssdsText = node.data.text
        // console.log(vm.ssdsText)
        vm.$store.state.base.ssdsStatName = vm.ssdsText
        // vm.statText = node.data.text
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
              let data = response.data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE
              vm.$store.state.info.ssdsData00[vm.mapName] = data

              data = data.filter((v) =>{
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
              data.sort(function(a, b) {
                if (Number(a['$']) < Number(b['$'])) {
                  return 1;
                } else {
                  return -1;
                }
              })
              vm.ssdsData = data

              // 初期時の抽出、直近の年で抽出----------------------------------------
              const maxTime = d3.max(vm.ssdsData, function(d){ return d['@time']; })
              vm.month = maxTime.slice(4)
              vm.statText = maxTime.slice(0,4) + ' ' + node.data.text
              let maxTimeResult = vm.ssdsData.filter((v)=>{
                return v['@time'] === maxTime
              })
              maxTimeResult.sort(function(a, b) {
                if (Number(a['$']) < Number(b['$'])) {
                  return 1;
                } else {
                  return -1;
                }
              })
              vm.$store.state.info.ssdsData[vm.mapName] = maxTimeResult
              LayersMvt.ssdsPrefObj[vm.mapName].getSource().changed()
              LayersMvt.ssdsCityObj[vm.mapName].getSource().changed()
              // スライドバーの設定-----------------------------------------
              const sliderData0 = data.filter((v) => {
                if (vm.item.id === 'ssdsPref') {
                  if (v['@area'] === '45000'){
                    return v
                  }
                } else {
                  if (v['@area'] === '45201'){
                    return v
                  }
                }
              })
              const sliderData = sliderData0.map((v) => {
                  return v['@time'].slice(0,4)
              })
              sliderData.sort(function(a, b) {
                if (Number(a) > Number(b)) {
                  return 1;
                } else {
                  return -1;
                }
              })
              vm.sliderData = sliderData
              vm.sliderValue = maxTime.slice(0,4)
              // ----------------------------------------------------------
              d3.select('.loadingImg').style("display","none")
        })
      }
    }
  },
  watch: {
    sliderValue : function () {
      // スライドバーの選択年で抽出---------------------------------
      const selectedTime = this.sliderValue
      this.statText = selectedTime + ' ' + this.ssdsText
      let selectedResult = this.ssdsData.filter((v)=>{
        return v['@time'] === selectedTime + this.month
      })
      selectedResult.sort(function(a, b) {
        if (Number(a['$']) < Number(b['$'])) {
          return 1;
        } else {
          return -1;
        }
      })
      this.$store.state.info.ssdsData[this.mapName] = selectedResult
      if (this.item.id === 'ssdsPref') {
        LayersMvt.ssdsPrefObj[this.mapName].getSource().changed()
      } else {
        LayersMvt.ssdsCityObj[this.mapName].getSource().changed()
      }
    }
  },
  mounted ()  {
    console.log(this.item.id)
    const vm = this
    const parentElement = document.querySelector('#ssds-div').parentElement;
    const dragHandle = parentElement.querySelector('.drag-handle')
    dragHandle.innerHTML = this.item.title

    // let cnt = 0
    // function aaa () {
    //   treeDataPref.forEach(value => {
    //     // console.log(value)
    //     if (!value.children) cnt++
    //     function bbb (v1) {
    //       if (v1.children) {
    //         v1.children.forEach(v2 => {
    //           // console.log(v2)
    //           if (!v2.children) cnt++
    //           if (v2.children) bbb(v2)
    //         })
    //       }
    //     }
    //     bbb(value)
    //   })
    // }
    // aaa()
    // console.log('背景' + cnt + '件')
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
.estat-summary{
  font-size: small;
}
.drag-handle{
  color: white;
}
.tree{
  font-size: small!important;
}
.vue-slider-dot-handle{
  width: 150%!important;
}
</style>
<style>

</style>