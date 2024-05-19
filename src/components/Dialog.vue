<script src="../js/layers.js"></script>
<template>
    <div class="dialog-div" :style="this.dialog.style" @mousedown="dialogMouseDown">
        <div class="drag-handle" v-my-drag-handle>
        </div>
            <div>
              <div id="reset-btn" v-if="reset === 1" class="reset-btn-div" @click="resetBtn"><i class="fa-sharp fa-solid fa-trash-arrow-up hover"></i></div>
              <div class="close-btn-div" @click="closeBtn"><i class="fa-solid fa-xmark hover close-btn"></i></div>
                <slot></slot>
            </div>
    </div>
</template>

<script>
  import store from "@/js/store";
  import * as Layers from '../js/layers'
  import * as MyMap from '../js/mymap'
  export default {
    name: 'Dialog',
    props: ['dialog','reset','mapName'],
    data () {
      return {
      }
    },
    methods: {
      resetBtn () {
        store.commit('base/deleteDialogsInfo',{mapName: this.mapName})
        MyMap.history ('リセット2だ')
        const map = store.state.base.maps[this.mapName];
        // const result = this.s_layerList.filter((el) => el.id === 2);
        const removeResult = this.s_layerList.filter((el) => el.id !== 2);
        removeResult.forEach((value) =>{
          map.removeLayer(value.layer)
        })
        // map.addLayer(MyMap.danmenLayer)
        store.commit('base/updateList', {
          value: [{
            id: 2,
            check: true,
            title: '淡色地図',
            layer: Layers.Layers[1].children[1].data.layer[this.mapName],
            opacity: 1,
            summary: Layers.Layers[1].children[1].data.summary,
            component: ''
          }],
          mapName: this.mapName
        })
      },
      closeBtn () {
        this.dialog.style.display = 'none'
      },
      dialogMouseDown () {
        store.commit('base/incrDialogMaxZindex');
        this.dialog.style["z-index"] = store.state.base.dialogMaxZindex
      }
    },
    computed: {
      s_layerList: {
        get () { return store.getters['base/layerList'](this.mapName) },
        set (value) { store.commit('base/updateList', {value: value, mapName: this.mapName}) }
      },
      s_flg: function () {
        const result = store.state.base.dialogArr.find(el => el.name === this.dialog.name);
        return result.flg
      }
    }
  }
</script>

<style scoped>
    .dialog-div{
        position: absolute;
        z-index: 1;
        background-color: #fff;
        box-shadow:2px 2px 5px #787878;
        border: 1px solid whitesmoke;
        border-radius: 4px;
        transition: opacity 1s;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        /*width: 300px;*/
    }
    .drag-handle{
        height: 30px;
        padding: 5px;
        background-color: rgba(0,60,136,0.5);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        cursor: grab;
        color: white;
        /*width: 50px;*/
    }
    .reset-btn-div{
      position: absolute;
      top: 0;
      right: 40px;
      cursor: pointer;
      color: #fff;
      z-index: 2;
      font-size:1.4em;
    }
    .close-btn-div{
        position: absolute;
        top: 0;
        right: 5px;
        cursor: pointer;
        color: #fff;
        z-index: 2;
        font-size:1.5em;
    }
    .hover:hover{
        color: blue;
    }
    .hover-white:hover{
        color: white;
    }

    /* 1秒かけて透明度を遷移 */
    .v-enter-active, .v-leave-active {
        transition: opacity 1s;
    }
    /* 見えなくなるときの透明度 */
    .v-enter, .v-leave-to {
        opacity: 0;
    }
</style>
