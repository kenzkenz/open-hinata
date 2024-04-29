
<template>
  <v-dialog :dialog="S_mainInfoDialog">

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
        const yearRights = ['2000', '2005', '2010']
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

          // var svg = d3.select('#d3-pyramid');
          // this.circle = svg.append('circle')
          //     .attr('cx', 40)
          //     .attr('cy', 25)
          //     .attr('r', 75)
          //     .style('fill','rgba(255, 0, 0, 0.8)')



          // 1. データの準備
          const  data = response[0].data.result.yearRight.data

          // set the dimensions and margins of the graph
          const margin = {top: 20, right: 20, bottom: 30, left: 40}
          const width = 480 - margin.left - margin.right
          const height = 250 - margin.top - margin.bottom
          const womanMargin = 240
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
              // .range([width,womanMargin])
              .range([0, width-240])
              .range([width-240,0])
              // .range([womanMargin, width]);
              // .range([xPadding,width/2 - xCenterPadding/2])

          // var x3 = d3.scaleLinear()
          //     .domain([0, maxPopulation])
          //     .range([width/2 - xCenterPadding/2,xPadding]);



// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin

          // var svg = d3.select("body").append("svg")

          d3.select(".d3-pyramid svg").remove()

          var svg = d3.select(".d3-pyramid").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

          svg.append("text")
              .attr("fill", "black")
              // .attr("transform", function(d) { return "translate(" + text.centroid(d) + ")"; })
              // .attr("dy", "5px")
              .attr("font", "10px")
              .attr("text-anchor", "middle")
              .text(cityName);

          // var svg = svg = d3.select('#d3-pyramid')
          // svg.attr("width", width + margin.left + margin.right)
          //     .attr("height", height + margin.top + margin.bottom)
          //     .append("g")
          //     .attr("transform",
          //         "translate(" + margin.left + "," + margin.top + ")");

          // Scale the range of the data in the domains
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
              //.attr("x", function(d) { return x(d.sales); })
              .attr("width", function(d) {
                return x(d.woman) - womanMargin
              })
              .attr("y", function(d) { return y(d.class); })
              .attr("height", y.bandwidth())
              .attr("transform", "translate(" + womanMargin + "," + 0 + ")")
              .attr("fill", "pink")

          svg.selectAll(".bar-man")
              .data(data)
              .enter().append("rect")
              .attr("class", "bar-man")
              .attr("x", function(d) {return x2(d.man);})
              .attr("width", function(d) {
                return width-x2(d.man)-womanMargin
              })
              .attr("y", function(d) { return y(d.class); })
              .attr("height", y.bandwidth())
              .attr("transform", "translate(" + 0 + "," + 0 + ")")
              .attr("fill", "steelblue")
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
              .attr("transform", "translate(240," + 0 + ")")
              .call(d3.axisLeft(y));








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
