<template>
    <div id="map00">
        <!--map01からmap04をループで作成-->
        <div v-for="mapName in mapNames" :key="mapName">
            <div :id=mapName :style="mapSize[mapName]" v-show="mapFlg[mapName]">
              <img class='loadingImg' src="https://kenzkenz.xsrv.jp/open-hinata/img/loading3.gif" style="width:40px;display:none;position: absolute;top:50%;left:50%;z-index:1;">

              <div :id="div3d[mapName]" class="cesium-btn-div">
                <div class="cesiun-btn-container">
                  <button type="button" class="cesium-btn-up btn olbtn" @pointerdown.stop="upMousedown(mapName)" @pointerup="leftMouseup"><i class='fa fa-arrow-up fa-lg hover'></i></button>
                  <button type="button" class="cesium-btn-down btn olbtn" @pointerdown.stop="downMousedown(mapName)" @pointerup="leftMouseup"><i class='fa fa-arrow-down fa-lg'></i></button>
                  <button type="button" class="cesium-btn-left btn olbtn" @pointerdown="leftMousedown(mapName)" @pointerup="leftMouseup"><i class='fa fa-arrow-left fa-lg'></i></button>
                  <button type="button" class="cesium-btn-right btn olbtn" @pointerdown="rightMousedown(mapName)" @pointerup="rightMouseup"><i class='fa fa-arrow-right fa-lg'></i></button>
                  <div class="elevMag">
                    <input type='number' v-model="s_hight" style="width: 40px;">
                  </div>
                </div>
              </div>

              <div id="modal0">
                <modal name="modal0" :width="300" :clickToClose="false">
                  <div class="modal-body">
                    <div class="dialog-close-btn-div" @click="closeBtn0"><i class="fa-solid fa-xmark hover close-btn"></i>
                    </div>
                    <br>
                    <h5>お知らせ</h5>
<!--                    <p>現在、<a href="https://mapwarper.h-gis.jp/" target="_blank">「日本版MapWarper」</a>のサーバーがダウンしているため戦前地形図が表示できません。しばらくお待ちください。</p>-->
                    <p>新しい背景（レイヤー）を追加しました。
                      <a href="https://kenzkenz.xsrv.jp/open-hinata/#sx2Ngs" target="_blank">ウィキメディア・コモンズ</a>
                      <br>是非ご覧ください。世界中の写真にアクセスできます。
                    </p>
                  </div>
                  <div class="modal-bottom">
                    ooen-hinata
                  </div>
                </modal>
              </div>
              <div id="modal1">
                <modal name="modal1" :width="300" :clickToClose="false">
                  <div class="modal-body">
                    <div class="dialog-close-btn-div" @click="closeBtn1"><i class="fa-solid fa-xmark hover close-btn"></i>
                    </div>
                    <b-button class='olbtn' v-on:click="stanford">スタンフォード大学</b-button><br><br>
                    <b-button class='olbtn' v-on:click="mapWarper">日本版 Map Warper </b-button><br><br>
                  </div>
                </modal>
              </div>
              <div :id="popup[mapName]" class="ol-popup">
                <a href="#" :id="popupCloser[mapName]" class="ol-popup-closer"></a>
                <div :id="popupContent[mapName]"></div>
              </div>
              <div :id="marker[mapName]" class="marker"></div>
              <div :id="cp[mapName]" class="current-position-marker"></div>
              <div class="center-target">
              </div>
                <div class="top-left-div">
                    <b-button v-if="mapName === 'map01'" class='olbtn' :size="btnSize" @click="openDialog(s_dialogs['menuDialog'])" style="margin-right:5px;"><i class="fa-solid fa-bars"></i></b-button>
                    <b-button v-if="mapName === 'map01'" class='olbtn' :size="btnSize" @click="home" style="margin-right:5px;"><i class="fa-solid fa-house"></i></b-button>
                    <b-button style="margin-right:5px;" :pressed.sync="s_toggle3d[mapName]" class='olbtn' :size="btnSize" @click="click3d(mapName)">{{ s_toggle3d[mapName] ? '2D' : '3D' }}</b-button>
                    <b-button id='split-map-btn' v-if="mapName === 'map01'" class='olbtn' :size="btnSize" @click="splitMap" style="margin-right:5px;">分割</b-button>
                    <b-button class='olbtn-red' :size="btnSize" @click="openDialog(s_dialogs[mapName])">背景</b-button>
                </div>
                <div class="top-right-div">
                  <b-button i v-if="mapName === 'map01'" class='olbtn' :size="btnSize" @click="openDialog(s_dialogs['dialogEdit0'])"><i class="fa-solid fa-pen"></i></b-button>
                </div>

                <div class="bottom-right-div">
                  <b-button i v-if="mapName === 'map01'" class='olbtn' :size="btnSize" @click="currentPosition"><i class="fa-solid fa-location-crosshairs"></i></b-button>
                </div>
                <v-dialog-layer :mapName=mapName />
                <v-dialog-info :mapName=mapName />
                <v-dialog2 :mapName=mapName />
                <v-dialog-menu v-if="mapName === 'map01'"/>
                <v-dialog-main-info v-if="mapName === 'map01'"/>
                <v-dialog-edit v-if="mapName === 'map01'"/>
                <div class="zoom-div">{{ zoom[mapName] }}</div>
            </div>
        </div>
        <!--map01からmap04をループで作成。ここまで-->
<!--        <transition>-->
            <div id="lock" v-show="synchDivFlg" @click="synch">
                  <span class="lock"><i  class="fa-solid fa-lock hover fa-lg"></i></span>
                  <span class="lock-open" style="display: none"><i class="fa-solid fa-lock-open hover fa-lg"></i></span>
            </div>
<!--        </transition>-->
        <b-popover
                 content="画面同期を変更します。"
                 target="lock"
                 triggers="hover"
                 placement="bottomright"
                 boundary="viewport"
        />
    </div>
</template>

<script>
  import DialogMenu from './Dialog-menu'
  import DialogLayer from './Dialog-layer'
  import DialogMainInfo from './Dialog-edit0'
  import DialogEdit from './Dialog-edit'
  import * as Permalink from '../js/permalink'
  import Inobounce from '../js/inobounce'
  import * as MyMap from '../js/mymap'
  import axios from "axios";
  import store from "@/js/store";
  import OLCesium from 'ol-cesium'
  import * as d3 from "d3";

  let heading
  let tilt
  let tiltStart
  let tiltEnd
  export default {
    name: 'App',
    components: {
      'v-dialog-layer': DialogLayer,
      'v-dialog-menu': DialogMenu,
      'v-dialog-main-info': DialogMainInfo,
      'v-dialog-edit': DialogEdit,
    },
    data () {
      return {
        zyougen:1,
        tiltFlg: false,
        // mapNames: ['map01','map02','map03','map04'],
        mapNames: ['map01','map02'],
        btnSize: '',
        cp:{map01: 'map01-current-position',map02: 'map02-current-position',map03: 'map03-current-position',map04: 'map04-current-position'},
        marker:{map01: 'map01-marker',map02: 'map02-marker',map03: 'map03-marker',map04: 'map04-marker'},
        popup:{map01: 'map01-popup',map02: 'map02-popup',map03: 'map03-popup',map04: 'map04-popup'},
        div3d:{map01: 'map01-3d',map02: 'map02-3d',map03: 'map03-3d',map04: 'map04-3d'},

        popupCloser:{map01: 'map01-popup-closer',map02: 'map02-popup-closer',map03: 'map03-popup-closer',map04: 'map04-popup-closer'},
        popupContent:{map01: 'map01-popup-content',map02: 'map02-popup-content',map03: 'map03-popup-content',map04: 'map04-popup-content'},
        mapSize: {
          map01: {top: 0, left: 0, width: '100%', height: window.innerHeight + 'px'},
          map02: {top: 0, right: 0, width: 0, height: window.innerHeight + 'px'},
          map03: {top: 0, right: 0, width: '50%', height: window.innerHeight / 2 + 'px'},
          map04: {top: 0, right: 0, width: '50%', height: window.innerHeight / 2 + 'px'}
        },
        zoom: {map01: '',map02: '',map03: '',map04: ''},
        mapFlg: {map01:true, map02:false, map03:false, map04:false},
        synchDivFlg: false,
        synchFlg: true,
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
      s_hight: {
        get() {
          return this.$store.state.base.hight['map01']
        },
        set(value) {
          console.log(value)
          this.$store.commit('base/updateHight',{mapName: 'map01', value: value})
          const ol3d = this.$store.state.base.ol3d['map01']
          const scene = ol3d.getCesiumScene()
          const terrainProvider = new Cesium.PngElevationTileTerrainProvider( {
            url: 'https://gsj-seamless.jp/labs/elev2/elev/{z}/{y}/{x}.png?prj=latlng&size=257',
            tilingScheme: new Cesium.GeographicTilingScheme(),
            credit: '',
            heightScale: Number(value),
          })
          scene.terrainProvider = terrainProvider
          Permalink.moveEnd()
        }
      },
      s_toggle3d () { return this.$store.state.base.toggle3d},
      s_dialogShow () { return this.$store.state.base.dialogShow},
      s_suUrl () { return this.$store.state.base.suUrl},
      s_mwId () { return this.$store.state.base.mwId},
      s_dialogs () { return this.$store.state.base.dialogs},
      s_splitFlg () { return this.$store.state.base.splitFlg},
      s_dialogMaxZindex () { return this.$store.state.base.dialogMaxZindex},
      s_dialo2Id () { return this.$store.state.base.dialog2Id}

    },
    watch: {
      s_dialogShow(newValue, oldValue) {
        if (newValue) {
          this.$modal.show('modal1');
          store.commit('base/updateDialogShow',false);
        } else {
          this.$modal.hide('modal1');
        }
      }
    },
    methods: {
      currentPosition: function (){
        MyMap.history ('現在地取得')
        MyMap.currentPosition()
      },
      closeBtn0: function () {
        this.$modal.hide('modal0')
      },
      closeBtn1: function () {
        this.$modal.hide('modal1')
      },
      stanford: function () {
        MyMap.history ('スタンフォード大学へ')
        if(this.s_suUrl.includes('stanford')) {
          window.open(this.s_suUrl, '_blank')
        } else {
          alert('スタンフォード大学にはありません。')
        }
      },
      mapWarper: function () {
        MyMap.history ('日本版mapwarperへ')
        window.open('https://mapwarper.h-gis.jp/maps/' + this.s_mwId, '_blank');
      },
      home() {
        MyMap.history ('説明画面へ')
        // window.open('https://kenzkenz.xsrv.jp/oh/open-hinata/')
        window.open('https://note.com/kenzkenz2536/n/n08d8fca5d795')
      },
      // ダイアログを開く------------------------------------------------------------------
      openDialog (dialog) {
        if (dialog.style.display === 'block') {
          dialog.style.display = 'none'
          // this.$store.state.base.maps['map01'].removeInteraction(MyMap.modifyInteraction2)

        } else {
          this.$store.commit('base/incrDialogMaxZindex');
          dialog.style["z-index"] = this.s_dialogMaxZindex;
          dialog.style.display = 'block'
          MyMap.overlay['0'].setPosition(undefined)

          // this.$store.state.base.maps['map01'].addInteraction(MyMap.modifyInteraction2)
        }
      },
      // 分割-------------------------------------------------------------------------------------
      splitMap () {
        MyMap.history ('分割')
        this.$store.commit('base/incrSplitFlg');
        this.splitMap2();
        Permalink.moveEnd()
      },
      // 分割その２
      splitMap2 () {
        const vm = this;
        const isPortrait = window.matchMedia("(orientation: portrait)").matches
        const height = window.innerHeight + 'px';
        const height2 = window.innerHeight / 2 + 'px';
        switch (this.s_splitFlg) {
          // 1画面
          case 1:
            vm.synchDivFlg = false;
            vm.mapFlg['map02'] = false; vm.mapFlg['map03'] = false; vm.mapFlg['map04'] = false;
            vm.mapSize['map01'] = {top: 0, left: 0, width: '100%', height: height};
            vm.mapSize['map02'] = {top: 0, right: 0, width: 0, height: 0};
            vm.mapSize['map03'] = {top: 0, left: 0, width: 0, height: 0};
            vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
            break;
          // 2画面
          case 2:
            if (window.innerWidth > 850) {// 横２画面
              vm.synchDivFlg = true;
              vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = false; vm.mapFlg['map04'] = false;
              vm.mapSize['map01'] = {top: 0, left: 0, width: '50%', height: height};
              vm.mapSize['map02'] = {top: 0, left: '50%', width: '50%', height: height};
              vm.mapSize['map03'] = {top: 0, left: 0, width: 0, height: 0};
              vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
            } else { // 縦2画面or横2画面
              // alert(window.innerWidth)
              if (isPortrait) { // 縦2画面
                vm.synchDivFlg = true;
                vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = false; vm.mapFlg['map04'] = false;
                vm.mapSize['map01'] = {top: 0, left: 0, width: '100%', height: height2};
                vm.mapSize['map02'] = {top: '50%', left: 0, width: '100%', height: height2};
                vm.mapSize['map03'] = {top: 0, left: 0, width: 0, height: 0};
                vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
              } else {
                vm.synchDivFlg = true;
                vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = false; vm.mapFlg['map04'] = false;
                vm.mapSize['map01'] = {top: 0, left: 0, width: '50%', height: height};
                vm.mapSize['map02'] = {top: 0, left: '50%', width: '50%', height: height};
                vm.mapSize['map03'] = {top: 0, left: 0, width: 0, height: 0};
                vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
              }
            }
            break;
          // 2画面（縦２画面）
          // case 3:
          //   vm.synchDivFlg = true;
          //   vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = false; vm.mapFlg['map04'] = false;
          //   vm.mapSize['map01'] = {top: 0, left: 0, width: '100%', height: height2};
          //   vm.mapSize['map02'] = {top: '50%', left: 0, width: '100%', height: height2};
          //   vm.mapSize['map03'] = {top: 0, left: 0, width: 0, height: 0};
          //   vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
          //   break;
          // 3画面１（左が縦全、右が縦半）
          // case 4:
          //   vm.synchDivFlg = true;
          //   vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = true; vm.mapFlg['map04'] = false;
          //   vm.mapSize['map01'] = {top: 0, left: 0, width: '50%', height: height};
          //   vm.mapSize['map02'] = {top: 0, left: '50%', width: '50%', height: height2};
          //   vm.mapSize['map03'] = {top: '50%', left: '50%', width: '50%', height: height2};
          //   vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
          //   break;
          // // 3画面2（全て縦半）
          // case 5:
          //   vm.synchDivFlg = true;
          //   vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = true; vm.mapFlg['map04'] = false;
          //   vm.mapSize['map01'] = {top: 0, left: 0, width: '100%', height: height2};
          //   vm.mapSize['map02'] = {top: '50%', left: 0, width: '50%', height: height2};
          //   vm.mapSize['map03'] = {top: '50%', left: '50%', width: '50%', height: height2};
          //   vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
          //   break;

          // 4画面（全て縦半）
          // case 3:
          //   vm.synchDivFlg = true;
          //   vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = true; vm.mapFlg['map04'] = true;
          //   vm.mapSize['map01'] = {top: 0, left: 0, width: '50%', height: height2};
          //   vm.mapSize['map02'] = {top: 0, right: 0, width: '50%', height: height2};
          //   vm.mapSize['map03'] = {top: '50%', left: 0, width: '50%', height: height2};
          //   vm.mapSize['map04'] = {top: '50%', left: '50%', width: '50%', height: height2}
        }
        this.$nextTick(function () {
          MyMap.resize ()
        })
      },
      // 同期-------------------------------------------------------------------------------------
      synch () {
        MyMap.synch(this)
        if(this.synchFlg) {
          document.querySelector('.lock-open').style.display ='none'
          document.querySelector('.lock').style.display ='block'
        } else {
          document.querySelector('.lock-open').style.display = 'block'
          document.querySelector('.lock').style.display = 'none'
        }
      },
      click3d (mapName) {
        if (!this.$store.state.base.ol3d[mapName]) {
          this.$store.state.base.ol3d[mapName] = new OLCesium({map: this.$store.state.base.maps[mapName]})
          const ol3d = this.$store.state.base.ol3d[mapName]
          const scene = ol3d.getCesiumScene()
          const terrainProvider = new Cesium.PngElevationTileTerrainProvider( {
            url: 'https://gsj-seamless.jp/labs/elev2/elev/{z}/{y}/{x}.png?prj=latlng&size=257',
            tilingScheme: new Cesium.GeographicTilingScheme(),
            credit: '',
            heightScale: this.$store.state.base.hight[mapName],
            // heightMapWidth: 32,
            // maximumLevel: 14,
          })
          scene.terrainProvider = terrainProvider
          scene.terrainProvider.heightmapTerrainQuality = 0.5
          scene.screenSpaceCameraController._minimumZoomRate = 1//10000
          // // ズームしたときの，ホイールに対する動作制御。
          scene.screenSpaceCameraController.minimumZoomDistance = 10
          // // めり込みにくくするためズーム制限
          ol3d.setEnabled(true)
          // ol3d.getCamera().setTilt(0.75)
          tiltStart(ol3d)

          document.querySelector('#' + mapName + '-3d').style.display = 'block'
        } else {
          const ol3d = this.$store.state.base.ol3d[mapName]
          // ol3d.setEnabled(false)
          tiltEnd(ol3d)
          this.$store.state.base.ol3d[mapName] = null
          document.querySelector('#' + mapName + '-3d').style.display = 'none'
        }
      },
      downMousedown(mapName) {
        const vm = this
        const ol3d = this.$store.state.base.ol3d[mapName]
        vm.tiltFlg = true
        tilt(ol3d,'down')
      },
      upMousedown(mapName) {
        const vm = this
        const ol3d = this.$store.state.base.ol3d[mapName]
        vm.tiltFlg = true
        tilt(ol3d,'up')
      },
      leftMousedown(mapName) {
        const vm = this
        const ol3d = this.$store.state.base.ol3d[mapName]
        vm.tiltFlg = true
        heading(ol3d,'left')
      },
      leftMouseup() {
        this.tiltFlg = false
      },
      rightMousedown(mapName) {
        const vm = this
        const ol3d = this.$store.state.base.ol3d[mapName]
        vm.tiltFlg = true
        heading(ol3d,'right')
      },
      rightMouseup() {
        this.tiltFlg = false
      },
    },
    mounted () {
      // RESAS人口ピラミッド----------------------------------------------------------------
      const vm = this
      const randRange = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
      const resasApiKeyArr = [
        "ZKE7BccwVM8e2onUYC7iX2tnuuZwZJfuOTf3rL93",
        "Sultx8zfCSfOwJ9M0bZPcTd3KmryBhzm86Qz9skE",
        'dQz5vv6mTd3awaTl3qVRJyQRrnyQfcPhlHXGuuR3',
        'PhDwqQNb40trBwyOivI5CMdeyqGEx0Gcubdv1GpL'
      ]
      const resasApiKey = resasApiKeyArr[randRange(0,3)]
      const resasUrl = "https://opendata.resas-portal.go.jp/api/v1/"
      // 市区町村人口ピラミッド----------------------------------------------------------------

      // const maps = ['map01','map02','map03','map04']
      const maps = ['map01','map02']
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if (e.target && e.target.classList.contains("pyramid") ) {
            //----------------------------------------------------------------
            d3.select('#' + mapName + ' .loadingImg').style("display","block")
            // const resasApiKey ='PhDwqQNb40trBwyOivI5CMdeyqGEx0Gcubdv1GpL'
            const cityCode = e.target.getAttribute("citycode")
            let cityName = e.target.getAttribute("cityName")
            const prefCode = e.target.getAttribute("citycode").slice(0,2)
            console.log(cityCode)
            console.log(cityName)
            console.log(prefCode)
            cityName = cityName.replace('役所','').replace('役場','').replace('庁','')
            vm.$store.state.base.cityName = cityName
            console.log(cityName)
            vm.$store.state.base.cityCode[mapName] = cityName
            const yearRights = ['1980','1985','1990','1995','2000', '2005', '2010','2015','2020','2025','2030','2035','2040','2045']
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
                    // d3Create (response)
                    console.log(response)
                    vm.$store.state.base.resasDataset = response
                    dialogOpen()
                    d3.select('#' + mapName + ' .loadingImg').style("display","none")
                  })
                  .catch(function (response) {
                    alert('データが存在しないか又はリクエストが多くて制限がかかっています。')
                  })
            }
            created()
            //----------------------------------------------------------------

            function dialogOpen() {
              vm.$store.commit('base/incrDialog2Id');
              vm.$store.commit('base/incrDialogMaxZindex');
              let width
              let left
              if (window.innerWidth > 600) {
                width = '550px'
                left = (window.innerWidth - 560) + 'px'
              } else {
                width = '350px'
                left = (window.innerWidth / 2 - 175) + 'px'
              }
              const diialog =
                  {
                    id: vm.s_dialo2Id,
                    name:'pyramid',
                    style: {
                      display: 'block',
                      width: width,
                      top: '60px',
                      left: left,
                      // right:'10px',
                      'z-index': vm.s_dialogMaxZindex
                    }
                  }
              vm.$store.commit('base/pushDialogs2',{mapName: mapName, dialog: diialog})
            }
          }
        })
      })
      // 都道府県人口ピラミッド----------------------------------------------------------------
      // const maps = ['map01','map02','map03','map04']
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if (e.target && e.target.classList.contains("pyramid-kencho") ) {

            //----------------------------------------------------------------
            d3.select('#' + mapName + ' .loadingImg').style("display","block")
            // const resasApiKey ='PhDwqQNb40trBwyOivI5CMdeyqGEx0Gcubdv1GpL'
            const cityCode = e.target.getAttribute("citycode")
            let cityName = e.target.getAttribute("cityName")
            const prefCode = e.target.getAttribute("citycode").slice(0,2)
            console.log(cityCode)
            console.log(cityName)
            console.log(prefCode)
            cityName = cityName.replace('役所','').replace('役場','').replace('庁','')
            console.log(cityName)
            vm.$store.state.base.cityName = cityName
            const yearRights = ['1980','1985','1990','1995','2000', '2005', '2010','2015','2020','2025','2030','2035','2040','2045']
            async function created() {
              const fetchData = yearRights.map((yearRight) => {
                return axios
                    .get(resasUrl +'population/composition/pyramid',{
                      headers:{'X-API-KEY':resasApiKey},
                      params: {
                        prefCode:prefCode,
                        cityCode:'-',
                        yearLeft:"2000",
                        yearRight:yearRight,
                      }
                    })
              })
              await Promise.all([
                ...fetchData
              ])
                  .then((response) => {
                    // d3Create (response)
                    console.log(response)
                    vm.$store.state.base.resasDataset = response
                    dialogOpen()
                    d3.select('#' + mapName + ' .loadingImg').style("display","none")
                  })
                  .catch(function (response) {
                    alert('データが存在しないか又はリクエストが多くて制限がかかっています。')
                  })
            }
            created()
            //----------------------------------------------------------------

            function dialogOpen() {
              vm.$store.commit('base/incrDialog2Id');
              vm.$store.commit('base/incrDialogMaxZindex');
              let width
              let left
              if (window.innerWidth > 600) {
                width = '550px'
                left = (window.innerWidth - 560) + 'px'
              } else {
                width = '350px'
                left = (window.innerWidth / 2 - 175) + 'px'
              }
              const diialog =
                  {
                    id: vm.s_dialo2Id,
                    name:'pyramid',
                    style: {
                      display: 'block',
                      width: width,
                      top: '60px',
                      left: left,
                      // right:'10px',
                      'z-index': vm.s_dialogMaxZindex
                    }
                  }
              vm.$store.commit('base/pushDialogs2',{mapName: mapName, dialog: diialog})
            }
          }
        })
      })
      // R02小地域人口ピラミッド----------------------------------------------------------------
      // const maps = ['map01','map02','map03','map04']
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if (e.target && e.target.classList.contains("pyramid-syochiiki-r02") ) {
            d3.select('#' + mapName + ' .loadingImg').style("display","block")
            this.$store.state.base.cdArea = e.target.getAttribute("cdArea")
            this.$store.state.base.syochiikiName = e.target.getAttribute("syochiikiname")
            const cityCode = this.$store.state.base.cdArea.slice(0,5)
            const azaCode = this.$store.state.base.cdArea.slice(5)
            axios
                .get('https://kenzkenz.xsrv.jp/open-hinata/php/pyramid.php',{
                  params: {
                    cityCode: cityCode,
                    azaCode: azaCode
                  }
                }).then(function (response) {
                   d3.select('#' + mapName + ' .loadingImg').style("display","none")
                   console.log(response.data)
                   const dataMan = []
                   const dataWoman = []
                   const dataSousu = []
                   response.data.forEach((v) => {
                     if (v.男女 === '男') {
                       dataMan.push({class: '0～4歳', man: Number(v['0～4歳'])})
                       dataMan.push({class: '5～9歳', man: Number(v['5～9歳'])})
                       dataMan.push({class: '10～14歳', man: Number(v['10～14歳'])})
                       dataMan.push({class: '15～19歳', man: Number(v['15～19歳'])})
                       dataMan.push({class: '20～24歳', man: Number(v['20～24歳'])})
                       dataMan.push({class: '25～29歳', man: Number(v['25～29歳'])})
                       dataMan.push({class: '30～34歳', man: Number(v['30～34歳'])})
                       dataMan.push({class: '35～39歳', man: Number(v['35～39歳'])})
                       dataMan.push({class: '40～44歳', man: Number(v['40～44歳'])})
                       dataMan.push({class: '45～49歳', man: Number(v['45～49歳'])})
                       dataMan.push({class: '50～54歳', man: Number(v['50～54歳'])})
                       dataMan.push({class: '55～59歳', man: Number(v['55～59歳'])})
                       dataMan.push({class: '60～64歳', man: Number(v['60～64歳'])})
                       dataMan.push({class: '65～69歳', man: Number(v['65～69歳'])})
                       dataMan.push({class: '70～74歳', man: Number(v['70～74歳'])})
                       dataMan.push({class: '75～79歳', man: Number(v['75～79歳'])})
                       dataMan.push({class: '80～84歳', man: Number(v['80～84歳'])})
                       dataMan.push({class: '85～89歳', man: Number(v['85～89歳'])})
                       dataMan.push({class: '90～94歳', man: Number(v['90～94歳'])})
                       dataMan.push({class: '95～99歳', man: Number(v['95～99歳'])})
                       dataMan.push({class: '100歳以上', man: Number(v['100歳以上'])})
                     } else if(v.男女 === '女') {
                       dataWoman.push({woman: Number(v['0～4歳'])})
                       dataWoman.push({woman: Number(v['5～9歳'])})
                       dataWoman.push({woman: Number(v['10～14歳'])})
                       dataWoman.push({woman: Number(v['15～19歳'])})
                       dataWoman.push({woman: Number(v['20～24歳'])})
                       dataWoman.push({woman: Number(v['25～29歳'])})
                       dataWoman.push({woman: Number(v['30～34歳'])})
                       dataWoman.push({woman: Number(v['35～39歳'])})
                       dataWoman.push({woman: Number(v['40～44歳'])})
                       dataWoman.push({woman: Number(v['45～49歳'])})
                       dataWoman.push({woman: Number(v['50～54歳'])})
                       dataWoman.push({woman: Number(v['55～59歳'])})
                       dataWoman.push({woman: Number(v['60～64歳'])})
                       dataWoman.push({woman: Number(v['65～69歳'])})
                       dataWoman.push({woman: Number(v['70～74歳'])})
                       dataWoman.push({woman: Number(v['75～79歳'])})
                       dataWoman.push({woman: Number(v['80～84歳'])})
                       dataWoman.push({woman: Number(v['85～89歳'])})
                       dataWoman.push({woman: Number(v['90～94歳'])})
                       dataWoman.push({woman: Number(v['95～99歳'])})
                       dataWoman.push({woman: Number(v['100歳以上'])})
                     } else if(v.男女 === '総数') {
                       dataSousu.push({class: '総数', 総数: Number(v['総数'])})
                       dataSousu.push({class: '総数', over65: Number(v['65歳以上'])})
                       dataSousu.push({class: '総数', 平均年齢: Number(v['平均年齢'])})
                       dataSousu.push({class: '総数', 秘匿処理: v['秘匿処理']})
                     }
                   })
                   const data = dataMan.map((v,i) =>{
                     return Object.assign(v, dataWoman[i]);
                   })
                   console.log(dataSousu)
                   const sousu = dataSousu[0]['総数']
                   const over65 = dataSousu[1].over65
                   const heikinnenrei = dataSousu[2]['平均年齢'].toFixed(2) + '歳'
                   let koureikaritu
                   if (isNaN(over65)) {
                     koureikaritu = '0%'
                   } else {
                     koureikaritu = ((over65 / sousu) * 100).toFixed(2) + '%'
                   }
                   const hitokuSyori = dataSousu[3]['秘匿処理']
                   if (hitokuSyori === '秘匿地域') {
                     alert('秘匿地域です。人口ピラミッドは作成されません。pyramid-syochiiki-r02')
                     return
                   }
                   vm.$store.state.base.koureikaritu = koureikaritu
                   vm.$store.state.base.heikinnenrei = heikinnenrei
                   vm.$store.state.base.kokuchoYear = e.target.getAttribute("year")

                   vm.$store.state.base.estatDataset = data

                   vm.$store.commit('base/incrDialog2Id');
                   vm.$store.commit('base/incrDialogMaxZindex');
                   let left
                   if (window.innerWidth < 600) {
                      left = (window.innerWidth / 2 - 175) + 'px'
                   } else {
                      left = (window.innerWidth - 560) + 'px'
                   }
                   const diialog =
                       {
                         id: vm.s_dialo2Id,
                         name:'pyramid-estat',
                         style: {
                           display: 'block',
                           top: '60px',
                           left:left,
                           'z-index': vm.s_dialogMaxZindex
                         }
                       }
                   vm.$store.commit('base/pushDialogs2',{mapName: mapName, dialog: diialog})
                })
            // switch (prefCode) {
            //   case '01':
            //     statsDataId = '8003006783'
            //     break
            //   case '02':
            //     statsDataId = '8003006747'
            //     break
            //   case '03':
            //     statsDataId = '8003006760'
            //     break
            //   case '04':
            //     statsDataId = '8003006765'
            //     break
            //   case '05':
            //     statsDataId = '8003006766'
            //     break
            //   case '06':
            //     statsDataId = '8003006791'
            //     break
            //   case '07':
            //     statsDataId = '8003006755'
            //     break
            //   case '08':
            //     statsDataId = '8003006756'
            //     break
            //   case '09':
            //     statsDataId = '8003006769'
            //     break
            //   case '10':
            //     statsDataId = '8003006778'
            //     break
            //   case '11':
            //     statsDataId = '8003006762'
            //     break
            //   case '12':
            //     statsDataId = '8003006752'
            //     break
            //   case '13':
            //     statsDataId = '8003006792'
            //     break
            //   case '14':
            //     statsDataId = '8003006761'
            //     break
            //   case '15':
            //     statsDataId = '8003006774'
            //     break
            //   case '16':
            //     statsDataId = '8003006784'
            //     break
            //   case '17':
            //     statsDataId = '8003006771'
            //     break
            //   case '18':
            //     statsDataId = '8003006753'
            //     break
            //   case '19':
            //     statsDataId = '8003006758'
            //     break
            //   case '20':
            //     statsDataId = '8003006775'
            //     break
            //   case '21':
            //     statsDataId = '8003006782'
            //     break
            //   case '22':
            //     statsDataId = '8003006767'
            //     break
            //   case '23':
            //     statsDataId = '8003006757'
            //     break
            //   case '24':
            //     statsDataId = '8003006776'
            //     break
            //   case '25':
            //     statsDataId = '8003006787'
            //     break
            //   case '26':
            //     statsDataId = '8003006764'
            //     break
            //   case '27':
            //     statsDataId = '8003006751'
            //     break
            //   case '28':
            //     statsDataId = '8003006777'
            //     break
            //   case '29':
            //     statsDataId = '8003006763'
            //     break
            //   case '30':
            //     statsDataId = '8003006772'
            //     break
            //   case '31':
            //     statsDataId = '8003006790'
            //     break
            //   case '32':
            //     statsDataId = '8003006754'
            //     break
            //   case '33':
            //     statsDataId = '8003006779'
            //     break
            //   case '34':
            //     statsDataId = '8003006785'
            //     break
            //   case '35':
            //     statsDataId = '8003006793'
            //     break
            //   case '36':
            //     statsDataId = '8003006759'
            //     break
            //   case '37':
            //     statsDataId = '8003006780'
            //     break
            //   case '38':
            //     statsDataId = '8003006781'
            //     break
            //   case '39':
            //     statsDataId = '8003006786'
            //     break
            //   case '40':
            //     statsDataId = '8003006768'
            //     break
            //   case '41':
            //     statsDataId = '8003006788'
            //     break
            //   case '42':
            //     statsDataId = '8003006749'
            //     break
            //   case '43':
            //     statsDataId = '8003006789'
            //     break
            //   case '44':
            //     statsDataId = '8003006770'
            //     break
            //   case '45':
            //     statsDataId = '8003006773'
            //     break
            //   case '46':
            //     statsDataId = '8003006750'
            //     break
            //   case '47':
            //     statsDataId = '8003006748'
            //     break
            // }
            // axios
            //     .get('https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData',{
            //       params: {
            //         appId:'5797c9f94cb117eca0c4e72ca1bd3dddad95c4a5',
            //         // statsDataId:'8003006773', // 宮崎
            //         // statsDataId: '8003006750', // 鹿児島
            //         statsDataId:statsDataId,
            //         // cdArea:"452011520",
            //         cdArea:this.$store.state.base.cdArea
            //       }
            //     }).then(function (response) {
            //       console.log(response.data)
            //       const class0 = response.data.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF.CLASS_OBJ[0].CLASS
            //       const value = response.data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE
            //       console.log(value[0]['$'])
            //       console.log(value[18]['$'])
            //       const koureikaritu = ((value[18]['$'] / value[0]['$']) * 100).toFixed(2) + '%'
            //       console.log(koureikaritu)
            //       vm.$store.state.base.koureikaritu = koureikaritu
            //       const man = []
            //       value.forEach((v, index) => {
            //         if ((index >= 21 & index <= 35) || index === 39) {
            //           man.push({class: class0[index]['@name'], man: v['$']})
            //         }
            //       })
            //       const woman = []
            //       value.forEach((v, index) => {
            //         if ((index >= 41 & index <= 55) || index === 59) {
            //           woman.push({class: class0[index]['@name'], woman: v['$']})
            //         }
            //       })
            //
            //       function toHalfWidth(str) {
            //        // 全角英数字を半角に変換
            //         str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            //            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            //         });
            //         return str;
            //       }
            //       const estatDataset = man.map((v, i) => {
            //         let class1 = toHalfWidth(v.class).replace('男','')
            //         return {class: class1, man: Number(v.man), woman: Number(woman[i].woman)}
            //       })
            //       console.log(estatDataset)
            //       console.log(vm.$store.state.base.estatDataset)
            //       vm.$store.state.base.estatDataset = estatDataset
            //
            //   vm.$store.commit('base/incrDialog2Id');
            //   vm.$store.commit('base/incrDialogMaxZindex');
            //   let left
            //   if (window.innerWidth < 600) {
            //     left = (window.innerWidth / 2 - 175) + 'px'
            //   } else {
            //     left = (window.innerWidth - 560) + 'px'
            //   }
            //   const diialog =
            //       {
            //         id: vm.s_dialo2Id,
            //         name:'pyramid-estat',
            //         style: {
            //           display: 'block',
            //           top: '60px',
            //           // left: '10px',
            //           // right:'10px',
            //           left:left,
            //           'z-index': vm.s_dialogMaxZindex
            //         }
            //       }
            //       vm.$store.state.base.resusOrEstat = 'eStat'
            //       vm.$store.commit('base/pushDialogs2',{mapName: mapName, dialog: diialog})
            //       vm.$store.state.base.cdArea = e.target.getAttribute("cdArea")
            //
            //
            //     })
          }
        })
      })
      function h27syoshiiki(e,mapName,year){
          d3.select('#' + mapName + ' .loadingImg').style("display", "block")
          vm.$store.state.base.cdArea = e.target.getAttribute("cdArea")
          vm.$store.state.base.syochiikiName = e.target.getAttribute("syochiikiname")
          const cityCode = vm.$store.state.base.cdArea.slice(0, 5)
          const azaCode = vm.$store.state.base.cdArea.slice(5)
          axios
              .get('https://kenzkenz.xsrv.jp/open-hinata/php/pyramid2015.php', {
                params: {
                  cityCode: cityCode,
                  azaCode: azaCode,
                  year: year
                }
              }).then(function (response) {
            d3.select('#' + mapName + ' .loadingImg').style("display", "none")
            if (response.data.error) {
              alert('データがありません。地区変更等があったかもしれません。')
              return
            }
            console.log(response.data)
            const dataSet = []
            const dataSousu = []
            response.data.forEach((v) => {
              dataSet.push({class: '0～4歳', man: Number(v['男0～4歳']), woman: Number(v['女0～4歳'])})
              dataSet.push({class: '5～9歳', man: Number(v['男5～9歳']), woman: Number(v['女5～9歳'])})
              dataSet.push({class: '10～14歳', man: Number(v['男10～14歳']), woman: Number(v['女10～14歳'])})
              dataSet.push({class: '15～19歳', man: Number(v['男15～19歳']), woman: Number(v['女15～19歳'])})
              dataSet.push({class: '20～24歳', man: Number(v['男20～24歳']), woman: Number(v['女20～24歳'])})
              dataSet.push({class: '25～29歳', man: Number(v['男25～29歳']), woman: Number(v['女25～29歳'])})
              dataSet.push({class: '30～34歳', man: Number(v['男30～34歳']), woman: Number(v['女30～34歳'])})
              dataSet.push({class: '35～39歳', man: Number(v['男35～39歳']), woman: Number(v['女35～39歳'])})
              dataSet.push({class: '40～44歳', man: Number(v['男40～44歳']), woman: Number(v['女40～44歳'])})
              dataSet.push({class: '45～49歳', man: Number(v['男45～49歳']), woman: Number(v['女45～49歳'])})
              dataSet.push({class: '50～54歳', man: Number(v['男50～54歳']), woman: Number(v['女50～54歳'])})
              dataSet.push({class: '55～59歳', man: Number(v['男55～59歳']), woman: Number(v['女55～59歳'])})
              dataSet.push({class: '60～64歳', man: Number(v['男60～64歳']), woman: Number(v['女60～64歳'])})
              dataSet.push({class: '65～69歳', man: Number(v['男65～69歳']), woman: Number(v['女65～69歳'])})
              dataSet.push({class: '70～74歳', man: Number(v['男70～74歳']), woman: Number(v['女70～74歳'])})
              dataSet.push({class: '75～79歳', man: Number(v['男75～79歳']), woman: Number(v['女75～79歳'])})
              dataSet.push({class: '80～84歳', man: Number(v['男80～84歳']), woman: Number(v['女80～84歳'])})
              dataSet.push({class: '85～89歳', man: Number(v['男85～89歳']), woman: Number(v['女85～89歳'])})
              dataSet.push({class: '90～94歳', man: Number(v['男90～94歳']), woman: Number(v['女90～94歳'])})
              dataSet.push({class: '95～99歳', man: Number(v['男95～99歳']), woman: Number(v['女95～99歳'])})
              dataSet.push({class: '100歳以上', man: Number(v['男100歳以上']), wpman: Number(v['女100歳以上'])})

              dataSousu.push({class: '総数', 総数: Number(v['総数'])})
              dataSousu.push({class: '総数', 総数65歳以上: Number(v['65歳以上'])})
              dataSousu.push({class: '総数', 平均年齢: Number(v['平均年齢'])})
              dataSousu.push({class: '総数', 秘匿処理: v['秘匿処理']})
            })

            const sousu = dataSousu[0]['総数']
            const over65 = dataSousu[1]['総数65歳以上']
            const heikinnenrei = dataSousu[2]['平均年齢'].toFixed(2) + '歳'
            let koureikaritu
            if (isNaN(over65)) {
              koureikaritu = '0%'
            } else {
              koureikaritu = ((over65 / sousu) * 100).toFixed(2) + '%'
            }
            const hitokuSyori = dataSousu[3]['秘匿処理']
            if (hitokuSyori === '秘匿地域') {
              alert('秘匿地域です。人口ピラミッドは作成されません。')
              return;
            }
            vm.$store.state.base.koureikaritu = koureikaritu
            vm.$store.state.base.heikinnenrei = heikinnenrei
            vm.$store.state.base.kokuchoYear = year

            vm.$store.state.base.estatDataset = dataSet

            vm.$store.commit('base/incrDialog2Id');
            vm.$store.commit('base/incrDialogMaxZindex');
            let left
            if (window.innerWidth < 600) {
              left = (window.innerWidth / 2 - 175) + 'px'
            } else {
              left = (window.innerWidth - 560) + 'px'
            }
            const diialog =
                {
                  id: vm.s_dialo2Id,
                  name: 'pyramid-estat',
                  style: {
                    display: 'block',
                    top: '60px',
                    left: left,
                    'z-index': vm.s_dialogMaxZindex
                  }
                }
            vm.$store.commit('base/pushDialogs2', {mapName: mapName, dialog: diialog})
          })
      }
      // H27小地域人口ピラミッド----------------------------------------------------------------
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if (e.target && e.target.classList.contains("pyramid-syochiiki-h27") ) {
            h27syoshiiki(e,mapName,2015)
          }
        })
      })
      // H22小地域人口ピラミッド----------------------------------------------------------------
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if (e.target && e.target.classList.contains("pyramid-syochiiki-h22") ) {
            h27syoshiiki(e,mapName,2010)
          }
        })
      })
      // H17小地域人口ピラミッド----------------------------------------------------------------
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if (e.target && e.target.classList.contains("pyramid-syochiiki-h17") ) {
            h27syoshiiki(e,mapName,2005)
          }
        })
      })
      //小地域人口推移----------------------------------------------
      function r2jinkosuii(e,mapName){
        return new Promise(resolve => {
          d3.select('#' + mapName + ' .loadingImg').style("display","block")
          vm.$store.state.base.cdArea = e.target.getAttribute("cdArea")
          vm.$store.state.base.syochiikiName = e.target.getAttribute("syochiikiname")
          const cityCode = vm.$store.state.base.cdArea.slice(0,5)
          const azaCode = vm.$store.state.base.cdArea.slice(5)
          axios
              .get('https://kenzkenz.xsrv.jp/open-hinata/php/pyramid.php',{
                params: {
                  cityCode: cityCode,
                  azaCode: azaCode
                }
              }).then(function (response) {
            d3.select('#' + mapName + ' .loadingImg').style("display","none")
            const dataMan = []
            const dataWoman = []
            const dataSousu = []
            response.data.forEach((v) => {
              if(v.男女 === '総数') {
                dataSousu.push({class: '総数', 総数: Number(v['総数'])})
                dataSousu.push({class: '総数', over65: Number(v['65歳以上'])})
                dataSousu.push({class: '総数', 平均年齢: Number(v['平均年齢'])})
                dataSousu.push({class: '総数', 秘匿処理: v['秘匿処理']})
                dataSousu.push({class: '総数', under15: Number(v['15歳未満'])})
                dataSousu.push({class: '総数', seisan: Number(v['15～64歳'])})
              }
            })
            const data = dataMan.map((v,i) =>{
              return Object.assign(v, dataWoman[i]);
            })
            const sousu = dataSousu[0]['総数']
            const over65 = dataSousu[1].over65
            const heikinnenrei = dataSousu[2]['平均年齢'].toFixed(2) + '歳'
            let koureikaritu
            if (isNaN(over65)) {
              koureikaritu = '0%'
            } else {
              koureikaritu = ((over65 / sousu) * 100).toFixed(2) + '%'
            }
            const ronenRate = over65 / sousu * 100
            const hitokuSyori = dataSousu[3]['秘匿処理']
            if (hitokuSyori === '秘匿地域') {
              alert('秘匿地域です。人口ピラミッドは作成されません。r2jinkosuii')
              return
            }
            const under15 = dataSousu[4].under15
            const nensyoRate = under15 / sousu * 100
            const seisan = dataSousu[5].seisan
            const seisanRate = seisan / sousu * 100
            console.log(seisan)
            resolve(
                {year:2020,
                  value:sousu,
                  ronenRate:ronenRate,
                  nensyoRate:nensyoRate,
                  seisanRate:seisanRate}
            )
            vm.$store.state.base.koureikaritu = koureikaritu
            vm.$store.state.base.heikinnenrei = heikinnenrei
            vm.$store.state.base.kokuchoYear = e.target.getAttribute("year")

            vm.$store.state.base.estatDataset = data

            vm.$store.commit('base/incrDialog2Id');
            vm.$store.commit('base/incrDialogMaxZindex');
          })
        })
      }
      // ----------------------------------------------
      function h27jinkosuii(e,mapName,year){
        return new Promise(resolve => {
          d3.select('#' + mapName + ' .loadingImg').style("display", "block")
          vm.$store.state.base.cdArea = e.target.getAttribute("cdArea")
          vm.$store.state.base.syochiikiName = e.target.getAttribute("syochiikiname")
          const cityCode = vm.$store.state.base.cdArea.slice(0, 5)
          const azaCode = vm.$store.state.base.cdArea.slice(5)
          axios
              .get('https://kenzkenz.xsrv.jp/open-hinata/php/pyramid2015.php', {
                params: {
                  cityCode: cityCode,
                  azaCode: azaCode,
                  year: year
                }
              }).then(function (response) {
            d3.select('#' + mapName + ' .loadingImg').style("display", "none")
            if (response.data.error) {
              alert('地区変更等があったかもしれません。線グラフが０からスタートします。注意してください。')
              resolve(
                  {
                    year:year,
                    value:0,
                    ronenRate:0,
                    nensyoRate:0,
                    seisanRate:0
                  }
              )
              return
            }
            console.log(response.data)
            const dataSet = []
            const dataSousu = []
            response.data.forEach((v) => {
              dataSousu.push({class: '総数', 総数: Number(v['総数'])})
              dataSousu.push({class: '総数', 総数65歳以上: Number(v['65歳以上'])})
              dataSousu.push({class: '総数', 平均年齢: Number(v['平均年齢'])})
              dataSousu.push({class: '総数', 秘匿処理: v['秘匿処理']})
              dataSousu.push({class: '総数', 総数15歳未満: Number(v['15歳未満'])})
              dataSousu.push({class: '総数', 総数1564歳: Number(v['15～64歳'])})
            })
            const sousu = dataSousu[0]['総数']
            const over65 = dataSousu[1]['総数65歳以上']
            const heikinnenrei = dataSousu[2]['平均年齢'].toFixed(2) + '歳'
            let koureikaritu
            if (isNaN(over65)) {
              koureikaritu = '0%'
            } else {
              koureikaritu = ((over65 / sousu) * 100).toFixed(2) + '%'
            }
            const ronenRate = over65 / sousu * 100
            const hitokuSyori = dataSousu[3]['秘匿処理']
            const under15 = dataSousu[4]['総数15歳未満']
            const nensyoRate = under15 / sousu * 100
            const seisan = dataSousu[5]['総数1564歳']
            const seisanRate = seisan / sousu * 100

            if (hitokuSyori === '秘匿地域') {
              alert('過去に秘匿地域でした。線グラフが０からスタートします。注意してください。')
              resolve(
                  {
                    year:year,
                    value:0,
                    ronenRate:0,
                    nensyoRate:0,
                    seisanRate:0
                  }
              )
              return;
            }

            vm.$store.state.base.koureikaritu = koureikaritu
            vm.$store.state.base.heikinnenrei = heikinnenrei
            vm.$store.state.base.kokuchoYear = year
            vm.$store.state.base.estatDataset = dataSet
            resolve(
                {
                  year:year,
                  value:sousu,
                  ronenRate:ronenRate,
                  nensyoRate:nensyoRate,
                  seisanRate:seisanRate,
                  seisan:seisan
                }
            )
            vm.$store.commit('base/incrDialog2Id');
            vm.$store.commit('base/incrDialogMaxZindex');
          })
        })
      }
      // 小地域人口推移------------------------------------------------------
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if (e.target && e.target.classList.contains("jinkosuii3") ) {
            async function sample() {
              const arr = []
              const a2005 = await h27jinkosuii(e,mapName,2005)
              arr.push(a2005)
              const a2010 = await h27jinkosuii(e,mapName,2010)
              arr.push(a2010)
              const a2015 = await h27jinkosuii(e,mapName,2015)
              arr.push(a2015)
              const a2020 = await r2jinkosuii(e,mapName)
              arr.push(a2020)
              return arr
            }
            sample().then((response) => {
              vm.$store.state.base.jinkosuiiDatasetEstat['datasetAll'] = response
              const ronen = response.map((value) =>{
                if (isNaN(value.ronenRate)) value.ronenRate = 0
                return {year:value.year,rate:value.ronenRate}
              })
              vm.$store.state.base.jinkosuiiDatasetEstat['datasetRonen'] = ronen
              const nensyo = response.map((value) =>{
                if (isNaN(value.nensyoRate)) value.nensyoRate = 0
                return {year:value.year,rate:value.nensyoRate}
              })
              vm.$store.state.base.jinkosuiiDatasetEstat['datasetNensyo'] = nensyo
              const seisan = response.map((value) =>{
                if (isNaN(value.seisanRate)) value.seisanRate = 0
                return {year:value.year,rate:value.seisanRate,sousu:value.value,seisan:value.seisan}
              })
              vm.$store.state.base.jinkosuiiDatasetEstat['datasetSeisan'] = seisan
              console.log(seisan)

              vm.$store.commit('base/incrDialog2Id');
              vm.$store.commit('base/incrDialogMaxZindex');
              let width
              let left
              if (window.innerWidth > 600) {
                width = '550px'
                left = (window.innerWidth - 560) + 'px'
              } else {
                width = '350px'
                left = (window.innerWidth / 2 - 175) + 'px'
              }
              const diialog =
                  {
                    id: vm.s_dialo2Id,
                    name:'jinkosuii',
                    style: {
                      display: 'block',
                      width: width,
                      top: '60px',
                      left: left,
                      'z-index': vm.s_dialogMaxZindex
                    }
                  }
              vm.$store.state.base.resasOrEstat = 'eStat'
              vm.$store.commit('base/pushDialogs2',{mapName: mapName, dialog: diialog})
            });
          }
        })
      })
      // resae人口推移----------------------------------------------------------------
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if ((e.target && e.target.classList.contains("jinkosuii1")) ||
              (e.target && e.target.classList.contains("jinkosuii2"))) {
            //----------------------------------------------------------------
            d3.select('#' + mapName + ' .loadingImg').style("display","block")
            // const resasApiKey ='PhDwqQNb40trBwyOivI5CMdeyqGEx0Gcubdv1GpL'
            let cityCode
            if (e.target.classList.contains("jinkosuii2")) {
              cityCode = '-'
            } else {
              cityCode = e.target.getAttribute("citycode")
            }
            // const cityCode = e.target.getAttribute("citycode")
            let cityName = e.target.getAttribute("cityName")
            const prefCode = e.target.getAttribute("citycode").slice(0,2)
            console.log(cityCode)
            console.log(cityName)
            console.log(prefCode)
            cityName = cityName.replace('役所','').replace('役場','').replace('庁','')
            console.log(cityName)
            vm.$store.state.base.cityName = cityName
            const yearRights = ['dummy']
            async function created() {
              const fetchData = yearRights.map((yearRight) => {
                return axios
                    .get(resasUrl +'population/composition/perYear',{
                      headers:{'X-API-KEY':resasApiKey},
                      params: {
                        prefCode:prefCode,
                        cityCode:cityCode,
                      }
                    })
              })
              await Promise.all([
                ...fetchData
              ])
                  .then((response) => {
                    // d3Create (response)
                    console.log(response[0].data.result.data)
                    vm.$store.state.base.jinkosuiiDataset = response
                    dialogOpen()
                    d3.select('#' + mapName + ' .loadingImg').style("display","none")
                  })
                  .catch(function (response) {
                    alert('データが存在しないか又はリクエストが多くて制限がかかっています。')
                  })
            }
            created()
            //----------------------------------------------------------------

            function dialogOpen() {
              vm.$store.commit('base/incrDialog2Id');
              vm.$store.commit('base/incrDialogMaxZindex');
              let width
              let left
              if (window.innerWidth > 600) {
                width = '550px'
                left = (window.innerWidth - 560) + 'px'
              } else {
                width = '350px'
                left = (window.innerWidth / 2 - 175) + 'px'
              }
              const diialog =
                  {
                    id: vm.s_dialo2Id,
                    name:'jinkosuii',
                    style: {
                      display: 'block',
                      width: width,
                      top: '60px',
                      left: left,
                      'z-index': vm.s_dialogMaxZindex
                    }
                  }
              vm.$store.state.base.resasOrEstat = 'resas'
              vm.$store.commit('base/pushDialogs2',{mapName: mapName, dialog: diialog})
            }
          }
        })
      })
      // 1kmメッシュ円グラフ------------------------------------------------------
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if (e.target && e.target.classList.contains("jinkopie1km") ) {
            vm.$store.commit('base/incrDialog2Id');
            vm.$store.commit('base/incrDialogMaxZindex');
            let width
            let left
            if (window.innerWidth > 600) {
              width = '400px'
              left = (window.innerWidth - 410) + 'px'
            } else {
              width = '350px'
              left = (window.innerWidth / 2 - 175) + 'px'
            }
            const diialog =
                {
                  id: vm.s_dialo2Id,
                  name:'jinkopie',
                  style: {
                    display: 'block',
                    width: width,
                    top: '60px',
                    left: left,
                    'z-index': vm.s_dialogMaxZindex
                  }
                }
            const jinkoPieData = {
              jyusyo:  e.target.getAttribute("jyusyo"),
              jinko:  Number(e.target.getAttribute("jinko")),
              ronen: Number(e.target.getAttribute("ronen")),
              seisan: Number(e.target.getAttribute("seisan")),
              nensyo: Number(e.target.getAttribute("nensyo")),
            }
            vm.$store.state.base.jinkoPieData = jinkoPieData
            vm.$store.commit('base/pushDialogs2',{mapName: mapName, dialog: diialog})
          }
        })
      })
      // 100mメッシュ円グラフ------------------------------------------------------
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if (e.target && e.target.classList.contains("jinkopie100m") ) {
            vm.$store.commit('base/incrDialog2Id');
            vm.$store.commit('base/incrDialogMaxZindex');
            let width
            let left
            if (window.innerWidth > 600) {
              width = '400px'
              left = (window.innerWidth - 410) + 'px'
            } else {
              width = '350px'
              left = (window.innerWidth / 2 - 175) + 'px'
            }
            const diialog =
                {
                  id: vm.s_dialo2Id,
                  name:'jinkopie',
                  style: {
                    display: 'block',
                    width: width,
                    top: '60px',
                    left: left,
                    'z-index': vm.s_dialogMaxZindex
                  }
                }
            const jinkoPieData = {
              jyusyo:  e.target.getAttribute("jyusyo"),
              jinko:  Number(e.target.getAttribute("jinko")),
              ronen: Number(e.target.getAttribute("ronen")),
              seisan: Number(e.target.getAttribute("seisan")),
              nensyo: Number(e.target.getAttribute("nensyo")),
            }
            vm.$store.state.base.jinkoPieData = jinkoPieData
            vm.$store.commit('base/pushDialogs2',{mapName: mapName, dialog: diialog})
          }
        })
      })
      // ssds棒グラフ------------------------------------------------------
      maps.forEach((mapName) => {
        const olPopup = document.querySelector('#' + mapName + ' .ol-popup')
        olPopup.addEventListener('click', (e) => {
          if (e.target && e.target.classList.contains("ssdspref") ) {
            vm.$store.commit('base/incrDialog2Id');
            vm.$store.commit('base/incrDialogMaxZindex');
            let width
            let left
            if (window.innerWidth > 1000) {
              width = '700px'
              left = (window.innerWidth - 710) + 'px'
            } else {
              width = '350px'
              left = (window.innerWidth / 2 - 175) + 'px'
            }
            const diialog =
                {
                  id: vm.s_dialo2Id,
                  name:'ssdsbsr',
                  style: {
                    display: 'block',
                    width: width,
                    top: '60px',
                    left: left,
                    'z-index': vm.s_dialogMaxZindex
                  }
                }

            // console.log(e.target.getAttribute("area"))
            const data00 = vm.$store.state.info.ssdsData00[mapName]
            // console.log(data00)
            let data = data00.filter((v) =>{
              return v['@area'] === e.target.getAttribute("area")
            })
            data = data.map((v) =>{
              return {year:v['@time'].slice(0,4),value:Number(v['$']),unit:v['@unit']}
            })
            console.log(data)
            vm.$store.state.base.cityName = e.target.getAttribute("city")
            vm.$store.state.info.ssdsDataBar = data
            vm.$store.commit('base/pushDialogs2',{mapName: mapName, dialog: diialog})
          }
        })
      })
      // --------------------------------------------------------------
      // const vm = this
      heading = function(ol3d,leftRight){
        if(vm.tiltFlg){
          let head = ol3d.getCamera().getHeading()
          if (head === 0) {
            head = -12.62
            ol3d.getCamera().setHeading(-12.62)
          }
          if (leftRight === 'left') {
            ol3d.getCamera().setHeading(head - 0.025)
          } else {
            ol3d.getCamera().setHeading(head + 0.025)
          }
          setTimeout(function(){heading(ol3d,leftRight)},10);
        } else {
          clearTimeout(heading);
        }
      }

      tilt = function(ol3d,upDown){
        if(vm.tiltFlg){
          const tilt0 = ol3d.getCamera().getTilt()
          // console.log(tilt0)
          if (upDown === 'down') {
            if (tilt0 > 0) ol3d.getCamera().setTilt(tilt0 - 0.025)
          } else {
            if (tilt0 < 1.5) ol3d.getCamera().setTilt(tilt0 + 0.025)
          }
          setTimeout(function(){tilt(ol3d,upDown)},10);
        } else {
          clearTimeout(tilt);
        }
      }

      tiltStart = function(ol3d){
        if(ol3d.getCamera().getTilt() < 0.75){
          const tilt0 = ol3d.getCamera().getTilt()
          ol3d.getCamera().setTilt(tilt0 + 0.0125)
          setTimeout(function(){tiltStart(ol3d)},10);
        } else {
          clearTimeout(tiltStart);
        }
      }

      tiltEnd = function(ol3d){
        if(ol3d.getCamera().getTilt() > 0){
          const tilt0 = ol3d.getCamera().getTilt()
          ol3d.getCamera().setTilt(tilt0 - 0.0125)
          setTimeout(function(){tiltEnd(ol3d)},10);
        } else {
          clearTimeout(tiltEnd)
          ol3d.setEnabled(false)
        }
      }

      this.$nextTick(function () {

        // http://localhost:8080/#Ldd6
        // http://localhost:8080/#yweq
        // 'http://localhost:8080/#9/130.69914/32.42704%3FS%3D1%26L%3D%5B%5B%7B%22id%22%3A%22mw5%22%2C%22ck%22%3Atrue%2C%22o%22%3A1%7D%2C%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%5D'

        // this.$modal.show('modal0');

        const vm = this
        const url = new URL(window.location.href) // URLを取得
        window.history.replaceState(null, '', url.pathname + window.location.hash) //パラメータを削除 FB対策
        const hash = window.location.hash.replace('#','')
        let urlid
        if (hash.length >= 5 && hash.substring(0,1) === 's') {
          // 改善後の短縮URL 最初がsの５桁になっている。
          urlid = hash.substring(1)
        } else {
          const zoomParameter = Number(hash.split('/')[0])
          if (isNaN(zoomParameter)) {
            urlid = hash
          } else {
            urlid = 999
          }
        }
        axios.get('https://kenzkenz.xsrv.jp/open-hinata/php/select.php',{
          params: {
            urlid: urlid
          }
        }).then(function (response) {
          init(response)
          // vm.$modal.hide('modal0')
        }).finally(function () {

        });

        function init (response) {
          // ①map初期化-----------------------------
          MyMap.initMap(vm)
          // ②パーマリンク------------------------------
          Permalink.permalinkEventSet(response)
          // ③画面分割-------------------------------
          // this.splitMap2();
          // ④リサイズ---------------------------------
          const resize = () => {
            if (window.innerWidth < 800) {
              vm.btnSize = 'sm'
              vm.toolTip = false
            } else {
              vm.btnSize = ''
              vm.toolTip = true
            }
            vm.splitMap2()
          };
          // setTimeout(function(){
          resize()
          // }, 300);
          window.onresize =  () => {
            setTimeout(function(){
              resize()
            }, 50);
          };
          window.addEventListener("orientationchange", function() {
            /* 向き切り替え時の処理 */
            setTimeout(function(){
              resize()
            }, 50);
          });
          // ⑤縦バウンス無効化----------------------
          // https://github.com/lazd/iNoBounce
          Inobounce();
          // vm.$modal.show('modal0')
          // ⑥ダイアログ----------------------
          store.state.base.maps['map01'].addControl(MyMap.dialog);
          MyMap.dialog.show({
            content:
                // '<p>海面上昇シミュを改良しました。上昇だけでなく下降もシミュレートします。「' +
                // '<a href="https://kenzkenz.xsrv.jp/open-hinata/#spCXRi" target="_blank">海面上昇シミュ</a>' +
                // '」' +
                // '<p>市区町村の人口ピラミッドを追加しました。「' +
                // '<a href="https://kenzkenz.xsrv.jp/open-hinata/#sDbPrP" target="_blank">市区町村人口ピラミッド</a>' +
                // '」' +
                // '<p>都道府県の人口ピラミッドを追加しました。「' +
                // '<a href="https://kenzkenz.xsrv.jp/open-hinata/#s3SqZv" target="_blank">都道府県人口ピラミッド</a>' +
                // '」' +
                // '<p>国勢調査小地域の人口ピラミッドを追加しました。「' +
                // '<a href="https://kenzkenz.xsrv.jp/open-hinata/#s3PHDc" target="_blank">R2国勢調査小地域人口ピラミッド</a>' +
                // '」' +
                // '<p>広島県のCS立体図（0.5m）を追加しました。「' +
                // '<a href="https://kenzkenz.xsrv.jp/open-hinata/#sotlKZ" target="_blank">広島県CS立体図（広島県0.5m）</a>' +
                // '」' +
                // '<br>是非ご覧ください。',
                   '<p>システム安定化のため４分割機能を削除しました。申し訳ありません。</p>' +
                   '<p>国勢調査小地域の人口ピラミッドはこちら「' +
                   '<a href="https://kenzkenz.xsrv.jp/open-hinata/#s3PHDc" target="_blank">R2国勢調査小地域人口ピラミッド</a>' +
                   '」' +
                   '<p>1kmメッシュの人口を追加しました。「' +
                   '<a href="https://kenzkenz.xsrv.jp/open-hinata/#s0PngJ" target="_blank">2020人口1km</a>' +
                    '」' +
                   '<p>100mメッシュの人口を追加しました。「' +
                   '<a href="https://kenzkenz.xsrv.jp/open-hinata/#s8KTIM" target="_blank">2020人口100m(簡易)</a>' +
                    '」' +
                   '<br>是非ご覧ください。',
            title: 'お知らせ',
            // buttons:{ ok:'hello', cancel:'nope' }
          })
          //-------------------------------
        }
      })
    }
  }
</script>

<style scoped>
    #map00{
        width: 100%;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0;
        padding: 0;
        background-color: #bed2ff;
    }
    #map01{
        background-color: #bed2ff;
        position: relative;
        z-index: 1;
        border: #fff 1px solid;
    }
    #map02{
        background-color: #bed2ff;
        position: absolute;
        border: #fff 1px solid;
    }
    #map03{
        background-color: #bed2ff;
        position: absolute;
        border: #fff 1px solid;
    }
    #map04{
        background-color: #bed2ff;
        position: absolute;
        border: #fff 1px solid;
    }
    .top-left-div{
        position: absolute;
        margin: 0;
        padding: 10px;
        top: 0;
        left: 0;
        z-index: 1;
    }
    .top-right-div{
        position: absolute;
        margin: 0;
        padding: 10px;
        top: 0;
        right: 0;
        z-index: 1;
    }
    .bottom-right-div{
        position: absolute;
        margin: 0;
        padding: 10px;
        bottom: 30px;
        right: 0;
        z-index: 1;
    }
    .zoom-div{
        position: absolute;
        left: 10px;
        /*bottom: 10px;*/
        top: calc(100% - 1.5em);
        z-index: 9999;
        color: #fff;
        text-shadow: black 1px 1px 0, black -1px 1px 0,
        black 1px -1px 0, black -1px -1px 0;
        font-size: large;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        /*cursor: grab;*/
    }
    .marker, .current-position-marker{
      position: absolute;
      background-color: red;
      /*background-image:url('https://kenzkenz.xsrv.jp/open-hinata/img/redpinmini.png');*/
      padding: 8px;
      bottom: -8px;
      left: -8px;
      border-radius: 8px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      pointer-events: none;
    }
    .center-target{
      position: absolute;
      background-image:url('https://kenzkenz.xsrv.jp/open-hinata/img/target0.gif');
      background-repeat:  no-repeat;
      width:24px;
      height:24pX;
      pointer-events: none;
      top: calc(50% - 12px);
      left: calc(50% - 12px);
      z-index: 1;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    #lock{
        position: absolute;
        top: calc(50% - 15px);
        left: calc(50% - 15px);;
        width:30px;
        height: 30px;
        border-radius: 30px;
        text-align: center;
        background-color: #fff;
        color: rgba(0,60,136,0.5);
        z-index: 2;
        cursor: pointer;
        padding-top: 4px;
    }
    #lock:hover{
        color: rgba(0,60,136,0.7);
    }
    .lock, .lock-open {
      /*margin-top: 4px;*/
    }
    .olbtn{
        background-color: rgba(0,60,136,0.5);
    }
    .olbtn:hover{
      background-color: rgba(0,60,136,0.7);
    }
    .olbtn-red{
      background-color: rgba(255,0,0,0.7);
    }
    .olbtn-red:hover{
      background-color: rgba(255,0,0,1.0);
    }
    /*.btn-secondary:hover{*/
    /*    background-color: rgba(0,60,136,0.7);*/
    /*}*/
    .v-enter-active, .v-leave-active {
        transition: opacity 3s;
    }
    .v-leave-active {
        transition: opacity 3s;
    }
    .v-enter, .v-leave-to  {
        opacity: 0;
    }
    .fa-github{
        font-size: 20px;
    }
    .dialog-close-btn-div{
        position: absolute;
        top: 5px;
        right: 13px;
        cursor: pointer;
        z-index: 2;
        font-size:1.5em;
    }
    .modal-bottom {
        position: absolute;
        bottom: 5px;
        width: 100%;
        text-align: center;
    }
    /*セシウムのボタン-------------------------------------------------------------*/
    .cesium-btn-div{
      position:absolute;
      top:60%;
      right:0px;
      z-index:999999999;
      display:none;
      height:145px;
      width:145px;
      margin-left:-72px;
      /*margin-top:-72px;*/
      margin-top:20px;
      background:rgba(0,0,0,0.1);
      border-radius:145px 0 0 145px;
      /*-moz-user-select:none;*/
      /*-webkit-user-select:none;*/
      /*-ms-user-select:none;*/
      /*cursor:move;*/
    }
    .cesiun-btn-container{
      position:relative;
      height:100%;
    }
    .cesium-btn-up{
      position:absolute;
      top:10px;
      left:50%;
      padding:0;
      width:40px;
      height:40px;
      margin-left:-20px;
      color: white;
      /*display:none;*/
    }
    .cesium-btn-down{
      position:absolute;
      bottom:10px;
      left:50%;
      padding:0;
      width:40px;
      height:40px;
      margin-left:-20px;
      color: white;
      /*display:none;*/
    }
    .cesium-btn-left{
      position:absolute;
      top:50%;
      left:10px;
      padding:0;
      width:40px;
      height:40px;
      margin-top:-20px;
      color: white;
    }
    .cesium-btn-right{
      position:absolute;
      top:50%;
      right:10px;
      padding:0;
      width:40px;
      height:40px;
      margin-top:-20px;
      color: white;
    }
    .elevMag{
      position:absolute;
      top:60px;
      left:50%;
      padding:0;
      width:20px;
      height:20px;
      margin-left:-20px;
      text-align:center;
      /*display:none;*/
    }

    .cesium-btn-div .ui-spinner{
      font-size:10px;
      width:30px;
      background:rgba(0,0,0,0);
      border:none;
    }
</style>
<style>
    html {
      /*touch-action: none;*/
    }
    #modal1 .vm--container{
      z-index: 10002;
    }
    #modal2 .vm--container{
      z-index: 10002;
    }
    /*汎用的なスタイルはここに*/
    body{
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
    h1, h2 {
        font-weight: normal;
    }
    p {
        margin: 0!important;
        padding: 0!important;
    }
    hr {
        margin-top: 0.5em!important;
        margin-bottom: 0.5em!important;
    }
    input[type=range] {
        height: 26px;
        -webkit-appearance: none;
        margin: 0 0;/*修正*/
        width: 100%;
        background-color: rgba(0,0,0,0);/*修正*/
    }
    input[type=range]:focus {
        outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        box-shadow: 0 0 0 #000000;
        background: #B6B6B6;
        border-radius: 6px;
        border: 1px solid #8A8A8A;
    }
    input[type=range]::-webkit-slider-thumb {
        box-shadow: 1px 1px 1px #828282;
        border: 1px solid #8A8A8A;
        height: 18px;
        width: 18px;
        border-radius: 18px;
        background: #DADADA;
        cursor: grab;
        -webkit-appearance: none;
        margin-top: -7.5px;
    }
    @media screen and (max-width:480px) {
      input[type=range]::-webkit-slider-thumb {
        height: 23px;
        width: 30px;
        border-radius: 0;
        margin-top: -12.5px;
      }
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
        background: #B6B6B6;
    }
    input[type=range]::-moz-range-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        box-shadow: 0 0 0 #000000;
        background: #B6B6B6;
        border-radius: 6px;
        border: 1px solid #8A8A8A;
    }
    input[type=range]::-moz-range-thumb {
        box-shadow: 1px 1px 1px #828282;
        border: 1px solid #8A8A8A;
        height: 18px;
        width: 18px;
        border-radius: 18px;
        background: #DADADA;
        cursor: grab;
    }
    input[type=range]::-ms-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        background: transparent;
        border-color: transparent;
        color: transparent;
    }
    input[type=range]::-ms-fill-lower {
        background: #B6B6B6;
        border: 1px solid #8A8A8A;
        border-radius: 12px;
        box-shadow: 0 0 0 #000000;
    }
    input[type=range]::-ms-fill-upper {
        background: #B6B6B6;
        border: 1px solid #8A8A8A;
        border-radius: 12px;
        box-shadow: 0 0 0 #000000;
    }
    input[type=range]::-ms-thumb {
        margin-top: 1px;
        box-shadow: 1px 1px 1px #828282;
        border: 1px solid #8A8A8A;
        height: 18px;
        width: 18px;
        border-radius: 18px;
        background: #DADADA;
        cursor: grab;
    }
    input[type=range]:focus::-ms-fill-lower {
        background: #B6B6B6;
    }
    input[type=range]:focus::-ms-fill-upper {
        background: #B6B6B6;
    }
</style>
<style>
    /*ol関係のスタイル*/
    .gray-scale {
      mix-blend-mode: multiply;
      filter: grayScale(1);
    }
    .ol-popup {
      position: absolute;
      background-color: white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      padding: 15px;
      border-radius: 5px;
      border: 1px solid #cccccc;
      bottom: 12px;
      left: -50px;
      user-select: text!important;
      /*min-width: 400px;*/
      /*width:200px;*/
    }
    .ol-popup:after, .ol-popup:before {
      top: 100%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
    .ol-popup:after {
      border-top-color: white;
      border-width: 10px;
      left: 48px;
      margin-left: -10px;
    }
    .ol-popup:before {
      border-top-color: #cccccc;
      border-width: 11px;
      left: 48px;
      margin-left: -11px;
    }
    .ol-popup-closer {
      text-decoration: none;
      position: absolute;
      top: 2px;
      right: 8px;
      font-size: 1.5em;
    }
    .ol-popup-closer:after {
      content: "✖";
    }
    .ol-rotate {
        right: 50%;
        top: 4em;
    }
    .ol-scale-line{
        left: calc(50% - 50px);
        top: calc(100% - 3em);
        height: 22px;
        cursor: grab;
    }
    .ol-zoom {
        /*bottom: 40px;*/
        /*top: auto;*/
        top: calc(100% - 6em);
        /*cursor: grab;*/
    }
    .ol-notification {
        width: 150%;
        bottom: 0;
        border: 0;
        background: none;
        margin: 0;
        padding: 0;
    }
    .ol-notification > div,
    .ol-notification > div:hover {
        position: absolute;
        background-color: rgba(0,0,0,.8);
        color: #fff;
        bottom: 0;
        left: 33.33%;
        max-width: calc(66% - 4em);
        min-width: 5em;
        max-height: 15em;
        min-height: 3em;
        border-radius: 4px 4px 0 0;
        padding: .2em .5em;
        text-align: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        -webkit-transition: .3s;
        transition: .3s;
        opacity: 1;
    }
    .ol-notification.ol-collapsed > div {
        bottom: -5em;
        opacity: 0;
    }
    .ol-notification a {
        color: #9cf;
        cursor: pointer;
    }
    .ol-button i {
      color: inherit;
    }
    .ol-button.ol-active button {
      background-color: rgba(60, 136, 0, 0.7)
      /*background-color: rgba(0,60,136,0.7);*/
    }
    .ol-button.ol-unselectable button {
      background-color: rgba(0,60,136,0.7);
    }
    .current-position {
      top: calc(100% - 3em);
      left: calc(100% - 3em);
    }
    .ol-target-overlay .ol-target
    {
      width: 10px;
      height: 10px;
      background-color: green;
      border-radius: 50%;
      border: 1px solid white;
      position:absolute;
      top: -5px;
      left: -5px;
    }
    /*十字にするときは以下を使う*/
    /*.ol-target-overlay .ol-target*/
    /*{	border: 1px solid transparent;*/
    /*  -webkit-box-shadow: 0 0 1px 1px #fff;*/
    /*  box-shadow: 0 0 1px 1px #fff;*/
    /*  display: block;*/
    /*  height: 20px;*/
    /*  width: 0;*/
    /*}*/

    /*.ol-target-overlay .ol-target:after,*/
    /*.ol-target-overlay .ol-target:before*/
    /*{	content:"";*/
    /*  border: 1px solid #369;*/
    /*  -webkit-box-shadow: 0 0 1px 1px #fff;*/
    /*  box-shadow: 0 0 1px 1px #fff;*/
    /*  display: block;*/
    /*  width: 20px;*/
    /*  height: 0;*/
    /*  position:absolute;*/
    /*  top:10px;*/
    /*  left:-9px;*/
    /*}*/
    /*.ol-target-overlay .ol-target:after*/
    /*{	-webkit-box-shadow: none;	box-shadow: none;*/
    /*  height: 20px;*/
    /*  width: 0;*/
    /*  top:0px;*/
    /*  left:0px;*/
    /*}*/
</style>
<style>
@import '../css/ol-ext.css';
</style>
