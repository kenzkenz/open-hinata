// マップ関係の関数
import store from './store'
import 'ol/ol.css'
import Map from 'ol/Map'
import Overlay from 'ol/Overlay';
import View from 'ol/View'
import { transform, fromLonLat } from 'ol/proj'
import { ScaleLine } from 'ol/control';
import Toggle from 'ol-ext/control/Toggle'
import Target from 'ol-ext/control/Target'
import Lego from 'ol-ext/filter/Lego'
import Notification from './notification'
import * as Layers from './layers'
import * as PopUp from './popup'
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';
import {popUpKeizoku, popUpShinsuishin, popUpTunami} from "./popup";
let maxZndex = 0;
let legoFilter = null;
export function initMap (vm) {
  // マップ作製ループ用の配列を作成
  const maps = [
    {mapName: 'map01', map:store.state.base.map01},
    {mapName: 'map02', map:store.state.base.map02},
    {mapName: 'map03', map:store.state.base.map03},
    {mapName: 'map04', map:store.state.base.map04}
  ];
  const view01 = new View({
    center: fromLonLat([140.097, 37.856]),
    zoom: 6
  });
  for (let i in maps) {
    //ポップアップを作る。
    const container = document.getElementById(maps[i].mapName + '-popup');
    const content = document.getElementById(maps[i].mapName  + '-popup-content');
    const closer = document.getElementById(maps[i].mapName  + '-popup-closer');
    const overlay =[]
    overlay[i] = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    closer.onclick = function () {
      overlay[i].setPosition(undefined);
      closer.blur();
      return false;
    };
    // マップ作製
    const mapName = maps[i].mapName;
    const map = new Map({
      interactions: defaultInteractions().extend([
        new DragRotateAndZoom()
      ]),
      // layers: [maps[i].layer],
      overlays: [overlay[i]],
      target: mapName,
      view: view01
    });
    // マップをストアに登録
    store.commit('base/setMap', {mapName: maps[i].mapName, map});

    // コントロール追加---------------------------------------------------------------------------
    map.addControl(new Target({composite: 'difference'}));
    map.addControl(new ScaleLine());
    const notification = new Notification();
    map.addControl(notification);
    store.commit('base/setNotifications',{mapName:mapName, control: notification});
    //現在地取得
    const  success = (pos) =>{
      const lon = pos.coords.longitude;
      const lat = pos.coords.latitude;
      // map.getView().setCenter(transform([lon,lat],"EPSG:4326","EPSG:3857"));
      const center = transform([lon,lat],"EPSG:4326","EPSG:3857")
      map.getView().animate({
        center: center,
        duration: 500
      });
    }
    const  fail = (error) =>{alert('位置情報の取得に失敗しました。エラーコード：' + error.code)}
    let interval
    const stop = () => {clearInterval(interval)}
    const  currentPosition = new Toggle(
        {	html: '<i class="fa-solid fa-location-crosshairs"></i>',
      // {	html: '現',
         className: "current-position",
        active:true,
        onToggle: function(active)
        {
          if(!active) {
            notification.show("現在地を取得します。<br>戻すときはもう一回クリック",5000)
            interval = setInterval(function(){
              navigator.geolocation.getCurrentPosition(success, fail);
            },2000);
          } else {
            stop()
          }
        }
      }
    );
    if (mapName === 'map01') map.addControl(currentPosition);
    // コントロール追加ここまで----------------------------------------------------------------------

    // イベント追加----------------------------------------------------------------
    map.on("pointermove",function(evt) {


    })

    // フィーチャーにマウスがあたったとき
    map.on("pointermove",function(evt){
      document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "default"
      const map = evt.map;
      // const option = {
      //   layerFilter: function (layer) {
      //     return layer.get('name') === 'Mw5center' || layer.get('name') === 'Mw20center';
      //   }
      // };
      const feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
          return feature;
        });
    // },option);
      if (feature) {
        document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "pointer"
      }
      //----------------------------------
      // 特定のラスターでカーソルを変える
      const pixel = (map).getPixelFromCoordinate(evt.coordinate);
      const layers = [];
      //マウスがあたった箇所のレイヤーを複数取得する
      (map).forEachLayerAtPixel(pixel,function(layer){
        layers.push(layer);
      });
      const tgtLayers = layers.filter(el => el.get('name')==='shinsuishin'
        || el.get('name')==='tunami'
        || el.get('name')==='keizoku');
      if (tgtLayers.length>0) {
        document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "pointer"
      }
    });
    // シングルクリック------------------------------------------------------------------------------------
    // 洪水,津波,継続用-----------------------------------------------------------------
    map.on('singleclick', function (evt) {
      //処理を早くするため抜ける。
      const layers0 = map.getLayers().getArray();
      const hazardLayers = layers0.filter(el => el.get('name')==='shinsuishin'
        || el.get('name')==='tunami'
        || el.get('name')==='keizoku');
      if (hazardLayers.length===0) return
      //-------------------------------------------------------------------------
      const pixel = (map).getPixelFromCoordinate(evt.coordinate);
      const layersObj = [];
      //マウスがあたった箇所のレイヤーを複数取得する
      (map).forEachLayerAtPixel(pixel,function(layer, rgba){
        layersObj.push({
            layer,
            rgba
        });
      })
      layersObj.forEach(object =>{
        switch (object.layer.get('name')){
          case 'shinsuishin':
            popUpShinsuishin(object.rgba)
            break;
          case 'tunami':
            popUpTunami(object.rgba)
            break;
          case 'keizoku':
            popUpKeizoku(object.rgba)
            break;
          default:
        }
      });
      const coordinate = evt.coordinate;
      const cont = store.state.base.popUpCont
      content.innerHTML = cont
      if (cont.includes('undefined') || cont==='') {
        overlay[i].setPosition(undefined)
      } else {
        overlay[i].setPosition(coordinate);
      }
      store.commit('base/popUpContReset')
    })
    // 大正古地図用-----------------------------------------------------------------
    map.on('singleclick', function (evt) {
      //少しでも処理を早めるために古地図レイヤーがなかったら抜ける。
      const layers = map.getLayers().getArray();
      let kotizuLayer = layers.find(el => el.get('dep'));
      if (!kotizuLayer) return //ここで抜ける

      //  洪水浸水想定と重ねるときは動作させない
      const layers0 = map.getLayers().getArray();
      const hazardLayers = layers0.filter(el => el.get('name')==='shinsuishin'
        || el.get('name')==='tunami'
        || el.get('name')==='keizoku');
      if (hazardLayers.length>0) return
      // ここまで

      // ここから本番
      const pixel = (map).getPixelFromCoordinate(evt.coordinate);
      const clickedLayers = [];
       //クリックされた箇所のレイヤーを複数取得する
      (map).forEachLayerAtPixel(pixel,function(layer){
           clickedLayers.push(layer);
      });
      // クリックされたレイヤーのうちdepを持っているレイヤーだけ抽出する。
      kotizuLayer = clickedLayers.find(el => el.values_.dep);
      if (kotizuLayer) {
        const dep = kotizuLayer.values_.dep
        if (kotizuLayer.getFilters().length >0) {
          // 3回削除する必要がある。
          kotizuLayer.removeFilter()
          kotizuLayer.removeFilter()
          kotizuLayer.removeFilter()
          maxZndex++
          kotizuLayer.setZIndex(maxZndex)
        } else {
          Layers.mask(dep,kotizuLayer)
          kotizuLayer.setZIndex(undefined)
        }
      }
    })
//--------------------------------------------------------------------------------
// ポップアップ用
    map.on('singleclick', function (evt) {
      const pixel = (map).getPixelFromCoordinate(evt.coordinate);
      const features = [];
      const layers = [];
      (map).forEachFeatureAtPixel(pixel,function(feature,layer){
        features.push(feature);
        layers.push(layer);
      });
      if(features.length){
        PopUp.popUp(layers,features,overlay[i],evt,content)
      }
    })
  //------------------------------------------------------------------------------------------------------
  // 旧版地形図用
    map.on('singleclick', function (evt) {
      console.log(transform(evt.coordinate, "EPSG:3857", "EPSG:4326"));
      const map = evt.map;
      //  洪水浸水想定と重ねるときは動作させない
      const layers0 = map.getLayers().getArray();
      const hazardLayers = layers0.filter(el => el.get('name')==='shinsuishin'
                                                                    || el.get('name')==='tunami'
                                                                    || el.get('name')==='keizoku');
      if (hazardLayers.length>0) return
      // ここまで
      const option = {
        layerFilter: function (layer) {
          return layer.get('name') === 'Mw5center' || layer.get('name') === 'Mw20center';
        }
      };
      const feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
          return feature;
        },option);
      if (feature) {
        const prop = feature.getProperties();
        const uri = prop.uri
        const title = prop.title
        if(uri.includes('stanford')) {
          if (confirm('スタンフォード大学のサイトを表示しますか？')) {
            window.open(uri, '_blank');
          }
        } else {
          notification.show('「' +title + '」の地図はスタンフォード大学にありません。',5000)
        }
        // return
      }
      const layers = map.getLayers().getArray();
      const result5 = layers.find(el => el === Layers.mw5Obj[mapName]);
      const result20 = layers.find(el => el === Layers.mw20Obj[mapName]);
      if(result5 && result20) {
        if(result5.myZindex > result20.myZindex) {
          extentChange(5)
        } else {
          extentChange(20)
        }
      } else if (result5) {
        extentChange(5)
      } else if (result20) {
        extentChange(20)
      }
      function extentChange (mw){
        let gLayers;
        let lonOutside; let latOutside;
        if(mw === 5) {
          gLayers = Layers.mw5Obj[mapName].values_.layers.array_;
          lonOutside = 5000; latOutside = 4000
        } else {
          gLayers = Layers.mw20Obj[mapName].values_.layers.array_;
          lonOutside = 24000; latOutside = 14000
        }
        const lon = evt.coordinate[0], lat = evt.coordinate[1];
        for (let i in gLayers) {
          const extent2 = gLayers[i].values_['extent2'];
          const lonMin = extent2[0], lonMax = extent2[2], latMin = extent2[1], latMax = extent2[3];
          if (lonMin < lon && lonMax > lon) {
            if (latMin < lat && latMax > lat) {
              if (gLayers[i].getExtent()[0] === extent2[0]) {
                maxZndex++;
                gLayers[i].setExtent([lonMin - lonOutside, latMin - latOutside, lonMax + lonOutside, latMax + latOutside]);
                gLayers[i].setZIndex(maxZndex)
              } else {
                gLayers[i].setExtent(extent2);
                gLayers[i].setZIndex(undefined)
              }
              break;
            }
          }
        }
      }
    });
    //----------------------------------------------------------------------------------------
    const getElevation = (event) =>{
      let z = map.getView().getZoom()
      if(z>13) z=13;
      // const coord = event.coordinate　こっちにするとマウスの標高を取得する。
      const coord =map.getView().getCenter()
      const R = 6378137;// 地球の半径(m);
      const x = ( 0.5 + coord[ 0 ] / ( 2 * R * Math.PI ) ) * Math.pow( 2, z );
      const y = ( 0.5 - coord[ 1 ] / ( 2 * R * Math.PI ) ) * Math.pow( 2, z );
      // var e = event;
      getElev( x, y, z, function( h ) {
        const zoom = String(Math.floor(map.getView().getZoom() * 100) / 100)
        if (h !=='e') {
          // console.log(h)
          vm.zoom[mapName] = 'zoom=' + zoom + '  中心の標高' + h + 'm'
        } else {
          vm.zoom[mapName] = 'zoom=' + zoom
        }
      } );
    }
    map.on('moveend', function (event) {
      // vm.zoom[mapName] = 'zoom=' + String(Math.floor(map.getView().getZoom() * 100) / 100)
      getElevation(event)
    });
    map.on("pointermove",function(event){
      getElevation(event)
    });
    // ****************
    // 産総研さん作成の関数
    // getElev, タイル座標とズームレベルを指定して標高値を取得する関数
    //	rx, ry: タイル座標(実数表現）z:　ズームレベル
    //	thenは終了時に呼ばれるコールバック関数
    //	成功時には標高(単位m)，無効値の場合は'e'を返す
    // ****************
    function getElev( rx, ry, z, then ) {
      const elevServer = 'https://gsj-seamless.jp/labs/elev2/elev/'
      const x = Math.floor( rx )				// タイルX座標
      const y = Math.floor( ry )				// タイルY座標
      const i = ( rx - x ) * 256			// タイル内i座標
      const j = ( ry - y ) * 256			// タイル内j座標
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function(){
        const canvas = document.createElement( 'canvas' )
        const context = canvas.getContext( '2d' )
        let  h = 'e'
        canvas.width = 1;
        canvas.height = 1;
        context.drawImage( img, i, j, 1, 1, 0, 0, 1, 1 );
        const data = context.getImageData( 0, 0, 1, 1 ).data;
        if ( data[ 3 ] === 255 ) {
          h = data[ 0 ] * 256 * 256 + data[ 1 ] * 256 + data[ 2 ];
          h = ( h < 8323072 ) ? h : h - 16777216;
          h /= 100;
        }
        then( h );
      }
      img.src = elevServer + z + '/' + y + '/' + x + '.png?res=cm';
    }

    // 要素をドラッグする。
    //要素の取得
    const elements = document.querySelectorAll(".ol-scale-line, .ol-zoom, .zoom-div");
    //要素内のクリックされた位置を取得するグローバル（のような）変数
    let x;
    let y;
    //マウスが要素内で押されたとき、又はタッチされたとき発火
    for(let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("mousedown", mdown, false);
      elements[i].addEventListener("touchstart", mdown, false);
    }

    //マウスが押された際の関数
    function mdown(e) {
      //クラス名に .drag を追加
      this.classList.add("drag");
      //タッチデイベントとマウスのイベントの差異を吸収
      if(e.type === "mousedown") {
        const event = e;
      } else {
        const  event = e.changedTouches[0];
      }
      //要素内の相対座標を取得
      x = event.pageX - this.offsetLeft;
      y = event.pageY - this.offsetTop;
      //ムーブイベントにコールバック
      document.body.addEventListener("mousemove", mmove, false);
      document.body.addEventListener("touchmove", mmove, false);
    }

    //マウスカーソルが動いたときに発火
    function mmove(e) {
      //ドラッグしている要素を取得
      const drag = document.getElementsByClassName("drag")[0];
      //同様にマウスとタッチの差異を吸収
      if(e.type === "mousemove") {
        const event = e;
      } else {
        const event = e.changedTouches[0];
      }
      //フリックしたときに画面を動かさないようにデフォルト動作を抑制
      e.preventDefault();
      //マウスが動いた場所に要素を動かす
      // console.log(drag.parentNode.parentNode.clientHeight)
      let top = event.pageY - y
      const left = event.pageX - x
      // console.log(top)
      // if (top >= drag.parentNode.clientHeight - drag.clientHeight || top - drag.parentNode.clientHeight - drag.clientHeight === 0) {
      //   top = drag.parentNode.clientHeight - drag.clientHeight
      //   document.body.addEventListener("mouseleave", mup, false);
      //   document.body.addEventListener("touchleave", mup, false);
      //   return
      // }
      drag.style.top = top + "px";
      drag.style.left = left + "px";
      //マウスボタンが離されたとき、またはカーソルが外れたとき発火
      drag.addEventListener("mouseup", mup, false);
      document.body.addEventListener("mouseleave", mup, false);
      drag.addEventListener("touchend", mup, false);
      document.body.addEventListener("touchleave", mup, false);
    }

    //マウスボタンが上がったら発火
    function mup(e) {
      var drag = document.getElementsByClassName("drag")[0];
      //ムーブベントハンドラの消去
      document.body.removeEventListener("mousemove", mmove, false);
      drag.removeEventListener("mouseup", mup, false);
      document.body.removeEventListener("touchmove", mmove, false);
      drag.removeEventListener("touchend", mup, false);
      //クラス名 .drag も消す
      drag.classList.remove("drag");
    }
  }
}

export function synch (vm) {
  vm.synchFlg = !vm.synchFlg;
  let map01View = store.state.base.maps.map01.getView();
  if (!vm.synchFlg) {
    const viewArr = [];
    for (let i = 0; i < 3; i++) {
      viewArr[i] = new View({
        center: map01View.getCenter(),
        zoom: map01View.getZoom()
      })
    }
    store.state.base.maps.map02.setView(viewArr[0]);
    store.state.base.maps.map03.setView(viewArr[1]);
    store.state.base.maps.map04.setView(viewArr[2]);
  } else {
    store.state.base.maps.map02.setView(map01View);
    store.state.base.maps.map03.setView(map01View);
    store.state.base.maps.map04.setView(map01View)
  }
}

export function resize () {
  store.state.base.maps.map01.updateSize();
  store.state.base.maps.map02.updateSize();
  store.state.base.maps.map03.updateSize();
  store.state.base.maps.map04.updateSize()
}

export function watchLayer (map, thisName, newLayerList,oldLayerList) {
  // store.commit('base/updateFirstFlg')
  //[0]はレイヤーリスト。[1]はlength
  // 逆ループ
  let myZindex = 0;
  for (let i = newLayerList[0].length - 1; i >= 0; i--) {
    // リストクリックによる追加したレイヤーで リストの先頭で リストの増加があったとき
     const layer = newLayerList[0][i].layer;
    // グループレイヤーで個別にzindexを触っているときがあるのでリセット。重くなるようならここを再検討。
   if (layer.values_.layers) {
     const gLayers = layer.values_.layers.array_;
     for (let i in gLayers) {
       gLayers[i].setZIndex(undefined);
       // mw5,mw20のためのコード。気にしすぎ、なくてもいい。
       const extent2 = gLayers[i].values_['extent2'];
       if(extent2) gLayers[i].setExtent(extent2);
       // 古地図のためのコード。気にしすぎ、なくてもいい。
       const dep = gLayers[i].values_['dep'];
       if (dep) Layers.mask(dep,gLayers[i])
     }
   }
    // グループレイヤーのときzindexは効かないようだ。しかしz順が必要になるときがあるので項目を作っている。
    layer['myZindex'] = myZindex++;
    map.removeLayer(layer);
    map.addLayer(layer);
    layer.setOpacity(newLayerList[0][i].opacity)
    // console.log(newLayerList[0][i])
    // 新規追加したレイヤーだけにズームとセンターを設定する。
    // console.log(oldLayerList.length,newLayerList.length)
    if(!store.state.base.firstFlg) {
      if (newLayerList[0][0].zoom) {
        map.getView().setZoom(newLayerList[0][0].zoom)
      }
      if (newLayerList[0][0].center) {
        map.getView().setCenter(transform(newLayerList[0][0].center, "EPSG:4326", "EPSG:3857"));
      }
    }
  }
  store.commit('base/updateFirstFlg',false)
}

export function opacityChange (item) {
  item.layer.setOpacity(item.opacity);
}

export function removeLayer (item, layerList, name) {
  const result = layerList.filter((el) => el.id !== item.id);
  store.commit('base/updateList', {value: result, mapName: name});
  // 削除するレイヤーの透過度を１に戻す。再度追加するときのために
  item.layer.setOpacity(1);
  const map = store.state.base.maps[name];
  map.removeLayer(item.layer)
}

export function lego (name, selected) {
  const map = store.state.base.maps[name];
  try{map.removeFilter(legoFilter);}catch(e){}
  legoFilter = new Lego({ brickSize:selected, img:'brick' });
  map.addFilter(legoFilter);
}

export function legoRemove (name) {
  const map = store.state.base.maps[name];
  try{map.removeFilter(legoFilter);}catch(e){}
}
