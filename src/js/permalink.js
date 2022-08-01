import store from './store'
import { transform } from 'ol/proj.js'
import * as Layers from '../js/layers'
export function permalinkEventSet () {
  // 起動時の処理------------------------------------------------------------------------------
  // value.layerはオブジェクトになっており、map01から04が入っている。
  store.commit('base/unshiftLayerList', {
    value: {
      id: 2,
      title: '淡色地図',
      layer: Layers.Layers[1].children[1].data.layer,
      opacity: 1,
      summary: Layers.Layers[1].children[1].data.summary,
      component: ''
    },
    mapName: 'map01'
  });
  store.commit('base/unshiftLayerList', {
    value: {
      id: 2,
      title: '淡色地図',
      layer: Layers.Layers[1].children[1].data.layer,
      opacity: 1,
      summary: Layers.Layers[1].children[1].data.summary,
      component: ''
    },
    // value: {
    //   id: 1,
    //   title: '標準地図',
    //   layer: Layers.Layers[1].children[0].data.layer,
    //   opacity: 1,
    //   summary: Layers.Layers[1].children[0].data.summary,
    //   component: ''
    // },
    mapName: 'map02'
  });
  store.commit('base/unshiftLayerList', {
    value: {
      id: 4,
      title: '色別標高図',
      layer: Layers.Layers[1].children[3].data.layer,
      opacity: 1,
      summary: Layers.Layers[1].children[3].data.summary,
      component: ''
    },
    mapName: 'map03'
  });
  store.commit('base/unshiftLayerList', {
    value: {
      id: 'zenkokusaisin',
      title: '全国最新写真',
      layer: Layers.Layers[2].children[0].data.layer,
      opacity: 1,
      summary: Layers.Layers[2].children[0].data.summary,
      component: ''
    },
    mapName: 'map04'
  });
  if (window.location.hash !== '') {
     const hash = decodeURIComponent(window.location.hash.replace('#', ''));
     // 場所、ズームを復帰
     const parts = hash.split('/');
     const map = store.state.base.maps.map01;
     if (parts.length === 3) {
       const center = [ parseFloat(parts[1]), parseFloat(parts[2]) ];
       const center3857 = transform(center,'EPSG:4326','EPSG:3857');
       map.getView().setCenter(center3857);
       map.getView().setZoom(parseInt(parts[0], 10))
     }
     // パラメータで復帰
     // まずパラメータをオブジェクトにする
     const obj = {};
     // console.log((hash.split('?')[1]))
     if (hash.split('?')[1]) {
       const parameter = hash.split('?')[1].split('&');
       for (let i of parameter) {
         obj[i.split('=')[0]] = i.split('=')[1];
       }
     }
    for (let key in obj) {
      if (key==='S') {
        store.commit('base/updateSplitFlg',obj[key])
      }
      if (key==='L') {
        // 初期レイヤーをリセット
        store.commit('base/updateList', {value: [], mapName: 'map01'});
        store.commit('base/updateList', {value: [], mapName: 'map02'});
        store.commit('base/updateList', {value: [], mapName: 'map03'});
        store.commit('base/updateList', {value: [], mapName: 'map04'});
        store.state.base.maps.map01.removeLayer(store.state.base.maps.map01.getLayers().getArray()[0]);
        store.state.base.maps.map02.removeLayer(store.state.base.maps.map02.getLayers().getArray()[0]);
        store.state.base.maps.map03.removeLayer(store.state.base.maps.map03.getLayers().getArray()[0]);
        store.state.base.maps.map04.removeLayer(store.state.base.maps.map04.getLayers().getArray()[0]);
        const urlLayerListArr = JSON.parse(obj[key]);
        for (let i = 0; i < urlLayerListArr.length; i++) {
          // 逆ループ
          for (let j = urlLayerListArr[i].length - 1; j >= 0; j--) {
            const saiki =function (layers){
              for (let node of layers) {
                if (node.children) {
                  saiki(node.children)
                } else {
                  if (urlLayerListArr[i][j].id === node.data.id) {
                    const mapName = 'map0' + ( i + 1 );
                    store.commit('base/unshiftLayerList', {
                      value: {
                        id: node.data.id,
                        title: node.text,
                        layer: node.data.layer,
                        opacity: urlLayerListArr[i][j].o,
                        summary: node.data.summary,
                        component: urlLayerListArr[i][j].c
                      },
                      mapName: mapName
                    });
                    // レイヤーに設定項目があるとき
                    if (node.data.component) {
                      store.commit('base/incrDialogMaxZindex');
                      store.state.base.dialogs[mapName].style.display = 'block';
                      const top = store.state.base.dialogs[mapName].style.top;
                      // $('#map01' + ' .dialog-div')の長さがわかればいい。それぞれに必要なし
                      document.querySelector('#map01' + ' .dialog-div').style.display = 'block';
                      const left = Number(store.state.base.dialogs[mapName].style.left.replace(/px/,"")) + document.querySelector('#map01' + ' .dialog-div').clientWidth + 10 + 'px';
                      const infoDialog =
                        {
                          id: node.data.id,
                          title: node.text,
                          summary: node.data.summary,
                          component: node.data.component,
                          style: {
                            display: 'block',
                            top: top,
                            left: left,
                            'z-index': store.state.base.dialogMaxZindex
                          }
                        };
                      store.commit('base/pushDialogsInfo', {mapName: mapName, dialog: infoDialog});
                      const c = urlLayerListArr[i][j].c;
                      for (let k=0; k<c.values.length;k++) {
                        store.commit('info/update', {name: c.name, mapName: mapName, value: c.values[k], order: k})
                      }
                    }
                    // レイヤーに設定項目があるとき。ここまで
                  }
                }
              }
            };
            saiki(Layers.Layers)
          }
        }
      }
    }
  }
  // マップ移動時イベント------------------------------------------------------------------------
  store.state.base.maps.map01.on('moveend', moveEnd)
}

export function moveEnd () {
  const map = store.state.base.maps.map01;
  const zoom = map.getView().getZoom();
  const center = map.getView().getCenter();
  const center4326 = transform(center,'EPSG:3857','EPSG:4326');
  const hash = '#' +
    zoom + '/' +
    Math.round(center4326[0] * 100000) / 100000 + '/' +
    Math.round(center4326[1] * 100000) / 100000;
  let parameter = '?S=' + store.state.base.splitFlg;
  parameter += '&L=' + store.getters['base/layerLists'];
  // console.log(store.getters['base/layerLists'])
  // parameterだけエンコードする。起動時にwindow.location.hashでハッシュ値を取得するため
  parameter = encodeURIComponent(parameter);
  const state = {
    zoom: zoom,
    center: center4326
  };
  window.history.pushState(state, 'map', hash + parameter);
}
