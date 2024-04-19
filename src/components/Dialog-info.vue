<template>
    <div>
        <div class="v-dialog-info-div" v-for="item in info" :key="item.id" :style="item.style" @mousedown="dialogMouseDown(item)">
            <div class="drag-handle" v-my-drag-handle></div>
            <div class="close-btn-div" @click="close(item)"><i class="fa-solid fa-xmark hover close-btn"></i></div>
            <!--なにもないとき。普通のラスターのとき-->
            <div v-if="!item.component">
                <div class="info-content-div">
                    <p v-html="item.title"></p><hr>
                    <p v-html="item.summary"></p>
                </div>
            </div>
            <!--海面上昇シミュレーション5m-->
            <v-flood :item="item" :mapName="mapName" v-else-if="item.component.name === 'flood5m'" />
            <!--海面上昇シミュレーション10m-->
            <v-flood :item="item" :mapName="mapName" v-else-if="item.component.name === 'flood10m'"/>
            <!--シームレス地質図-->
            <v-seamless :item="item" :mapName="mapName" v-else-if="item.component.name === 'seamless'"/>

            <v-kouzi :item="item" :mapName="mapName" v-else-if="item.component.name === 'kouzi'"/>

            <v-dokuji :item="item" :mapName="mapName" v-else-if="item.component.name === 'dokuji'"/>

        </div>
    </div>
</template>

<script>
  import DialogInfoFlood from './dialog-info/Dialog-info-flood'
  import DialogInfoSeamless from "@/components/dialog-info/Dialog-info-seamless";
  import DialogInfoKouzi from "@/components/dialog-info/Dialog-info-kouzi";
  import DialogInfoDokuji from "@/components/dialog-info/Dialog-info-dokuji";
  export default {
    name: "v-dialog-info",
    components: {
      'v-kouzi': DialogInfoKouzi,
      'v-seamless':DialogInfoSeamless,
      'v-flood': DialogInfoFlood,
      'v-dokuji':DialogInfoDokuji
    },
    props: ['mapName'],
    computed: {
      info () {
        return this.$store.state.base.dialogsInfo[this.mapName]
      }
    },
    methods: {
      close (item) {
        const result = this.$store.state.base.dialogsInfo[this.mapName] .find(el => el.id === item.id);
        result.style.display = 'none'
      },
      dialogMouseDown (item) {
        const result = this.$store.state.base.dialogsInfo[this.mapName] .find(el => el.id === item.id);
        this.$store.commit('base/incrDialogMaxZindex');
        result.style["z-index"] = this.$store.state.base.dialogMaxZindex
      }
    }
  }
</script>

<style>
    .form-group {
        margin-bottom: 0;
    }
    .v-dialog-info-div{
        position: absolute;
        z-index: 10;
        background-color: #fff;
        box-shadow:2px 2px 5px #787878;
        border: 1px solid whitesmoke;
        border-radius: 4px;
        transition: opacity 1s;
        /*-webkit-user-select: none;*/
        /*-moz-user-select: none;*/
        /*-ms-user-select: none;*/
        /*user-select: none;*/
    }
    .drag-handle{
        height: 30px;
        padding: 5px;
        background-color: rgba(0,60,136,0.5);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        cursor: grab;
    }
    .close-btn-div{
        position: absolute;
        top: 0;
        right: 5px;
        cursor: pointer;
        color: #fff;
        z-index: 2;
    }
    .close-btn-div{
      font-size:1.5em;
    }
    .hover:hover{
      color: blue;
    }
    .info-content-div{
        padding: 10px;
        /*max-width: 350px;*/
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
</style>
