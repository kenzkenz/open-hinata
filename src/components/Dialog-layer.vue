<template>
    <v-dialog :dialog="s_dialogs[mapName]" :reset="1" :mapName="mapName">
        <div class="content-div" :style="contentSize[mapName]">
            <div class="first-content-div" :style="firstContentHeight[mapName]">
                <v-layer :mapName="mapName"/>
            </div>
            <div class="second-content-div" :style="secondContentHeight[mapName]">
                <v-layerList :mapName="mapName" />
            </div>
        </div>
    </v-dialog>
</template>

<script>
  import LayerList from './LayerList'
  import Layer from './Layer'
  export default {
    name: "Dialog-layer",
    components: {
      'v-layerList': LayerList,
      'v-layer': Layer
    },
    props: ['mapName'],
    data() {
      return {
        contentSize: {
          map01: {'max-height': '300px', 'overflow': 'auto'},
          map02: {'max-height': '300px', 'overflow': 'auto'},
          // map03: {'max-height': '300px', 'overflow': 'auto'},
          // map04: {'max-height': '300px', 'overflow': 'auto'}
        },
        firstContentHeight: {
          map01: {'height': '200px'},
          map02: {'height': '200px'},
        },
        secondContentHeight: {
          map01: {'height': '200px'},
          map02: {'height': '200px'},
        }
      }
    },
    computed: {
      s_dialogs() { return this.$store.state.base.dialogs },
      s_splitFlg() { return this.$store.state.base.splitFlg }
    },
    methods: {
      splitMap () {
        const contentHeight = (window.innerHeight - 190) + 'px';
        const contentHeight2 = ((window.innerHeight / 2) - 0) + 'px';
        const secondContentHeight = (window.innerHeight - 410) + 'px';
        const secondContentHeight2 = ((window.innerHeight / 2) - 220) + 'px';
        console.log(this.s_splitFlg)
        switch (this.s_splitFlg) {
          // 1画面
          case 1:
            this.contentSize['map01'] = {'max-height': contentHeight};
            this.firstContentHeight['map01'].height = '200px'
            this.secondContentHeight['map01'].height = secondContentHeight
            break;
          // 2画面（縦２画面）
          case 2:
            if (window.innerWidth > 800) {
              this.contentSize['map01'] = {'max-height': contentHeight};
              this.contentSize['map02'] = {'max-height': contentHeight};
              this.firstContentHeight['map01'].height = '200px'
              this.firstContentHeight['map02'].height = '200px'
              this.secondContentHeight['map01'].height = secondContentHeight
              this.secondContentHeight['map02'].height = secondContentHeight
            } else {
              this.contentSize['map01'] = {'max-height': contentHeight2};
              this.contentSize['map02'] = {'max-height': contentHeight2};
              this.firstContentHeight['map01'].height = '100px'
              this.firstContentHeight['map02'].height = '100px'
              this.secondContentHeight['map01'].height = secondContentHeight2
              this.secondContentHeight['map02'].height = secondContentHeight2
            }
            break;


          // 2画面（横２画面）
          // case 3:
          //   alert(3)
          //   this.contentSize['map01'] = {'max-height': contentHeight2};
          //   this.contentSize['map02'] = {'max-height': contentHeight2};
          //   this.contentSize2['map01'].height = secondContentHeight2
          //   this.contentSize2['map02'].height = secondContentHeight2
          //   break;
          // // 3画面１（左が縦全、右が縦半）
          // case 4:
          //   this.contentSize['map01'] = {'max-height': contentHeight};
          //   this.contentSize['map02'] = {'max-height': contentHeight2};
          //   this.contentSize['map03'] = {'max-height': contentHeight2};
          //   break;
          // // 3画面2（全て縦半）
          // case 5:
          //   this.contentSize['map01'] = {'max-height': contentHeight2};
          //   this.contentSize['map02'] = {'max-height': contentHeight2};
          //   this.contentSize['map03'] = {'max-height': contentHeight2};
          //   break;
          // // 4画面（全て縦半）
          // case 6:
          //   this.contentSize['map01'] = {'max-height': contentHeight2};
          //   this.contentSize['map02'] = {'max-height': contentHeight2};
          //   this.contentSize['map03'] = {'max-height': contentHeight2};
          //   this.contentSize['map04'] = {'max-height': contentHeight2}
        }
      }
    },
    watch: {
      s_splitFlg : function () {
        this.splitMap ()
      }
    },
    mounted () {
      this.splitMap ()
    }
  }
</script>

<style scoped>
    /*重要！！バウンスを止めたときに同時にスクロールを無効化させないために必要*/
    .content-div{
        /*overflow: auto;*/
        -webkit-overflow-scrolling: touch;
    }
    .first-content-div{
      border: 1px solid grey;
      margin: 5px;
      height: 200px;
      overflow-y: auto;
      background-color: gray;
    }
    .second-content-div{
      border: 1px solid grey;
      margin: 5px;
      background: rgba(255,255,255,0.5);
      height: 410px;
      /*height: calc(100% - 300px);*/
      /*height: 100px;*/
      overflow-y: auto;
      overflow-x: hidden;
    }
</style>
