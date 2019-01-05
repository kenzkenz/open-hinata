import store from './store'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector';
import ImageLaye from 'ol/layer/Image'
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM.js'
import XYZ from 'ol/source/XYZ.js'
import GeoJSON from 'ol/format/GeoJSON';
import {Fill, Stroke, Style, Text} from 'ol/style';
import RasterSource from 'ol/source/Raster';
import { transformExtent } from 'ol/proj.js'
import LayerGroup from 'ol/layer/Group';
import mw5 from './mw/mw5'
import mw20 from './mw/mw20'
const mapsStr = ['map01','map02','map03','map04'];
const transformE = extent => {
  return transformExtent(extent,'EPSG:4326','EPSG:3857');
};
function flood(pixels, data) {
  var pixel = pixels[0];
  if (pixel[3]) {
    var height = (pixel[0] * 256 * 256 + pixel[1] * 256 + pixel[2]) / 100;
    if (height <= data.level) {
      let sinsui = - height + data.level;
      const c = data.colors;
      if (sinsui >= 20) {
        pixel[0] = c.m20.r; pixel[1] = c.m20.g; pixel[2] = c.m20.b; pixel[3] = c.m20.a*255
      } else if (sinsui >= 10) {
        pixel[0] = c.m10.r; pixel[1] = c.m10.g; pixel[2] = c.m10.b; pixel[3] = c.m10.a*255
      } else if (sinsui >= 5) {
        pixel[0] = c.m5.r; pixel[1] = c.m5.g; pixel[2] = c.m5.b; pixel[3] = c.m5.a*255
      } else if (sinsui >= 3) {
        pixel[0] = c.m3.r; pixel[1] = c.m3.g; pixel[2] = c.m3.b; pixel[3] = c.m3.a*255
      } else if (sinsui >= 0.5) {
        pixel[0] = c.m0.r; pixel[1] = c.m0.g; pixel[2] = c.m0.b; pixel[3] = c.m0.a*255
      } else {
        pixel[0] = c.m00.r; pixel[1] = c.m00.g; pixel[2] = c.m00.b; pixel[3] = c.m00.a*255
      }

/*
      if (sinsui >= 20) {
        pixel[0] = 187; pixel[1] = 0; pixel[2] = 187; pixel[3] = 122
      } else if (sinsui >= 10) {
        pixel[0] = 228; pixel[1] = 0; pixel[2] = 142; pixel[3] = 135
      } else if (sinsui >= 5) {
        pixel[0] = 255; pixel[1] = 0; pixel[2] = 0; pixel[3] = 145
      } else if (sinsui >= 3) {
        pixel[0] = 255; pixel[1] = 13; pixel[2] = 13; pixel[3] = 179
      } else if (sinsui >= 1) {
        pixel[0] = 255; pixel[1] = 125; pixel[2] = 45; pixel[3] = 179
      } else if (sinsui >= 0.5) {
        pixel[0] = 236; pixel[1] = 169; pixel[2] = 0; pixel[3] = 166
      } else if (sinsui >= 0.3) {
        pixel[0] = 232; pixel[1] = 226; pixel[2] = 8; pixel[3] = 166
      } else {
        pixel[0] = 255;pixel[1] = 255;pixel[2] = 0;pixel[3] = 179
      }
*/


      /*
      let opacity = sinsui * 20;
      if (opacity>200) opacity = 200;
      pixel[0] = 0;
      pixel[1] = 0;
      pixel[2] = 180;
      pixel[3] = opacity;
      */
    } else {
      pixel[3] = 0;
    }
  }
  return pixel;
}
//dem10---------------------------------------------------------------------------------
const elevation10 = new XYZ({
  url:'https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png',
  maxZoom:14,
  crossOrigin:'anonymous'
});
function Dem10 () {
  this.source = new RasterSource({
    sources:[elevation10],
    operation:flood
  })
}
export const flood10Obj = {};
for (let i of mapsStr) {
  flood10Obj[i] = new ImageLaye(new Dem10());
  flood10Obj[i].getSource().on('beforeoperations', function(event) {
    event.data.level = Number($('#' + i  + " .flood-range10m").val());
    event.data.colors = store.state.info.colors;
  });
}
//dem5---------------------------------------------------------------------------------
const elevation5 = new XYZ({
  url:'https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png',
  minZoom:15,
  maxZoom:15,
  crossOrigin:'anonymous'
});
function Dem5 () {
  this.source = new RasterSource({
    sources:[elevation5],
    operation:flood
  });
  this.maxResolution = 38.22
}
export const flood5Obj = {};
for (let i of mapsStr) {
  flood5Obj[i] = new ImageLaye(new Dem5());
  flood5Obj[i].getSource().on('beforeoperations', function(event) {
    event.data.level = Number($('#' + i  + " .flood-range5m").val());
    event.data.colors = store.state.info.colors;
  });
}

let floodSumm = '';

// オープンストリートマップ------------------------------------------------------------------------
function Osm () {
  this.source = new OSM()
}
const osmObj = {};
for (let i of mapsStr) {
  osmObj[i] = new TileLayer(new Osm())
}
const osmSumm = 'OpenStreetMapは、道路地図などの地理情報データを誰でも利用できるよう、フリーの地理情報データを作成することを目的としたプロジェクトです。<a href=\'https://openstreetmap.jp\' target=\'_blank\'>OpenStreetMap</a>';
// 標準地図------------------------------------------------------------------------------------
function Std () {
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    minZoom: 2,
    maxZoom: 18
  })
}
const stdObj = {};
for (let i of mapsStr) {
  stdObj[i] = new TileLayer(new Std())
}
const stdSumm = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>';
// 淡色地図------------------------------------------------------------------------------------
function Pale () {
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
    minZoom: 2,
    maxZoom: 18
  })
}
const paleObj = {};
for (let i of mapsStr) {
  paleObj[i] = new TileLayer(new Pale())
}
const paleSumm = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>';
// 白地図--------------------------------------------------------------------------------------
function Blank () {
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png',
    minZoom: 2,
    maxZoom: 18
  })
}
const blankObj = {};
for (let i of mapsStr) {
  blankObj[i] = new TileLayer(new Blank())
}
const blankSumm = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>';
// 全国最新写真-------------------------------------------------------------------------------
function Seamlessphoto () {
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
    minZoom: 2,
    maxZoom: 18
  })
}
const seamlessphotoObj = {};
for (let i of mapsStr) {
  seamlessphotoObj[i] = new TileLayer(new Seamlessphoto())
}
const seamlessphotoSumm = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>';
// 色別標高図---------------------------------------------------------------------------------
function Relief () {
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png',
    minZoom: 5,
    maxZoom: 15
  })
}
const reliefObj = {};
for (let i of mapsStr) {
  reliefObj[i] = new TileLayer(new Relief())
}
const reliefSumm = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>';
// 宮崎県航空写真----------------------------------------------------------------------------
function MiyazakiOrt () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/ort/{z}/{x}/{-y}.png',
    minZoom: 1,
    maxZoom: 19
  });
  this.extent = transformE([130.66371,31.34280,131.88045,32.87815])
}
const miyazakiOrtObj = {};
for (let i of mapsStr) {
  miyazakiOrtObj[i] = new TileLayer(new MiyazakiOrt())
}
const miyazakiOrtSumm = '';
// 岐阜県CS立体図----------------------------------------------------------------------------
function GihuCs () {
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/gihucs/{z}/{x}/{-y}.png',
    minZoom: 1,
    maxZoom: 18
  });
  this.extent = transformE([136.257111,35.141011,137.666902,36.482164143934]);
  this.center = [136.92019043124094,35.55338980561788]
}
const gihuCsObj = {};
for (let i of mapsStr) {
  gihuCsObj[i] = new TileLayer(new GihuCs())
}
const gihuCsSumm = '';
// 日本CS立体図------------------------------------------------------------------------------
function NihonCs () {
  this.source = new XYZ({
    url: 'http://kouapp.main.jp/csmap/tile/japan/{z}/{x}/{y}.jpg',
    minZoom:9,
    maxZoom:15
  })
}
const nihonCsObj = {};
for (let i of mapsStr) {
  nihonCsObj[i] = new TileLayer(new NihonCs())
}
const nihonCsSumm = '';
// 迅速測図 (関東)----------------------------------------------------------------------------
function Jinsoku () {
  this.source = new XYZ({
    url: 'https://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png',
    minZoom:1,
    maxZoom:17
  });
  this.extent = transformE([138.954453,34.86946,140.8793163,36.45969967])
}
const jinsokuObj = {};
for (let i of mapsStr) {
  jinsokuObj[i] = new TileLayer(new Jinsoku())
}
const jinsokuSumm = '<a href=\'http://www.finds.jp/tmc/layers.html.ja\' target=\'_blank\'>農研機構</a>';
// 今昔マップ-----------------------------------------------------------------------------------
// 福岡・北九州編------------------------------------------------------------------------------
function Kon_hukuoka01 () {
  this.source = new XYZ({
    url: 'https://sv53.wadax.ne.jp/~ktgis-net/kjmapw/kjtilemap/fukuoka/00/{z}/{x}/{-y}.png',
    minZoom: 1,
    maxZoom: 16
  });
  this.center = [130.6152588501701, 33.720855341479506];
  this.extent = transformE([130.12549,33.41993,131.1254516,34.003285])
}
const kon_hukuoka01Obj = {};
for (let i of mapsStr) {
  kon_hukuoka01Obj[i] = new TileLayer(new Kon_hukuoka01())
}
const kon_hukuoka01Summ = '';
// CS立体図10Mここから-----------------------------------------------------------------------
function Cs10m01 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/1/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([128.4,32.5,129.530,34.7]);
}
function Cs10m02 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/2/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([129.02,30.2,132.9,34]);
}
function Cs10m03 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/3/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([129.99,33.33,133.7,36.6]);
}
function Cs10m04 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/4/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([131.99,32.68,134.98,34.67]);
}
function Cs10m05 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/5/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([132.99,34.00,135.48,35.8]);
}
function Cs10m06 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/6/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([134.51,33.40,137.02,36.34]);
}
function Cs10m07 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/7/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([135.99,34.00,137.90,37.66]);
}
function Cs10m08 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/8/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([137.00,38.68,139.97,34.56]);
}
function Cs10m09 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/9/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([138.05,38.00,140.99,32.43]);
}
function Cs10m10 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/10/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([139.46,41.65,142.12,37.66]);
}
function Cs10m11 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/11/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([139.00,43.35,141.19,41.33]);
}
function Cs10m12 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/12/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([140.93,45.65,144.05,41.85]);
}
function Cs10m13 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/13/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([143.95,44.35,145.95,42.70]);
}
function Cs10m15 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/15/{z}/{x}/{-y}.png',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([126.60,27.37,128.82,26.00]);
}
const cs10mObj = {};
for (let i of mapsStr) {
  cs10mObj[i] = new LayerGroup({
    layers: [
      new TileLayer(new Cs10m01()),
      new TileLayer(new Cs10m02()),
      new TileLayer(new Cs10m03()),
      new TileLayer(new Cs10m04()),
      new TileLayer(new Cs10m05()),
      new TileLayer(new Cs10m06()),
      new TileLayer(new Cs10m07()),
      new TileLayer(new Cs10m08()),
      new TileLayer(new Cs10m09()),
      new TileLayer(new Cs10m10()),
      new TileLayer(new Cs10m11()),
      new TileLayer(new Cs10m12()),
      new TileLayer(new Cs10m13()),
      new TileLayer(new Cs10m15())
      ]
  })
}
const cs10mSumm = '';
// CS立体図10Mここまで-----------------------------------------------------------------------
// 日本版mapwarper５万分の１ここから------------------------------------------------------
// 5万分の1,20万分の1の共用コンストラクタなど
// 共用スタイル
const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)'
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3
    })
  })
});
// タイル
function Mapwarper (url,bbox) {
  this.source = new XYZ({
    url: url,
    minZoom: 1,
    maxZoom: 18
  });
  this.extent = transformE(bbox);
  // クリックしたとときにextentを操作するため元のextentを保存しておく。
  this.extent2 = transformE(bbox)
}
// 地区名
function Mw5center () {
  this.name = 'Mw5center';
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/aaa/geojson/mw5center.geojson',
    format: new GeoJSON()
  });
  this.maxResolution = 1222.99;
  this.style = function(feature) {
    style.getText().setText(feature.get('title') );
    return style;
  }
}
export const mw5Obj = {};
for (let i of mapsStr) {
  const layerGroup = [];
  const length =  mw5.length;
  // const features = [];
  for (let j = 0; j < length; j++) {
    const id = mw5[j].id;
    const url = 'https://mapwarper.h-gis.jp/maps/tile/' + id + '/{z}/{x}/{y}.png';
    const bbox = mw5[j].extent;
    const layer = new TileLayer(new Mapwarper(url,bbox));
    layerGroup.push(layer)
    // ------------------------------------------------------
/*
    const extent = mw5[j].extent
    // console.log(extent)
    const lon = (extent[0] + extent[2]) / 2
    // console.log(lon)
    const lat = (extent[1] + extent[3]) / 2
    // console.log(lat)
    let title = mw5[j].title
    const uri = mw5[j].source_uri
    const result = title.match( /『(.*)』/ );
    if (result) {
      title = result[1]
    }
    const feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          lon,
          lat
        ]
      },
      "properties": {
        "title": title,
        "uri": uri,
        "layer": "mw5center"
        // "_fillColor": "rgb(0,0,255)",
        // "_radius": 8
      }
    }
    features.push(feature)
    */
  }
  /*
  const geojson = {
    "type": "FeatureCollection",
    "features": features
  }
  console.log(JSON.stringify(geojson))
  */
  const mw5centerLayer = new VectorLayer(new Mw5center());
  layerGroup.push(mw5centerLayer);

  mw5Obj[i] = new LayerGroup({
    layers: layerGroup
  })
}
const mw5Summ = '';

// 日本版mapwarper５万分の１ここまで------------------------------------------------------
// 日本版mapwarper20万分の１ここから------------------------------------------------------
// 地区名
function Mw20center () {
  this.name = 'Mw20center';
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/aaa/geojson/mw20center.geojson',
    format: new GeoJSON()
  });
  this.style = function(feature) {
    style.getText().setText(feature.get('title') );
    return style;
  }
}
export const mw20Obj = {};
for (let i of mapsStr) {
  const layerGroup = [];
  const length =  mw20.length;
  for (let j = 0; j < length; j++) {
    const id = mw20[j].id;
    const url = 'https://mapwarper.h-gis.jp/maps/tile/' + id + '/{z}/{x}/{y}.png';
    const bbox = mw20[j].extent;
    const layer = new TileLayer(new Mapwarper(url,bbox));
    layerGroup.push(layer)
  }
  const mw20centerLayer = new VectorLayer(new Mw20center());
  layerGroup.push(mw20centerLayer);

  mw20Obj[i] = new LayerGroup({
    layers: layerGroup
  })
}
const mw20Summ = '';
// 日本版mapwarper20万分の１ここまで------------------------------------------------------

// 洪水浸水想定-------------------------------------------------------------------------------
function Shinsuishin () {
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin/{z}/{x}/{y}.png',
    minZoom: 1,
    maxZoom: 17
  })
}
const shinsuishinObj = {};
for (let i of mapsStr) {
  shinsuishinObj[i] = new TileLayer(new Shinsuishin())
}
const shinsuishinSumm = '';
// 洪水浸水想定ここまで------------------------------------------------------------------------

// ここにレイヤーを全部書く。クリックするとストアのlayerListに追加されていく-------------------------
const layers =
  [
    { text: 'OpenStreetMap', data: { id: 0, layer: osmObj, opacity: 1, summary: osmSumm } },
    { text: '国土地理院',
      children: [
        { text: '標準地図', data: { id: 1, layer: stdObj, opacity: 1, summary: stdSumm } },
        { text: '淡色地図', data: { id: 2, layer: paleObj, opacity: 1, summary: paleSumm } },
        { text: '白地図', data: { id: 3, layer: blankObj, opacity: 1, summary: blankSumm } },
        { text: '色別標高図', data: { id: 4, layer: reliefObj, opacity: 1, summary: reliefSumm } },
        { text: '全国最新写真', data: { id: 5, layer: seamlessphotoObj, opacity: 1, summary: seamlessphotoSumm } }
      ]},
    { text: '宮崎県',
      children: [
        { text: '宮崎県航空写真', data: { id: 6, layer: miyazakiOrtObj, opacity: 1, summary: miyazakiOrtSumm } }
      ]},
    { text: '立体図等',
      children: [
        { text: '日本CS立体図', data: { id: 'jcs', layer: nihonCsObj, opacity: 1, summary: nihonCsSumm } },
        { text: '全国CS立体図10m', data: { id: 'cs10', layer: cs10mObj, opacity: 1, summary: cs10mSumm } },
        { text: '岐阜県CS立体図', data: { id: 'gcs', layer: gihuCsObj, opacity: 1, summary: gihuCsSumm } }
      ]},
    { text: '古地図',
      children: [
        { text: '旧版地形図5万分の１', data: { id: 'mw5', layer: mw5Obj, opacity: 1, summary: mw5Summ } },
        { text: '旧版地形図20万分の１', data: { id: 'mw20', layer: mw20Obj, opacity: 1, summary: mw20Summ } },
        { text: '迅速測図 (関東)', data: { id: 'jinsoku', layer: jinsokuObj, opacity: 1, summary: jinsokuSumm } }
      ]},
    { text: '今昔マップ',
      children: [
        { text: '福岡・北九州編',
          children: [
            { text: '1922-1926年', data: { id: 'kon_hu01', layer: kon_hukuoka01Obj, opacity: 1, summary: kon_hukuoka01Summ } },
            // { text: '1936-1938年', data: { id: 'kon_hu02', layer: nihonCsArr, opacity: 1 } }
          ]}
      ]},
    { text: '海面上昇',
      children: [
        { text: '海面上昇シミュ5Mdem', data: { id: 'flood5m', layer: flood5Obj, opacity: 1, summary: floodSumm, component: {name: 'flood5m', values:[]}} },
        { text: '海面上昇シミュ10Mdem', data: { id: 'flood10m', layer: flood10Obj, opacity: 1, summary: floodSumm, component: {name: 'flood10m', values:[]}} },
      ]},
    { text: '洪水浸水想定', data: { id: 'shinsuishin', layer: shinsuishinObj, opacity: 1, summary: shinsuishinSumm } }
  ];
export const Layers = layers;

