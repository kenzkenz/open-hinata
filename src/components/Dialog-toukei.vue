<template>
    <v-dialog :dialog="S_toukei">
        <div :style="contentSize">
          <select v-model="selected">
            <option disabled value="">選択して下さい</option>
            <option v-for="option in options" v-bind:value="option.name" v-bind:key="option.id">
              {{ option.name }}
            </option>
          </select>
        </div>
    </v-dialog>
</template>

<script>

    export default {
    name: "mainInfo",
    data () {
      return {
        selected: '',
        options: [
          { id: 1, name: '01北海道' },
          { id: 2, name: '02青森県' },
          { id: 3, name: '03岩手県' },
          { id: 4, name: '04宮城県' },
          { id: 5, name: '05秋田県' },
          { id: 6, name: '06山形県' },
          { id: 7, name: '07福島県' },
          { id: 8, name: '08茨城県' },
          { id: 9, name: '09栃木県' },
          { id: 10, name: '10群馬県' },
          { id: 11, name: '11埼玉県' },
          { id: 12, name: '12千葉県' },
          { id: 13, name: '13東京都' },
          { id: 14, name: '14神奈川県' },
          { id: 15, name: '15新潟県' },
          { id: 16, name: '16富山県' },
          { id: 17, name: '17石川県' },
          { id: 18, name: '18福井県' },
          { id: 19, name: '19山梨県' },
          { id: 20, name: '20長野県' },
          { id: 21, name: '21岐阜県' },
          { id: 22, name: '22静岡県' },
          { id: 23, name: '23愛知県' },
          { id: 24, name: '24三重県' },
          { id: 25, name: '25滋賀県' },
          { id: 26, name: '26京都府' },
          { id: 27, name: '27大阪府' },
          { id: 28, name: '28兵庫県' },
          { id: 29, name: '29奈良県' },
          { id: 30, name: '30和歌山県' },
          { id: 31, name: '31鳥取県' },
          { id: 32, name: '32島根県' },
          { id: 33, name: '33岡山県' },
          { id: 34, name: '34広島県' },
          { id: 35, name: '35山口県' },
          { id: 36, name: '36徳島県' },
          { id: 37, name: '37香川県' },
          { id: 38, name: '38愛媛県' },
          { id: 39, name: '39高知県' },
          { id: 40, name: '40福岡県' },
          { id: 41, name: '41佐賀県' },
          { id: 42, name: '42長崎県' },
          { id: 43, name: '43熊本県' },
          { id: 44, name: '44大分県' },
          { id: 45, name: '45宮崎県' },
          { id: 46, name: '46鹿児島県' },
          { id: 47, name: '47沖縄県' }
        ],
        contentSize: {'height': 'auto', 'margin': '10px', 'overflow': 'auto', 'user-select': 'text'},
      }
    },
    computed: {
      S_toukei () {
        return this.$store.state.base.dialogs.toukei
      }
    },
    methods: {
    },
    mounted () {
      this.$watch(function () {

      });
    }
  }
</script>

<style scoped>

</style>
