
<template>
  <div :id="id">
    <!--    aaaaaaa-->
    <!--    <img class='loadingImg' src="https://kenzkenz.xsrv.jp/open-hinata/img/loading.gif" style="position: absolute;top:50%;left:50%;z-index:1;">-->
    <div class="d3-jinkosuii"></div>
    <!--      <svg id="d3-pyramid" width="350" :height="350" style="border: 1px dotted"></svg>-->
  </div>
</template>

<script>
import store from "@/js/store";
import * as d3 from "d3"
import axios from "axios";
import {transform} from "ol/proj";

export default {
  name: "Dialog-jinkosuii",
  props: ['mapName', 'item'],
  data () {
    return {
    }
  },
  computed: {
    id () {
      return 'jinkosuii-' + this.item.id
    },
    // S_mainInfoDialog () {
    //   return this.$store.state.base.dialogs.pyramidDialog[this.mapName]
    // },
    // S_cityCode () {
    //   return this.$store.state.base.cityCode[this.mapName]
    // },
  },
  methods: {
  },
  watch: {
  },
  mounted () {
    const vm = this
    resasD3()
    function resasD3 () {
      const elements = document.querySelectorAll('.v-dialog2-div')
        const len = elements.length
        if (len>1) {
          elements[len-1].style.top = Number(elements[len-2].style.top.replace('px','')) + 40 + 'px'
          if (window.innerWidth > 600) {
            elements[len-1].style.left = Number(elements[len-2].style.left.replace('px','')) - 40 + 'px'
          }
        }
      // 1. データの準備

      const datasetAll = vm.$store.state.base.jinkosuiiDataset[0].data.result.data[0].data
      const datasetNensyo = vm.$store.state.base.jinkosuiiDataset[0].data.result.data[1].data
      const datasetSeisan = vm.$store.state.base.jinkosuiiDataset[0].data.result.data[2].data
      const datasetRonen = vm.$store.state.base.jinkosuiiDataset[0].data.result.data[3].data

      console.log(datasetAll)
      console.log(datasetNensyo)

      const dialog2DragHandle = document.querySelector('#dialog2-' + vm.item.id + ' .drag-handle')
      dialog2DragHandle.innerHTML = vm.$store.state.base.cityName + '　人口推移'

      let width = 550; // グラフの幅
      const height = 300; // グラフの高さ
      const padding = 30; // スケール表示用マージン
      let paddingBottom = 30
      let paddingLeft = 70
      let fontSize = '12px'

      if (window.innerWidth < 600) {
        width = 350
        paddingLeft = 65
        paddingBottom = 40
        fontSize = '9px'
      }

      // 2. SVG領域の設定
      const svg = d3.select('#' + vm.id + ' .d3-jinkosuii')
          .append("svg")
          .attr("width", width)
          .attr("height", height)

      svg.append("text")
          .attr("fill", "black")
          .attr("transform", "translate(" + (width/2) + "," + (padding-10) + ")")
          // .attr("dy", "5px")
          .attr("font-size", fontSize)
          .attr("text-anchor", "middle")
          // .attr("class", "city-name")
          .text('棒=人口、緑色線=年少人口率、青色線=生産年齢人口率、赤色線=老年人口率');

      // 3. 軸スケールの設定
      const xScale = d3.scaleBand()
          .rangeRound([paddingLeft, width - padding])
          .padding(0.1)
          .domain(datasetAll.map(function(d) { return d.year; }));

      const yScale = d3.scaleLinear()
          .domain([0, d3.max(datasetAll, function(d) { return d.value; })])
          .range([height - paddingBottom, paddingBottom]);

      const yScaleNensyou = d3.scaleLinear()
          .domain([0, 100])
          .range([height - paddingBottom, paddingBottom]);

      // 4. 軸の表示
      const xs = svg.append("g")
          .attr("transform", "translate(" + 0 + "," + (height - paddingBottom) + ")")
          // .attr('transform', 'rotate(-90)')
          .call(d3.axisBottom(xScale));
      if (window.innerWidth < 600) {
        xs.selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-1em')
            .attr('dy', '-0.7em')
            .attr('transform', 'rotate(-90)')
      }
      svg.append("g")
          .attr("transform", "translate(" + paddingLeft + "," + 0 + ")")
          .call(d3.axisLeft(yScale));
      svg.append("g")
          .attr("transform", "translate(" + (width - padding) + "," + 0 + ")")
          .call(d3.axisRight(yScaleNensyou));
      // . バーの表示
      svg.append("g")
          .selectAll("rect")
          .data(datasetAll)
          .enter()
          .append("rect")
          .attr("x", function(d) { return xScale(d.year); })
          .attr("y", function(d) { return yScale(d.value); })
          .attr("width", xScale.bandwidth())
          .attr("height", function(d) { return height - paddingBottom - yScale(d.value); })
          .attr("fill", "lightsteelblue");

      // . ラインの表示
      const pathNensyou = svg.append("path")
          .datum(datasetNensyo)
          .attr("fill", "none")
          .attr("stroke", "green")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
              .x(function(d) { return xScale(d.year); })
              .y(function(d) { return yScaleNensyou(d.rate); }))
          .attr("transform", "translate(" + xScale.bandwidth()/2 + "," + 0 + ")")
      const pathSeisan = svg.append("path")
          .datum(datasetSeisan)
          .attr("fill", "none")
          .attr("stroke", "blue")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
              .x(function(d) { return xScale(d.year); })
              .y(function(d) { return yScaleNensyou(d.rate); }))
          .attr("transform", "translate(" + xScale.bandwidth()/2 + "," + 0 + ")")
      const pathRonen = svg.append("path")
          .datum(datasetRonen)
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
              .x(function(d) { return xScale(d.year); })
              .y(function(d) { return yScaleNensyou(d.rate); }))
          .attr("transform", "translate(" + xScale.bandwidth()/2 + "," + 0 + ")")

    }


    this.$watch(function () {
    });
  }
}
</script>

<style>
.d3tooltip {
  position: absolute;
  text-align: center;
  width: auto;
  height: auto;
  padding: 2px;
  font-size: 14px;
  background: white;
  -webkit-box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.8);
  -moz-box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.8);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.8);
  visibility: hidden;
  border-radius:2px;
  z-index: 9999;
}
</style>
<style scoped>
.content-div{
  width: 500px;
  padding: 10px;
}

</style>
