import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const moduleBase = {
  namespaced: true,
  state: {
    currentPosition: false,
    dialogShow: false,
    suUrl: '',
    mwId: '',
    zyougen:100000,
    colorArr: {
      map01: [],
      map02: [],
      map03: [],
      map04: []
    },
    maps: {map01: null, map02: null, map03: null, map04: null},
    ol3d: {map01: null, map02: null, map03: null, map04: null},
    toggle3d: {map01:false,map02:false,map03:false,map04:false},
    layerLists: {
      map01: [],
      map02: [],
      map03: [],
      map04: []
    },
    dialogs: {
      dialogEdit0:{style: {top: '56px', right: '10px', 'z-index': 1, height: 'auto', 'width': '200px', display: 'none'}},
      dialogEdit:{style: {top: '250px', right: '10px', 'z-index': 1, height: 'auto', 'width': '323px', display: 'none'}},
      menuDialog: {style: {top: '56px', left: '10px', 'z-index': 1, height: 'auto', 'min-width': '150px', display: 'none'}},
      map01: {style: {top: '56px', left:'10px', 'z-index': 1, height: 'auto', 'min-width': '250px', display: 'none'}},
      map02: {style: {top: '56px', left:'10px', 'z-index': 1, height: 'auto', 'min-width': '250px', display: 'none'}},
      map03: {style: {top: '56px', left:'10px', 'z-index': 1, height: 'auto', 'min-width': '250px', display: 'none'}},
      map04: {style: {top: '56px', left:'10px', 'z-index': 1, height: 'auto', 'min-width': '250px', display: 'none'}},
    },
    dialogsInfo: {
      map01: [],
      map02: [],
      map03: [],
      map04: []
    },
    dialogs2: {
      map01: [],
      map02: [],
      map03: [],
      map04: []
    },
    menuFlg:false,
    notifications: {},
    notification: '',
    dialogMaxZindex:1,
    dialog2Id:1,
    splitFlg: 1,
    firstFlg: true,
    increment: 0,
    popUpCont: '',
    hight: {
      map01: 1,
      map02: 1,
      map03: 1,
      map04: 1
    },
    cityCode: {
      map01: '',
      map02: '',
      map03: '',
      map04: ''
    },
    cityName: '',
    cdArea: '',
    syochiikiName: '',
    koureikaritu: '',
    heikinnenrei: '',
    kokuchoYear: '',
    erevArr:[],
    drawType:'danmen',
    estatDataset:[],
    resasDataset:[],
    jinkosuiiDataset:[],
    jinkosuiiDatasetEstat:[],
    jinkoPieData: {
      jinko: 0,
      ronen: 0,
      seisan: 0,
      nensyo: 0
    },
    ssdsStatName: '',
    togglePoint:false,
    toggleModify:false,
    editFeature:'',
    editFeatureName:'',
    editFeatureSetumei:'',
    editFeatureSrc:'',
    resasOrEstat:'',
    prefId:[{pref:'北海道', id:1}, {pref:'青森県', id:2}, {pref:'岩手県', id:3}, {pref:'宮城県', id:4},
          {pref:'秋田県', id:5}, {pref:'山形県', id:6}, {pref:'福島県', id:7}, {pref:'茨城県', id:8},
          {pref:'栃木県', id:9}, {pref:'群馬県', id:10}, {pref:'埼玉県', id:11}, {pref:'千葉県', id:12},
          {pref:'東京都', id:13}, {pref:'神奈川県', id:14}, {pref:'新潟県', id:15}, {pref:'富山県', id:16},
          {pref:'石川県', id:17}, {pref:'福井県', id:18}, {pref:'山梨県', id:19}, {pref:'長野県', id:20},
          {pref:'岐阜県', id:21}, {pref:'静岡県', id:22}, {pref:'愛知県', id:23}, {pref:'三重県', id:24},
          {pref:'滋賀県', id:25}, {pref:'京都府', id:26}, {pref:'大阪府', id:27}, {pref:'兵庫県', id:28},
          {pref:'奈良県', id:29}, {pref:'和歌山県', id:30}, {pref:'鳥取県', id:31}, {pref:'島根県', id:32},
          {pref:'岡山県', id:33}, {pref:'広島県', id:34}, {pref:'山口県', id:35}, {pref:'徳島県', id:36},
          {pref:'香川県', id:37}, {pref:'愛媛県', id:38}, {pref:'高知県', id:39}, {pref:'福岡県', id:40},
          {pref:'佐賀県', id:41}, {pref:'長崎県', id:42}, {pref:'熊本県', id:43}, {pref:'大分県', id:44},
          {pref:'宮崎県', id:45}, {pref:'鹿児島県', id:46}, {pref:'沖縄県', id:47}
        ]
  },
  getters: {
    layerList: (state) => (mapName) => {
      return state.layerLists[mapName]
    },
    // 重要！！！！！！！！！！------------------------------------------------
    layerLists (state) {
      const layerListArr = [];
      layerListArr.push(state.layerLists.map01);layerListArr.push(state.layerLists.map02);layerListArr.push(state.layerLists.map03);layerListArr.push(state.layerLists.map04);
      const layerListArr2 = [];
      for (let layerList of layerListArr) {
        const layerList2 = [];
        for (let layer of layerList) {
          let check
          if (layer.check === undefined) {
            check = true
          } else {
            check = layer.check
          }
          layerList2.push({
            id:layer.id,
            m:layer.multipli,
            ck:check,
            o:layer.opacity,
            c:layer.component
          })
        }
        layerListArr2.push(layerList2)
      }
      // console.log(layerListArr2);
      // console.log(JSON.stringify(layerListArr2))
      return JSON.stringify(layerListArr2)
      // return layerListArr2
    }
  },
  mutations: {
    updateHight (state,payload) {
      state.hight[payload.mapName] = payload.value
    },
    toggleCurrentPosition (state) {
      state.currentPosition = !state.currentPosition
    },
    updateDialogShow (state, payload) {
      state.dialogShow = payload
    },
    updateSuUrl (state, payload) {
      state.suUrl = payload
    },
    updateMwId (state, payload) {
      state.mwId = payload
    },
    updateZyougen (state, payload) {
      state.zyougen = payload
    },
    updateColorArr (state, payload) {
      state.colorArr[payload.mapName] = payload.colorArr
    },
    //------------------------------------------------------------------------------------
    popUpContReset(state) {
      state.popUpCont = ''
    },
    //------------------------------------------------------------------------------------
    popUpContUpdate(state,payload) {
      if (!state.popUpCont) {
        state.popUpCont = state.popUpCont + payload
      } else {
        state.popUpCont = state.popUpCont + '<hr>' + payload
      }
    },
    //------------------------------------------------------------------------------------
    updateFirstFlg (state, payload) {
      state.firstFlg = payload
    },
    //------------------------------------------------------------------------------------
    increment (state) {
      state.increment++
    },
    // マップを登録------------------------------------------------------------------------------
    setMap (state,payload) {
      state.maps[payload.mapName] = payload.map
    },
    //-----------------------------------------------------------------------------------------
    setNotifications(state, payload) {
      state.notifications[payload.mapName] = payload.control
    },
    // メニューの展開フラグ-----------------------------------------------------------------------
    menuFlgToggle (state) {
      state.menuFlg = !state.menuFlg
    },
    // ダイアログのマックスz-indedx インクリメント--------------------------------------------------
    incrDialogMaxZindex (state) {
      state.dialogMaxZindex++
    },
    // cdialog2のid インクリメント--------------------------------------------------
    incrDialog2Id (state) {
      state.dialog2Id++
    },
    // インフォ用ダイアログの追加------------------------------------------------------------------
    pushDialogsInfo (state,payload) {
      const dialogs = state.dialogsInfo[payload.mapName];
      dialogs.push(payload.dialog)
      // console.log(payload.dialog)
    },
    pushDialogs2 (state,payload) {
      const dialogs = state.dialogs2[payload.mapName];
      dialogs.push(payload.dialog)
      // console.log(payload.dialog)
    },

    deleteDialogsInfo (state,payload) {
      state.dialogsInfo[payload.mapName]= []
    },
    // レイヤーリスト更新-------------------------------------------------------------------------
    updateList (state, payload) {
      state.layerLists[payload.mapName] = payload.value
    },
    // レイヤーリスト先頭に追加--------------------------------------------------------------------
    unshiftLayerList (state, payload) {
      const layerList = state.layerLists[payload.mapName];
      const layer = payload.value.layer[payload.mapName];
      if (!layerList.find(el => el.id === payload.value.id)) {
        payload.value.layer = layer;
        layerList.unshift(payload.value)
      }
    },
    // レイヤーリスト一部更新-------------------------------------------------------------------------
    updateListPart (state, payload) {
      const result = state.layerLists[payload.mapName].find(el => el.id === payload.id);
      // console.log(result)
      result.component.values = payload.values;
    },
    getListPart (state, payload) {
      const result = state.layerLists[payload.mapName].find(el => el.id === payload.id);
      console.log(result.component.values)

      // result.component.values = payload.values;
    },
    // 通知-------------------------------------------------------------------------------------
    updateNotification (state, payload) { state.notification = payload },
    //マップ分割フラグ----------------------------------------------------------------------------
    incrSplitFlg (state) {
      state.splitFlg++;
      // if (state.splitFlg === 4) state.splitFlg = 1
      if (state.splitFlg === 3) state.splitFlg = 1
    },
    updateSplitFlg (state, payload) {
      state.splitFlg = Number(payload)
    }
  }

};

const moduleInfo = {
  namespaced: true,
  state: {
    dokujiUrl: {
      map01: '',
      map02: '',
      map03: '',
      map04: ''
    },
    // crossOrigin: {
    //   map01: '',
    //   map02: '',
    //   map03: '',
    //   map04: ''
    // },
    selected10m: {
      map01: 200,
      map02: 200,
      map03: 200,
      map04: 200
    },
    landCheck: {
      map01: true,
      map02: true,
      map03: true,
      map04: true
    },
    paintCheck100m: {
      map01: true,
      map02: true,
      map03: true,
      map04: true
    },
    paintCheck250m: {
      map01: true,
      map02: true,
      map03: true,
      map04: true
    },
    paintCheck500m: {
      map01: true,
      map02: true,
      map03: true,
      map04: true
    },
    paintCheck1k: {
      map01: true,
      map02: true,
      map03: true,
      map04: true
    },
    paintCheckSyogakkoR05: {map01: true, map02: true, map03: true, map04: true},
    paintCheckSyogakkoR03: {map01: true, map02: true, map03: true, map04: true},
    paintCheckTyugakkoR05: {map01: true, map02: true, map03: true, map04: true},
    paintCheckTyugakkoR03: {map01: true, map02: true, map03: true, map04: true},

    textCheckSyogakkoR05: {map01: true, map02: true, map03: true, map04: true},
    textCheckSyogakkoR03: {map01: true, map02: true, map03: true, map04: true},
    textCheckTyugakkoR05: {map01: true, map02: true, map03: true, map04: true},
    textCheckTyugakkoR03: {map01: true, map02: true, map03: true, map04: true},

    seaLevel10m: {
      map01: 0,
      map02: 0,
      map03: 0,
      map04: 0
    },
    jinko: {
      map01: 35100,
      map02: 35100,
      map03: 35100,
      map04: 35100
    },
    jinko100m: {
      map01: 1310,
      map02: 1310,
      map03: 1310,
      map04: 1310
    },
    jinko250m: {
      map01: 3010,
      map02: 3010,
      map03: 3010,
      map04: 3010
    },
    jinko500m: {
      map01: 15000,
      map02: 15000,
      map03: 15000,
      map04: 15000
    },
    kosoku: {
      map01: 2024,
      map02: 2024,
      map03: 2024,
      map04: 2024
    },
    tetsudoJikeiretsu: {
      map01: 2024,
      map02: 2024,
      map03: 2024,
      map04: 2024
    },
    ssdsData00: {
      map01: [],
      map02: [],
      map03: [],
      map04: []
    },
    ssdsDataBar: [],
    ssdsData: {
      map01: [],
      map02: [],
      map03: [],
      map04: []
    },
    kouzi: {
      map01: 100000,
      map02: 100000,
      map03: 100000,
      map04: 100000
    },
    floodColors: {
    },
    floodColors2: {
    },
    colors: {
      // m20: {r: 187,g: 0,b:187,a:122/255 },
      // m10: {r: 228,g: 0,b:142,a:135/255 },
      // m5: {r: 255,g: 0,b:0,a:145/255 },
      // m3: {r: 255,g: 13,b:13,a:179/255 },
      // m0: {r: 255,g: 125,b:45,a:179/255 },
      // m00: {r: 232,g: 226,b:8,a:166/255 },
      // m000: {r: 0,g: 0,b:0,a:0 }

      m5: {r: 145,g: 255,b:0,a:255/255 },
      m10: {r: 145,g: 255,b:0,a:255/255 },
      m50: {r: 145,g: 255 ,b:0,a:255/255 },
      m100: {r: 255,g: 255,b:0,a:255/255 },
      m500: {r: 255,g: 125,b:0,a:255/255 },
      m1500: {r: 210,g: 105,b:30,a:255/255 },
      // m1500: {r: 0,g: 0,b:0,a:255/255 },
      m2500: {r: 255,g: 68,b:0,a:255/255 },
      sea: {r: 0,g: 0,b:255,a:255/255 },

      sea5: {r: 0,g: 0,b:255,a:255/255 },
      sea10: {r: 0,g: 0,b:255,a:255/255 },
      sea50: {r: 0,g: 0 ,b:205,a:255/255 },
      sea100: {r: 0,g: 0,b:205,a:255/255 },
      sea500: {r: 0,g: 0,b:205,a:255/255 },
      sea1500: {r: 0,g: 0,b:139,a:255/255 },
      sea2500: {r: 0,g: 0,b:128,a:255/255 },
      sea3500: {r: 25,g: 25,b:112,a:255/255 },

      paleSea: {r: 193,g: 210,b:251,a:255/255 },

      m20: {r: 0,g: 0,b:255,a:122/255 },
      // m10: {r: 0,g: 0,b:255,a:122/255 },
      // m5: {r: 0,g: 0,b:255,a:122/255 },
      m3: {r: 0,g: 0,b:255,a:122/255 },
      m0: {r: 0,g: 0,b:255,a:122/255 },
      m00: {r: 0,g: 0,b:255,a:122/255 },
      m000: {r: 0,g: 0,b:0,a:0 },
      land: {r: 0,g: 255,b:0,a:200/255 },
    }
  },
  getters: {
  },
  mutations: {
    updateColors (state,payload) {
      state.colors[payload.colorM] = payload.value.rgba
    },
    // 重要!!!!------------------------------------------------------
    update (state,payload) {
      let variable;
      switch (payload.name) {
        case 'flood5m':
          if (payload.order === 0) {
            variable = 'seaLevel5m'
          } else {
            variable = 'selected5m'
          }
          break;
        case 'floodSimple':
        case 'flood15':
        case 'flood10m':
          if (payload.order === 0) {
            variable = 'seaLevel10m'
          } else if (payload.order === 1){
            variable = 'selected10m'
          } else if (payload.order === 2){
            variable = 'landCheck'
          }
          break
        case 'kouzi':
            variable = 'kouzi'
          break
        case 'dokuji':
          variable = 'dokujiUrl'
          break
        case 'jinko':
          if (payload.order === 0) {
            variable = 'jinko'
          } else if (payload.order === 1){
            variable = 'paintCheck1k'
          }
          break
        case 'jinko100m':
          if (payload.order === 0) {
            variable = 'jinko100m'
          } else if (payload.order === 1){
            variable = 'paintCheck100m'
          }
          break
        case 'jinko250m':
          if (payload.order === 0) {
            variable = 'jinko250m'
          } else if (payload.order === 1){
            variable = 'paintCheck250m'
          }
          break
        case 'jinko500m':
          if (payload.order === 0) {
            variable = 'jinko500m'
          } else if (payload.order === 1){
            variable = 'paintCheck500m'
          }
          break
        case 'syogakkoR05':
          if (payload.order === 0) {
            variable = 'paintCheckSyogakkoR05'
          } else if (payload.order === 1){
            variable = 'textCheckSyogakkoR05'
          }
          break
        case 'syogakkoR03':
          if (payload.order === 0) {
            variable = 'paintCheckSyogakkoR03'
          } else if (payload.order === 1){
            variable = 'textCheckSyogakkoR03'
          }
          break
        case 'tyugakkoR05':
          if (payload.order === 0) {
            variable = 'paintCheckTyugakkoR05'
          } else if (payload.order === 1){
            variable = 'textCheckTyugakkoR05'
          }
          break
        case 'tyugakkoR03':
          if (payload.order === 0) {
            variable = 'paintCheckTyugakkoR03'
          } else if (payload.order === 1){
            variable = 'textCheckTyugakkoR03'
          }
        case 'kosoku':
          variable = 'kosoku'
          break
        case 'tetsudoJikeiretsu':
          variable = 'tetsudoJikeiretsu'
          break
      }
      state[variable][payload.mapName] = payload.value
    },

    updateKouzi (state,payload) {
      state.kouzi[payload.mapName] = payload.value
    },
    updateSeaLevel5m (state,payload) {
      state.seaLevel5m[payload.mapName] = payload.value
    },
    updateSeaLevel10m (state,payload) {
      state.seaLevel10m[payload.mapName] = payload.value
    },
    updateSelected5m (state,payload) {
      state.selected5m[payload.mapName] = payload.value
    },
    updateSelected10m (state,payload) {
      state.selected10m[payload.mapName] = payload.value
    },
    updateLand (state,payload) {
      state.landCheck[payload.mapName] = payload.value
    },
    updateDokujiUrl (state,payload) {
      state.dokujiUrl[payload.mapName] = payload.value
    },
    updateCrossOrigin (state,payload) {
      state.crossOrigin[payload.mapName] = payload.value
    },
  }
};

const store = new Vuex.Store({
  modules: {
    base:moduleBase,
    info:moduleInfo
  }
});

export default store
