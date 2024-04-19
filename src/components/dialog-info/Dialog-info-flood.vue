<template>
    <div>
        <!--海面上昇シミュレーション5m-->
        <div v-if="item.component.name === 'flood5m'">
            <div class="content-div">
                <p v-html="item.title"></p><hr>
                <input type="range" min="0" :max="floodMax5m" :step="seaLevelStep5m" class="flood-range5m" v-model.number="s_seaLevel5m" @input="flood5m" />
                <div style="text-align: center;">{{ s_seaLevel5m.toFixed(1) }}m上昇した場合</div>
                <p v-html="item.summary"></p><hr>
                <div style="position: absolute;left:260px;"><chrome-picker v-show="colorsShowFlg" v-model="s_colors" @input="colorChange5m"/></div>
                <div  @click="colorsShow('m20')" :style="style('m20')">20m～</div>
                <div @click="colorsShow('m10')" :style="style('m10')">10m～20m</div>
                <div @click="colorsShow('m5')" :style="style('m5')">5m～10m</div>
                <div @click="colorsShow('m3')" :style="style('m3')">3m～5m</div>
                <div @click="colorsShow('m0')" :style="style('m0')">0.5m～3m</div>
                <div @click="colorsShow('m00')" :style="style('m00')">～0.5m</div>
                <b-form-radio-group v-model="s_selected5m" :options="options" @change="floodChange5m" />
            </div>
        </div>
        <!--海面上昇シミュレーション10m-->
        <div v-else-if="item.component.name === 'flood10m'">
            <div class="content-div">
                <p v-html="item.title"></p><hr>
                <input type="range" min="0" :max="floodMax10m" :step="seaLevelStep10m" class="flood-range10m" v-model.number="s_seaLevel10m" @input="flood10m" />
                <div style="text-align: center;">{{ s_seaLevel10m.toFixed(1) }}m上昇した場合</div>
                <p v-html="item.summary"></p><hr>
                <div style="position: absolute;left:260px;"><chrome-picker v-show="colorsShowFlg" v-model="s_colors" @input="colorChange10m"/></div>
                <div @click="colorsShow('m20')" :style="style('m20')">20m～</div>
                <div @click="colorsShow('m10')" :style="style('m10')">10m～20m</div>
                <div @click="colorsShow('m5')" :style="style('m5')">5m～10m</div>
                <div @click="colorsShow('m3')" :style="style('m3')">3m～5m</div>
                <div @click="colorsShow('m0')" :style="style('m0')">0.5m～3m</div>
                <div @click="colorsShow('m00')" :style="style('m00')">～0.5m</div>
                <b-form-radio-group v-model="s_selected10m" :options="options" @change="floodChange10m"/>
            </div>
        </div>
    </div>
</template>

<script>
  import * as Layers from '../../js/layers'
  import * as permalink from '../../js/permalink'
  import { Chrome } from 'vue-color'
  import * as MyMap from '../../js/mymap'

  export default {
    name: "flood",
    props: ['mapName', 'item'],
    components: {
      'chrome-picker': Chrome
    },
    data () {
      return {
        colorsShowFlg: false,
        colorM: 'm20',
        seaLevelStep5m: 0.5,
        seaLevelStep10m: 0.5,
        options: [
          { text: 'max 25m　', value: '25' },
          { text: 'max 100m　', value: '100' },
          { text: 'max 500m', value: '500' },
          { text: 'max 1000m', value: '1000' },
          { text: 'max 3800m', value: '3800' },
          { text: 'max 9000m', value: '9000' }
        ],
        floodMax5m: '100',
        floodMax10m: '100'
      }
    },
    computed: {
      s_colors: {
        get() {
          return this.$store.state.info.colors[this.colorM]
        },
        set(value) {
          this.$store.commit('info/updateColors', {colorM:this.colorM, value:value})
        }
      },
      s_seaLevel5m: {
        get() { return this.$store.state.info.seaLevel5m[this.mapName] },
        set(value) {
          this.$store.commit('info/updateSeaLevel5m', {mapName: this.mapName, value:value})
        }
      },
      s_seaLevel10m: {
        get() { return this.$store.state.info.seaLevel10m[this.mapName] },
        set(value) {
          this.$store.commit('info/updateSeaLevel10m', {mapName: this.mapName, value:value})
        }
      },
      s_selected5m: {
        get() { return this.$store.state.info.selected5m[this.mapName] },
        set(value) {
          this.$store.commit('info/updateSelected5m', {mapName: this.mapName, value:value})
        }
      },
      s_selected10m: {
        get() { return this.$store.state.info.selected10m[this.mapName] },
        set(value) {
          this.$store.commit('info/updateSelected10m', {mapName: this.mapName, value:value})
        }
      }
    },
    methods: {
      style (colorM) {
        let rgba; let border;
        if (this.colorM === colorM) {
          rgba = this.s_colors;
          if (this.colorsShowFlg) {
            border = '1px solid black'
          } else {
            border = 'none'
          }
        } else {
          rgba = this.$store.state.info.colors[colorM];
          border = 'none'
        }
        return {
          background: 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')',
          border: border,
          'font-size': 'x-small',
          color: 'black',
          'padding-left': '1em',
          cursor: 'pointer'
        }
      },
      colorChange5m () {
        Layers.flood5Obj['map01'].getSource().changed();
        Layers.flood5Obj['map02'].getSource().changed();
        Layers.flood5Obj['map03'].getSource().changed();
        Layers.flood5Obj['map04'].getSource().changed()
      },
      colorChange10m () {
        Layers.flood10Obj['map01'].getSource().changed();
        Layers.flood10Obj['map02'].getSource().changed();
        Layers.flood10Obj['map03'].getSource().changed();
        Layers.flood10Obj['map04'].getSource().changed()

        Layers.flood102Obj['map01'].getSource().changed();
        Layers.flood102Obj['map02'].getSource().changed();
        Layers.flood102Obj['map03'].getSource().changed();
        Layers.flood102Obj['map04'].getSource().changed()

      },
      colorsShow (cororM) {
        if (this.colorM === cororM) {
          this.colorsShowFlg = !this.colorsShowFlg;
        } else {
          this.colorsShowFlg = true;
        }
        this.colorM = cororM;
      },
      // 海面上昇シミュレーション
      storeUpdate (dem) {
        let lebel; let selected;
        if (dem === '5m') {
          lebel = this.s_seaLevel5m;
          selected = this.s_selected5m;
        } else {
          lebel = this.s_seaLevel10m;
          selected = this.s_selected10m;
        }
        this.$store.commit('base/updateListPart',{mapName: this.mapName, id:this.item.id, values: [lebel, selected]});
        permalink.moveEnd();
      },
      flood5m () {
        MyMap.history ('海面上昇5mdem')
        Layers.flood5Obj[this.mapName].getSource().changed();
        this.storeUpdate('5m')
      },
      flood10m () {
        MyMap.history ('海面上昇10mdem')
        Layers.flood10Obj[this.mapName].getSource().changed();
        Layers.flood102Obj[this.mapName].getSource().changed();

        this.storeUpdate('10m')
      },
      floodChange5m () {
        this.$nextTick(function () {
          const val = this.s_selected5m;
          this.floodMax5m = val;
          if (val === '25') {
            this.seaLevelStep5m = 0.1
          } else if (val === '100') {
            this.seaLevelStep5m = 0.5
          } else {
            this.seaLevelStep5m = 1
          }
          this.storeUpdate('5m')
        })
      },
      floodChange10m () {
        this.$nextTick(function () {
          const val = this.s_selected10m;
          this.floodMax10m = val;
          if (val === '25') {
            this.seaLevelStep10m = 0.1
          } else if (val === '100') {
            this.seaLevelStep10m = 0.5
          } else {
            this.seaLevelStep5m = 1
          }
          this.storeUpdate('10m')
        })
      }
    },
    mounted ()  {
      this.$nextTick(function () {
        Layers.flood5Obj[this.mapName].getSource().changed();
        Layers.flood10Obj[this.mapName].getSource().changed();
        Layers.flood102Obj[this.mapName].getSource().changed();
        this.storeUpdate('5m');
        this.storeUpdate('10m')
      })
    },
    watch: {
      s_selected5m: {
        handler: function () {
          this.floodMax5m = this.s_selected5m
        },
        immediate: true
      },
      s_selected10m: {
        handler: function () {
          this.floodMax10m = this.s_selected10m
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>
.content-div{
  width: 200px;
  padding: 10px;
}
</style>
