
<template>
  <div :id="id">
    <div class="d3-ssds-bar"></div>
  </div>
</template>

<script>

import * as d3 from "d3"

export default {
  name: "Dialog-ssds-bar",
  props: ['mapName', 'item'],
  data () {
    return {
    }
  },
  computed: {
    id () {
      return 'ssds-bar-' + this.item.id
    }
  },
  methods: {
  },
  watch: {
  },
  mounted () {
    const vm = this
    barD3()
    function barD3 () {
      const elements = document.querySelectorAll('.v-dialog2-div')
      const len = elements.length
      if (len>1) {
        elements[len-1].style.top = Number(elements[len-2].style.top.replace('px','')) + 40 + 'px'
        if (window.innerWidth > 600) {
          elements[len-1].style.left = Number(elements[len-2].style.left.replace('px','')) - 40 + 'px'
        }
      }

      const dataset = vm.$store.state.info.ssdsDataBar
      // console.log(dataset)

      const dialog2DragHandle = document.querySelector('#dialog2-' + vm.item.id + ' .drag-handle')
      dialog2DragHandle.innerHTML = vm.$store.state.base.cityName + ' ' + vm.$store.state.base.ssdsStatName

      let width = 700; // グラフの幅
      const height = 300; // グラフの高さ
      const paddingTop = 35; // スケール表示用マージン
      const paddingRight = 10
      let paddingBottom = 40
      let paddingLeft = 70
      let fontSize = '12px'

      if (dataset.length <= 10) {
        width = 500
      }

      if (window.innerWidth < 600) {
        width = 350
        paddingLeft = 65
        paddingBottom = 40
        fontSize = '9px'
      }

      const svg = d3.select('#' + vm.id + ' .d3-ssds-bar')
          .append("svg")
          .attr("width", width)
          .attr("height", height)

      svg.append("text")
          .attr("fill", "black")
          .attr("transform", "translate(" + (10) + "," + (paddingTop - 10) + ")")
          .attr("font-size", fontSize)
          // .attr("text-anchor", "middle")
          .text(dataset[0].unit);

      const xScale = d3.scaleBand()
          .rangeRound([paddingLeft, width - paddingRight])
          .padding(0.1)
          .domain(dataset.map(function(d) { return d.year; }));

      let min = d3.min(dataset, function(d) { return d.value; })
      let max = d3.max(dataset, function(d) { return d.value; })
      if (min > 0) {
        min = 0
      }
      if (max < 0) {
        max = 0
      }
      const yScale = d3.scaleLinear()
          .domain([min, max])
          .range([height - paddingBottom, paddingBottom])

      const xs = svg.append("g")
          .attr("transform", "translate(" + 0 + "," + (height - paddingBottom) + ")")
          .call(d3.axisBottom(xScale));
      // if (window.innerWidth < 600) {
        xs.selectAll('text')
            .style('text-anchor', 'start')
            .attr('dx', '1em')
            .attr('dy', '-0.5em')
            .attr('transform', 'rotate(90)')
      // }
      svg.append("g")
          .attr("transform", "translate(" + paddingLeft + "," + 0 + ")")
          .call(d3.axisLeft(yScale));

      const tooltip = d3.select("body").append("div").attr("class", "d3tooltip");

      svg.append("g")
          .selectAll("rect")
          .data(dataset)
          .enter()
          .append("rect")
          .on("mouseover", function(event, data) {
            tooltip
                .style("visibility", "visible")
                .html(data.value.toLocaleString() + dataset[0].unit);
          })
          .on("mousemove", function(event) {
            tooltip
                .style("top", (event.pageY - 20) + "px")
                .style("left", (event.pageX + 10) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.style("visibility", "hidden");
          })
          .attr("x", function(d) { return xScale(d.year); })
          .attr("width", xScale.bandwidth())
          .attr("height",0)
          .attr('y', height - paddingBottom)
          .transition()
          .duration(1500)
          .delay(200)
          .attr("y", function(d) {
            if (d.value>0) {
              return yScale(d.value)
            } else {
              return yScale(0)
            }
          })
          .attr("height", function(d) {
            return  Math.abs(yScale(d.value) - yScale(0))
          })
          .attr("fill", function(d) {
            if (d.value>0) {
              return "lightsteelblue"
            } else {
              return "pink"
            }
          });
    }
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
