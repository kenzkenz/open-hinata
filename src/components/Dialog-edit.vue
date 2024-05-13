<template>
  <v-dialog :dialog="S_dialogEdit" id="dialog-edit">
    <div :style="contentSize">
      <input style="width: 300px;" type="text" @input="changeName" v-model="s_featureName" placeholder="名称を入力（必須）">
      <hr>
      <textarea rows="4" cols="36" @input="changeName" v-model="s_featureSetumei" placeholder="説明を入力"></textarea>
      <hr>
      <img :src="s_featureSrc" style="width: 300px;">
      <form id="my_form">
        <input type="file" name="file_1" accept="image/*" @change="file_upload()">
<!--        <button type="button" @click="file_upload()">アップロード</button>-->
      </form>
      <hr>
      <button type="button" @click="featureRemove">ポイント削除</button>
    </div>
  </v-dialog>
</template>

<script>
import axios from "axios";
import * as MyMap from '../js/mymap'
import * as d3 from "d3";
import {moveEnd} from "@/js/permalink"
import store from "@/js/store";

// import FormData from 'form-data'

export default {
  name: "dialog-edit",
  data () {
    return {
      togglePoint: false,
      contentSize: {'height': 'auto', 'margin': '10px', 'overflow': 'auto', 'user-select': 'text'},
    }
  },
  computed: {
    S_dialogEdit () {
      return this.$store.state.base.dialogs.dialogEdit
    },
    s_featureName: {
      get () { return this.$store.state.base.editFeatureName },
      set (value) {
        this.$store.state.base.editFeatureName = value
      }
    },
    s_featureSetumei: {
      get () { return this.$store.state.base.editFeatureSetumei },
      set (value) {
        this.$store.state.base.editFeatureSetumei = value
      }
    },
    s_featureSrc () {
      return this.$store.state.base.editFeatureSrc
    },
  },
  methods: {
    featureRemove(){
      MyMap.drawLayer2.getSource().removeFeature(this.$store.state.base.editFeature)
      store.state.base.dialogs.dialogEdit.style.display = 'none'
      MyMap.overlay['0'].setPosition(undefined)


    },
    changeName(e) {
      console.log(e)
      const feature = this.$store.state.base.editFeature
      console.log(feature)
      feature.setProperties({name: this.$store.state.base.editFeatureName})
      feature.setProperties({setumei: this.$store.state.base.editFeatureSetumei})
      document.querySelector('#drawLayer2-name').innerHTML = this.$store.state.base.editFeatureName
      document.querySelector('#drawLayer2-setumei').innerHTML = this.$store.state.base.editFeatureSetumei

      moveEnd()
    },
    file_upload() {
      const vm = this
      // d3.select('#' + mapName + ' .loadingImg').style("display","block")
      document.querySelector('#map01 .loadingImg').style.display = 'block'
      // フォームデータを取得
      var formdata = new FormData(document.getElementById("my_form"));
      // XMLHttpRequestによるアップロード処理
      var xhttpreq = new XMLHttpRequest();
      xhttpreq.addEventListener("progress", function(e){
        var progress_data = e.loaded / e.total;
        console.log('progress:'+progress_data);
      }, false);

      xhttpreq.open("POST", "https://kenzkenz.xsrv.jp/open-hinata/php/upload.php", true);
      xhttpreq.send(formdata);
      xhttpreq.addEventListener("load", function(e){
        let fileName = JSON.parse(e.target.response).fileName
        console.log(fileName)
        fileName = 'https://kenzkenz.xsrv.jp/open-hinata/php/img/' + fileName
        vm.$store.state.base.editFeatureSrc = fileName

        const feature = vm.$store.state.base.editFeature
        console.log(feature)

        feature.setProperties({src: fileName})
        document.querySelector('#drawLayer2-src').src = fileName


        document.querySelector('#map01 .loadingImg').style.display = 'none'

      }, false);
    }
  },
  mounted () {
    const dragHandle = document.querySelector('#dialog-edit .drag-handle');
    console.log(dragHandle)
    dragHandle.innerHTML = '編集'



    this.$watch(function () {

    });
  }
}
</script>

<style scoped>

</style>
