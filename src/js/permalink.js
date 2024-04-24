import store from './store'
import { transform } from 'ol/proj.js'
import * as Layers from '../js/layers'
import * as MyMap from '../js/mymap'
import axios from "axios";
import {drawLayer, modifyInteraction} from "../js/mymap";
import {GeoJSON} from "ol/format";
import {Circle,LineString,Polygon} from "ol/geom";
import Feature from "ol/Feature";
import * as turf from "@turf/turf";
import OLCesium from "ol-cesium";
export function permalinkEventSet (response) {
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
    mapName: 'map02'
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
    mapName: 'map03'
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
    mapName: 'map04'
  });
  if (window.location.hash !== '') {
    // const hash = decodeURIComponent(window.location.hash.replace('#', ''));
    console.log(response)
    let hash
    if (response.data) {
      hash = decodeURIComponent(response.data.replace('#', ''));
    } else {
      hash = decodeURIComponent(window.location.hash.replace('#', ''));
    }

  // if (response !== '') {
  //   console.log(response)
  //   const hash = decodeURIComponent(response.replace('#', ''));
    // 場所、ズームを復帰
    const parts = hash.split('/');
    const map = store.state.base.maps.map01;
    if (parts.length === 3) {
      const center = [ parseFloat(parts[1]), parseFloat(parts[2]) ];
      const center3857 = transform(center,'EPSG:4326','EPSG:3857');
      map.getView().setCenter(center3857);
      // map.getView().setZoom(parseInt(parts[0], 10))
      map.getView().setZoom(parts[0])
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
      const maps = ['map01','map02','map03','map04']
      maps.forEach((map) => {
        if (key==='3d' + map) {
          store.state.base.ol3d[map] = new OLCesium({map: store.state.base.maps[map]})
          const ol3d = store.state.base.ol3d[map]
          const scene = ol3d.getCesiumScene()
          const terrainProvider = new Cesium.PngElevationTileTerrainProvider( {
            url: 'https://gsj-seamless.jp/labs/elev2/elev/{z}/{y}/{x}.png?prj=latlng&size=257',
            tilingScheme: new Cesium.GeographicTilingScheme(),
            credit: '',
            heightScale: 1,
          })
          scene.terrainProvider = terrainProvider
          scene.terrainProvider.heightmapTerrainQuality = 0.5
          scene.screenSpaceCameraController._minimumZoomRate = 1//10000
          // // ズームしたときの，ホイールに対する動作制御。
          scene.screenSpaceCameraController.minimumZoomDistance = 10
          // // めり込みにくくするためズーム制限
          ol3d.setEnabled(true)
          const json = JSON.parse(obj[key])
          console.log(obj[key])
          console.log(json)
          ol3d.getCamera().setTilt(json.tilt)
          ol3d.getCamera().setHeading(json.heading)
          ol3d.getCamera().setDistance(json.distance)
          // store.state.base.maps[map].getView().setZoom(9)
          store.state.base.toggle3d[map] = true
          document.querySelector('#' + map + '-3d').style.display = 'block'
        }
      })

      // if (key==='3d1') {
      //   const mapName = 'map01'
      //   store.state.base.ol3d[mapName] = new OLCesium({map: store.state.base.maps[mapName]})
      //   const ol3d = store.state.base.ol3d[mapName]
      //   const scene = ol3d.getCesiumScene()
      //   const terrainProvider = new Cesium.PngElevationTileTerrainProvider( {
      //     url: 'https://gsj-seamless.jp/labs/elev2/elev/{z}/{y}/{x}.png?prj=latlng&size=257',
      //     tilingScheme: new Cesium.GeographicTilingScheme(),
      //     magnification: 5,
      //     crossOrigin: 'anonymous',
      //   })
      //   scene.terrainProvider = terrainProvider
      //   scene.terrainProvider.heightmapTerrainQuality = 0.5
      //   ol3d.setEnabled(true)
      //   const json = JSON.parse(obj[key])
      //   ol3d.getCamera().setTilt(json.tilt)
      //   ol3d.getCamera().setHeading(json.heading)
      // }
      if (key==='GJ') {
        const geojson = JSON.parse(obj[key])
        if (geojson.features[0]) {
          geojson.features.forEach((feature) => {
            const distance = feature.properties.distance
            if (feature.geometry.type === 'GeometryCollection') {
              const center = feature.properties.center
              const radius = feature.properties.radius
              const circle = new Circle(center, radius)
              const newFeature = new Feature(circle)
              newFeature.setProperties({distance: distance})
              MyMap.drawLayer.getSource().addFeature(newFeature)
            } else if (feature.geometry.type === 'LineString') {
              let coordinates = []
              feature.geometry.coordinates.forEach((coord) => {
                // coord = turf.toWgs84(coord)
                coordinates.push(transform(coord, "EPSG:4326", "EPSG:3857"))
              })
              // const distance = feature.properties.distance
              const lineString = new LineString(coordinates)
              const newFeature = new Feature(lineString)
              // newFeature.setProperties({distance: "distance"})
              newFeature['properties'] = 'aaa'
              newFeature.setProperties({distance: distance})
              console.log(newFeature)
              MyMap.drawLayer.getSource().addFeature(newFeature)
            } else if (feature.geometry.type === 'Polygon') {
              let coordinates = []
              feature.geometry.coordinates[0].forEach((coord) => {
                // coord = turf.toWgs84(coord)
                console.log(coord)
                coordinates.push(transform(coord, "EPSG:4326", "EPSG:3857"))
              })
              console.log(coordinates)
              const polygon = new Polygon([coordinates])
              const newFeature = new Feature(polygon)
              newFeature['properties'] = 'aaaa'
              newFeature.setProperties({distance: distance})
              MyMap.drawLayer.getSource().addFeature(newFeature)
            }
          })
        }
        store.state.base.maps.map01.addInteraction(MyMap.modifyInteraction)
        // store.state.base.maps.map01.addInteraction(MyMap.transformInteraction)
        store.state.base.maps.map01.addLayer(MyMap.drawLayer)
      }
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
                        multipli: urlLayerListArr[i][j].m,
                        check: urlLayerListArr[i][j].ck,
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
                      // レイヤーダイアログを開く時は下記１行を使う。
                      // store.state.base.dialogs[mapName].style.display = 'block';
                      const top = store.state.base.dialogs[mapName].style.top;
                      // $('#map01' + ' .dialog-div')の長さがわかればいい。それぞれに必要なし
                      // document.querySelector('#map01' + ' .dialog-div').style.display = 'block';
                      // const left = Number(store.state.base.dialogs[mapName].style.left.replace(/px/,"")) + document.querySelector('#map01' + ' .dialog-div').clientWidth + 96 + 'px';
                      // const left = '355px'
                      const left = '10px'
                      const infoDialog =
                          {
                            id: node.data.id,
                            multipli: node.data.multipli,
                            check: node.data.check,
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
  const features = MyMap.drawLayer.getSource().getFeatures()
  features.forEach(function(feature){
    if (feature.getGeometry().getType() === 'Circle') {
      const radius = feature.getGeometry().getRadius();
      const center = feature.getGeometry().getCenter();
      feature.set('radius', radius);
      feature.set('center', center);
    }
  })
  const drawSourceGeojson = new GeoJSON().writeFeatures(features, {
    featureProjection: "EPSG:3857"
  });
  const geojsonT = JSON.stringify(JSON.parse(drawSourceGeojson),null,1);
  // console.log(geojsonT)
  // ----------------------------------------------------------------------------------
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
  parameter += '&GJ=' + geojsonT

  const maps = ['map01','map02','map03','map04']
  maps.forEach((map) => {
    if (store.state.base.ol3d[map]) {
      const json = {
        'enabled': true,
        'tilt':store.state.base.ol3d[map].getCamera().getTilt(),
        'heading':store.state.base.ol3d[map].getCamera().getHeading(),
        'distance':store.state.base.ol3d[map].getCamera().getDistance(),
      }
      const jsonT = JSON.stringify(json,null,1)
      parameter += '&3d' + map + '=' + jsonT
    }
  })
    // console.log(parameter)
  // console.log(parameter.replace(/,/g,encodeURIComponent(",")))
  // parameter = parameter.replace(/,/g,encodeURIComponent(","))
  // parameterだけエンコードする。起動時にwindow.location.hashでハッシュ値を取得するため
  // parameter = encodeURIComponent(parameter);
  const state = {
    zoom: zoom,
    center: center4326
  };
  // window.history.pushState(state, 'map', hash + parameter);
  // MyMap.history ('moveend')
  //---------------------------------------------------------------
  // const parameters = decodeURIComponent(window.location.hash)
  const parameters = hash + parameter
  if(store.state.base.increment > 4) {
    axios
        .get('https://kenzkenz.xsrv.jp/open-hinata/php/insert.php', {
          params: {
            parameters: parameters
          }
        })
        .then(function (response) {
          // console.log(response.data.urlid)
          // const url = new URL(window.location.href) // URLを取得
          // window.history.replaceState(null, '', url.pathname) //パラメータを削除 FB対策
          window.history.pushState(state, 'map', "#s" + response.data.urlid);
          MyMap.history('moveend', window.location.href)
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
        });
  } else {
    store.commit('base/increment')
  }
}