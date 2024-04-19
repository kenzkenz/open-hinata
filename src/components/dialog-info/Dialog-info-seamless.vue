<template>
  <div>
   <div id="group-name-div">
     地質で検索
      <li v-for="item in groupName" :id="item.id">
        <input type="radio" :name="mapName"
               :id="mapName + item.name"
               v-model="choosed"
               :value="item.name"
               @click = radioClick(item.colorArr)>
        <label :for="mapName + item.name">{{ item.name }}</label>
      </li>
     <br>
     時代で検索
     <li v-for="item in formationAge" :id="item.id">
       <input type="radio" :name="mapName"
              :id="mapName + item.ageName"
              :value="item.ageName"
              @click = radioClick(item.colorArr)>
       <label :for="mapName + item.ageName">{{ item.ageName }}</label>
     </li>
   </div>
<!--    <b-button class='olbtn' :size="btnSize" @click="reset">リセット</b-button>-->
  </div>
</template>
<script>
import axios from "axios";
import * as Layers from '../../js/layers'
export default {
  name: "Dialog-info-seamless",
  props: ['mapName'],
  data () {
    return {
      btnSize: 'sm',
      choosed:'全て表示',
      groupName:[],
      formationAge:[]
    }
  },
  computed: {

  },
  methods: {
    radioClick(colorArr){
      console.log(this.mapName)
      this.$store.commit('base/updateColorArr',{mapName:this.mapName,colorArr:colorArr});
      Layers.seamlessObj[this.mapName].getSource().changed()
    }
  },
  mounted ()  {
    // 配列内に存在するかを調べる関数
    function IsExists(array, value){
      for (let i =0, len = array.length; i < len; i++){
        if (value == array[i]){
          // 存在したらtrueを返す
          return true;
        }
      }
      // 存在しない場合falseを返す
      return false;
    }
    // 重複を排除しながらpushする関数
    function PushArray(array, value){
      // 存在しない場合、配列にpushする
      if(! IsExists(array, value)){
        array.push(value);
      }
      return true;
    }
    //--------------------------------------
    this.$nextTick(function () {
      const vm = this;
      let id = 1
      let id2 = 100
      const url = 'https://gbank.gsj.jp/seamless/v2/api/1.0/legend.json'
      axios.get(url, {
      }) .then(function (response) {
        bbb(response.data)
      })
      function bbb(json) {
        const group = [];
        const formationAge = [];
        let colorArr = [];
        for(let i = 0; i <json.length; i++){
          PushArray(group, json[i]["group_ja"]);
          PushArray(formationAge, json[i]["formationAge_ja"].split(" ")[0]);
        }
        id++
        vm.groupName.push({
          "id":id,
          "name":'全て表示',
          "colorArr":[]
        });
        for(let i = 0; i <group.length; i++){
          colorArr = [];
          const groupName = group[i];
          for(let j = 0; j <json.length; j++){
            if(json[j]["group_ja"]===groupName){
              colorArr.push(
                  json[j]["r"] + "/" + json[j]["g"] + "/" + json[j]["b"]
              )
            }
          }
          vm.groupName.push({
            "id":id,
            "name":groupName,
            "colorArr":colorArr
          });
        }
        // content += "時代で抽出";
        for(let i = 0; i <formationAge.length; i++){
          colorArr = [];
          const formationAgeName = formationAge[i];
          for(let j = 0; j <json.length; j++){
            //console.log(json[j]["formationAge_ja"]);
            if(json[j]["formationAge_ja"].split(" ")[0]===formationAgeName){
              colorArr.push(
                  json[j]["r"] + "/" + json[j]["g"] + "/" + json[j]["b"]
              )
            }
          }
          id2++
          vm.formationAge.push({
            "id":id2,
            "ageName":formationAgeName,
            "colorArr":colorArr
          });
        }
      }
    })
  },
  watch: {

  }
}
</script>

<style scoped>
.olbtn{
  background-color: rgba(0,60,136,0.5);
}
li {
  list-style-type: none;
}
#group-name-div{
  margin: 5px;
  border: 1px solid grey;
  padding: 5px;
}

</style>