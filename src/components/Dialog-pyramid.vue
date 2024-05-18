
<template>
  <div :id="id">
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
    <button class="renzoku">連続</button>
<!--    <img class='loadingImg' src="https://kenzkenz.xsrv.jp/open-hinata/img/loading.gif" style="position: absolute;top:50%;left:50%;z-index:1;">-->
    <div class="d3-pyramid"></div>
<!--      <svg id="d3-pyramid" width="350" :height="350" style="border: 1px dotted"></svg>-->
  </div>
</template>

<script>

import * as d3 from "d3"

let renzoku

export default {
  name: "Dialog-pyramid",
  props: ['mapName', 'item'],
  data () {
    return {
    }
  },
  computed: {
    id () {
      return 'pyramid' + this.item.id
    },
    // S_mainInfoDialog () {
    //   return this.$store.state.base.dialogs.pyramidDialog[this.mapName]
    // },
    S_cityCode () {
      return this.$store.state.base.cityCode[this.mapName]
    },
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
        elements[len-1].style.top = Number(elements[len-2].style.top.replace('px','')) + 40 + 'px'
        if (window.innerWidth > 600) {
          elements[len-1].style.left = Number(elements[len-2].style.left.replace('px','')) - 40 + 'px'
        }
      }
      // elements[len-1].style.width = '550px'
      // ---------------------------------------------------------------------------
      d3.select('#' + vm.id + ' .d3-pyramid svg').remove()
      // d3.select('#' + vm.id + ' .loadingImg').style("display","block")
      // //----------------------------------------------------------------
      // const randRange = function (min, max) {
      //   return Math.floor(Math.random() * (max - min + 1) + min)
      // }
      // const resasApiKeyArr = [
      //   "ZKE7BccwVM8e2onUYC7iX2tnuuZwZJfuOTf3rL93",
      //   "Sultx8zfCSfOwJ9M0bZPcTd3KmryBhzm86Qz9skE",
      //   'dQz5vv6mTd3awaTl3qVRJyQRrnyQfcPhlHXGuuR3',
      //   'PhDwqQNb40trBwyOivI5CMdeyqGEx0Gcubdv1GpL'
      // ]
      // const resasApiKey = resasApiKeyArr[randRange(0,3)]
      // const resasUrl = "https://opendata.resas-portal.go.jp/api/v1/"
      // const cityCode = vm.$store.state.base.cityCode[vm.mapName]
      // let cityName = vm.$store.state.base.cityName
      // const prefCode = vm.$store.state.base.prefCode
      // console.log(cityCode)
      // console.log(cityName)
      // console.log(prefCode)
      // cityName = cityName.replace('役所','').replace('役場','').replace('庁','')
      // console.log(cityName)
      // const dialog2DragHandle = document.querySelector('#dialog2-' + vm.item.id + ' .drag-handle')
      // dialog2DragHandle.innerHTML = cityName
      // const yearRights = ['1980','1985','1990','1995','2000', '2005', '2010','2015','2020','2025','2030','2035','2040','2045']
      // async function created() {
      //   const fetchData = yearRights.map((yearRight) => {
      //     return axios
      //         .get(resasUrl +'population/composition/pyramid',{
      //           headers:{'X-API-KEY':resasApiKey},
      //           params: {
      //             prefCode:prefCode,
      //             cityCode:cityCode,
      //             yearLeft:"2000",
      //             yearRight:yearRight,
      //           }
      //         })
      //   })
      //   await Promise.all([
      //     ...fetchData
      //   ])
      //       .then((response) => {
      //         d3Create (response)
      //         d3.selectAll('.loadingImg').style("display","none")
      //       })
      //       .catch(function (response) {
      //         alert('データが存在しないか又はリクエストが多くて制限がかかっています。')
      //         elements[len-1].style.display = 'none'
      //         console.log(response);
      //       })
      // }
      // created()
      // //----------------------------------------------------------------
      console.log(vm.$store.state.base.resasDataset)
      d3Create(vm.$store.state.base.resasDataset)
      function d3Create (response) {
        console.log(response[0].data.result.yearRight.data)
        const cityName = vm.$store.state.base.cityName
        const dialog2DragHandle = document.querySelector('#dialog2-' + vm.item.id + ' .drag-handle')
        dialog2DragHandle.innerHTML = cityName
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
          height = 280 - margin.top - margin.bottom
          womanMargin = 185
        }

        let  data = response[8].data.result.yearRight.data

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
        svg.append("line")
            .attr("x1",width/2 -30)
            .attr("y1",0)
            .attr("x2",width/2 -30)
            .attr("y2",height)
            .attr("stroke-width",1)
            .attr("stroke","black");
        svg.append("text")
            .attr("fill", "black")
            .attr("transform", "translate(" + 30 + "," + 0 + ")")
            // .attr("dy", "5px")
            .attr("font", "10px")
            // .attr("text-anchor", "middle")
            .attr("class", "city-name")
            .text(cityName + '2020');

        x.domain([0, d3.max(data, function(d){ return d.woman; })])
        x2.domain(
            // スケールを女性に合わせる。
            [0,d3.max(data, function(d){ return d.woman; })]
        )

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
        // グラフ書き換え
        d3.selectAll('#' + vm.id + ' .updataGraph')
            .on("click",click);
        function click(e) {
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
                return width -x2(d.man) -womanMargin-0
              })
        }

        d3.select('#' + vm.id + ' .renzoku')
            .on("click",function(){
              let count = 0
              renzoku = function(){
                let year
                if(count < 14){
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
                        return width -x2(d.man) -womanMargin-0
                      })
                  count++
                  console.log(9999)
                  setTimeout(function(){renzoku()},500);
                } else {
                  clearTimeout(renzoku)
                }
              }
              renzoku()
            });
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
