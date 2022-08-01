選択されたリストを表示するvueファイル。
<template>
    <v-draggable element="ul" :options="{handle:'.handle-div',animation: 200}" v-model="s_layerList">
        <li v-for="item in s_layerList" :key="item.id">
            <div class="list-div">
                <div class="handle-div" ><i class="fa-solid fa-bars hover-white handle-icon "></i></div>
                <div class="item-div">
                    <span v-html="item.title"></span>
                </div>
                <div class="range-div"><input type="range" min="0" max="1" step="0.01" class="range" v-model.number="item.opacity" @input="opacityChange(item)" /></div>
                <div class="info-div" @click="infoOpen(arguments[0],item)"><i class="fa-solid fa-circle-info hover"></i></div>
                <div class="close-div" @click="removeLayer(item)"><i class="fa-solid fa-xmark fa-lg hover"></i></div>
            </div>
        </li>
        <vue-snotify></vue-snotify>
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
        MyMap.opacityChange(item);
        permalink.moveEnd()
      },
      removeLayer (item) {
        MyMap.removeLayer(item, this.s_layerList, this.mapName)
      },
      infoOpen (e,item) {
        // const dialogEl = $(e.currentTarget).parents('.dialog-div')[0];
        console.log(e.currentTarget.parentNode)
        console.log(this.mapName)
        let len= 1
        switch (this.mapName) {
          case 'map01':
            len = 0
            break;
          case 'map02':
            len = 2  //なぜか２でないとうまくいかない。
            break;
          case 'map03':
            len = 3
            break;
          case 'map04':
            len = 4
            break;
         }
        const dialogEl = document.querySelectorAll(".dialog-div")[len]
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
            };
          this.$store.commit('base/pushDialogsInfo',{mapName: this.mapName, dialog: infoDialog});
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
    // watch: {
    //   // ストアを監視。レイヤーを追加したとき・順番を変えたときに動く
    //   s_layerListWatch : function (newLayerList,oldLayerList) {
    //     const map = this.$store.state.base.maps[this.mapName];
    //     if (map) MyMap.watchLayer(map, this.mapName, newLayerList,oldLayerList);
    //     permalink.moveEnd()
    //   }
    // },
    mounted () {
      this.$watch(
        // 2つの値を評価させる
        () => [this.$store.getters['base/layerList'](this.mapName), this.$store.getters['base/layerList'](this.mapName).length],
        (newLayerList,oldLayerList) => {
          //newLayerList,oldLayerListは配列になっている。
          const map = this.$store.state.base.maps[this.mapName];
          if (map) MyMap.watchLayer(map, this.mapName, newLayerList,oldLayerList);
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
    .handle-div{
        position: absolute;
        height: 100%;
        background-color: rgba(0,60,136,0.5);
        cursor: grab;
    }
    .handle-icon{
        margin: 10px 5px 0 5px;
    }
    .list-div{
        position: relative;
        height: 100%;
    }
    .item-div{
        position: absolute;
        left: 45px;
        top: 3px;
    }
    .range-div{
        position: absolute;
        top:16px;
        left:30px;
        width:calc(100% - 60px);
    }
    .info-div{
        position: absolute;
        top:2px;
        left:28px;
        width:15px;
        cursor: pointer;
        color:rgba(0,60,136,0.5);
    }
    .close-div{
        position: absolute;
        top:13px;
        right:0;
        width:15px;
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
</style>
<style>
    /*非scopedでないと反映しなかったため*/
    .snotifyToast__inner{
        min-height: 50px;
    }
</style>
