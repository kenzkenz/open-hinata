選択されたリストを表示するvueファイル。
<template>
<!--  <v-draggable element="ul" :options="{handle:'.handle-div, .title-span',animation: 200}" v-model="s_layerList">-->
  <v-draggable element="ul" :options="{handle:'.handle-div',animation: 200}" v-model="s_layerList">
        <li v-for="item in s_layerList" :key="item.id">
            <div class="list-div">

              <div class="handle-div" ><i class="fa-solid fa-up-down fa-lg handle-icon"></i></div>

              <label class="check-box" :for='mapName + "checkbox" + item.id'>
                <div class="check-div" >
                    <input :id='mapName + "checkbox" + item.id' type="checkbox" checked v-model="item.check" @change="checkLayer(item)">
                    <span class="check-text"></span>
                </div>
              </label>

              <label :for='"checkbox2" + item.id'>
                <div class="check2-div" >
                  <input :id='"checkbox2" + item.id' type="checkbox" class='check-box' v-model="item.multipli" @change="multipliLayer(item)">
                  <b-popover   content="合成します。"
                               :target='"checkbox2" + item.id'
                               triggers="hover"
                               placement="left"
                               boundary="viewport"
                  />
                </div>
              </label>

              <div class="item-div" @click="clickDiv(item)">
                    <span class ="title-span" v-html="item.title"></span>
              </div>
                <div class="range-div"><input type="range" min="0" max="1" step="0.01" class="range" v-model.number="item.opacity" @input="opacityChange(item)" /></div>
                <div class="info-div" @click="infoOpen(arguments[0],item)"><i class="fa-solid fa-circle-info hover"></i></div>
                <div class="close-div" @click="removeLayer(item)"><i class="fa-sharp fa-solid fa-trash-arrow-up hover"></i></div>
            </div>
        </li>
<!--        <vue-snotify></vue-snotify>-->
    </v-draggable>
</template>

<script>
  import vuedraggable from 'vuedraggable'
  import * as permalink from '../js/permalink'
  import * as MyMap from '../js/mymap'
  export default {
    name: 'Layer',
    props: ['mapName'],
    components: {
      'v-draggable': vuedraggable
    },
    methods: {
      displayNotification() {
        this.$snotify.simple({
          body: '使っていないけど残している。メソッドをどこかに仕掛ければこのメッセージがでる。今のところ不要',
          title: 'Notification Title',
          config: {}
        });
      },
      opacityChange (item) {
        MyMap.history ('透過-' + item.title)
        MyMap.opacityChange(item);
        permalink.moveEnd()
      },
      clickDiv (item) {
        MyMap.history ('不可視')
        const elm = document.querySelector('#' + this.mapName + "checkbox" + item.id)
        if (elm.checked) {
          item['check'] = false
        } else {
          item['check'] = true
        }
        MyMap.checkLayer(item, this.s_layerList, this.mapName);
        permalink.moveEnd()
      },
      checkLayer (item) {
        MyMap.history ('不可視')
        MyMap.checkLayer(item, this.s_layerList, this.mapName);
        permalink.moveEnd()
      },
      multipliLayer (item) {
        MyMap.history ('合成')
        MyMap.multipliLayer(item, this.s_layerList, this.mapName);
        permalink.moveEnd()
      },
      removeLayer (item) {
        MyMap.history ('リセット3')
        MyMap.removeLayer(item, this.s_layerList, this.mapName)
        this.$store.commit('base/deleteDialogsInfo',{mapName: this.mapName})
      },
      infoOpen (e,item) {
        // const dialogEl = $(e.currentTarget).parents('.dialog-div')[0];
        console.log(e.currentTarget.parentNode)
        console.log(this.mapName)
        const dialogEl = document.querySelector('#' + this.mapName + " .dialog-div")
        const top = dialogEl.offsetTop + 'px';
        const left = (dialogEl.offsetLeft + dialogEl.offsetWidth + 5) + 'px';
        const result = this.s_dialogsINfo[this.mapName].find(el => el.id === item.id);
        this.$store.commit('base/incrDialogMaxZindex');
        if (!result) {
          const infoDialog =
            {
              id: item.id,
              title: item.title,
              summary: item.summary,
              component: item.component,
              style: {
                display: 'block',
                top: top,
                left: left,
                'z-index': this.s_dialogMaxZindex
              }
            }
          // this.$store.commit('base/deketeDialogsInfo',{mapName: this.mapName})
          this.$store.commit('base/pushDialogsInfo',{mapName: this.mapName, dialog: infoDialog})
        } else {
          // 既に存在しているときは表示のみ。データを変更せずにスタイルを直接書き換えている。
          result.style.display = 'block';
          result.style["z-index"] = this.s_dialogMaxZindex
        }
      }
    },
    computed: {
      s_layerList: {
        get () { return this.$store.getters['base/layerList'](this.mapName) },
        set (value) { this.$store.commit('base/updateList', {value: value, mapName: this.mapName}) }
      },
      s_dialogsINfo () {
        return this.$store.state.base.dialogsInfo
      },
      s_dialogMaxZindex () {
        return this.$store.state.base.dialogMaxZindex
      },
      // watch用にlengthのあるオブジェクト
      s_layerListWatch: {
        get () {
          return {
            value: this.$store.getters['base/layerList'](this.mapName),
            length:this.$store.getters['base/layerList'](this.mapName).length }
        },
      },
      storeNotification: {
        get () { return this.$store.state.base.notification },
        set (value) { this.$store.commit('base/updateNotification', value) }
      }
    },
    mounted () {
      this.$watch(
        // 2つの値を評価させる
        () => [this.$store.getters['base/layerList'](this.mapName), this.$store.getters['base/layerList'](this.mapName).length],
        (newLayerList,oldLayerList) => {
          //newLayerList,oldLayerListは配列になっている。
          const map = this.$store.state.base.maps[this.mapName];
          if (map) MyMap.watchLayer(map, this.mapName, newLayerList,oldLayerList);
          if (this.mapName === 'map01') MyMap.history ('順番変更')
          permalink.moveEnd()
        }
      )
    }
  }
</script>

<style scoped>
    ul{
        padding: 0;
        margin: 0;
        position: relative;
    }
    ul li {
        color: black;
        border-bottom: solid 1px gainsboro;
        background: rgba(255,255,255,0.5);
        padding-top: 0;
        list-style-type: none!important;
        text-align: left;
        height: 39px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    /*.check-icon{*/
    /*  margin: 10px 5px 0 5px;*/
    /*}*/
    .handle-div{
        position: absolute;
        width: 25px;
        height: 100%;
        color: #fff;
        background-color: rgba(0,60,136,0.5);
        cursor: grab;
    }
    .handle-icon{
        margin: 10px 5px 0 8px;
    }
    .list-div{
        position: relative;
        height: 100%;
        background-color: lightsteelblue;
    }
    .item-div{
        position: absolute;
        left: 90px;
        top: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width:calc(100% - 104px);
        cursor: pointer;
    }
    .range-div{
        position: absolute;
        top:16px;
        left:86px;
        width:calc(100% - 104px);
    }
    .info-div{
        position: absolute;
        top:7px;
        left:70px;
        width:15px;
        cursor: pointer;
        color:rgba(0,60,136,0.5);
    }
    .close-div{
        position: absolute;
        top:13px;
        right:0;
        width:15px;
        color:rgba(0,60,136,0.5);
        cursor: pointer;
    }
    .hover:hover{
        color: blue;
    }
    .hover-white:hover{
        color: white;
    }
    .el-notification__content{
        display: block;
    }
    .check-div{
      position: absolute;
      padding-top: 0px;
      padding-left: 5px;
      left: 23px;
      top:8px;
      height: 100%;
      cursor: pointer;
    }
    .check2-div{
      position: absolute;
      padding-top: 0px;
      padding-left: 5px;
      left: 46px;
      top:8px;
      height: 100%;
      cursor: pointer;
    }
    .check-box {
      cursor: pointer;
    }
    .check-text {
      /* チェックボックスとテキストの上下を中央に */
      align-items: center;
      display: flex;
    }
    .check-box input {
      display: none; /* デフォルトのチェックボックスを非表示 */
    }
    .check-box input + .check-text::before {
      background-image: url("https://kenzkenz.xsrv.jp/open-hinata/icon/eye2.png");
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      content: "";
      height: 16px;
      position: relative;
      width: 16px;
    }
    .check-box input:checked + .check-text::before {
      background-image: url("https://kenzkenz.xsrv.jp/open-hinata/icon/eye.png");
    }
    .title-span{
      /*cursor: grab;*/
    }
</style>
<style>
    /*非scopedでないと反映しなかったため*/
    .snotifyToast__inner{
        min-height: 50px;
    }
</style>
