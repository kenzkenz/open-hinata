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
      dialogEdit:{style: {top: '250px', right: '10px', 'z-index': 1, height: 'auto', 'width': 'auto', display: 'none'}},

      // pyramidDialog:{
      //   map01: {style: {top: '56px', right: '10px', 'z-index': 1, height: 'auto', 'width': '550px', display: 'block'}},
      //   map02: {style: {top: '56px', right: '10px', 'z-index': 1, height: 'auto', 'width': '550px', display: 'block'}},
      //   map03: {style: {top: '56px', right: '10px', 'z-index': 1, height: 'auto', 'width': '550px', display: 'block'}},
      //   map04: {style: {top: '56px', right: '10px', 'z-index': 1, height: 'auto', 'width': '550px', display: 'block'}},
      // },
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
    togglePoint:false,
    editFeature:'',
    editFeatureName:'',
    editFeatureSetumei:'',
    editFeatureSrc:'',
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
      console.log(payload.dialog)
    },
    pushDialogs2 (state,payload) {
      const dialogs = state.dialogs2[payload.mapName];
      dialogs.push(payload.dialog)
      console.log(payload.dialog)
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
      if (state.splitFlg === 4) state.splitFlg = 1
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
    seaLevel10m: {
      map01: 0,
      map02: 0,
      map03: 0,
      map04: 0
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
    // 重要
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
