
<template>
  <div :id="id">
    <div class="d3-erev"></div>
  </div>
</template>

<script>
import * as d3 from "d3"
import Point from 'ol/geom/Point.js'
import Feature from 'ol/Feature.js'
import * as MyMap from '../js/mymap'
import { transform} from 'ol/proj'

export default {
  name: "Dialog-pyramid",
  props: ['mapName', 'item'],
  data () {
    return {
    }
  },
  computed: {
    id () {
      return 'erev-' + this.item.id
    },
  },
  methods: {
  },
  watch: {
  },
  mounted () {
    const vm = this
    const dataset = this.$store.state.base.erevArr
    const tani = dataset[0].tani
    const soukyori = dataset[0].tDistance
    const saikouErev = d3.max(dataset, function(d) { return d.erev; })
    const dialog2DragHandle = document.querySelector('#dialog2-' + vm.item.id + ' .drag-handle')
    dialog2DragHandle.innerHTML = '距離=' + soukyori + ' 最高標高' + saikouErev + 'm'

    const width = 500; // グラフの幅
    const height = 400; // グラフの高さ
    const margin = { "top": 30, "bottom": 60, "right": 30, "left": 60 };

    // 2. SVG領域の設定
    // var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
    const svg = d3.select('#' + vm.id + ' .d3-erev').append("svg")
        .attr("width", width)
        .attr("height", height)

    // 3. 軸スケールの設定
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) {return d.kyori;})])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) { return d.erev; })])
        .range([height - margin.bottom, margin.top]);

    // 4. 軸の表示
    const axisx = d3.axisBottom(xScale).ticks(5);
    const axisy = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
        .attr("transform", "translate(" + 0 + "," + (height - margin.bottom) + ")")
        .call(axisx)
        .append("text")
        .attr("fill", "black")
        .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "10pt")
        // .attr("font-weight", "bold")
        .text("距離(" + dataset[0].tani +  ")");

    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        .call(axisy)
        .append("text")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("x", -(height - margin.top - margin.bottom) / 2 - margin.top)
        .attr("y", -35)
        .attr("transform", "rotate(-90)")
        // .attr("font-weight", "bold")
        .attr("font-size", "10pt")
        .text("標高(m)");

    // 5. ラインの表示

    const path = svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return xScale(d.kyori); })
            .y(function(d) { return yScale(d.erev); }));

    let totalLength = path.node().getTotalLength();
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .delay(200)
        .attr("stroke-dashoffset", 0);

    // 5. バーの表示
    svg.append("g")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.kyori); })
        // .attr("y", function(d) { return yScale(d.erev); })
        .attr("y", function(d) { return margin.top; })
        .attr("width", 2)
        // .attr("height", function(d) { return height - margin.bottom - yScale(d.erev); })
        .attr("height", function(d) { return height - margin.bottom; })
        .attr("fill", "rgb(0,0,0,0)")
        .on("mouseover", function(event, data) {
          let coord = data.coord
          coord = transform(coord, "EPSG:4326", "EPSG:3857")
          const geometry = new Point(coord);
          const newFeature = new Feature({
            geometry: geometry,
          });
          MyMap.danmenLayer.getSource().clear()
          MyMap.danmenLayer.getSource().addFeature(newFeature)
          d3.select(this).attr("fill", "steelblue")
        })
        .on("mouseout", function(d) {
          d3.select(this).attr("fill", "rgb(0,0,0,0)")
        })

    svg.on("mouseout", function(d) {
      d3.select(this).attr("fill", "rgb(0,0,0,0)")
      MyMap.danmenLayer.getSource().clear()
    })

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
