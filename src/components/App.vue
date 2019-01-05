<template>
    <div id="map00">
        <!--map01からmap04をループで作成-->
        <transition v-for="mapName in mapNames" :key="mapName">
            <div :id=mapName :style="mapSize[mapName]" v-show="mapFlg[mapName]">
                <div class="top-left-div">
                    <b-button v-if="mapName === 'map01'" class='olbtn' :size="btnSize" @click="openDialog(s_dialogs['menuDialog'])" style="margin-right:5px;"><v-icon name="bars"  scale="1.0" /></b-button>
                    <b-button v-if="mapName === 'map01'" class='olbtn' :size="btnSize" @click="splitMap" style="margin-right:5px;"><v-icon name="columns"  scale="1.0" /></b-button>
                    <b-button class='olbtn' :size="btnSize" @click="openDialog(s_dialogs[mapName])">背景</b-button>
                </div>
                <div class="top-right-div"></div>
                <v-dialog-layer :mapName=mapName />
                <v-dialog-info :mapName=mapName />
                <v-dialog-menu v-if="mapName === 'map01'"/>
                <div class="zoom-div">{{ zoom[mapName] }}</div>
            </div>
        </transition>
        <!--map01からmap04をループで作成。ここまで-->
        <transition>
            <div id="lock" v-show="synchDivFlg" @click="synch">
                <v-icon v-if="synchFlg" name="lock" scale="1.5" class="hover"/>
                <v-icon v-else name="lock-open" scale="1.5" class="hover"/>
            </div>
        </transition>
    </div>
</template>

<script>
  import DialogMenu from './Dialog-menu'
  import DialogLayer from './Dialog-layer'
  import * as Permalink from '../js/permalink'
  import Inobounce from '../js/inobounce'
  import * as MyMap from '../js/mymap'
  import JqueryFunction from '../js/jquery-function'
  export default {
    name: 'App',
    components: {
      'v-dialog-layer': DialogLayer,
      'v-dialog-menu': DialogMenu
    },
    data () {
      return {
        mapNames: ['map01','map02','map03','map04'],
        btnSize: '',
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
      s_dialogs () { return this.$store.state.base.dialogs},
      s_splitFlg () { return this.$store.state.base.splitFlg},
      s_dialogMaxZindex () { return this.$store.state.base.dialogMaxZindex}
    },
    methods: {
      // レイヤーのダイアログを開く------------------------------------------------------------------
      openDialog (dialog) {
        this.$store.commit('base/incrDialogMaxZindex');
        dialog.style["z-index"] = this.s_dialogMaxZindex;
        dialog.style.display = 'block'

        // this.$store.commit('editDialogArr', {name: dialog.name, flg: 'toggle'})
      },
      // 分割-------------------------------------------------------------------------------------
      splitMap () {
        this.$store.commit('base/incrSplitFlg');
        this.splitMap2();
        Permalink.moveEnd()
      },
      // 分割その２
      splitMap2 () {
        const vm = this;
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
          // 2画面（縦２画面）
          case 2:
            vm.synchDivFlg = true;
            vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = false; vm.mapFlg['map04'] = false;
            vm.mapSize['map01'] = {top: 0, left: 0, width: '50%', height: height};
            vm.mapSize['map02'] = {top: 0, left: '50%', width: '50%', height: height};
            vm.mapSize['map03'] = {top: 0, left: 0, width: 0, height: 0};
            vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
            break;
          // 2画面（横２画面）
          case 3:
            vm.synchDivFlg = true;
            vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = false; vm.mapFlg['map04'] = false;
            vm.mapSize['map01'] = {top: 0, left: 0, width: '100%', height: height2};
            vm.mapSize['map02'] = {top: '50%', left: 0, width: '100%', height: height2};
            vm.mapSize['map03'] = {top: 0, left: 0, width: 0, height: 0};
            vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
            break;
          // 3画面１（左が縦全、右が縦半）
          case 4:
            vm.synchDivFlg = true;
            vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = true; vm.mapFlg['map04'] = false;
            vm.mapSize['map01'] = {top: 0, left: 0, width: '50%', height: height};
            vm.mapSize['map02'] = {top: 0, left: '50%', width: '50%', height: height2};
            vm.mapSize['map03'] = {top: '50%', left: '50%', width: '50%', height: height2};
            vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
            break;
          // 3画面2（全て縦半）
          case 5:
            vm.synchDivFlg = true;
            vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = true; vm.mapFlg['map04'] = false;
            vm.mapSize['map01'] = {top: 0, left: 0, width: '100%', height: height2};
            vm.mapSize['map02'] = {top: '50%', left: 0, width: '50%', height: height2};
            vm.mapSize['map03'] = {top: '50%', left: '50%', width: '50%', height: height2};
            vm.mapSize['map04'] = {top: 0, left: 0, width: 0, height: 0};
            break;
          // 4画面（全て縦半）
          case 6:
            vm.synchDivFlg = true;
            vm.mapFlg['map02'] = true; vm.mapFlg['map03'] = true; vm.mapFlg['map04'] = true;
            vm.mapSize['map01'] = {top: 0, left: 0, width: '50%', height: height2};
            vm.mapSize['map02'] = {top: 0, right: 0, width: '50%', height: height2};
            vm.mapSize['map03'] = {top: '50%', left: 0, width: '50%', height: height2};
            vm.mapSize['map04'] = {top: '50%', left: '50%', width: '50%', height: height2}
        }
        this.$nextTick(function () {
          MyMap.resize ()
        })
      },
      // 同期-------------------------------------------------------------------------------------
      synch () {
        MyMap.synch(this)
      }
    },
    mounted () {
      this.$nextTick(function () {
        // ①map初期化-----------------------------
        MyMap.initMap(this);
        // ②パーマリンク------------------------------
        Permalink.permalinkEventSet();
        // ③画面分割-------------------------------
        this.splitMap2();
        // ④リサイズ---------------------------------
        const resize = () => {
          if (window.innerWidth < 700) {
            this.btnSize = 'sm'
          } else {
            this.btnSize = ''
          }
          this.splitMap2()
        };
        resize();
        window.onresize =  () => resize();
        // ⑤縦バウンス無効化----------------------
        // https://github.com/lazd/iNoBounce
        Inobounce();
      });

      JqueryFunction();//削除予定
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
    }
    #map01{
        background-color: #fff;
        position: relative;
        z-index: 1000;
        border: #fff 1px solid;
    }
    #map02{
        background-color: #fff;
        position: absolute;
        border: #fff 1px solid;
    }
    #map03{
        background-color: white;
        position: absolute;
        border: #fff 1px solid;
    }
    #map04{
        background-color: white;
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
    .zoom-div{
        position: absolute;
        left: 10px;
        bottom: 10px;
        z-index: 1;
        color: #fff;
        text-shadow: black 1px 1px 0, black -1px 1px 0,
        black 1px -1px 0, black -1px -1px 0;
        font-size: x-large;
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
        z-index: 10001;
    }
    #lock:hover{
        color: rgba(0,60,136,0.7);
    }
    .olbtn{
        background-color: rgba(0,60,136,0.5);
    }
    .btn-secondary:hover{
        background-color: rgba(0,60,136,0.7);
    }
    .v-enter-active, .v-leave-active {
        transition: opacity 3s;
    }
    .v-leave-active {
        transition: opacity 3s;
    }
    .v-enter, .v-leave-to  {
        opacity: 0;
    }
</style>
<style>
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
    .ol-rotate {
        right: 49%;
        top: 20px;
    }
    .ol-scale-line{
        left: calc(50% - 50px);
        height: 22px;
        cursor: grab;
    }
    .ol-zoom {
        bottom: 40px;
        top: auto;
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
        max-height: 5em;
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
</style>
