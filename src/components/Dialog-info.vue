<template>
    <div>
        <div class="v-dialog-info-div" v-for="item in info" :key="item.id" :style="item.style" @mousedown="dialogMouseDown(item)">
            <div class="drag-handle" v-my-drag-handle></div>
            <div class="close-btn-div" @click="close(item)"><i style="" class="fa-solid fa-xmark hover close-btn"></i></div>
            <!--なにもないとき。普通のラスターのとき-->
            <div v-if="!item.component">
                <div class="info-content-div">
                    <p v-html="item.title"></p><hr>
                    <p v-html="item.summary"></p>
                </div>
            </div>
            <v-flood :item="item" :mapName="mapName" v-else-if="item.component.name === 'flood10m'"/>
            <v-flood :item="item" :mapName="mapName" v-else-if="item.component.name === 'flood15'"/>
            <v-flood :item="item" :mapName="mapName" v-else-if="item.component.name === 'floodSimple'"/>
            <v-seamless :item="item" :mapName="mapName" v-else-if="item.component.name === 'seamless'"/>
            <v-kouzi :item="item" :mapName="mapName" v-else-if="item.component.name === 'kouzi'"/>
            <v-dokuji :item="item" :mapName="mapName" v-else-if="item.component.name === 'dokuji'"/>
            <v-jinko-1km :item="item" :mapName="mapName" v-else-if="item.component.name === 'jinko'"/>
            <v-jinko-100m :item="item" :mapName="mapName" v-else-if="item.component.name === 'jinko100m'"/>
            <v-jinko-250m :item="item" :mapName="mapName" v-else-if="item.component.name === 'jinko250m'"/>

        </div>
    </div>
</template>

<script>
  import DialogInfoFlood from '@/components/dialog-info/Dialog-info-flood'
  import DialogInfoSeamless from "@/components/dialog-info/Dialog-info-seamless";
  import DialogInfoKouzi from "@/components/dialog-info/Dialog-info-kouzi";
  import DialogInfoDokuji from "@/components/dialog-info/Dialog-info-dokuji";
  import DialogInfoJinko1km from '@/components/dialog-info/Dialog-info-jinko1km'
  import DialogInfoJinko100m from '@/components/dialog-info/Dialog-info-jinko100m'
  import DialogInfoJinko250m from '@/components/dialog-info/Dialog-info-jinko250m'


  export default {
    name: "v-dialog-info",
    components: {
      'v-kouzi': DialogInfoKouzi,
      'v-seamless':DialogInfoSeamless,
      'v-flood': DialogInfoFlood,
      'v-dokuji':DialogInfoDokuji,
      'v-jinko-1km':DialogInfoJinko1km,
      'v-jinko-100m':DialogInfoJinko100m,
      'v-jinko-250m':DialogInfoJinko250m,
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
        width:30px;
        text-align: center;
    }
    .close-btn-div{
      font-size:1.5em;
    }
    /*.overlink{*/
    /*  position: absolute;*/
    /*  top: 0;*/
    /*  left: 0;*/
    /*  width: 100%;*/
    /*  height: 100%;*/
    /*  text-indent: -999px;*/
    /*  z-index: 2;*/
    /*}*/
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
