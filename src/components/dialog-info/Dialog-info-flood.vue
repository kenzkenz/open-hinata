<template>
    <div>
        <!--海面上昇シミュレーション5m-->
        <div v-if="item.component.name === 'flood5m'">
            <div class="info-content-div">
                <p v-html="item.title"></p><hr>
                <p v-html="item.summary"></p><hr>
                <b-form-radio-group v-model="s_selected5m" :options="options" @change="floodChange5m" />
                <input type="range" min="0" :max="floodMax5m" :step="seaLevelStep5m" class="flood-range5m" v-model.number="s_seaLevel5m" @input="flood5m" />
                <div style="text-align: center;">{{ s_seaLevel5m.toFixed(1) }}m上昇した場合</div>
            </div>
        </div>
        <!--海面上昇シミュレーション10m-->
        <div v-else-if="item.component.name === 'flood10m'">
            <div class="info-content-div">
                <p v-html="item.title"></p><hr>
                <p v-html="item.summary"></p><hr>
                <b-form-radio-group v-model="s_selected10m" :options="options" @change="floodChange10m"/>
                <input type="range" min="0" :max="floodMax10m" :step="seaLevelStep10m" class="flood-range10m" v-model.number="s_seaLevel10m" @input="flood10m" />
                <div style="text-align: center;">{{ s_seaLevel10m.toFixed(1) }}m上昇した場合</div>
            </div>
        </div>
    </div>
</template>

<script>
  import * as Layers from '../../js/layers'
  import * as permalink from '../../js/permalink'
  export default {
    name: "flood",
    props: ['mapName', 'item'],
    data () {
      return {
        seaLevelStep5m: 0.5,
        seaLevelStep10m: 0.5,
        options: [
          { text: 'max 25m　', value: '25' },
          { text: 'max 100m　', value: '100' },
          { text: 'max 500m', value: '500' },
          { text: 'max 1000m', value: '1000' },
          { text: 'max 3800m', value: '3800' }
        ],
        floodMax5m: '100',
        floodMax10m: '100'
      }
    },
    computed: {
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
        Layers.flood5Obj[this.mapName].getSource().changed();
        this.storeUpdate('5m')
      },
      flood10m () {
        Layers.flood10Obj[this.mapName].getSource().changed();
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

</style>
