<template>
    <v-dialog :dialog="S_menuDialog">
        <div :style="menuContentSize">
            <div>
<!--                <br>-->
                <b-button class='olbtn' :size="btnSize" @click="reset01">リセット</b-button>
<!--                <b-button class='olbtn' :size="btnSize" @click="reset02" style="margin-left:5px;">座標を残してリセット</b-button>-->
            </div>
            <hr>
<!--            <div>-->
<!--                <b-button class='olbtn' :size="btnSize" @click="shortUrl">短縮URL作成</b-button>-->
<!--                <div class="shortUrl-div">{{ shortUrlText }}</div>-->
<!--            </div>-->
<!--            <hr>-->
<!--            <div>-->
<!--              <b-button class='olbtn' :size="btnSize" @click="shortUrlBitly">短縮URL作成(Bitly)</b-button>-->
<!--              <div class="shortUrl-div">{{ shortUrlTextBitly }}</div>-->
<!--            </div>-->

<!--            <div>-->
<!--                <b-button :pressed.sync="toggle" class='olbtn' :size="btnSize">{{ toggle ? 'ブロックOFF' : 'ブロックON' }}</b-button>-->
<!--                <b-form-select v-model="selected" :options="options" style="width: 60px;margin-left: 10px;"/>-->
<!--            </div>-->
            <div>
              <b-button :pressed.sync="toggleCenter" class='olbtn' :size="btnSize">{{ toggleCenter ? '中心十字ON' : '中心十字OFF' }}</b-button>
            </div>
            <hr>
             住所
            <input type='text' @change="onInput" v-model="address" placeholder="住所or座標で検索します。" style="width: 300px;">
            <hr>
            <a id="toPng" href="#" download="image.png" @click='toPng'>PNGダウンロード</a><br>
<!--            <hr>-->
<!--            <a href="https://kenzkenz.xsrv.jp/open-hinata/open-hinata.html" target="_blank">WEBページへ</a>-->
            <hr>
            計測
            <br>
            <b-button :pressed.sync="toggleDanmen" class='olbtn' :size="btnSize">{{ toggleDanmen ? '断面図ON' : '断面図OFF' }}</b-button>
            <b-button style="margin-left: 10px;" :pressed.sync="toggleLine" class='olbtn' :size="btnSize">{{ toggleLine ? '距離計測ON' : '距離計測OFF' }}</b-button>
            <b-button style="margin-left: 10px;" :pressed.sync="toggleMenseki" class='olbtn' :size="btnSize">{{ toggleMenseki ? '面積計測ON' : '面積計測OFF' }}</b-button>
            <b-button style="margin-left: 10px;" :pressed.sync="toggleCircle" class='olbtn' :size="btnSize">{{ toggleCircle ? '円描画ON' : '円描画OFF' }}</b-button>
            <br>
<!--            <b-button style="margin-top: 10px;" class='olbtn' :size="btnSize" @click="drawStop">描画ストップ</b-button>-->
            <b-button style="margin-top: 10px;" :pressed.sync="toggleIdou" class='olbtn' :size="btnSize">{{ toggleIdou ? '移動ON' : '描画ストップ&移動OFF' }}</b-button>
            <b-button style="margin-top: 10px; margin-left: 10px" :pressed.sync="toggleDelete" class='olbtn' :size="btnSize">{{ toggleDelete ? '削除ON' : '削除OFF' }}</b-button>
            <b-button style="margin-top: 10px; margin-left: 10px;" class='olbtn' :size="btnSize" @click="drawReset">クリア</b-button>
            <br>
          <b-button style="margin-top: 10px;" class='olbtn' :size="btnSize" @click="saveGeojson">geojson保存</b-button>

          <a id="download" download="draw.geojson"></a>

        </div>
    </v-dialog>
</template>

<script>
  import axios from 'axios'
  import * as MyMap from '../js/mymap'
  import {drawLayer} from "../js/mymap";
  import {GeoJSON} from 'ol/format.js';
  import {moveEnd} from "../js/permalink";

  export default {
    name: "Menu",
    data () {
      return {
        address: '',
        menuContentSize: {'height': 'auto','margin': '10px', 'overflow': 'auto', 'user-select': 'text'},
        btnSize: 'sm',
        shortUrlText: '',
        shortUrlTextBitly: '',
        toggle: false,
        toggleCenter: true,
        toggleLine: false,
        toggleDanmen: false,
        toggleMenseki: false,
        toggleCircle: false,
        toggleDelete: false,
        toggleIdou: false,
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
      saveGeojson () {
        const features = drawLayer.getSource().getFeatures()
        features.forEach(function(feature){
          if (feature.getGeometry().getType() === 'Circle') {
            const radius = feature.getGeometry().getRadius();
            const center = feature.getGeometry().getCenter();
            feature.set('radius', radius);
            feature.set('center', center);
          }
        })
        const drawSourceGeojson = new GeoJSON().writeFeatures(features, {
          featureProjection: "EPSG:3857"
        });
        const geojsonT = JSON.stringify(JSON.parse(drawSourceGeojson),null,1);
        console.log(geojsonT)
        const type = "text/plain";
        const blob = new Blob([geojsonT], {type: type});
        const a = document.getElementById('download');
        a.href = window.URL.createObjectURL(blob);
        a.click()
      },
      drawStop () {
        this.toggleLine = false
        this.toggleMenseki = false
        this.toggleCircle = false
        this.toggleDelete = false
        this.$store.state.base.maps['map01'].removeInteraction(MyMap.lineInteraction)
        this.$store.state.base.maps['map01'].removeInteraction(MyMap.polygonInteraction)
        this.$store.state.base.maps['map01'].removeInteraction(MyMap.circleInteraction)
        // this.$store.state.base.maps['map01'].addInteraction(MyMap.transformInteraction)
        this.$store.state.base.maps['map01'].addInteraction(MyMap.modifyInteraction)
      },
      drawReset () {
        this.toggleLine = false
        this.toggleMenseki = false
        this.toggleCircle = false
        this.toggleDelete = false
        this.toggleDanmen = false
        MyMap.drawLayer.getSource().clear()
        moveEnd()
      },
      distance (){
        MyMap.addDrawInteraction(this.$store.state.base.maps['map01'])
      },
      // ------------------------------------------------------------------------------------------
      onInput() {
        MyMap.history (this.address)
        MyMap.addressSerch('map01',this.address)
      },
      // リセット------------------------------------------------------------------------------------
      reset01() {
        MyMap.history ('リセット')
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
        const parameters = decodeURIComponent(window.location.hash)
        axios
            .get('https://kenzkenz.xsrv.jp/open-hinata/php/shorturl.php',{
              params: {
                parameters: parameters
              }
            })
            .then(function (response) {
              console.log(response)
              let host
              if (window.location.host.indexOf('localhost') !== -1) {
                host = 'http://localhost:8080/#s'
              } else {
                host = 'https://kenzkenz.xsrv.jp/open-hinata/#s'
              }
              // vm.shortUrlText = 'https://kenzkenz.xsrv.jp/open-hinata/#' + response.data.urlid
              vm.shortUrlText = host + response.data.urlid
            })
            .catch(function (error) {
              console.log(error);
            })
            .finally(function () {
            });
      },
      shortUrlBitly () {
        MyMap.history ('短縮URL')
        const vm = this;
        // let target = 'https://kenzkenz.xsrv.jp/open-hinata/#11.213333333333333/135.39004/34.87765%3FS%3D1%26L%3D%5B%5B%7B%22id%22%3A%22nihonisan%22%2C%22ck%22%3Atrue%2C%22o%22%3A1%7D%2C%7B%22id%22%3A%22flood10m%22%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%7B%22name%22%3A%22flood10m%22%2C%22values%22%3A%5B56%2C100%5D%7D%7D%2C%7B%22id%22%3A%22sizen%22%2C%22m%22%3Atrue%2C%22ck%22%3Atrue%2C%22o%22%3A1%7D%2C%7B%22id%22%3A%22inei%22%2C%22m%22%3Atrue%2C%22ck%22%3Atrue%2C%22o%22%3A1%7D%2C%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%5D'
        let target = window.location.href;
        target = decodeURIComponent(target) /*ちょっとでも短くするため*/

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
            vm.shortUrlTextBitly = res.data.link
          } catch (error) {
            console.log(error.response.body);
          }
        })();
      },
      toPng(){
        MyMap.history ('PNGダウンロード')
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
        const ol3d = this.$store.state.base.ol3d['map01']
        let dataurl
        if (ol3d) {
          const pngScene = ol3d.getCesiumScene()
          pngScene.render();//セシウムのsceneを使う。
          dataurl = pngScene.canvas.toDataURL(type)
        } else {
          dataurl = canvas.toDataURL(type)
        }
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
        return [this.toggle, this.selected]
      }, function () {
        MyMap.history ('ブロックonoff')
        if (this.toggle) {
          MyMap.lego('map01', this.selected)
        } else {
          MyMap.legoRemove('map01', this.selected)
        }
      })
      this.$watch(function () {
        return [this.toggleIdou]
      }, function () {
        if (this.toggleIdou) {
          console.log('on')
          this.toggleLine = false
          this.toggleMenseki = false
          this.toggleCircle = false
          this.toggleDelete = false
          this.toggleDanmen = false
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.lineInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.polygonInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.circleInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.danmenInteraction)
          this.$store.state.base.maps['map01'].addInteraction(MyMap.transformInteraction)
          this.$store.state.base.maps['map01'].addInteraction(MyMap.modifyInteraction)
        } else {
          console.log('off')
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.transformInteraction)
        }
      })
      this.$watch(function () {
        return [this.toggleDelete]
      }, function () {
        if (this.toggleDelete) {
          this.toggleLine = false
          this.toggleMenseki = false
          this.toggleCircle = false
          this.$store.state.base.maps['map01'].addInteraction(MyMap.selectInteraction)
          MyMap.selectInteraction.on('select', function (e) {
            const selectCollection = MyMap.selectInteraction.getFeatures();
            MyMap.drawLayer.getSource().removeFeature(selectCollection.item(0))
            //     e.target.getFeatures().getLength() +
          });
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.lineInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.polygonInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.circleInteraction)
        } else {
          console.log('off')
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.selectInteraction)
        }
      })
      this.$watch(function () {
        return [this.toggleCircle]
      }, function () {
        if (this.toggleCircle) {
          this.toggleLine = false
          this.toggleMenseki = false
          this.toggleDelete = false
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.selectInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.lineInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.polygonInteraction)
          this.$store.state.base.maps['map01'].addInteraction(MyMap.circleInteraction)
          this.$store.state.base.maps['map01'].addInteraction(MyMap.modifyInteraction)
          this.$store.state.base.drawType = 'circle'
        } else {
          console.log('off')
          // MyMap.drawLayer.getSource().clear()
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.circleInteraction)
        }
      })
      this.$watch(function () {
        return [this.toggleMenseki]
      }, function () {
        if (this.toggleMenseki) {
          console.log(this.toggleMenseki)
          this.toggleLine = false
          this.toggleCircle = false
          this.toggleDelete = false
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.selectInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.lineInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.polygonInteraction)
          this.$store.state.base.maps['map01'].addInteraction(MyMap.polygonInteraction)
          this.$store.state.base.maps['map01'].addInteraction(MyMap.modifyInteraction)
          this.$store.state.base.drawType = 'menseki'

        } else {
          console.log('off')
          // MyMap.drawLayer.getSource().clear()
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.polygonInteraction)
        }
      })
      this.$watch(function () {
        return [this.toggleDanmen]
      }, function () {
        if (this.toggleDanmen) {
          // this.$store.state.base.maps['map01'].removeLayer(MyMap.drawLayer)
          // this.$store.state.base.maps['map01'].addLayer(MyMap.drawLayer)
          console.log('on')
          this.toggleMenseki = false
          this.toggleCircle = false
          this.toggleDelete = false
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.selectInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.lineInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.polygonInteraction)
          this.$store.state.base.maps['map01'].addInteraction(MyMap.danmenInteraction)
          this.$store.state.base.maps['map01'].addInteraction(MyMap.modifyInteraction)
          this.$store.state.base.drawType = 'danmen'

        } else {
          console.log('off')
          // MyMap.drawLayer.getSource().clear()
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.danmenInteraction)
        }
      })
      this.$watch(function () {
        return [this.toggleLine]
      }, function () {
        if (this.toggleLine) {
          // this.$store.state.base.maps['map01'].removeLayer(MyMap.drawLayer)
          // this.$store.state.base.maps['map01'].addLayer(MyMap.drawLayer)
          console.log('on')
          this.toggleMenseki = false
          this.toggleCircle = false
          this.toggleDelete = false
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.selectInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.lineInteraction)
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.polygonInteraction)
          this.$store.state.base.maps['map01'].addInteraction(MyMap.lineInteraction)
          this.$store.state.base.maps['map01'].addInteraction(MyMap.modifyInteraction)
          this.$store.state.base.drawType = 'line'

        } else {
          console.log('off')
          // MyMap.drawLayer.getSource().clear()
          this.$store.state.base.maps['map01'].removeInteraction(MyMap.lineInteraction)
        }
      })
      this.$watch(function () {
        return [this.toggleCenter]
      }, function () {
        const mapsStr = ['map01','map02','map03','map04']
        // const map = this.$store.state.base.maps['map04']
        MyMap.history ('中心十字onoff')
        const target = document.querySelector(".center-target");
        if (this.toggleCenter) {
          console.log('on')
          target.style.display = 'block';
          // mapsStr.forEach(value => {
          //   const map = this.$store.state.base.maps[value]
          //   const centerTarget = new Target({composite: 'difference'})
          //   // centerTarget.ol_uid = "18657"
          //   map.addControl(centerTarget);
          // })
        } else {
          console.log('off')
          target.style.display = 'none';

          // mapsStr.forEach(value => {
          //   const map = this.$store.state.base.maps[value]
          //   const targets = map.getControls().array_
          //   const targetsMap = targets.map(value => {
          //     return value
          //   });
          //   targetsMap.forEach(target => {
          //     if (target instanceof ol_control_Target){
          //       map.removeControl(target)
          //     }
          //   })
          // })

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
