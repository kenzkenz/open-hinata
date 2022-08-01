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
import { transformExtent, fromLonLat } from 'ol/proj.js'
import LayerGroup from 'ol/layer/Group';
import mw5 from './mw/mw5'
import mw20 from './mw/mw20'
import Feature from 'ol/Feature'
import Polygon  from "ol/geom/Polygon";
import Crop from 'ol-ext/filter/Crop'
import Mask from 'ol-ext/filter/Mask'
import  * as MaskDep from './mask-dep'
import  * as LayersMvt from './layers-mvt'
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
    event.data.level = Number(document.querySelector('#' + i  + " .flood-range10m").value);
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
    event.data.level = Number(document.querySelector('#' + i  + " .flood-range5m").value);
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
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 18
  })
}
const stdObj = {};
for (let i of mapsStr) {
  stdObj[i] = new TileLayer(new Std())
}
const stdSumm = '国土地理院作成のタイルです。<br><a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>';
// 淡色地図------------------------------------------------------------------------------------
function Pale () {
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
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
    crossOrigin: 'Anonymous',
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
    crossOrigin: 'Anonymous',
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
    crossOrigin: 'Anonymous',
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
  this.extent = transformE([130.66371,31.34280,131.88045,32.87815]);
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/ort/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 19
  });
}
const miyazakiOrtObj = {};
for (let i of mapsStr) {
  miyazakiOrtObj[i] = new TileLayer(new MiyazakiOrt())
}
const miyazakiOrtSumm = '宮崎県県土整備部砂防課が平成25年度に撮影した航空写真をオルソ補正したもの';
// 静岡県航空写真----------------------------------------------------------------------------
function SizuokaOrt () {
  this.extent = transformE([138.19778,34.8626474,138.671573,35.213088]);
  this.source = new XYZ({
    url: 'https://tile.geospatial.jp/shizuoka_city/h30_aerophoto/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 19
  });
}
const sizuokaOrtObj = {};
for (let i of mapsStr) {
  sizuokaOrtObj[i] = new TileLayer(new SizuokaOrt())
}
const sizuokaOrtSumm = '<a href="https://www.geospatial.jp/ckan/dataset/h30/resource/cb7f8bc4-0ec7-493b-b7fa-f90e5780ac5e" target="_blank">G空間情報センター</a>';
// 室蘭市航空写真----------------------------------------------------------------------------
function MuroransiOrt () {
  this.extent = transformE([140.888332,42.2961046,141.076206,42.44097007]),
    this.source = new XYZ({
      url: 'https://kenzkenz2.xsrv.jp/muroran3/{z}/{x}/{-y}.png',
      crossOrigin: 'Anonymous',
      minZoom: 1,
      maxZoom: 19
    });
}
const muroransiOrtObj = {};
for (let i of mapsStr) {
  muroransiOrtObj[i] = new TileLayer(new MuroransiOrt())
}
const muroransiOrtSumm = '<a href="http://www.city.muroran.lg.jp/main/org2260/odlib.php" target="_blank">むろらんオープンデータライブラリ</a>';
// 鹿児島市航空写真----------------------------------------------------------------------------
function KagosimasiOrt () {
  this.extent = transformE([130.370675,31.2819,130.732,31.767]);
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/orts/kagoshima/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 19
  });
}
const kagosimasiOrtObj = {};
for (let i of mapsStr) {
  kagosimasiOrtObj[i] = new TileLayer(new KagosimasiOrt())
}
const kagosimasiOrtSumm = '<a href="https://www.city.kagoshima.lg.jp/ict/opendata.html" target="_blank">鹿児島市オープンデータ</a>';
// ７４~７８年の航空写真-------------------------------------------------------------------------------
function Sp74 () {
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/gazo1/{z}/{x}/{y}.jpg',
    crossOrigin: 'Anonymous',
    minZoom: 10,
    maxZoom: 17
  })
}
const sp74Obj = {};
for (let i of mapsStr) {
  sp74Obj[i] = new TileLayer(new Sp74())
}
const sp74Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>';
// ６１~６４年の航空写真-------------------------------------------------------------------------------
function Sp61 () {
  this.source = new XYZ({
    url: 'https://maps.gsi.go.jp/xyz/ort_old10/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 10,
    maxZoom: 17
  })
}
const sp61Obj = {};
for (let i of mapsStr) {
  sp61Obj[i] = new TileLayer(new Sp61())
}
const sp61Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>';
// 川だけ地形地図---------------------------------------------------------------------------
function Kawadake () {
  this.source = new XYZ({
    url: 'http://www.gridscapes.net/AllRivers/1.0.0/t/{z}/{x}/{-y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 5,
    maxZoom: 14
  });
}
const kawadakeObj = {};
for (let i of mapsStr) {
  kawadakeObj[i] = new TileLayer(new Kawadake())
}
const kawadakeSumm = '<a href="https://www.gridscapes.net/#AllRiversAllLakesTopography" target="_blank">川だけ地形地図</a>';
// 川と流域地図---------------------------------------------------------------------------
function Ryuuiki () {
  this.source = new XYZ({
    url: 'https://tiles.dammaps.jp/ryuiki_t/1/{z}/{x}/{y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 5,
    maxZoom: 14
  });
}
const ryuuikiObj = {};
for (let i of mapsStr) {
  ryuuikiObj[i] = new TileLayer(new Ryuuiki())
}
const ryuuikiSumm = '<a href="https://tiles.dammaps.jp/ryuiki/" target="_blank">川だけ地形地図</a><br>' +
  '<div style="width: 400px"><small>本図は国土交通省 国土数値情報「河川」「流域メッシュ」「湖沼」（第2.1版）および国土地理院 地球地図日本「行政界」（第２版）をもとに高根たかね様が作成したものです。国土数値情報は国土計画関連業務のために作成されたデータが副次的に公開されたものであり、国土計画関連業務に差しさわりがない範囲で時間的、位置的精度において現況と誤差が含まれています。本地図を利用される場合はその点に十分ご留意の上ご利用ください。また、国土数値情報 利用約款を遵守しご利用ください。</small></div>'
// エコリス植生図---------------------------------------------------------------------------
function Ecoris () {
  this.source = new XYZ({
    url: 'https://map.ecoris.info/tiles/vegehill/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 5,
    maxZoom: 14
  });
}
const ecorisObj = {};
for (let i of mapsStr) {
  ecorisObj[i] = new TileLayer(new Ecoris())
}
const ecorisSumm = '<a href="http://map.ecoris.info/" target="_blank">エコリス地図タイル</a><br>' +
  '<div style="width: 300px"><small>第5回 自然環境保全基礎調査 植生調査結果を着色し、国土地理院 基盤地図情報 数値標高データ10mメッシュから作成した陰影起伏図に重ねたものです。</small></div>'
// 岐阜県CS立体図----------------------------------------------------------------------------
function GihuCs () {
  this.extent = transformE([136.257111,35.141011,137.666902,36.482164143934]);
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/gihucs/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const gihuCsObj = {};
for (let i of mapsStr) {
  gihuCsObj[i] = new TileLayer(new GihuCs())
}
const gihuCsSumm = '<a href="https://www.geospatial.jp/ckan/dataset/cs-2019-geotiff" target="_blank">G空間情報センター</a>';
// 兵庫県CS立体図----------------------------------------------------------------------------
function HyougoCs () {
  this.extent = transformE([134.2669714033038, 34.17797854803047,135.47241581374712, 35.783161768341444]);
  this.source = new XYZ({
    url: 'https://kenzkenz.xsrv.jp/tile/hyougo/cs/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const hyougoCsObj = {};
for (let i of mapsStr) {
  hyougoCsObj[i] = new TileLayer(new HyougoCs())
}
const hyougoCsSumm = '<a href="https://web.pref.hyogo.lg.jp/kk26/hyogo-geo.html" target="_blank">全国初「全県土分の高精度3次元データ」の公開について</a>';
// 長野県CS立体図----------------------------------------------------------------------------
function NaganoCs () {
  this.extent = transformE([137.34924687267085, 35.181791181300085,138.7683143113627, 37.14523688239089]);
  this.source = new XYZ({
    url: 'https://tile.geospatial.jp/CS/VER2/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const naganoCsObj = {};
for (let i of mapsStr) {
  naganoCsObj[i] = new TileLayer(new NaganoCs())
}
const naganoCsSumm = '<a href="https://www.geospatial.jp/ckan/dataset/nagano-csmap" target="_blank">G空間情報センター</a>';
// 静岡県CS立体図----------------------------------------------------------------------------
function SizuokaCs () {
  this.extent = transformE([137.47545,34.59443,139.1504,35.64359]);
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cssizuoka/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const sizuokaCsObj = {};
for (let i of mapsStr) {
  sizuokaCsObj[i] = new TileLayer(new SizuokaCs())
}
const sizuokaCsSumm = '<a href="https://www.geospatial.jp/ckan/dataset/shizuokakencsmap2" target="_blank">G空間情報センター</a>';
// 日本CS立体図------------------------------------------------------------------------------
function NihonCs () {
  this.source = new XYZ({
    url: 'https://main-kouapp.ssl-lolipop.jp/csmap/tile/japan/{z}/{x}/{y}.jpg',
    // crossOrigin: 'Anonymous',
    minZoom:9,
    maxZoom:15
  })
}
const nihonCsObj = {};
for (let i of mapsStr) {
  nihonCsObj[i] = new TileLayer(new NihonCs())
}
const nihonCsSumm = '<a href="http://kouapp.main.jp/csmap/japan/setumei.html" target="_blank">日本CS立体図</a>';
// 迅速測図 (関東)----------------------------------------------------------------------------
function Jinsoku () {
  this.extent = transformE([138.954453,34.86946,140.8793163,36.45969967])
  this.source = new XYZ({
    url: 'https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:17
  });
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
    crossOrigin: 'Anonymous',
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
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([128.4,32.5,129.530,34.7]);
}
function Cs10m02 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/2/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([129.02,30.2,132.9,34]);
}
function Cs10m03 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/3/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([129.99,33.33,133.7,36.6]);
}
function Cs10m04 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/4/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([131.99,32.68,134.98,34.67]);
}
function Cs10m05 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/5/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([132.99,34.00,135.48,35.8]);
}
function Cs10m06 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/6/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([134.51,33.40,137.02,36.34]);
}
function Cs10m07 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/7/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([135.99,34.00,137.90,37.66]);
}
function Cs10m08 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/8/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([137.00,38.68,139.97,34.56]);
}
function Cs10m09 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/9/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([138.05,38.00,140.99,32.43]);
}
function Cs10m10 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/10/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([139.46,41.65,142.12,37.66]);
}
function Cs10m11 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/11/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([139.00,43.35,141.19,41.33]);
}
function Cs10m12 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/12/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([140.93,45.65,144.05,41.85]);
}
function Cs10m13 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/13/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([143.95,44.35,145.95,42.70]);
}
function Cs10m15 () {
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/15/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
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
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
  //mymapのwatchLayerで実際にextentを作っている。
  this.extent2 = transformE(bbox)
}
// 地図上に地区名を表示する。
function Mw5center () {
  this.name = 'Mw5center';
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/mw5center.geojson',
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
  }
  const mw5centerLayer = new VectorLayer(new Mw5center());
  layerGroup.push(mw5centerLayer);
  mw5Obj[i] = new LayerGroup({
    layers: layerGroup
  })
}
const mw5Summ = '<a href="https://mapwarper.h-gis.jp/" target="_blank">日本版 Map Warper</a><br>' +
  '<a href="https://stanford.maps.arcgis.com/apps/SimpleViewer/index.html?appid=733446cc5a314ddf85c59ecc10321b41" target="_blank">スタンフォード大学</a>';

// 日本版mapwarper５万分の１ここまで------------------------------------------------------
// 日本版mapwarper20万分の１ここから------------------------------------------------------
// 地区名
function Mw20center () {
  this.name = 'Mw20center';
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/mw20center.geojson',
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
const mw20Summ = '<a href="https://mapwarper.h-gis.jp/" target="_blank">日本版 Map Warper</a><br>';
// 日本版mapwarper20万分の１ここまで------------------------------------------------------

// 	東西蝦夷山川地理取調図-------------------------------------------------------------------------------
function Ezosansen () {
  this.source = new XYZ({
    url: 'https://koukita.github.io/touzaiezo/tile/{z}/{x}/{y}.jpg',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const ezosansenObj = {};
for (let i of mapsStr) {
  ezosansenObj[i] = new TileLayer(new Ezosansen())
}
const ezosansenSumm = '<a href="https://github.com/koukita/touzaiezo" target="_blank">喜多氏のgithub</a>';
// 	東西蝦夷山川地理取調図ここまで------------------------------------------------------------------------

const SSK = '<a href="https://dl.ndl.go.jp/search/searchResult?featureCode=all&searchWord=%E6%9C%80%E6%96%B0%E8%A9%B3%E5%AF%86%E9%87%91%E5%88%BA%E5%88%86%E7%B8%A3%E5%9C%96&fulltext=1&viewRestricted=0" target="_blank">最新詳密金刺分縣圖</a>です。'
// 	北海道古地図-------------------------------------------------------------------------------
function Kotizu01hokkaidou () {
  this.extent = transformE([139.53735724663997, 41.186004293591395,146.42212376570964, 46.26259923231669]);
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu4/tile/01hokkaidou0/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const kotizu01hokkaidouObj = {};
for (let i of mapsStr) {
  kotizu01hokkaidouObj[i] = new TileLayer(new Kotizu01hokkaidou())
}
const kotizu01hokkaidouSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu4/image/01hokkaidou.jpg" target="_blank">jpg</a>'
// 	北海道古地図ここまで------------------------------------------------------------------------
//  レイヤーをマスクする関数
export  function mask (dep,layer) {
  const coords = dep.geometry.coordinates;
  // epsg4326(WGS84)のときだけ実行する。
  if(coords[0][0][0]< 1000) {
    for (let i = 0; i < coords[0].length; i++) {
      coords[0][i] = fromLonLat(coords[0][i])
    }
  }
  const f = new Feature(new Polygon(coords));
  const crop = new Crop({
    feature: f,
    wrapX: true,
    inner: false
  });
  layer.addFilter(crop);
  const mask = new Mask({
    feature: f,
    wrapX: true,
    inner: false,
    fill: new Fill({ color:[255,255,255,0.8] })
  });
  layer.addFilter(mask);
  mask.set('active', false);
}
// 	02青森県古地図-------------------------------------------------------------------------------
function Kotizu01aomori () {
  this.extent = transformE([139.14337531230578, 40.07947328862201,141.90826803012916, 41.65330584813219]);
  this.dep = MaskDep.aomori;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/02aomoriken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu01aomoriObj = {};
for (let i of mapsStr) {
  kotizu01aomoriObj[i] = new TileLayer(new Kotizu01aomori())
  const dep = kotizu01aomoriObj[i].values_.dep
  mask(dep,kotizu01aomoriObj[i])
}
const kotizu01aomoriSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/02aomoriken.jpg" target="_blank">jpg</a>'
// 	03岩手県古地図-------------------------------------------------------------------------------
function Kotizu03iwate () {
  this.extent = transformE([140.4647865251053, 38.60447110081623,142.43317043781053, 40.58197617127430]);
  this.dep = MaskDep.iwate;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/3iwateken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu03iwateObj = {};
for (let i of mapsStr) {
  kotizu03iwateObj[i] = new TileLayer(new Kotizu03iwate())
  const dep = kotizu03iwateObj[i].values_.dep
  mask(dep,kotizu03iwateObj[i])
}
const kotizu03iwateSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/3iwateken.jpg" target="_blank">jpg</a>'
// 	04宮城県古地図-------------------------------------------------------------------------------
function Kotizu04miyagi () {
  this.extent = transformE([140.1290931689802, 37.70458850846947,141.80756014280652, 39.4555183388096])
  this.dep = MaskDep.miyagi;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/04miyagiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu04miyagiObj = {};
for (let i of mapsStr) {
  kotizu04miyagiObj[i] = new TileLayer(new Kotizu04miyagi())
  const dep = kotizu04miyagiObj[i].values_.dep
  mask(dep,kotizu04miyagiObj[i])
}
const kotizu04miyagiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/04miyagiken.jpg" target="_blank">jpg</a>'
// 	05秋田県古地図-------------------------------------------------------------------------------
function Kotizu05akita () {
  this.extent = transformE([139.57672496186024, 38.80927604504396,141.46576302917126, 40.69313501471041])
  this.dep = MaskDep.akita;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/5akitaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu05akitaObj = {};
for (let i of mapsStr) {
  kotizu05akitaObj[i] = new TileLayer(new Kotizu05akita())
  const dep = kotizu05akitaObj[i].values_.dep
  mask(dep,kotizu05akitaObj[i])
}
const kotizu05akitaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/5akitaken.jpg" target="_blank">jpg</a>'
// 	06山形県古地図-------------------------------------------------------------------------------
function Kotizu06yamagata () {
  this.extent = transformE([139.30206674295448, 37.6200337575343,141.1026040665337, 39.26439508091832])
  this.dep = MaskDep.yamagata;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/6yamagataken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu06yamagataObj = {};
for (let i of mapsStr) {
  kotizu06yamagataObj[i] = new TileLayer(new Kotizu06yamagata())
  const dep = kotizu06yamagataObj[i].values_.dep
  mask(dep,kotizu06yamagataObj[i])
}
const kotizu06yamagataSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/6yamagataken.jpg" target="_blank">jpg</a>'
// 	07福島県古地図-------------------------------------------------------------------------------
function Kotizu07hukusima () {
  this.extent = transformE([138.9297523319492, 36.715403688409765,141.32538223338815, 38.145118377199196])
  this.dep = MaskDep.hukusima;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/7hukusimaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu07hukusimaObj = {};
for (let i of mapsStr) {
  kotizu07hukusimaObj[i] = new TileLayer(new Kotizu07hukusima())
  const dep = kotizu07hukusimaObj[i].values_.dep
  mask(dep,kotizu07hukusimaObj[i])
}
const kotizu07hukusimaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/7hukusimaken.jpg" target="_blank">jpg</a>'
// 08茨城県古地図-------------------------------------------------------------------------------
function Kotizu08ibaraki () {
  this.extent = transformE([139.58588029093454, 35.584363236024984,141.05682751930664, 37.05225527704674])
  this.dep = MaskDep.ibaraki;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/8ibarakiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu08ibarakiObj = {};
for (let i of mapsStr) {
  kotizu08ibarakiObj[i] = new TileLayer(new Kotizu08ibaraki())
  const dep = kotizu08ibarakiObj[i].values_.dep
  mask(dep,kotizu08ibarakiObj[i])
}
const kotizu08ibarakiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/8ibarakiken.jpg" target="_blank">jpg</a>'
// 09栃木県古地図-------------------------------------------------------------------------------
function Kotizu09tochigi () {
  this.extent = transformE([139.16473762415603, 36.034787548044235,140.3640785003479,37.28813719296335])
  this.dep = MaskDep.tochigi;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/9tochigiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu09tochigiObj = {};
for (let i of mapsStr) {
  kotizu09tochigiObj[i] = new TileLayer(new Kotizu09tochigi())
  const dep = kotizu09tochigiObj[i].values_.dep
  mask(dep,kotizu09tochigiObj[i])
}
const kotizu09tochigiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/9tochigiken.jpg" target="_blank">jpg</a>'
// 10群馬県古地図-------------------------------------------------------------------------------
function Kotizu10gunma () {
  this.extent = transformE([137.94708623489814, 35.728182291196276,140.03754030889286, 37.35366397666763])
  this.dep = MaskDep.gunma;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/10gunmaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu10gunmaObj = {};
for (let i of mapsStr) {
  kotizu10gunmaObj[i] = new TileLayer(new Kotizu10gunma())
  const dep = kotizu10gunmaObj[i].values_.dep
  mask(dep,kotizu10gunmaObj[i])
}
const kotizu10gunmaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/10gunmaken.jpg" target="_blank">jpg</a>'
// 11埼玉県古地図-------------------------------------------------------------------------------
function Kotizu11saitama () {
  this.extent = transformE([138.5177649935174, 35.56202325676628,140.11993795683864, 36.48019691910925])
  this.dep = MaskDep.saitama;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/11saitamaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu11saitamaObj = {};
for (let i of mapsStr) {
  kotizu11saitamaObj[i] = new TileLayer(new Kotizu11saitama())
  const dep = kotizu11saitamaObj[i].values_.dep
  mask(dep,kotizu11saitamaObj[i])
}
const kotizu11saitamaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/11saitamaken.jpg" target="_blank">jpg</a>'
// 12千葉県古地図-------------------------------------------------------------------------------
function Kotizu12chibaken () {
  this.extent = transformE([139.5767250328089, 34.76869219518032,141.05072411212575, 36.23442834465834])
  this.dep = MaskDep.chiba;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/12chibaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu12chibakenObj = {};
for (let i of mapsStr) {
  kotizu12chibakenObj[i] = new TileLayer(new Kotizu12chibaken())
  const dep = kotizu12chibakenObj[i].values_.dep
  mask(dep,kotizu12chibakenObj[i])
}
const kotizu12chibakenSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/12chibaken.jpg" target="_blank">jpg</a>'
// 13東京都古地図-------------------------------------------------------------------------------
function Kotizu13tokyo () {
  this.extent = transformE([138.82294073937393, 35.30093068425302,140.05279928682307, 36.0421907297518])
  this.dep = MaskDep.tokyo;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/13tokyo/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu13tokyoObj = {};
for (let i of mapsStr) {
  kotizu13tokyoObj[i] = new TileLayer(new Kotizu13tokyo())
  const dep = kotizu13tokyoObj[i].values_.dep
  mask(dep,kotizu13tokyoObj[i])
}
const kotizu13tokyoSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/13tokyo.jpg" target="_blank">jpg</a>'
// 14神奈川県古地図-------------------------------------------------------------------------------
function Kotizu14kanagawa () {
  this.extent = transformE([138.83819963744648, 35.0314965123706,140.05585111639266, 35.7975195233328])
  this.dep = MaskDep.kanagawa;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/14kanagawaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu14kanagawaObj = {};
for (let i of mapsStr) {
  kotizu14kanagawaObj[i] = new TileLayer(new Kotizu14kanagawa())
  const dep = kotizu14kanagawaObj[i].values_.dep
  mask(dep,kotizu14kanagawaObj[i])
}
const kotizu14kanagawaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/14kanagawaken.jpg" target="_blank">jpg</a>'
// 15新潟県古地図-------------------------------------------------------------------------------
function Kotizu15niigata () {
  this.extent = transformE([137.0758093644289, 36.14674733860816,140.71960875134744, 39.0997531252250]);
  this.dep = MaskDep.niigata;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/15niigataken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu15niigataObj = {};
for (let i of mapsStr) {
  kotizu15niigataObj[i] = new TileLayer(new Kotizu15niigata())
  const dep = kotizu15niigataObj[i].values_.dep
  mask(dep,kotizu15niigataObj[i])
}
const kotizu15niigataSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/15niigataken.jpg" target="_blank">jpg</a>'
// 16富山県古地図-------------------------------------------------------------------------------
function Kotizu16toyama () {
  this.extent = transformE([136.41205200872534, 36.13097429396195,137.95929333142155, 37.2031100807304]);
  this.dep = MaskDep.toyama;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/16toyamaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu16toyamaObj = {};
for (let i of mapsStr) {
  kotizu16toyamaObj[i] = new TileLayer(new Kotizu16toyama())
  const dep = kotizu16toyamaObj[i].values_.dep
  mask(dep,kotizu16toyamaObj[i])
}
const kotizu16toyamaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/16toyamaken.jpg" target="_blank">jpg</a>'
// 17石川県古地図-------------------------------------------------------------------------------
function Kotizu17isikawa () {
  this.extent = transformE([136.04278934906503, 35.9533069414312,137.7151526210018, 37.68527021748923]);
  this.dep = MaskDep.isikawa;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/17isikawaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu17isikawaObj = {};
for (let i of mapsStr) {
  kotizu17isikawaObj[i] = new TileLayer(new Kotizu17isikawa())
  const dep = kotizu17isikawaObj[i].values_.dep
  mask(dep,kotizu17isikawaObj[i])
}
const kotizu17isikawaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/17isikawaken.jpg" target="_blank">jpg</a>'
// 18福井県古地図-------------------------------------------------------------------------------
function Kotizu18fukuii () {
  this.extent = transformE([135.17456465674059, 35.2416321191818,137.07886130822314, 36.4782335734440]);
  this.dep = MaskDep.fukui;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/18fukuiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu18fukuiiObj = {};
for (let i of mapsStr) {
  kotizu18fukuiiObj[i] = new TileLayer(new Kotizu18fukuii())
  const dep = kotizu18fukuiiObj[i].values_.dep
  mask(dep,kotizu18fukuiiObj[i])
}
const kotizu18fukuiiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/18fukuiken.jpg" target="_blank">jpg</a>'
// 19山梨県古地図-------------------------------------------------------------------------------
function Kotizu19yamanasi () {
  this.extent = transformE([138.03558732341338, 35.11391818719886,139.4638098120253, 36.0594620601866]);
  this.dep = MaskDep.yamanasi;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/19yamanasiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu19yamanasiObj = {};
for (let i of mapsStr) {
  kotizu19yamanasiObj[i] = new TileLayer(new Kotizu19yamanasi())
  const dep = kotizu19yamanasiObj[i].values_.dep
  mask(dep,kotizu19yamanasiObj[i])
}
const kotizu19yamanasiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/19yamanasiken.jpg" target="_blank">jpg</a>'
// 20長野県古地図-------------------------------------------------------------------------------
function Kotizu20nagano () {
  this.extent = transformE([137.1063270425094, 35.039992106599726,139.2608680953873, 37.28182417551734]);
  this.dep = MaskDep.nagano;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/20naganoken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu20naganoObj = {};
for (let i of mapsStr) {
  kotizu20naganoObj[i] = new TileLayer(new Kotizu20nagano())
  const dep = kotizu20naganoObj[i].values_.dep
  mask(dep,kotizu20naganoObj[i])
}
const kotizu20naganoSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/20naganoken.jpg" target="_blank">jpg</a>'
// 21岐阜県古地図-------------------------------------------------------------------------------
function Kotizu21gihu () {
  this.extent = transformE([136.07330690248412, 34.96399858992143,137.95929328648847, 36.712957336663806]);
  this.dep = MaskDep.gihu;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/21gihuken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu21gihuObj = {};
for (let i of mapsStr) {
  kotizu21gihuObj[i] = new TileLayer(new Kotizu21gihu())
  const dep = kotizu21gihuObj[i].values_.dep
  mask(dep,kotizu21gihuObj[i])
}
const kotizu21gihuSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/21gihuken.jpg" target="_blank">jpg</a>'
// 22静岡県古地図-------------------------------------------------------------------------------
function Kotizu22sizuoka () {
  this.extent = transformE([137.18109503768795, 34.49498828796092,139.40582648300045, 35.802469846963874]);
  this.dep = MaskDep.sizuoka;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/22sizuokaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu22sizuokaObj = {};
for (let i of mapsStr) {
  kotizu22sizuokaObj[i] = new TileLayer(new Kotizu22sizuoka())
  const dep = kotizu22sizuokaObj[i].values_.dep
  mask(dep,kotizu22sizuokaObj[i])
}
const kotizu22sizuokaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/22sizuokaken.jpg" target="_blank">jpg</a>'
// 23愛知県古地図-------------------------------------------------------------------------------
function Kotizu23aichi () {
  this.extent = transformE([136.28692998417054, 34.54276315991859,137.90436161548232, 35.5371938249228]);
  this.dep = MaskDep.aichi;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/23aichiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu23aichiObj = {};
for (let i of mapsStr) {
  kotizu23aichiObj[i] = new TileLayer(new Kotizu23aichi())
  const dep = kotizu23aichiObj[i].values_.dep
  mask(dep,kotizu23aichiObj[i])
}
const kotizu23aichiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/23aichiken.jpg" target="_blank">jpg</a>'
// 24三重県古地図-------------------------------------------------------------------------------
function Kotizu24mieken () {
  this.extent = transformE([135.55755979081184, 33.668481789114,137.21161279527038, 35.41790535710936]);
  this.dep = MaskDep.mie;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/24mieken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu24miekenObj = {};
for (let i of mapsStr) {
  kotizu24miekenObj[i] = new TileLayer(new Kotizu24mieken())
  const dep = kotizu24miekenObj[i].values_.dep
  mask(dep,kotizu24miekenObj[i])
}
const kotizu24miekenSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/24mieken.jpg" target="_blank">jpg</a>'
// 25滋賀県古地図-------------------------------------------------------------------------------
function Kotizu25sigaken () {
  this.extent = transformE([135.6308020908143, 34.77370586704984,136.64398559143208, 35.76038208455544]);
  this.dep = MaskDep.siga;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/25sigaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu25sigakenObj = {};
for (let i of mapsStr) {
  kotizu25sigakenObj[i] = new TileLayer(new Kotizu25sigaken())
  const dep = kotizu25sigakenObj[i].values_.dep
  mask(dep,kotizu25sigakenObj[i])
}
const kotizu25sigakenSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/25sigaken.jpg" target="_blank">jpg</a>'
// 26京都府古地図-------------------------------------------------------------------------------
function Kotizu26kyoutohu () {
  this.extent = transformE([134.666446509287, 34.50504839149191,136.17096309222305, 36.0865950828696]);
  this.dep = MaskDep.kyouto;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/26kyoutohu/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu26kyoutohuObj = {};
for (let i of mapsStr) {
  kotizu26kyoutohuObj[i] = new TileLayer(new Kotizu26kyoutohu())
  const dep = kotizu26kyoutohuObj[i].values_.dep
  mask(dep,kotizu26kyoutohuObj[i])
}
const kotizu26kyoutohuSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/26kyoutohu.jpg" target="_blank">jpg</a>'
// 27大阪府古地図-------------------------------------------------------------------------------
function Kotizu27osaka () {
  this.extent = transformE([134.89227668426307, 34.16232390373379,135.85968392945202, 35.12889509173576]);
  this.dep = MaskDep.osaka;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/27osaka/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu27osakaObj = {};
for (let i of mapsStr) {
  kotizu27osakaObj[i] = new TileLayer(new Kotizu27osaka())
  const dep = kotizu27osakaObj[i].values_.dep
  mask(dep,kotizu27osakaObj[i])
}
const kotizu27osakaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/27osaka.jpg" target="_blank">jpg</a>'
// 28兵庫県古地図-------------------------------------------------------------------------------
function Kotizu28hyogo () {
  this.extent = transformE([134.0530432033324, 34.08147963860071,135.71625142534907, 35.84700903949149]);
  this.dep = MaskDep.hyogo;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/28hyogoken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu28hyogoObj = {};
for (let i of mapsStr) {
  kotizu28hyogoObj[i] = new TileLayer(new Kotizu28hyogo())
  const dep = kotizu28hyogoObj[i].values_.dep
  mask(dep,kotizu28hyogoObj[i])
}
const kotizu28hyogoSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/28hyogoken.jpg" target="_blank">jpg</a>'
// 29奈良県古地図-------------------------------------------------------------------------------
function Kotizu29nara () {
  this.extent = transformE([135.3622472647639, 33.800452639216985,136.30218885727842, 34.82382560320653]);
  this.dep = MaskDep.nara;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/29naraken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu29naraObj = {};
for (let i of mapsStr) {
  kotizu29naraObj[i] = new TileLayer(new Kotizu29nara())
  const dep = kotizu29naraObj[i].values_.dep
  mask(dep,kotizu29naraObj[i])
}
const kotizu29naraSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/29naraken.jpg" target="_blank">jpg</a>'
// 30和歌山県古地図-------------------------------------------------------------------------------
function Kotizu30wakayama () {
  this.extent = transformE([134.88006961357738, 33.28666157470339,136.13129027944944, 34.57794810432477]);
  this.dep = MaskDep.wakayama;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/30wakayamaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu30wakayamaObj = {};
for (let i of mapsStr) {
  kotizu30wakayamaObj[i] = new TileLayer(new Kotizu30wakayama())
  const dep = kotizu30wakayamaObj[i].values_.dep
  mask(dep,kotizu30wakayamaObj[i])
}
const kotizu30wakayamaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/30wakayamaken.jpg" target="_blank">jpg</a>'
// 31鳥取県古地図-------------------------------------------------------------------------------
function Kotizu31tottori () {
  this.extent = transformE([132.87201291366142, 34.6884324206926,134.9166908529274, 36.09399334219408]);
  this.dep = MaskDep.tottori;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/31tottoriken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu31tottoriObj = {};
for (let i of mapsStr) {
  kotizu31tottoriObj[i] = new TileLayer(new Kotizu31tottori())
  const dep = kotizu31tottoriObj[i].values_.dep
  mask(dep,kotizu31tottoriObj[i])
}
const kotizu31tottoriSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/31tottoriken.jpg" target="_blank">jpg</a>'
// 32島根県古地図-------------------------------------------------------------------------------
function Kotizu32shimane () {
  this.extent = transformE([131.10504508513685, 33.96006826212876,133.78143672104184, 36.07672962939766]);
  this.dep = MaskDep.shimane;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/32shimaneken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu32shimaneObj = {};
for (let i of mapsStr) {
  kotizu32shimaneObj[i] = new TileLayer(new Kotizu32shimane())
  const dep = kotizu32shimaneObj[i].values_.dep
  mask(dep,kotizu32shimaneObj[i])
}
const kotizu32shimaneSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/32shimaneken.jpg" target="_blank">jpg</a>'
// 33岡山県古地図-------------------------------------------------------------------------------
function Kotizu33okayama () {
  this.extent = transformE([133.12836056797116, 34.07389642661967,134.5626867584726, 35.49745065211569]);
  this.dep = MaskDep.okayama;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/33okayamaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu33okayamaObj = {};
for (let i of mapsStr) {
  kotizu33okayamaObj[i] = new TileLayer(new Kotizu33okayama())
  const dep = kotizu33okayamaObj[i].values_.dep
  mask(dep,kotizu33okayamaObj[i])
}
const kotizu33okayamaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/33okayamaken.jpg" target="_blank">jpg</a>'
// 34広島県古地図-------------------------------------------------------------------------------
function Kotizu34hiroshima () {
  this.extent = transformE([131.67267205452762, 33.77508941185097,133.9584387585356, 35.363172325219395]);
  this.dep = MaskDep.hiroshima;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/34hiroshimaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu34hiroshimaObj = {};
for (let i of mapsStr) {
  kotizu34hiroshimaObj[i] = new TileLayer(new Kotizu34hiroshima())
  const dep = kotizu34hiroshimaObj[i].values_.dep
  mask(dep,kotizu34hiroshimaObj[i])
}
const kotizu34hiroshimaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/34hiroshimaken.jpg" target="_blank">jpg</a>'
// 35山口県古地図-------------------------------------------------------------------------------
function Kotizu35yamaguchi () {
  this.extent = transformE([130.48858997221657, 33.62275225666322,132.73468370359012, 34.97400177667768]);
  this.dep = MaskDep.yamaguchi;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/35yamaguchiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu35yamaguchiObj = {};
for (let i of mapsStr) {
  kotizu35yamaguchiObj[i] = new TileLayer(new Kotizu35yamaguchi())
  const dep = kotizu35yamaguchiObj[i].values_.dep
  mask(dep,kotizu35yamaguchiObj[i])
}
const kotizu35yamaguchiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/35yamagutiken.jpg" target="_blank">jpg</a>'
// 36徳島県古地図-------------------------------------------------------------------------------
function Kotizu36tokusima () {
  this.extent = transformE([133.56171013343172, 33.4752365140107,134.95025990086629, 34.4018746044325]);
  this.dep = MaskDep.tokusima;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/36tokusimaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu36tokusimaObj = {};
for (let i of mapsStr) {
  kotizu36tokusimaObj[i] = new TileLayer(new Kotizu36tokusima())
  const dep = kotizu36tokusimaObj[i].values_.dep
  mask(dep,kotizu36tokusimaObj[i])
}
const kotizu36tokusimaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/36tokusimaken.jpg" target="_blank">jpg</a>'
// 37香川県古地図-------------------------------------------------------------------------------
function Kotizu37kagawa () {
  this.extent = transformE([133.39386355863118, 33.93222049322577,134.59320443482304, 34.72355570107369]);
  this.dep = MaskDep.kagawa;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/37kagawaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu37kagawaObj = {};
for (let i of mapsStr) {
  kotizu37kagawaObj[i] = new TileLayer(new Kotizu37kagawa())
  const dep = kotizu37kagawaObj[i].values_.dep
  mask(dep,kotizu37kagawaObj[i])
}
const kotizu37kagawaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/37kagawaken.jpg" target="_blank">jpg</a>'
// 38愛媛県古地図-------------------------------------------------------------------------------
function Kotizu38ehime () {
  this.extent = transformE([131.52008412875165, 32.48968656547299,134.25445930602635, 34.82382560341891]);
  this.dep = MaskDep.ehime;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/38ehimeken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu38ehimeObj = {};
for (let i of mapsStr) {
  kotizu38ehimeObj[i] = new TileLayer(new Kotizu38ehime())
  const dep = kotizu38ehimeObj[i].values_.dep
  mask(dep,kotizu38ehimeObj[i])
}
const kotizu38ehimeSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/38ehimeken.jpg" target="_blank">jpg</a>'
// 39高知県古地図-------------------------------------------------------------------------------
function Kotizu39kochi () {
  this.extent = transformE([132.22809198188384, 32.58744998236202,134.50775506782134, 34.0460859519771]);
  this.dep = MaskDep.kochi;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/39kochiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu39kochiObj = {};
for (let i of mapsStr) {
  kotizu39kochiObj[i] = new TileLayer(new Kotizu39kochi())
  const dep = kotizu39kochiObj[i].values_.dep
  mask(dep,kotizu39kochiObj[i])
}
const kotizu39kochiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/39kochiken.jpg" target="_blank">jpg</a>'
// 40福岡県古地図-------------------------------------------------------------------------------
function Kotizu40fukuoka () {
  this.extent = transformE([129.91791120950657, 32.79291937264675,131.31256467883068, 34.311177873747454]);
  this.dep = MaskDep.fukuoka;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/40fukuokaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu40fukuokaObj = {};
for (let i of mapsStr) {
  kotizu40fukuokaObj[i] = new TileLayer(new Kotizu40fukuoka())
  const dep = kotizu40fukuokaObj[i].values_.dep
  mask(dep,kotizu40fukuokaObj[i])
}
const kotizu40fukuokaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/40fukuokaken.jpg" target="_blank">jpg</a>'
// 41佐賀県古地図-------------------------------------------------------------------------------
function Kotizu41saga () {
  this.extent = transformE([129.62189076189054, 32.89803887690721,130.87005974445592, 33.68625888712265]);
  this.dep = MaskDep.saga;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/41sagaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu41sagaObj = {};
for (let i of mapsStr) {
  kotizu41sagaObj[i] = new TileLayer(new Kotizu41saga())
  const dep = kotizu41sagaObj[i].values_.dep
  mask(dep,kotizu41sagaObj[i])
}
const kotizu41sagaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/41sagaken.jpg" target="_blank">jpg</a>'
// 42長崎県古地図-------------------------------------------------------------------------------
function Kotizu42nagasaki () {
  this.extent = transformE([128.26996196165274, 32.47681505638525,130.68085078253935, 33.99549789518811]);
  this.dep = MaskDep.nagasaki;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/42nagasakiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu42nagasakiObj = {};
for (let i of mapsStr) {
  kotizu42nagasakiObj[i] = new TileLayer(new Kotizu42nagasaki())
  const dep = kotizu42nagasakiObj[i].values_.dep
  mask(dep,kotizu42nagasakiObj[i])
}
const kotizu42nagasakiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/42nagasakiken.jpg" target="_blank">jpg</a>'
// 43熊本県古地図-------------------------------------------------------------------------------
function Kotizu43kumamoto () {
  this.extent = transformE([129.99725691618875, 32.0225671681847,131.37970331700993, 33.51595568942747]);
  this.dep = MaskDep.kumamoto;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/43kumamotoken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu43kumamotoObj = {};
for (let i of mapsStr) {
  kotizu43kumamotoObj[i] = new TileLayer(new Kotizu43kumamoto())
  const dep = kotizu43kumamotoObj[i].values_.dep
  mask(dep,kotizu43kumamotoObj[i])
}
const kotizu43kumamotoSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/43kumamotoken.jpg" target="_blank">jpg</a>'
// 44大分県古地図-------------------------------------------------------------------------------
function Kotizu44oita () {
  this.extent = transformE([130.71747183513978, 32.71335609592143,132.48749157128074, 33.86636200310696]);
  this.dep = MaskDep.oita;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/44oitaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu44oitaObj = {};
for (let i of mapsStr) {
  kotizu44oitaObj[i] = new TileLayer(new Kotizu44oita())
  const dep = kotizu44oitaObj[i].values_.dep
  mask(dep,kotizu44oitaObj[i])
}
const kotizu44oitaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/44oitaken.jpg" target="_blank">jpg</a>'
// 45宮崎県古地図-------------------------------------------------------------------------------
function Kotizu45miyazaki () {
  this.extent = transformE([130.46417593144741, 31.2717699691664,132.07855579563346, 32.99279597868028]);
  this.dep = MaskDep.miyazaki;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/45miyazakiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu45miyazakiObj = {};
for (let i of mapsStr) {
  kotizu45miyazakiObj[i] = new TileLayer(new Kotizu45miyazaki())
  const dep = kotizu45miyazakiObj[i].values_.dep
  mask(dep,kotizu45miyazakiObj[i])
}
const kotizu45miyazakiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/45miyazakiken.jpg" target="_blank">jpg</a>'
// 46鹿児島県古地図-------------------------------------------------------------------------------
function Kotizu46kagoshima () {
  this.extent = transformE([129.98199816146874, 30.87446474904796,131.33087504008793, 32.366043938734606]);
  this.dep = MaskDep.kagoshima;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/46kagoshimaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu46kagoshimaObj = {};
for (let i of mapsStr) {
  kotizu46kagoshimaObj[i] = new TileLayer(new Kotizu46kagoshima())
  const dep = kotizu46kagoshimaObj[i].values_.dep
  mask(dep,kotizu46kagoshimaObj[i])
}
const kotizu46kagoshimaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/46kagoshimaken.jpg" target="_blank">jpg</a>'
// 47沖縄県県古地図-------------------------------------------------------------------------------
function Kotizu47okinawa () {
  this.extent = transformE([126.3076817147321, 25.88283898762164,128.71246700136726, 27.431915559934936]);
  this.dep = MaskDep.okinawa;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/47okinawaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu47okinawaObj = {};
for (let i of mapsStr) {
  kotizu47okinawaObj[i] = new TileLayer(new Kotizu47okinawa())
  const dep = kotizu47okinawaObj[i].values_.dep
  mask(dep,kotizu47okinawaObj[i])
}
const kotizu47okinawaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/47okinawaken.jpg" target="_blank">jpg</a>'
// 古地図全部を一つのレイヤーに-------------------------------------------------------------------------------
const kotizu00Obj = {};
for (let i of mapsStr) {
  kotizu00Obj[i] = new LayerGroup({
    layers: [
      kotizu01hokkaidouObj[i],
      kotizu01aomoriObj[i],
      kotizu03iwateObj[i],
      kotizu04miyagiObj[i],
      kotizu05akitaObj[i],
      kotizu06yamagataObj[i],
      kotizu07hukusimaObj[i],
      kotizu08ibarakiObj[i],
      kotizu09tochigiObj[i],
      kotizu10gunmaObj[i],
      kotizu11saitamaObj[i],
      kotizu12chibakenObj[i],
      kotizu13tokyoObj[i],
      kotizu14kanagawaObj[i],
      kotizu15niigataObj[i],
      kotizu16toyamaObj[i],
      kotizu17isikawaObj[i],
      kotizu18fukuiiObj[i],
      kotizu19yamanasiObj[i],
      kotizu20naganoObj[i],
      kotizu21gihuObj[i],
      kotizu22sizuokaObj[i],
      kotizu23aichiObj[i],
      kotizu24miekenObj[i],
      kotizu25sigakenObj[i],
      kotizu26kyoutohuObj[i],
      kotizu27osakaObj[i],
      kotizu28hyogoObj[i],
      kotizu29naraObj[i],
      kotizu30wakayamaObj[i],
      kotizu31tottoriObj[i],
      kotizu32shimaneObj[i],
      kotizu33okayamaObj[i],
      kotizu34hiroshimaObj[i],
      kotizu35yamaguchiObj[i],
      kotizu36tokusimaObj[i],
      kotizu37kagawaObj[i],
      kotizu38ehimeObj[i],
      kotizu39kochiObj[i],
      kotizu40fukuokaObj[i],
      kotizu41sagaObj[i],
      kotizu42nagasakiObj[i],
      kotizu43kumamotoObj[i],
      kotizu44oitaObj[i],
      kotizu45miyazakiObj[i],
      kotizu46kagoshimaObj[i],
      kotizu47okinawaObj[i]
    ]
  })
}
for (let i of mapsStr) {
  kotizu00Obj[i].values_['dep'] = true
}
const kotizu00Summ = SSK
// 洪水浸水想定-------------------------------------------------------------------------------
function Shinsuishin () {
  this.name = 'shinsuishin'
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const shinsuishinObj = {};
for (let i of mapsStr) {
  shinsuishinObj[i] = new TileLayer(new Shinsuishin())
}
const shinsuishinSumm = '<img src="https://kenzkenz.xsrv.jp/open-hinata/img/shinsui_legend2-1.png">';
// 津波浸水想定-------------------------------------------------------------------------------
function Tsunami () {
  this.name = 'tunami'
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png',
    // url: 'https://disaportaldata.gsi.go.jp/raster/04_tsunami_oldlegend/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const tsunamiObj = {};
for (let i of mapsStr) {
  tsunamiObj[i] = new TileLayer(new Tsunami())
}
const tunamiSumm =  '<img src="https://kenzkenz.xsrv.jp/open-hinata/img/tsunami_newlegend.png">';
// 津波浸水想定-------------------------------------------------------------------------------
function Keizoku () {
  this.name = 'keizoku'
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_keizoku_kuni_data/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const keizokuObj = {};
for (let i of mapsStr) {
  keizokuObj[i] = new TileLayer(new Keizoku())
}
const keizokuSumm =  '<img src="https://kenzkenz.xsrv.jp/open-hinata/img/shinsui_legend_l2_keizoku.png">';
// 土砂災害警戒区域（土石流-------------------------------------------------------------------------------
function Dosya () {
  this.name = 'dosya'
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const dosyaObj = {};
for (let i of mapsStr) {
  dosyaObj[i] = new TileLayer(new Dosya())
}
const dosyaSumm =  '<a href="https://kenzkenz.xsrv.jp/open-hinata/img/dosha_keikai.png" target="_blank" ><img width="600" src="https://kenzkenz.xsrv.jp/open-hinata/img/dosha_keikai.png"></a>  ';
// 宮崎市ハザードマップ-------------------------------------------------------------------------------
function MiyazakisiHm () {
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/hazardmap/tile/miyazakisi/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  })
}
const miyazakisiHmObj = {};
for (let i of mapsStr) {
  miyazakisiHmObj[i] = new TileLayer(new MiyazakisiHm())
}
const miyazakisiHmSumm = '<a href="http://www.city.miyazaki.miyazaki.jp/life/fire_department/hazard_map/1153.html" target="_blank">宮崎市洪水ハザードマップ</a>へ';
// 都城市ハザードマップ-------------------------------------------------------------------------------
function MiyakonozyousiHm () {
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/hazardmap/tile/miyakonozyousi/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  })
}
const miyakonozyousiHmObj = {};
for (let i of mapsStr) {
  miyakonozyousiHmObj[i] = new TileLayer(new MiyakonozyousiHm())
}
const miyakonozyousiHmSumm = '';
// 日向市ハザードマップ-------------------------------------------------------------------------------
function HyuugasiHm () {
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/hazardmap/tile/hyuugasibousai/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  })
}
const hyuugasiHmObj = {};
for (let i of mapsStr) {
  hyuugasiHmObj[i] = new TileLayer(new HyuugasiHm())
}
const hyuugasiHmSumm = '';
// ここにレイヤーを全部書く。クリックするとストアのlayerListに追加されていく-------------------------
const layers =
  [
    { text: 'OpenStreetMap', data: { id: 0, layer: osmObj, opacity: 1, summary: osmSumm } },
    { text: '国土地理院',
      children: [
        { text: '標準地図', data: { id: 1, layer: stdObj, opacity: 1, summary: stdSumm } },
        { text: '淡色地図', data: { id: 2, layer: paleObj, opacity: 1, summary: paleSumm } },
        { text: '白地図', data: { id: 3, layer: blankObj, opacity: 1, summary: blankSumm } },
        { text: '色別標高図', data: { id: 4, layer: reliefObj, opacity: 1, summary: reliefSumm } }
      ]},
    { text: '航空写真',
      children: [
        { text: '全国最新写真', data: { id: 'zenkokusaisin', layer: seamlessphotoObj, opacity: 1, summary: seamlessphotoSumm } },
        { text: '宮崎県航空写真', data: { id: 6, layer: miyazakiOrtObj, opacity: 1, zoom:9, center: [131.42386188579064, 31.911063477361182], summary: miyazakiOrtSumm } },
        { text: '静岡県航空写真', data: { id: 7, layer: sizuokaOrtObj, opacity: 1, zoom:12,center:[138.43674074146253, 35.052859245538755], summary: sizuokaOrtSumm } },
        { text: '室蘭市航空写真', data: { id: 'muroransiort', layer: muroransiOrtObj, opacity: 1, zoom:13,center:[140.97759620387416, 42.35223030295967], summary: muroransiOrtSumm } },
        { text: '鹿児島市航空写真', data: { id: 'kagosimasiort', layer: kagosimasiOrtObj, opacity: 1, zoom:12,center:[130.51208842259823, 31.58146097086727], summary: kagosimasiOrtSumm } }
      ]},
    { text: '過去の航空写真',
      children: [
        { text: '74~78年航空写真', data: { id: 'sp74', layer: sp74Obj, opacity: 1, summary: sp74Summ } },
        { text: '61~64年航空写真', data: { id: 'sp61', layer: sp61Obj, opacity: 1, summary: sp61Summ } }
      ]},
    { text: '立体図等',
      children: [
        { text: '川だけ地形地図', data: { id: 'kawadake', layer: kawadakeObj, opacity: 1, summary: kawadakeSumm } },
        { text: '川と流域地図', data: { id: 'ryuuiki', layer: ryuuikiObj, opacity: 1, summary: ryuuikiSumm } },
        { text: 'エコリス植生図', data: { id: 'ecoris', layer: ecorisObj, opacity: 1, summary: ecorisSumm } },
        { text: '日本CS立体図', data: { id: 'jcs', layer: nihonCsObj, opacity: 1, summary: nihonCsSumm } },
        { text: '全国CS立体図10m', data: { id: 'cs10', layer: cs10mObj, opacity: 1, summary: cs10mSumm } },
        { text: '岐阜県CS立体図', data: { id: 'gcs', layer: gihuCsObj, opacity: 1, zoom:9, center:[137.03491577372932, 35.871742161031975], summary: gihuCsSumm } },
        { text: '兵庫県CS立体図', data: { id: 'hyougocs', layer: hyougoCsObj, opacity: 1, zoom:9, center:[134.8428381533734, 35.05148520051671], summary: hyougoCsSumm } },
        { text: '長野県CS立体図', data: { id: 'naganocs', layer: naganoCsObj, opacity: 1, zoom:9, center:[138.14880751631608, 36.19749617538284], summary: naganoCsSumm } },
        { text: '静岡県CS立体図', data: { id: 'sizuokacs', layer: sizuokaCsObj, opacity: 1, zoom:9, center:[138.26385867875933, 35.01475223050842], summary: sizuokaCsSumm } }
      ]},
    { text: '古地図',
      children: [
        { text: '<i class="fa-solid fa-layer-group"></i>戦前地形図5万分の１', data: { id: 'mw5', layer: mw5Obj, opacity: 1, summary: mw5Summ } },
        { text: '<i class="fa-solid fa-layer-group"></i>戦前地形図20万分の１', data: { id: 'mw20', layer: mw20Obj, opacity: 1, summary: mw20Summ } },
        { text: '迅速測図 (関東)', data: { id: 'jinsoku', layer: jinsokuObj, opacity: 1, zoom: 9, center: [139.8089637733657, 35.86926927958841], summary: jinsokuSumm } },
        { text: '東西蝦夷山川地理取調図', data: { id: 'ezosansen', layer: ezosansenObj, opacity: 1, zoom: 8, center: [142.6944008210318, 43.241646716680606], summary: ezosansenSumm } },
        { text: '大正13,14年古地図',
          children: [
            { text: '<i class="fa-solid fa-layer-group"></i>大正古地図全て', data: { id: 'kotizu00', layer: kotizu00Obj, opacity: 1, summary: kotizu00Summ } },
            { text: '01北海道古地図', data: { id: 'kotizu01hokkaidou', layer: kotizu01hokkaidouObj, opacity: 1, zoom: 8, center: [142.6944008210318, 43.241646716680606], summary: kotizu01hokkaidouSumm } },
            { text: '東北',
              children: [
                { text: '02青森県古地図(大正13年)', data: { id: 'kotizu01aomori', layer: kotizu01aomoriObj, opacity: 1, zoom: 9, center: [140.67520521398887, 40.84152054620705], summary: kotizu01aomoriSumm } },
                { text: '03岩手県古地図(大正14年)', data: { id: 'kotizu03iwate', layer: kotizu03iwateObj, opacity: 1, zoom: 9, center: [141.40762710839144, 39.6512878209730], summary: kotizu03iwateSumm } },
                { text: '04宮城県古地図(大正14年)', data: { id: 'kotizu04miyagi', layer: kotizu04miyagiObj, opacity: 1, zoom: 9, center: [140.91324236659926, 38.49277272507115], summary: kotizu04miyagiSumm } },
                { text: '05秋田県古地図(大正13年)', data: { id: 'kotizu05akita', layer: kotizu05akitaObj, opacity: 1, zoom: 9, center: [140.342563594382, 39.746736192608324], summary: kotizu05akitaSumm } },
                { text: '06山形県古地図(大正13年)', data: { id: 'kotizu06yamagata', layer: kotizu06yamagataObj, opacity: 1, zoom: 9, center: [140.09842298137926, 38.50471461587239], summary: kotizu06yamagataSumm } },
                { text: '07福島県古地図(大正13年)', data: { id: 'kotizu07hukusima', layer: kotizu07hukusimaObj, opacity: 1, zoom: 9, center: [140.23376849960238, 37.48454580025047], summary: kotizu07hukusimaSumm } },
              ]},
            { text: '関東',
              children: [
                { text: '08茨城県古地図(大正14年)', data: { id: 'kotizu08ibaraki', layer: kotizu08ibarakiObj, opacity: 1, zoom: 9, center: [140.33340833916677, 36.289055943305996], summary: kotizu08ibarakiSumm } },
                { text: '09栃木県古地図(大正14年)', data: { id: 'kotizu09tochigii', layer: kotizu09tochigiObj, opacity: 1, zoom: 9, center: [139.79935070783154, 36.67918938356935], summary: kotizu09tochigiSumm } },
                { text: '10群馬県古地図(大正14年)', data: { id: 'kotizu10gunma', layer: kotizu10gunmaObj, opacity: 1, zoom: 9, center: [138.96622079371627, 36.50767460653462], summary: kotizu10gunmaSumm } },
                { text: '11埼玉県古地図(大正14年)', data: { id: 'kotizu11saitama', layer: kotizu11saitamaObj, opacity: 1, zoom: 9, center: [139.35699844775343, 36.02985181257246], summary: kotizu11saitamaSumm } },
                { text: '12千葉県古地図(大正13年)', data: { id: 'kotizu12chiba', layer: kotizu12chibakenObj, opacity: 1, zoom: 9, center: [140.20538708670875, 35.48254193777967], summary: kotizu12chibakenSumm} },
                { text: '13東京都古地図(大正13年)', data: { id: 'kotizu13tokyo', layer: kotizu13tokyoObj, opacity: 1, zoom: 9, center: [139.42718884237084, 35.69596949636376], summary: kotizu13tokyoSumm} },
                { text: '14神奈川県古地図(大正13年)', data: { id: 'kotizu14kanagawa', layer: kotizu14kanagawaObj, opacity: 1, zoom: 9, center: [139.3234291109266, 35.432826032715724], summary: kotizu14kanagawaSumm} },
              ]},
            { text: '中部',
              children: [
                { text: '15新潟県古地図(大正14年)', data: { id: 'kotizu15niigata', layer: kotizu15niigataObj, opacity: 1, zoom: 9, center: [138.99994268118078, 37.516020514481625], summary: kotizu15niigataSumm} },
                { text: '16富山県古地図(大正14年)', data: { id: 'kotizu16toyama', layer: kotizu16toyamaObj, opacity: 1, zoom: 9, center: [137.21161264873257, 36.65177261122085], summary: kotizu16toyamaSumm } },
                { text: '17石川県古地図(大正14年)', data: { id: 'kotizu17isikawa', layer: kotizu17isikawaObj, opacity: 1, zoom: 9, center: [136.79657363135973, 36.81563789609989], summary: kotizu17isikawaSumm } },
                { text: '18福井県古地図(大正14年)', data: { id: 'kotizu18fukui', layer: kotizu18fukuiiObj, opacity: 1, zoom: 9, center: [136.18011838773094, 35.84206149629695], summary: kotizu18fukuiiSumm } },
                { text: '19山梨県古地図(大正14年)', data: { id: 'kotizu19yamanasi ', layer: kotizu19yamanasiObj, opacity: 1, zoom: 9, center: [138.6367835664595, 35.651345759735065], summary: kotizu19yamanasiSumm} },
                { text: '20長野県古地図(大正12年)', data: { id: 'kotizu20nagano ', layer: kotizu20naganoObj, opacity: 1, zoom: 9, center: [138.0020178500573, 36.126044472410726], summary: kotizu20naganoSumm} },
                { text: '21岐阜県古地図(大正14年)', data: { id: 'kotizu21gihu ', layer: kotizu21gihuObj, opacity: 1, zoom: 9, center: [137.08038704085405, 35.80494491384562], summary: kotizu21gihuSumm } },
                { text: '22静岡県古地図(大正14年)', data: { id: 'kotizu22sizuoka ', layer: kotizu22sizuokaObj, opacity: 1, zoom: 9, center: [138.35297002625663, 35.03149650164657], summary: kotizu22sizuokaSumm } },
                { text: '23愛知県古地図(大正14年)', data: { id: 'kotizu23aichi', layer: kotizu23aichiObj, opacity: 1, zoom: 9, center: [137.18109497674774, 34.9965045398574], summary: kotizu23aichiSumm } },
              ]},
            { text: '近畿',
              children: [
                { text: '24三重県古地図(大正13年)', data: { id: 'kotizu24mieken', layer: kotizu24miekenObj, opacity: 1, zoom: 9, center: [136.4149512041131, 34.49297614663594], summary: kotizu24miekenSumm } },
                { text: '25滋賀県古地図(大正14年)', data: { id: 'kotizu25sigaken', layer: kotizu25sigakenObj, opacity: 1, zoom: 9, center: [136.09146486741864, 35.25160121546057], summary: kotizu25sigakenSumm } },
                { text: '26京都府古地図(大正13年)', data: { id: 'kotizu26kyoutohu', layer: kotizu26kyoutohuObj, opacity: 1, zoom: 9, center: [135.49026856249452, 34.66057422989442], summary: kotizu26kyoutohuSumm } },
                { text: '27大阪府古地図(大正14年)', data: { id: 'kotizu27osaka', layer: kotizu27osakaObj, opacity: 1, zoom: 9, center: [135.49026856249452, 34.66057422989442], summary: kotizu27osakaSumm } },
                { text: '28兵庫県古地図(大正13年)', data: { id: 'kotizu28hyogo', layer: kotizu28hyogoObj, opacity: 1, zoom: 9, center: [134.83719229873228, 34.969500528403245], summary: kotizu28hyogoSumm } },
                { text: '29奈良県古地図(大正14年)', data: { id: 'kotizu29nara', layer: kotizu29naraObj, opacity: 1, zoom: 9, center: [135.40787110854197, 33.93779078075431], summary: kotizu29naraSumm } },
                { text: '30和歌山県古地図(大正14年)', data: { id: 'kotizu30wakayama', layer: kotizu30wakayamaObj, opacity: 1, zoom: 9, center: [135.40787110854197, 33.93779078075431], summary: kotizu30wakayamaSumm } },
         ]},
            { text: ' 中国',
              children: [
                { text: '31鳥取県古地図(大正14年)', data: { id: 'kotizu31tottori', layer: kotizu31tottoriObj, opacity: 1, zoom: 9, center: [133.86368161450991, 35.4283501390533], summary: kotizu31tottoriSumm } },
                { text: '32島根県古地図(大正14年)', data: { id: 'kotizu32shimane', layer: kotizu32shimaneObj, opacity: 1, zoom: 9, center: [132.38663070035244, 35.00200428279085], summary: kotizu32shimaneSumm } },
                { text: '33岡山県古地図(大正14年)', data: { id: 'kotizu33okayama', layer: kotizu33okayamaObj, opacity: 1, zoom: 9, center: [133.79959468951728, 34.87942275146696], summary: kotizu33okayamaSumm } },
                { text: '34広島県古地図(大正13年)', data: { id: 'kotizu34hiroshima', layer: kotizu34hiroshimaObj, opacity: 1, zoom: 9, center: [132.7589452109575, 34.56839937423835], summary: kotizu34hiroshimaSumm } },
                { text: '35山口県古地図(大正13年)', data: { id: 'kotizu35yamaguchi', layer: kotizu35yamaguchiObj, opacity: 1, zoom: 9, center: [131.59317370493247, 34.230980820797356], summary: kotizu35yamaguchiSumm } },

           ]},
            { text: '四国',
              children: [
                { text: '36徳島県古地図(大正14年)', data: { id: 'kotizu36tokusima', layer: kotizu36tokusimaObj, opacity: 1, zoom: 9, center: [134.2512548300351, 33.9377907341931], summary: kotizu36tokusimaSumm } },
                { text: '37香川県古地図(大正14年)', data: { id: 'kotizu37kagawa', layer: kotizu37kagawaObj, opacity: 1, zoom: 9, center: [133.99185542756558, 34.24107268786568], summary: kotizu37kagawaSumm } },
                { text: '38愛媛県古地図(大正14年)', data: { id: 'kotizu38ehime', layer: kotizu38ehimeObj, opacity: 1, zoom: 9, center: [132.83829096234632, 33.67406931001446], summary: kotizu38ehimeSumm } },
                { text: '39高知県古地図(大正14年)', data: { id: 'kotizu39kochi', layer: kotizu39kochiObj, opacity: 1, zoom: 9, center: [133.31741694236896, 33.536816779433096], summary: kotizu39kochiSumm } },
              ]},
            { text: '九州沖縄',
              children: [
                { text: '40福岡県古地図(大正14年)', data: { id: 'kotizu40fukuoka', layer: kotizu40fukuokaObj, opacity: 1, zoom: 9, center: [130.63423506830085, 33.52587808087998], summary: kotizu40fukuokaSumm } },
                { text: '41佐賀県古地図(大正14年)', data: { id: 'kotizu41saga', layer: kotizu41sagaObj, opacity: 1, zoom: 9, center: [130.09476057930058, 33.30502734026227], summary: kotizu41sagaSumm } },
                { text: '42長崎県古地図(大正13年)', data: { id: 'kotizu42nagasaki', layer: kotizu42nagasakiObj, opacity: 1, zoom: 9, center: [129.5362889506741, 33.11863979844799], summary: kotizu42nagasakiSumm } },
                { text: '43熊本県古地図(大正13年)', data: { id: 'kotizu43kumamoto', layer: kotizu43kumamotoObj, opacity: 1, zoom: 9, center: [130.76919910142672, 32.66250105798969], summary: kotizu43kumamotoSumm } },
                { text: '44大分県古地図(大正14年)', data: { id: 'kotizu44oita', layer: kotizu44oitaObj, opacity: 1, zoom: 9, center: [131.46499990110914, 33.22847774498263], summary: kotizu44oitaSumm } },
                { text: '45宮崎県古地図(大正14年)', data: { id: 'kotizu45miyazaki', layer: kotizu45miyazakiObj, opacity: 1, zoom: 9, center: [131.300204984101, 32.13427469145421], summary: kotizu45miyazakiSumm } },
                { text: '46鹿児島県古地図(大正14年)', data: { id: 'kotizu46kagosima', layer: kotizu46kagoshimaObj, opacity: 1, zoom: 9, center: [130.65933581726637, 31.600372394062873], summary: kotizu46kagoshimaSumm } },
                { text: '47沖縄県古地図(大正14年)', data: { id: 'kotizu47okinawa', layer: kotizu47okinawaObj, opacity: 1, zoom: 9, center: [127.85255774851787, 26.472759103562595], summary: kotizu47okinawaSumm } },
              ]}
          ]},
      ]},
    { text: '夜の明かり', data: { id: "japanLight", layer: LayersMvt.japanLightObj, opacity: 1, summary: LayersMvt.japanLightSumm } },
    { text: '小学校区', data: { id: "syougakkouku", layer: LayersMvt.syougakkoukuObj, opacity: 1, summary: LayersMvt.syougakkoukuSumm } },
    { text: '中学校区', data: { id: "tyuugakkouku", layer: LayersMvt.tyuugakkoukuObj, opacity: 1, summary: LayersMvt.tyuugakkoukuSumm } },

    { text: '海面上昇シミュ',
      children: [
        { text: '海面上昇シミュ5Mdem', data: { id: 'flood5m', layer: flood5Obj, opacity: 1, summary: floodSumm, component: {name: 'flood5m', values:[]}} },
        { text: '海面上昇シミュ10Mdem', data: { id: 'flood10m', layer: flood10Obj, opacity: 1, summary: floodSumm, component: {name: 'flood10m', values:[]}} },
      ]},
    { text: 'ハザードマップ',
      children: [
        { text: '洪水浸水想定', data: { id: 'shinsuishin', layer: shinsuishinObj, opacity: 1, summary: shinsuishinSumm } },
        { text: '津波浸水想定', data: { id: 'tunami', layer: tsunamiObj, opacity: 1, summary: tunamiSumm } },
        { text: '浸水継続時間(想定最大規模)', data: { id: 'keizoku', layer: keizokuObj, opacity: 1, summary: keizokuSumm } },
        { text: '土砂災害警戒区域(土石流)', data: { id: 'dosya', layer: dosyaObj, opacity: 1, summary: dosyaSumm } },
        { text: '宮崎市洪水ﾊｻﾞｰﾄﾞﾏｯﾌﾟ', data: { id: 'miyazakisiHm', layer: miyazakisiHmObj, opacity: 1, zoom: 13, center: [131.42054548436312, 31.907339493919977], summary: miyazakisiHmSumm } },
        { text: '都城市洪水ﾊｻﾞｰﾄﾞﾏｯﾌﾟ', data: { id: 'miyakonozyousiHm', layer: miyakonozyousiHmObj, opacity: 1, zoom: 13, center: [131.07797970576192, 31.78882205640913], summary: miyakonozyousiHmSumm } },
        { text: '日向市防災ﾊｻﾞｰﾄﾞﾏｯﾌﾟ', data: { id: 'hyuugasiHm', layer: hyuugasiHmObj, opacity: 1, zoom: 13, center: [131.6400086045909, 32.395198966795306], summary: hyuugasiHmSumm } }
      ]}
  ];
export const Layers = layers;
