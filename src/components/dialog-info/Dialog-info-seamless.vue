<template>
  <div>
    <p v-html="contents"></p>
  </div>
</template>

<script>


import axios from "axios";

export default {
  name: "Dialog-info-seamless",
  data () {
    return {
      contents:'test2'
    }
  },
  computed: {

  },
  methods: {

  },
  mounted ()  {

    this.$nextTick(function () {
      const vm = this;
      var groupArr = [];
      var colorArr = null;
      var colorArr2 = null;
      var formationAgeArr = [];
      const url = 'https://gbank.gsj.jp/seamless/v2/api/1.0/legend.json'
      axios.get(url, {
      }) .then(function (response) {
        console.log(response.data)
        bbb(response.data)
      })
      // 配列内に存在するかを調べる関数
      function IsExists(array, value){
        for (var i =0, len = array.length; i < len; i++){
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
      function bbb(json) {
        console.log(json);
        var group = [];
        var formationAge = [];
        var colorArr = [];
        for(var i = 0; i <json.length; i++){
          PushArray(group, json[i]["group_ja"]);
          PushArray(formationAge, json[i]["formationAge_ja"].split(" ")[0]);
        }
        var content = "<div style='border: solid 1px #ddd;float: left'>";
        content += "地質で抽出";
        for(var i = 0; i <group.length; i++){
          colorArr = [];
          var groupName = group[i];
          for(var j = 0; j <json.length; j++){
            if(json[j]["group_ja"]===groupName){
              colorArr.push(
                  json[j]["r"] + "/" + json[j]["g"] + "/" + json[j]["b"]
              )
            }
          }
          groupArr.push({
            "groupname":groupName,
            "color":colorArr
          });
          content += "<div style='width:100px;'>";
          // var gId = "seamless-legend-check-" + groupName + "-" + mapName;
          var gId = "seamless-legend-check-" + groupName + "-";
          content += "<input type='checkbox' class='seamless-legend-check seamless-legend-check-group' id='" + gId + "' value='" + groupName + "'>";
          content += "<label for='" + gId + "'>" + group[i] + "</label>";
          content += "</div>";
        }
        content += "</div>";

        content += "<div style='border: solid 1px #ddd;margin-left: 5px;float: left'>";
        content += "時代で抽出";
        for(var i = 0; i <formationAge.length; i++){
          colorArr = [];
          var formationAgeName = formationAge[i];
          for(var j = 0; j <json.length; j++){
            //console.log(json[j]["formationAge_ja"]);
            if(json[j]["formationAge_ja"].split(" ")[0]===formationAgeName){
              colorArr.push(
                  json[j]["r"] + "/" + json[j]["g"] + "/" + json[j]["b"]
              )
            }
          }
          formationAgeArr.push({
            "formationAgename":formationAgeName,
            "color":colorArr
          });
          content += "<div style='width:100px;'>";
          // var fId = "seamless-legend-check-" + formationAgeName + "-" + mapName;
          var fId = "seamless-legend-check-" + formationAgeName + "-";
          content += "<input type='checkbox' class='seamless-legend-check seamless-legend-check-formationAge' id='" + fId + "' value='" + formationAgeName + "'>";
          content += "<label for='" + fId + "'>" + formationAgeName + "</label>";
          content += "</div>";
        }
        content += "</div>";
        content += "<br style='clear:both;'>";
        content += "<div style='margin-top: 10px;'>";
        content += "<button type='button' class='btn btn-xxs btn-primary seamless-legend-clear'>リセット</button>";
        content += "</div>";
        console.log(vm.contents)
        vm.contents=content
      }




    })
  },
  watch: {

  }
}
</script>

<style scoped>

</style>