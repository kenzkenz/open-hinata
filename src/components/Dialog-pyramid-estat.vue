
<template>
  <div :id="id">
<!--    aaaaaaa-->
<!--    <img class='loadingImg' src="https://kenzkenz.xsrv.jp/open-hinata/img/loading.gif" style="position: absolute;top:50%;left:50%;z-index:1;">-->
    <div class="d3-pyramid"></div>
    <!--      <svg id="d3-pyramid" width="350" :height="350" style="border: 1px dotted"></svg>-->
  </div>
</template>

<script>
import store from "@/js/store";
import * as d3 from "d3"
import axios from "axios";
import {transform} from "ol/proj";
let renzoku

export default {
  name: "Dialog-pyramid-estat",
  props: ['mapName', 'item'],
  data () {
    return {
    }
  },
  computed: {
    id () {
      return 'pyramid-estat-' + this.item.id
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
    console.log(this.id)
    resasD3()
    function resasD3 () {
      const elements = document.querySelectorAll('.v-dialog2-div')
      const len = elements.length
      if (len>1) {
        if (elements[len-2].style.top === '60px') {
          elements[len-1].style.top = '100px'
          elements[len-1].style.right = '50px'
        }
      }
      elements[len-1].style.width = '550px'
      // ---------------------------------------------------------------------------
      d3.select('#' + vm.id + ' .d3-pyramid svg').remove()
      d3.select('#' + vm.id + ' .loadingImg').style("display","block")

      //----------------------------------------------------------------
      const dialog2DragHandle = document.querySelector('#dialog2-' + vm.item.id + ' .drag-handle')
      dialog2DragHandle.innerHTML = vm.$store.state.base.syochiikiName

      //----------------------------------------------------------------
      d3Create (vm.$store.state.base.estatDataset)
      function d3Create (response) {
        // console.log(response[0].data.result.yearRight.data)
        // let  data = response[8].data.result.yearRight.data
        let  data = response

        const margin = {top: 20, right: 20, bottom: 30, left: 20}
        let width = 500 - margin.left - margin.right
        let height = 400 - margin.top - margin.bottom
        let womanMargin = 230

        if (window.innerWidth > 600) {
          elements[len-1].style.width = '550px'
          width = 550 - margin.left - margin.right
          height = 400 - margin.top - margin.bottom
          womanMargin = 285
        } else {
          elements[len-1].style.width = '350px'
          width = 350 - margin.left - margin.right
          height = 200 - margin.top - margin.bottom
          womanMargin = 185
        }

        // let  data = response[8].data.result.yearRight.data

        const y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);
        const y2 = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);
        const x = d3.scaleLinear()
            .range([womanMargin, width]);
        const x2 = d3.scaleLinear()
            .range([width - womanMargin-0,0])

        // d3.select(".d3-pyramid svg").remove()

        const svg = d3.select('#' + vm.id + ' .d3-pyramid').append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // svg.append("text")
        //     .attr("fill", "black")
        //     .attr("transform", "translate(" + 30 + "," + 0 + ")")
        //     // .attr("dy", "5px")
        //     .attr("font", "10px")
        //     // .attr("text-anchor", "middle")
        //     .attr("class", "city-name")
        //     .text(cityName + '2020');
        console.log(data)
        console.log(d3.max(data, function(d){ return d.woman; }))
        let max
        if (d3.max(data, function(d){ return d.woman; }) > d3.max(data, function(d){ return d.man; })) {
          max = d3.max(data, function(d){ return d.woman; })
        } else {
          max = d3.max(data, function(d){ return d.man; })
        }


        x.domain([0, max])
        x2.domain([0,max])

        y.domain(data.map(function(d) { return d.class; }));
        y2.domain(data.map(function(d) { return d.class; }));

        const tooltip = d3.select("body").append("div").attr("class", "d3tooltip");
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .on("mouseover", function(event, data) {
              tooltip
                  .style("visibility", "visible")
                  .html("年齢:" + data.class + "<br>人数: " + data.woman + "人");
            })
            .on("mousemove", function(event) {
              tooltip
                  .style("top", (event.pageY - 20) + "px")
                  .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function(d) {
              tooltip.style("visibility", "hidden");
            })
            .attr("y", function(d) { return y(d.class); })
            .attr("height", y.bandwidth())
            .attr("transform", "translate(" + womanMargin + "," + 0 + ")")
            .attr("fill", "pink")
            .attr("width", 0)
            .transition()
            .duration(1500)
            .delay(200)
            .attr("width", function(d) {
              return x(d.woman) - womanMargin
            })

        svg.selectAll(".bar-man")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-man")
            .on("mouseover", function(event, data) {
              tooltip
                  .style("visibility", "visible")
                  .html("年齢:" + data.class + "<br>人数: " + data.man + "人");
            })
            .on("mousemove", function(event) {
              tooltip
                  .style("top", (event.pageY - 20) + "px")
                  .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function(d) {
              tooltip.style("visibility", "hidden");
            })
            .attr("y", function(d) { return y(d.class); })
            .attr("height", y.bandwidth())
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .attr("fill", "steelblue")
            .attr("width", 0)
            .attr("x", function(d) {
              return width/2 -30;
            })
            // .attr("x", function(d) {return x2(d.man)/;})
            .transition()
            .duration(1500)
            .delay(200)
            .attr("x", function(d) {return x2(d.man);})
            .attr("width", function(d) {
              return width -x2(d.man) -womanMargin-0
            })

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(4))
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x2).ticks(4))
        svg.append("g")
            .attr("transform", "translate(" + womanMargin + "," + 0 + ")")
            .call(d3.axisLeft(y))
        // svg.append("g")
        //     .attr("transform", "translate(" + womanMargin -40 + "," + 0 + ")")
        //     .call(d3.axisRight(y).tickValues([]))


      }
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
