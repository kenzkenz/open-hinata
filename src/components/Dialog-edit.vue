<template>
  <v-dialog :dialog="S_dialogEdit" id="dialog-edit">
    <div :style="contentSize">
      <!--          <form action="https://kenzkenz.xsrv.jp/open-hinata/php/upload.php" method="POST" enctype="multipart/form-data" target="sendPhoto">-->
      <!--            <input type="file" name="image">-->
      <!--            <button><input type="submit" name="upload" value="送信"></button>-->
      <!--          </form>-->
      <!--          <iframe name="sendPhoto" style="width:0px;height:0px;border:0px;"></iframe>-->


<!--      <b-button :pressed.sync="togglePoint" class='olbtn' size="sm">{{ togglePoint ? 'ポイント描画ON' : 'ポイント描画OFF' }}</b-button>-->
<!--      <br><br>-->
      <input style="width: 300px;" type="text" @change="changeName" v-model="s_featureName" placeholder="名称を入力（必須）">
      <hr>
      <textarea rows="4" cols="36" @change="changeName" v-model="s_featureSetumei" placeholder="説明を入力"></textarea>
      <hr>
      <img :src="s_featureSrc" style="width: 300px;">
      <form id="my_form">
        <input type="file" name="file_1" accept="image/*" @change="file_upload()">
<!--        <button type="button" @click="file_upload()">アップロード</button>-->
      </form>


      <!--          <p>製作者＝kenzkenzです。</p>-->
      <!--          <p><a href="https://github.com/kenzkenz/open-hinata" target="_blank" >github</a>です。</p>-->
      <!--          <p><a href="https://twitter.com/kenzkenz" target="_blank">twitter</a>です。</p>-->
    </div>
  </v-dialog>
</template>

<script>
import axios from "axios";
import * as MyMap from '../js/mymap'
import * as d3 from "d3";

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
    // s_togglePoint () {
    //   return this.$store.state.base.togglePoint
    // },
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
    changeName(e) {
      console.log(e)
      const feature = this.$store.state.base.editFeature
      console.log(feature)
      feature.setProperties({name: this.$store.state.base.editFeatureName})
      feature.setProperties({setumei: this.$store.state.base.editFeatureSetumei})
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
        feature.setProperties({src: vm.$store.state.base.editFeatureSrc})

        document.querySelector('#map01 .loadingImg').style.display = 'none'

      }, false);

    },
    uploadImage() {
      // const FormData = require("form-data")
      const fileInput = document.querySelector('#fileInput');
      const file = fileInput.files[0];
      console.log(file)
      const FormData = require('form-data')
      const formData = new FormData();
      formData.append('file', file);


      // var formData = new FormData()
      // var file = document.getElementById("fileInput")
      // console.log(file)
      //
      // formData.append('file', file.files[0])
      // const res = await axios.post(url, params, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })

      // fetch('https://kenzkenz.xsrv.jp/open-hinata-test', { method: "POST", body: formData });


      axios.post('https://kenzkenz.xsrv.jp/open-hinata-test', file, {
        params: {
          fileName: file.name
        }
      }).then(response => {
        console.log('成功');
      }).catch(error => {
        console.error('失败', error);
      });

      // formData.append('image', file)
      // axios.defaults.baseURL = 'https://kenzkenz.xsrv.jp';
      // axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
      // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
      // axios.post('https://kenzkenz.xsrv.jp/open-hinata-test', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // }).then(response => {
      //   console.log('成功',response);
      // }).catch(error => {
      //   console.error('失敗', error);
      // });
    },
  },
  mounted () {
    // this.$watch(function () {
    //   return [this.s_togglePoint]
    // }, function () {
    //   if (this.s_togglePoint) {
    //     this.$store.state.base.maps['map01'].addInteraction(MyMap.pointInteraction)
    //   } else {
    //     this.$store.state.base.maps['map01'].removeInteraction(MyMap.pointInteraction)
    //   }
    // })
    this.$watch(function () {

    });
  }
}
</script>

<style scoped>

</style>
