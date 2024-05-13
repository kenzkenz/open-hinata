<template>
    <v-dialog :dialog="S_mainInfoDialog">
        <div :style="contentSize">
<!--          <form action="https://kenzkenz.xsrv.jp/open-hinata/php/upload.php" method="POST" enctype="multipart/form-data" target="sendPhoto">-->
<!--            <input type="file" name="image">-->
<!--            <button><input type="submit" name="upload" value="送信"></button>-->
<!--          </form>-->
<!--          <iframe name="sendPhoto" style="width:0px;height:0px;border:0px;"></iframe>-->


          <b-button :pressed.sync="s_togglePoint" class='olbtn' size="sm">{{ s_togglePoint ? 'ポイント描画ON' : 'ポイント描画OFF' }}</b-button>
          <br><br>


<!--          <form id="my_form">-->
<!--            <input type="file" name="file_1" accept="image/*">-->
<!--            <button type="button" @click="file_upload()">アップロード</button>-->
<!--          </form>-->


<!--          <p>製作者＝kenzkenzです。</p>-->
<!--          <p><a href="https://github.com/kenzkenz/open-hinata" target="_blank" >github</a>です。</p>-->
<!--          <p><a href="https://twitter.com/kenzkenz" target="_blank">twitter</a>です。</p>-->
        </div>
    </v-dialog>
</template>

<script>
    import axios from "axios";
    import * as MyMap from '../js/mymap'
    import * as Permalink from "@/js/permalink";

    // import FormData from 'form-data'

    export default {
    name: "mainInfo",
    data () {
      return {
        // togglePoint: false,
        contentSize: {'height': 'auto', 'margin': '10px', 'overflow': 'auto', 'user-select': 'text'},
      }
    },
    computed: {
      S_mainInfoDialog () {
        return this.$store.state.base.dialogs.mainInfoDialog
      },
      // s_togglePoint () {
      //   return this.$store.state.base.togglePoint
      // }
      s_togglePoint: {
        get() {
          return this.$store.state.base.togglePoint
        },
        set(value) {
          this.$store.state.base.togglePoint = value
        }
      },
    },
    methods: {
      file_upload() {
        // フォームデータを取得
        var formdata = new FormData(document.getElementById("my_form"));

        // XMLHttpRequestによるアップロード処理
        var xhttpreq = new XMLHttpRequest();

        xhttpreq.onreadystatechange = function() {
          if (xhttpreq.readyState == 4 && xhttpreq.status == 200) {
            alert(xhttpreq.responseText);
          }
        };

        xhttpreq.addEventListener("progress", function(e){
          var progress_data = e.loaded / e.total;
          console.log('progress:'+progress_data);
        }, false);
        xhttpreq.addEventListener("load", function(e){
          alert()
        }, false);
        xhttpreq.addEventListener("error", function(e){}, false);
        xhttpreq.addEventListener("abort", function(e){}, false);

        xhttpreq.open("POST", "https://kenzkenz.xsrv.jp/open-hinata/php/upload.php", true);
        xhttpreq.send(formdata);

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
      this.$watch(function () {
        return [this.s_togglePoint]
      }, function () {
        if (this.s_togglePoint) {
          this.$store.state.base.maps['map01'].addInteraction(MyMap.pointInteraction)
        } else {
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.pointInteraction)
        }
      })
      this.$watch(function () {

      });
    }
  }
</script>

<style scoped>

</style>
