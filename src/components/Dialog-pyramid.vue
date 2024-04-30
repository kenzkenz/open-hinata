
<template>
  <v-dialog :dialog="S_mainInfoDialog">
    <button class="updataGraph" value="0" >80</button>
    <button class="updataGraph" value="1" >85</button>
    <button class="updataGraph" value="2" >90</button>
    <button class="updataGraph" value="3" >95</button>
    <button class="updataGraph" value="4" >00</button>
    <button class="updataGraph" value="5" >05</button>
    <button class="updataGraph" value="6" >10</button>
    <button class="updataGraph" value="7" >15</button>
    <button class="updataGraph" value="8" >20</button>
    <button class="updataGraph" value="9" >25</button>
    <button class="updataGraph" value="10" >30</button>
    <button class="updataGraph" value="11" >35</button>
    <button class="updataGraph" value="12" >40</button>
    <button class="updataGraph" value="13" >45</button>

    <button id="renzoku">連続</button>
      <div class="d3-pyramid">

      </div>

<!--      <svg id="d3-pyramid" width="350" :height="350" style="border: 1px dotted"></svg>-->


  </v-dialog>
</template>

<script>
import store from "@/js/store";
import * as d3 from "d3"
import axios from "axios";
import {transform} from "ol/proj";
let ccc

export default {
  name: "Dialog-pyramid",
  data () {
    return {
      // contentSize: {'height': 'auto', 'width': 'auto', 'margin': '10px', 'overflow': 'auto', 'user-select': 'text'},
      // width: 500,
      // height: 500,
      // r: 75
    }
  },
  computed: {
    S_mainInfoDialog () {
      return this.$store.state.base.dialogs.pyramidDialog
    },
    S_cityCode () {
      return this.$store.state.base.cityCode
    },
  },
  methods: {
  },
  watch: {
    S_cityCode: {
      handler: function () {
        const resasApiKey = "ZKE7BccwVM8e2onUYC7iX2tnuuZwZJfuOTf3rL93";
        const resasUrl = "https://opendata.resas-portal.go.jp/api/v1/"
        const cityCode = this.$store.state.base.cityCode
        let cityName = this.$store.state.base.cityName
        const prefCode = this.$store.state.base.prefCode
        console.log(cityCode)
        console.log(cityName)
        console.log(prefCode)
        cityName = cityName.replace('役所','').replace('役場','')
        console.log(cityName)
        const yearRights = ['1980','1985','1990','1995','2000', '2005', '2010','2015','2020','2025','2030','2035','2040','2045']
        async function created() {
          const fetchData = yearRights.map((yearRight) => {
            return axios
                .get(resasUrl +'population/composition/pyramid',{
                  headers:{'X-API-KEY':resasApiKey},
                  params: {
                    prefCode:prefCode,
                    cityCode:cityCode,
                    yearLeft:"2000",
                    yearRight:yearRight,
                  }
                })
          })
          await Promise.all([
            ...fetchData
          ])
              .then((response) => {
                // console.log(response)
                aaa (response)
              })
              .catch(function (response) {
                console.log(response);
              })
        }
        created()

        function aaa (response) {
          console.log(response[0].data.result.yearRight.data)

          // 1. データの準備
          let  data = response[8].data.result.yearRight.data

          // set the dimensions and margins of the graph
          const margin = {top: 20, right: 20, bottom: 30, left: 20}
          const width = 400 - margin.left - margin.right
          const height = 250 - margin.top - margin.bottom
          const womanMargin = 200
          //

// set the ranges
          const y = d3.scaleBand()
              .range([height, 0])
              .padding(0.1);
          const y2 = d3.scaleBand()
              .range([height, 0])
              .padding(0.1);
          const x = d3.scaleLinear()
              .range([womanMargin, width]);
          const x2 = d3.scaleLinear()
              // .range([0, width-240])
              // .range([width-240,0]
                  .range([width - womanMargin-20,0])


          d3.select(".d3-pyramid svg").remove()

          var svg = d3.select(".d3-pyramid").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

          svg.append("text")
              .attr("fill", "black")
              .attr("transform", "translate(" + 30 + "," + 0 + ")")
              // .attr("dy", "5px")
              .attr("font", "10px")
              .attr("text-anchor", "middle")
              .attr("class", "city-name")
              .text(cityName + '2020');

          x.domain([0, d3.max(data, function(d){ return d.woman; })])
          x2.domain(
                  [0,d3.max(data, function(d){ return d.man; })]
          )
          y.domain(data.map(function(d) { return d.class; }));
          y2.domain(data.map(function(d) { return d.class; }));
          //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

          // append the rectangles for the bar chart
          svg.selectAll(".bar")
              .data(data)
              .enter().append("rect")
              .attr("class", "bar")
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

              .attr("y", function(d) { return y(d.class); })
              .attr("height", y.bandwidth())
              .attr("transform", "translate(" + 0 + "," + 0 + ")")
              .attr("fill", "steelblue")
              .attr("width", 0)
              .attr("x", function(d) {
                return width/2 -40;
              })
              .transition()
              .duration(1500)
              .delay(200)
              .attr("x", function(d) {return x2(d.man);})
              .attr("width", function(d) {
                return width -x2(d.man) -womanMargin-20
              })

          // add the x Axis
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x).ticks(4));
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              // .call(d3.axisBottom(x2))
              .call(d3.axisBottom(x2).ticks(4));
          // add the y Axis
          svg.append("g")
              .attr("transform", "translate(" + womanMargin + "," + 0 + ")")
              .call(d3.axisLeft(y));

          d3.selectAll(".updataGraph")
              .on("click",aaa);
          function aaa(e) {
            const count = Number(e.srcElement.getAttribute("value"))
            let year
            data = response[count].data.result.yearRight.data
            year = 1980 + (count*5)
            svg
                .selectAll(".city-name")
                .text(cityName + year)
            svg
                .selectAll(".bar")
                .data(data)
                .transition()
                .attr("width", function(d) {
                  return x(d.woman) - womanMargin
                })
            svg
                .selectAll(".bar-man")
                .data(data)
                .transition()
                .attr("x", function(d) {return x2(d.man);})
                .attr("width", function(d) {
                  return width -x2(d.man) -womanMargin-20
                })
          }

          d3.select("#renzoku")
              .on("click",function(){
                let count = 0
                ccc = function(){
                  let year
                  if(count < 15){
                    data = response[count].data.result.yearRight.data
                        year = 1980 + (count*5)
                    svg
                        .selectAll(".city-name")
                        .text(cityName + year)
                    svg
                        .selectAll(".bar")
                        .data(data)
                        .transition()
                        .attr("width", function(d) {
                          return x(d.woman) - womanMargin
                        })
                    svg
                        .selectAll(".bar-man")
                        .data(data)
                        .transition()
                        .attr("x", function(d) {return x2(d.man);})
                        .attr("width", function(d) {
                          return width -x2(d.man) -womanMargin-20
                        })
                    count++
                    console.log(9999)
                    setTimeout(function(){ccc()},500);
                  } else {
                    clearTimeout(ccc)
                  }
                }
                ccc()
              });



          // var width = 400; // グラフの幅
          // var height = 300; // グラフの高さ
          // var padding = 30; // スケール表示用マージン
          //
          // // 2. SVG領域の設定
          // // var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
          // var svg = d3.select('#d3-pyramid');
          //
          // // 3. 軸スケールの設定
          // var xScale = d3.scaleBand()
          //     .rangeRound([padding, width - padding])
          //     .padding(0.1)
          //     .domain(dataset.map(function(d) { return d.class; }));
          //
          // var yScale = d3.scaleLinear()
          //     .domain([0, d3.max(dataset, function(d) { return d.man; })])
          //     .range([height - padding, padding]);
          //
          // // 4. 軸の表示
          // svg.append("g")
          //     .attr("transform", "translate(" + 0 + "," + (height - padding) + ")")
          //     .call(d3.axisBottom(xScale));
          //
          // svg.append("g")
          //     .attr("transform", "translate(" + padding + "," + 0 + ")")
          //     .call(d3.axisLeft(yScale));
          //
          // // 5. バーの表示
          // svg.append("g")
          //     .selectAll("rect")
          //     .data(dataset)
          //     .enter()
          //     .append("rect")
          //     .attr("x", function(d) {
          //       console.log(d)
          //       return xScale(d.class);
          //     })
          //     .attr("y", function(d) { return yScale(d.man); })
          //     .attr("width", xScale.bandwidth())
          //     .attr("height", function(d) { return height - padding - yScale(d.man); })
          //     .attr("fill", "steelblue");




        }






        // ------------------------------
        // axios
        //       .get(resasUrl +'population/composition/pyramid',{
        //         headers:{'X-API-KEY':resasApiKey},
        //         params: {
        //           prefCode:prefCode,
        //           cityCode:cityCode,
        //           yearLeft:"2000",
        //           yearRight:"2030",
        //         }
        //       })
        //     .then(function (response) {
        //       console.log(response)
        //     })
        //     .catch(function (error) {
        //     })
        //     .finally(function () {
        //     })
        //-----------------------------------
      },
    }
  },
  mounted () {
    // var svg = d3.select('#d3-pyramid');
    // this.circle = svg.append('circle')
    //     .attr('cx', 40)
    //     .attr('cy', 25)
    //     .attr('r', 75)
    //     .style('fill','rgba(255, 0, 0, 0.8)')




    this.$watch(function () {

    });
  }
}
</script>

<style scoped>
.content-div{
  width: 500px;
  padding: 10px;
}
</style>
