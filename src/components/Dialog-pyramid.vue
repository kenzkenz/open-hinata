
<template>
  <v-dialog :dialog="S_mainInfoDialog">

<!--      <div class="d3-pyramid">-->

<!--      </div>-->

      <svg id="d3-pyramid" width="350" :height="350" style="border: 1px dotted"></svg>


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
        const prefCode = this.$store.state.base.prefCode
        console.log(cityCode)
        console.log(prefCode)
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
          console.log(response)
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
    var svg = d3.select('#d3-pyramid');
    this.circle = svg.append('circle')
        .attr('cx', 40)
        .attr('cy', 25)
        .attr('r', 75)
        .style('fill','rgba(255, 0, 0, 0.8)')




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
