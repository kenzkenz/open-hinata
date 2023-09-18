<template>
    <v-dialog :dialog="S_menuDialog">
        <div :style="menuContentSize">
            <div>
<!--                <br>-->
                <b-button class='olbtn' :size="btnSize" @click="reset01">リセット</b-button>
<!--                <b-button class='olbtn' :size="btnSize" @click="reset02" style="margin-left:5px;">座標を残してリセット</b-button>-->
            </div>
            <hr>
            <div>
                <b-button class='olbtn' :size="btnSize" @click="shortUrl">短縮URL作成</b-button>
                <div class="shortUrl-div">{{ shortUrlText }}</div>
            </div>
            <hr>
            <div>
                <b-button :pressed.sync="myToggle" class='olbtn' :size="btnSize">{{ myToggle ? 'ブロックOFF' : 'ブロックON' }}</b-button>
                <b-form-select v-model="selected" :options="options" style="width: 60px;margin-left: 10px;"/>
            </div>
            <hr>
             住所
            <input type='text' @input="onInput" v-model="address" placeholder="住所検索します。" style="width: 200px;">
            <hr>
            <a id="toPng" href="#" download="image.png" @click='toPng'>PNGダウンロード</a>
<!--            <hr>-->
<!--            <a href="https://kenzkenz.xsrv.jp/open-hinata/open-hinata.html" target="_blank">WEBページへ</a>-->
        </div>
    </v-dialog>
</template>

<script>
  import axios from 'axios'
  import * as MyMap from '../js/mymap'
  import {transform} from "ol/proj";
    export default {
    name: "Menu",
    data () {
      return {
        address: '',
        menuContentSize: {'height': 'auto','margin': '10px', 'overflow': 'auto', 'user-select': 'text'},
        btnSize: 'sm',
        shortUrlText: '',
        myToggle: false,
        selected: 20,
        options: [
          { value: '20', text: '20' },
          { value: '30', text: '30' },
          { value: '50', text: '50' }
        ]
      }
    },
    computed: {
      S_menuDialog () {
        return this.$store.state.base.dialogs.menuDialog
      }
    },
    methods: {
      onInput() {
        MyMap.addressSerch('map01',this.address)
      },
      // リセット------------------------------------------------------------------------------------
      reset01() {
        let url = window.location.href.split("#")[0];
        // url = url + "?"
        console.log(url)
        history.pushState(null, null,url);
        window.location.reload(true);
      },
      reset02() {
        const url = decodeURIComponent(window.location.href).split("?")[0];
        history.pushState(null, null,url);
        window.location.reload(true);
      },
      // 短縮URL作成----------------------------------------------------------------------------
      shortUrl () {
        const vm = this;
        const parameters = window.location.hash
        axios
            .get('https://kenzkenz.xsrv.jp/open-hinata/php/shorturl.php',{
              params: {
                parameters: parameters
              }
            })
            .then(function (response) {
              console.log(response)
              vm.shortUrlText = 'https://kenzkenz.xsrv.jp/open-hinata/#' + response.data.urlid
            })
            .catch(function (error) {
              console.log(error);
            })
            .finally(function () {
            });
      },
      shortUrlBK () {
        const vm = this;
        //const target = 'https://kenzkenz.xsrv.jp/aaa/#8/140.1/37.86%3FS%3D1%26L%3D%5B%5B%7B%22id%22%3A1%2C%22o%22%3A1%7D%5D%2C%5B%7B%22id%22%3A2%2C%22o%22%3A1%7D%5D%2C%5B%7B%22id%22%3A4%2C%22o%22%3A1%7D%5D%2C%5B%7B%22id%22%3A5%2C%22o%22%3A1%7D%5D%5D'
        const target = window.location.href;
        console.log(target)
        const BITLY_ACCESS_TOKEN = '032704dc9764ff62c36ef2aff9464eb50e89b4fe' || "";
        (async () => {
          try {
            const endpoint = 'https://api-ssl.bitly.com/v4';
            const url = `${endpoint}/shorten`;
            const options = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`
              }
            };
            const params = {
              long_url: target
            };
            const res = await axios.post(url, params, options);
            console.log(res.data.link);
            vm.shortUrlText = res.data.link
          } catch (error) {
            console.log(error.response.body);
          }
        })();
      },
      toPng(){
        // MyMap.ChangeFilter('map01','grayscale')

        const map = this.$store.state.base.maps['map01']
        const targetArr = []
        const targets = map.getControls().array_
        const targetsMap = targets.map(value => {
          return value
        });
        targetsMap.forEach(target => {
          targetArr.push(target)
          console.log(target)
          map.removeControl(target)
        })
        const type = 'image/png';
        const canvas = document.querySelector("canvas");
        const dataurl = canvas.toDataURL(type);
        const bin = atob(dataurl.split(',')[1]);
        const buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++){
           buffer[i] = bin.charCodeAt(i);
        }
        const blob = new Blob([buffer.buffer],{type:type});
        document.getElementById('toPng').href = window.URL.createObjectURL(blob);
        targetArr.forEach(target => {
          map.addControl(target)
        })
       }
    },
    mounted () {
      this.$watch(function () {
        return [this.myToggle, this.selected]
      }, function () {
        if (this.myToggle) {
          MyMap.lego('map01', this.selected)
        } else {
          MyMap.legoRemove('map01', this.selected)
        }
      });
    }
  }
</script>

<style scoped>
    .shortUrl-div{
        margin-top: 10px;
        padding: 5px;
        border: solid 1px gray;
        height: 36px;
    }
    .olbtn{
        background-color: rgba(0,60,136,0.5);
    }
    .btn-secondary:hover{
        background-color: rgba(0,60,136,0.7);
    }
</style>
