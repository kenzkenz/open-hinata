
<template>
  <div :id="id">
    <div class="d3-jinkopie"></div>
  </div>
</template>

<script>

import * as d3 from "d3"

export default {
  name: "Dialog-jinkopie",
  props: ['mapName', 'item'],
  data () {
    return {
    }
  },
  computed: {
    id () {
      return 'pie-' + this.item.id
    }
  },
  methods: {
  },
  watch: {
  },
  mounted () {
    const vm = this
    pie()
    function pie () {
      const elements = document.querySelectorAll('.v-dialog2-div')
      const len = elements.length
      if (len>1) {
        elements[len-1].style.top = Number(elements[len-2].style.top.replace('px','')) + 40 + 'px'
        if (window.innerWidth > 600) {
          elements[len-1].style.left = Number(elements[len-2].style.left.replace('px','')) - 40 + 'px'
        }
      }

      const dialog2DragHandle = document.querySelector('#dialog2-' + vm.item.id + ' .drag-handle')
      dialog2DragHandle.innerHTML = vm.$store.state.base.jinkoPieData.jyusyo

      const data = vm.$store.state.base.jinkoPieData
      const dataset = [
        { "name": '老年人口' + (data.ronen/data.jinko*100).toFixed(2) + '%', "value": data.ronen },
        { "name": '生産年齢人口' + (data.seisan/data.jinko*100).toFixed(2) + '%', "value": data.seisan },
        { "name": '年少人口' + (data.nensyo/data.jinko*100).toFixed(2) + '%', "value": data.nensyo },
      ]

      let width = 400; // グラフの幅
      let height = 400; // グラフの高さ
      if (window.innerWidth < 600) {
        width = 350
        height = 350
      }

      const radius = Math.min(width, height) / 2 - 10;

      const svg = d3.select('#' + vm.id + ' .d3-jinkopie')
          .append("svg")
          .attr("width", width)
          .attr("height", height)

      const g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      const color = d3.scaleOrdinal()
          .range(["red", "green", "blue"]);

      // 4. pieチャートデータセット用関数の設定
      const pie = d3.pie()
          .value(function(d) { return d.value; })
          .sort(null);

      g.selectAll("path")
          .data(pie(dataset))
          .enter()
          .append("path") // 円弧はパスで指定する
          .attr("fill", function(d) { return color(d.index) })
          .attr("stroke", "white")    // 円グラフの区切り線を白色にする
          // .attr("transform", "translate("+width/2+", "+height/2+")")    // 円グラフをSVG領域の中心にする
          .transition()   // トランジション開始
          .duration(1000) // 1秒間でアニメーションさせる
          .attrTween("d", function(d){    // 指定した範囲で値を変化させアニメーションさせる
            var interpolate = d3.interpolate(
                { startAngle : 0, endAngle : 0 },   // 各円グラフの開始角度
                { startAngle : d.startAngle, endAngle : d.endAngle }    // 各円グラフの終了角度
            );
            return function(t){
              return arc(interpolate(t)); // 時間に応じて処理
            }
          })

      const arc = d3.arc()
          .outerRadius(radius)
          .innerRadius(0);

      const pieGroup = g.selectAll(".pie")
          .data(pie(dataset))
          .enter()
          .append("g")
          .attr("class", "pie");

      const text = d3.arc()
          .outerRadius(radius - 130)
          .innerRadius(radius - 30);

      pieGroup.append("text")
          .transition()
          .duration(1500)
          .delay(1200)
          .attr("fill", "white")
          // .attr("transform", function(d) { return "translate(" + text.centroid(d) + ")"; })
          // .attr("transform", datum => `translate(${arc.centroid(datum)})`) // 扇型の中心に移動
          .attr('transform', (d) => {
            let angle = ((180 / Math.PI) * (d.startAngle + d.endAngle)) / 2 - 90
            if (angle > 90) {
              angle = angle + 180
            }
            return 'translate(' + text.centroid(d) + ') ' + 'rotate(' + angle + ')'
            // return 'translate(' + text.centroid(d) + ')' // 水平に文字を置くときはこっち
          })
          .attr("dy", "5px")
          .attr("font", "6px")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.data.name; });
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
