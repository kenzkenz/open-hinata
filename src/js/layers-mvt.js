import store from './store'
import VectorTileSource from "ol/source/VectorTile"
import MVT from "ol/format/MVT"
import GeoJSON from "ol/format/GeoJSON"
import {createXYZ} from "ol/tilegrid"
import VectorTileLayer from "ol/layer/VectorTile"
import * as d3 from "d3"
import {Fill, Stroke, Style, Text, Circle} from "ol/style"
import FontSymbol from 'ol-ext/style/FontSymbol'
import {transformExtent} from "ol/proj"
import LayerGroup from "ol/layer/Group"
import XYZ from "ol/source/XYZ"
import TileLayer from "ol/layer/Tile"
import Icon from 'ol/style/Icon'
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import {Heatmap} from 'ol/layer'
import MVTFormat from 'ol/format/MVT'
import WebGLPointsLayer from 'ol/layer/WebGLPoints'
import WikiCommons from 'ol-ext/source/WikiCommons'
import  * as Tilegrid from 'ol/tilegrid'
import * as Loadingstrategy from 'ol/loadingstrategy'
// import image from "ol-ext/legend/Image";
// import * as flatgeobuf from 'flatgeobuf'

const transformE = extent => {
  return transformExtent(extent,'EPSG:4326','EPSG:3857')
}
const ru2 = string => {
  if (string === undefined || string === 0) {
    return '-'
  } else {
    return string
  }
}
String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this.substr(0);
    }
// const mapsStr = ['map01','map02','map03','map04'];
const mapsStr = ['map01','map02']
// メッシュ洪水-----------------------------------------------------------------------
function kozuiMesh9syu(){
  this.name = 'zoseiMvt'
  // this.className = 'zoseiMvt'
  this.source = new VectorTileSource({
    crossOrigin: 'Anonymous',
    format: new MVT(),
    maxZoom:14,
    url: "https://kenzkenz3.xsrv.jp/mvt/kozui/9syu/{z}/{x}/{y}.mvt"
  });
  // this.style = zoseiStyleFunction()
  this.maxResolution = 152.874057 //zoom10
  // this.declutter = true
  // this.overflow = true
}
export const kozuiMesh9syuSumm = "<a href='l' target='_blank'>国土数値情報</a>"
export const kozuiMesh9syuMvtObj = {};
for (let i of mapsStr) {
  kozuiMesh9syuMvtObj[i] = new VectorTileLayer(new kozuiMesh9syu())
}


// 大規模盛土造成地データ-----------------------------------------------------------------------
function zoseiMvt(){
  this.name = 'zoseiMvt'
  // this.className = 'zoseiMvt'
  this.source = new VectorTileSource({
    crossOrigin: 'Anonymous',
    format: new MVT(),
    maxZoom:14,
    url: "https://kenzkenz3.xsrv.jp/mvt/zosei/{z}/{x}/{y}.mvt"
  });
  this.style = zoseiStyleFunction()
  this.maxResolution = 152.874057 //zoom10
  // this.declutter = true
  // this.overflow = true
}
export const zoseiSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A54-2023.html' target='_blank'>国土数値情報</a>"
export const zouseiMvtObj = {};
for (let i of mapsStr) {
  zouseiMvtObj[i] = new VectorTileLayer(new zoseiMvt())
}
// ----------------------------------------------------------------------------
function zoseiRaster() {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/zosei/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    minZoom: 0,
    maxZoom: 11
  })
  this.minResolution = 152.874057 //zoom10
}
// -----------------------------------------------------
export const zoseiRasterObj = {};
for (let i of mapsStr) {
  zoseiRasterObj[i] = new TileLayer(new zoseiRaster())
}
export const zoseiObj = {};
for (let i of mapsStr) {
  zoseiObj[i] = new LayerGroup({
    layers: [
      zoseiRasterObj[i],
      zouseiMvtObj[i]
    ]
  })
  zoseiObj[i].values_['pointer'] = true
  zoseiObj[i].values_['multiply'] = true
}
// -------------------------------------------------------------------
function zoseiStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    let color
    let text
    switch (prop.A54_001) {
      case '1':
        color = 'rgb(179,253,165)'
        text = '谷埋め型'
        break
      case '2':
        color = 'rgb(155,155,248)'
        text = '腹付け型'
        break
      case '9':
        color = 'rgb(0,255,0)'
        text = '区分をしていない'
        break
    }
    const polygonStyle = new Style({
      fill: new Fill({
        color: color
        // color: 'rgba(0,0,0,0)'
      }),
      stroke: new Stroke({
        color: "black",
        width: 1
      })
    })
    const textStyle = new Style({
      text: new Text({
        font: "12px sans-serif",
        text: text,
        fill: new Fill({
          color: 'black'
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(polygonStyle);
    if (zoom >= 13)styles.push(textStyle);
    return styles;
  }
}
// ----------------------------------------------------------------------------
function iryoMvt(){
  this.name = 'iryoMvt'
  this.className = 'iryoMvt'
  this.source = new VectorTileSource({
    crossOrigin: 'Anonymous',
    format: new MVT(),
    maxZoom:14,
    url: "https://kenzkenz3.xsrv.jp/mvt/iryo/{z}/{x}/{y}.mvt"
  });
  this.style = iryoStyleFunction()
  this.maxResolution = 152.874057 //zoom10
  // this.declutter = true
  // this.overflow = true
}
export const iryoSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P04-v3_0.html' target='_blank'>国土数値情報</a>"
export const iryoMvtObj = {};
for (let i of mapsStr) {
  iryoMvtObj[i] = new VectorTileLayer(new iryoMvt())
}
function iryoRaster () {
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/iryoraster/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 11
  })
  this.minResolution = 152.874057 //zoom10
}
export const iryoRasterObj = {};
for (let i of mapsStr) {
  iryoRasterObj[i] = new TileLayer(new iryoRaster())
}
export const iryoObj = {};
for (let i of mapsStr) {
  iryoObj[i] = new LayerGroup({
    layers: [
      iryoMvtObj[i],
      iryoRasterObj[i]
    ]
  })
  iryoObj[i].values_['pointer'] = true
}
//--------------------------
function iryoStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution)
    const prop = feature.getProperties()
    let text = prop.P04_002
    const styles = []
    let font
    if (zoom >= 18) {
      font = "20px sans-serif"
    } else {
      font = "14px sans-serif"
      text = text.trunc(8)
    }
    let color = 'red'
    switch (prop.P04_001) {
      case 1:
        color = 'red'
        break
      case 2:
        color = 'green'
        break
      case 3:
        color = 'blue'
        break
    }
    const iconStyle = new Style({
      image: new Icon({
        // anchor: [0.5, 1],
        src: require('@/assets/icon/whitecircle.png'),
        color: color,
        scale: zoom>=15 ? 1.5: 1
      })
    })
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        offsetY: 18,
        stroke: new Stroke({
          color: "white",
          width: 3
        })
      })
    });
    styles.push(iconStyle);
    if(zoom>=16) {
      styles.push(textStyle);
    }
    return styles;
  }
}
// ----------------------------------------------------------------------------
function yochienHoikuen(){
  this.name = 'yochienHoikuen'
  this.className = 'yochienHoikuen'
  this.source = new VectorTileSource({
    crossOrigin: 'Anonymous',
    format: new MVT(),
    maxZoom:14,
    url: "https://kenzkenz3.xsrv.jp/mvt/yochienhoikuen/{z}/{x}/{y}.mvt"
  });
  this.style = yochienHoikuenStyleFunction()
  this.maxResolution = 152.874057 //zoom10
  // this.declutter = true
  // this.overflow = true
}
export const yochienHoikuenSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P14-v2_1.html' target='_blank'>国土数値情報</a>" +
    "<br><a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P29-v2_0.html' target='_blank'>国土数値情報</a>";
export const yochienHoikuenMvtObj = {};
for (let i of mapsStr) {
  yochienHoikuenMvtObj[i] = new VectorTileLayer(new yochienHoikuen())
}
function yochienHoikuenRaster () {
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/yochienhoikuenraster/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 11
  })
  this.minResolution = 152.874057 //zoom10
}
export const yochienHoikuenRasterObj = {};
for (let i of mapsStr) {
  yochienHoikuenRasterObj[i] = new TileLayer(new yochienHoikuenRaster())
}

export const yochienHoikuenObj = {};
for (let i of mapsStr) {
  yochienHoikuenObj[i] = new LayerGroup({
    layers: [
      yochienHoikuenMvtObj[i],
      yochienHoikuenRasterObj[i],
    ]
  })
  yochienHoikuenObj[i].values_['pointer'] = true
}
//--------------------------
function yochienHoikuenStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    let text
    if (prop.P29_001) { // 幼稚園
      text = prop.P29_004
    } else {
      text = prop.P14_008
    }
    const styles = [];
    let font
    if (zoom >= 18) {
      font = "20px sans-serif"
    } else {
      font = "14px sans-serif"
      text = text.trunc(8)
    }
    const iconStyle = new Style({
      image: new Icon({
        // anchor: [0.5, 1],
        src: require('@/assets/icon/whitecircle.png'),
        color: 'green',
        scale: zoom>=15 ? 1.5: 1
      })
    })
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        offsetY: 18,
        stroke: new Stroke({
          color: "white",
          width: 3
        })
      })
    });
    styles.push(iconStyle);
    if(zoom>=16) {
      styles.push(textStyle);
    }
    return styles;
  }
}
// ----------------------------------------------------------------------------
function ssdsCity (mapName) {
  this.useInterimTilesOnError = false
  this.name = 'ssdsPref'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/city.geojson',
    format: new GeoJSON()
  });
  this.style = ssdsStyleFunction(mapName,'city')
}
export const citySumm = "<a href='' target='_blank'></a>";
export const ssdsCityObj = {};
for (let i of mapsStr) {
  ssdsCityObj[i] = new VectorLayer(new ssdsCity(i))
}
// ----------------------------------------------------------------------------
function ssdsPref (mapName) {
  this.useInterimTilesOnError = false
  this.name = 'ssdsPref'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/pref.geojson',
    format: new GeoJSON()
  });
  this.style = ssdsStyleFunction(mapName,'pref')
}
export const prefSumm = "<a href='' target='_blank'></a>";
export const ssdsPrefObj = {};
for (let i of mapsStr) {
  ssdsPrefObj[i] = new VectorLayer(new ssdsPref(i))
}
// -----------------------------------------------------------------------------------
function ssdsStyleFunction(mapName,prefOrCity) {
  return function (feature, resolution) {
    const zoom = getZoom(resolution)
    const prop = feature.getProperties()
    let area
    if (prefOrCity === 'pref') {
      area = ('00' + prop.コード).slice(-2) + "000"
    } else {
      area = prop.コード
    }
    let ssdsData = store.state.info.ssdsData[mapName]
    // console.log(ssdsData)
    const jyuni = ssdsData.findIndex((v) => {
      return v['@area'] === area
    }) + 1
    const max = d3.max(ssdsData, function(d){ return Number(d['$']) })
    const min = d3.min(ssdsData, function(d){ return Number(d['$']) })
    // console.log(min,max)
    let d3Color
    if (min>0) {
      d3Color = d3.scaleLinear()
          .domain([min, max])
          .range(["white", "red"])
    } else {
      d3Color = d3.scaleLinear()
          .domain([min,0, max])
          .range(['blue',"white", "red"])
    }
    const result = ssdsData.find((v) => {
      return v['@area'] === area
    })
    let rgba = 'rgba(0,0,0,0)'
    let value = ''
    let unit = ''
    if (result) {
      value = Number(result['$'])
      unit = result['@unit']
      // console.log(value)
      const rgb = d3.rgb(d3Color(value))
      rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)"
      // console.log(rgba)
    }
    // console.log(area)
    const styles = [];
    const polygonStyle = new Style({
      fill: new Fill({
        color: rgba
        // color: 'red'
      }),
      stroke: new Stroke({
        color: 'black',
        width: 1
      })
    })
    const text = jyuni + '位' + '\n' + value + unit
    feature.setProperties({'value':text})
    let font
    font = "14px sans-serif"
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: prop.自治体名 + '\n' +text,
        fill: new Fill({
          color: "black"
        }),
        Placement: 'point',
        overflow: 'true',
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
      })
    })
    styles.push(polygonStyle);
    if (prefOrCity === 'pref') {
      if (zoom>=8) styles.push(textStyle);
    } else {
      if (zoom>=11) styles.push(textStyle);
    }
    return styles;
  }
}
// 500mメッシュ-------------------------------------------------------------
let mesh500MaxResolution
if (window.innerWidth > 1000) {
  mesh500MaxResolution = 305.748113 //zoom9
} else {
  mesh500MaxResolution = 152.874057 //zoom10
}
function Mesh500(mapName){
  this.name = 'mesh500'
  this.className = 'mesh500'
  this.source = new VectorTileSource({
    crossOrigin: 'Anonymous',
    format: new MVT(),
    maxZoom:14,
    url: "https://kenzkenz3.xsrv.jp/mvt/500mmesh/{z}/{x}/{y}.mvt"
  });
  this.style = mesh500ColorFunction(mapName)
  this.maxResolution = mesh500MaxResolution
  this.declutter = true
  this.overflow = true
}
export  const mesh500Obj = {};
for (let i of mapsStr) {
  mesh500Obj[i] = new VectorTileLayer(new Mesh500((i)))
}
export const mesh500ObjSumm = "" +
    "<a href='https://www.e-stat.go.jp/gis/statmap-search?page=8&type=1&toukeiCode=00200521&toukeiYear=2020&aggregateUnit=H&serveyId=H002005112020&statsId=T001141&datum=2011' target='_blank'>e-Stat</a>";
// -----------------------------------------------------------------------------------
function mesh500ColorFunction(mapName) {
  return function (feature, resolution) {
    const jinkoMax = Number(store.state.info.jinko500m[mapName])
    const paintCheck = store.state.info.paintCheck500m[mapName]
    // const jinkoMax = 15000
    const mesh100Color = d3.scaleLinear()
        .domain([
          0,
          jinkoMax/3.5,
          jinkoMax/1.75,
          jinkoMax*30/35,
          jinkoMax])
        .range(["white", "red","#880000",'maroon','black']);
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const rgb = d3.rgb(mesh100Color(prop.jinko))
    let rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)"
    if (!paintCheck) rgba = 'rgba(0,0,0,0)'
    const polygonStyle = new Style({
      fill: new Fill({
        color: rgba
      }),
      stroke: new Stroke({
        color: zoom >= 14 ? 'red' : 'rgba(0,0,0,0)',
        width: 1
      })
    })
    const text = prop.jinko + '人'
    let font
    if (zoom>=18) {
      font = "26px sans-serif"
    } else if (zoom>=16) {
      font = "20px sans-serif"
    } else if (zoom>=15) {
      font = "14px sans-serif"
    } else if (zoom >= 14) {
      font = "8px sans-serif"
    }
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        fill: new Fill({
          color: "black"
        }),
        Placement: 'point',
        overflow: 'true',
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
      })
    })
    styles.push(polygonStyle)
    if (zoom>=14) styles.push(textStyle)
    return styles
  }
}
// 250mメッシュ-------------------------------------------------------------
let mesh250MaxResolution
if (window.innerWidth > 1000) {
  mesh250MaxResolution = 152.874057 //zoom10
} else {
  mesh250MaxResolution = 76.437028 //zoom11
}
function Mesh250(mapName){
  this.name = 'mesh250'
  this.className = 'mesh250'
  this.source = new VectorTileSource({
    crossOrigin: 'Anonymous',
    format: new MVT(),
    maxZoom:14,
    url: "https://kenzkenz3.xsrv.jp/mvt/250mmesh/{z}/{x}/{y}.mvt"
  });
  this.style = mesh250ColorFunction(mapName)
  this.maxResolution = mesh250MaxResolution
  this.declutter = true
  this.overflow = true
}
export  const mesh250Obj = {};
for (let i of mapsStr) {
  mesh250Obj[i] = new VectorTileLayer(new Mesh250((i)))
}
export const mesh250ObjSumm = "" +
    "<a href='https://www.e-stat.go.jp/gis/statmap-search?page=1&type=1&toukeiCode=00200521&toukeiYear=2020&aggregateUnit=Q&serveyId=Q002005112020&statsId=T001142' target='_blank'>e-Stat</a>";
// -----------------------------------------------------------------------------------
function mesh250ColorFunction(mapName) {
  return function (feature, resolution) {
    const jinkoMax = Number(store.state.info.jinko250m[mapName])
    const paintCheck = store.state.info.paintCheck250m[mapName]
    // const jinkoMax = 3000
    const mesh100Color = d3.scaleLinear()
        .domain([
          0,
          jinkoMax/3.5,
          jinkoMax/1.75,
          jinkoMax*30/35,
          jinkoMax])
        .range(["white", "red","#880000",'maroon','black']);
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const rgb = d3.rgb(mesh100Color(prop.jinko))
    let rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)"
    if (!paintCheck) rgba = 'rgba(0,0,0,0)'
    const polygonStyle = new Style({
      fill: new Fill({
        color: rgba
      }),
      stroke: new Stroke({
        color: zoom >= 14 ? 'red' : 'rgba(0,0,0,0)',
        width: 1
      })
    })
    const text = prop.jinko + '人'
    let font
    if (zoom>=18) {
      font = "26px sans-serif"
    } else if (zoom>=17) {
      font = "20px sans-serif"
    } else if (zoom>=16) {
      font = "14px sans-serif"
    } else if (zoom >= 15) {
      font = "8px sans-serif"
    }
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        fill: new Fill({
          color: "black"
        }),
        Placement: 'point',
        overflow: 'true',
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
      })
    })
    styles.push(polygonStyle);
    if (zoom>=15) styles.push(textStyle);
    return styles;
  }
}
// 100mメッシュ-------------------------------------------------------------
let mesh100MaxResolution
if (window.innerWidth > 1000) {
  mesh100MaxResolution = 19.109257 //zoom13
} else {
  mesh100MaxResolution = 19.109257 //zoom13
  // mesh100MaxResolution = 9.554629 //zoom14
}
function Mesh100(mapName){
  this.name = 'mesh100'
  this.className = 'mesh100'
  this.source = new VectorTileSource({
    crossOrigin: 'Anonymous',
    format: new MVT(),
    maxZoom:14,
    url: "https://kenzkenz3.xsrv.jp/mvt/100mmesh/{z}/{x}/{y}.mvt"
  });
  this.style = mesh100ColorFunction(mapName)
  this.maxResolution = mesh100MaxResolution
  this.declutter = true
  this.overflow = true
}
export  const mesh100Obj = {};
for (let i of mapsStr) {
  mesh100Obj[i] = new VectorTileLayer(new Mesh100((i)))
}
export const mesh100ObjSumm = "<div style='font-size: small'>" +
    "令和2年国勢調査の250mメッシュ集計の人口を100mメッシュに按分したデータです。" +
    "このデータは、簡易な方法で人口を按分したものであり、当該100mメッシュの実際の人口を示しているものではなく、" +
    "広い範囲での人口分布の概要を見る目的、一定範囲の人口を建築物面積により簡易に按分集計する目的で利用して下さい。" +
    "ライセンスはCC-BYとします。" +
    "<br>" +
    "<a href='https://gtfs-gis.jp/teikyo/' target='_blank'>地域分析に有用なデータの提供</a></div>";
// -----------------------------------------------------------------------------------
function mesh100ColorFunction(mapName) {
  return function (feature, resolution) {
    const jinkoMax = Number(store.state.info.jinko100m[mapName])
    const paintCheck = store.state.info.paintCheck100m[mapName]
    // const jinkoMax = 1300
    const mesh100Color = d3.scaleLinear()
        .domain([
          0,
          jinkoMax/3.5,
          jinkoMax/1.75,
          jinkoMax*30/35,
          jinkoMax])
        .range(["white", "red","#880000",'maroon','black']);
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const rgb = d3.rgb(mesh100Color(prop.PopT))
    let rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)"
    if (!paintCheck) rgba = 'rgba(0,0,0,0)'
    const polygonStyle = new Style({
      fill: new Fill({
        color: rgba
      }),
      stroke: new Stroke({
        color: zoom >= 15 ? 'red' : 'rgba(0,0,0,0)',
        width: 1
      })
    })
    const text = Math.round(prop.PopT) + '人'
    let font
    if (zoom>=19) {
      font = "26px sans-serif"
    } else if (zoom>=18) {
      font = "20px sans-serif"
    } else if (zoom>=17) {
      font = "14px sans-serif"
    } else if (zoom >= 16) {
      font = "8px sans-serif"
    }
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        fill: new Fill({
          color: "black"
        }),
        Placement: 'point',
        overflow: 'true',
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
      })
    })
    styles.push(polygonStyle);
    if (zoom>=16) styles.push(textStyle);
    return styles;
  }
}
// 1kmメッシュ-------------------------------------------------------------
let mesh1kMaxResolution
if (window.innerWidth > 1000) {
  mesh1kMaxResolution = 611.496226 //zoom8
} else {
  mesh1kMaxResolution = 300 //zoom9?
  // mesh1kMaxResolution = 611.496226 //zoom8
}
function Mesh1km(mapName){
  this.name = 'mesh1km'
  this.className = 'mesh1km'
  this.source = new VectorTileSource({
    crossOrigin: 'Anonymous',
    format: new MVT(),
    maxZoom:14,
    url: "https://kenzkenz3.xsrv.jp/mvt/1kmesh3/{z}/{x}/{y}.mvt"
  });
  this.style = mesh1kColorFunction(mapName)
  // this.style = mesh1kColorFunctionRonen()
  this.maxResolution = mesh1kMaxResolution
  this.declutter = true
  this.overflow = true
}
export  const mesh1kmObj = {};
for (let i of mapsStr) {
  mesh1kmObj[i] = new VectorTileLayer(new Mesh1km((i)))
}
export const mesh1kmObjSumm = "<a href='https://www.e-stat.go.jp/gis/statmap-search?page=8&type=1&toukeiCode=00200521&toukeiYear=2020&aggregateUnit=S&serveyId=S002005112020&statsId=T001100&prefCode=01%2C02%2C03%2C04%2C05%2C06%2C07%2C08%2C09%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C36%2C37%2C38%2C39%2C40%2C41%2C42%2C43%2C44%2C45%2C46%2C47&datum=2000' target='_blank'>e-Stat</a>";
// -----------------------------------------------------------------------------------
function mesh1kColorFunction(mapName) {
  return function (feature, resolution) {
    const jinkoMax = Number(store.state.info.jinko[mapName])
    const paintCheck = store.state.info.paintCheck1k[mapName]
    const mesh1kColor = d3.scaleLinear()
        // .domain([0,10000,20000,30000,33000])
        .domain([
            0,
          jinkoMax/3.5,
          jinkoMax/1.75,
          jinkoMax*30/35,
          jinkoMax])
        // .domain([0,30000])
        .range(["white", "red","#880000",'maroon','black']);
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const rgb = d3.rgb(mesh1kColor(prop.jinko))
    let rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)"
    if (!paintCheck) rgba = 'rgba(0,0,0,0)'
    const polygonStyle = new Style({
      fill: new Fill({
        color: rgba
        // color: 'rgba(0,0,0,0)'
      }),
      stroke: new Stroke({
        color: zoom >= 12 ? 'red' : 'rgba(0,0,0,0)',
        width: 1
      })
    })
    const text = String(ru2(prop.jinko)) + '人'
    const textStyle = new Style({
      text: new Text({
        font: zoom <= 15 ? "14px sans-serif" : "20px sans-serif",
        text: text,
        fill: new Fill({
          color: "black"
        }),
        Placement: 'point',
        overflow: 'true',
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
      })
    })
    styles.push(polygonStyle);
    if (zoom>=14 && prop.jinko) styles.push(textStyle);
    return styles;
  }
}

//小地域------------------------------------------------------------------------------------------------
let syochiikiMaxResolution
if (window.innerWidth > 1000) {
  syochiikiMaxResolution = 76.437028 //zoom11
} else {
  syochiikiMaxResolution = 38.218514 //zoom12
}
function Syochiiki2020(){
  this.name = 'syochiki2020'
  this.className = 'syochiki2020'
  this.source = new VectorTileSource({
    crossOrigin: 'Anonymous',
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz3.xsrv.jp/mvt/syochiiki/2020/{z}/{x}/{y}.mvt"
  });
  this.style = syochiikiStyleFunction()
  this.maxResolution = syochiikiMaxResolution
  this.declutter = true
  this.overflow = true
}
export  const syochiiki2020MvtObj = {};
for (let i of mapsStr) {
  syochiiki2020MvtObj[i] = new VectorTileLayer(new Syochiiki2020())
}
export const syochiiki2020Summ = "<a href='https://www.e-stat.go.jp/stat-search/files?page=1&toukei=00200521&tstat=000001136464&cycle=0&tclass1=000001136472' target='_blank'>e-StatI</a>";
// -------------------------------------------------------------------
function syochiikiStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const polygonStyle = new Style({
      fill: new Fill({
        // color: rgba
        color: 'rgba(0,0,0,0)'
      }),
      stroke: new Stroke({
        color: "red",
        width: 2
      })
    })
    let text
    if (zoom>15) {
      text = prop.S_NAME + '\n' + String(ru2(prop.JINKO)) + '人'
    } else {
      text = String(ru2(prop.JINKO)) + '人'
    }
    const textStyle = new Style({
      text: new Text({
        font: "16px sans-serif",
        text: text,
        fill: new Fill({
          color: "red"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(polygonStyle);
    styles.push(textStyle);
    return styles;
  }
}
// ---------------------------------------------------------------------
function Syochiiki2020Raster () {
  this.preload = Infinity
  this.source = new XYZ({
    url: "https://kenzkenz3.xsrv.jp/mvt/syochiiki/2020/raster/{z}/{x}/{y}.png",
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 11
  })
  this.minResolution = 38.218514 //zoom12
}
export const syochiiki2020RasterObj = {};
for (let i of mapsStr) {
  syochiiki2020RasterObj[i] = new TileLayer(new Syochiiki2020Raster())
}
export const syochiiki2020Obj = {};
for (let i of mapsStr) {
  syochiiki2020Obj[i] = new LayerGroup({
    layers: [
      syochiiki2020MvtObj[i],
      // syochiiki2020RasterObj[i],
    ]
  })
}

// //H28小学校区------------------------------------------------------------------------------------------------
// function SyougakkoukuH28(){
//   this.name = 'syougakkoukuH28'
//   this.source = new VectorTileSource({
//     format: new MVT(),
//     maxZoom:15,
//     url: "https://kenzkenz.github.io/h28syougaku/{z}/{x}/{y}.mvt"
//   });
//   this.style = syougakkoukuStyleFunction(28);
// }
// export  const syougakkoukuH28Obj = {};
// for (let i of mapsStr) {
//   syougakkoukuH28Obj[i] = new VectorTileLayer(new SyougakkoukuH28())
// }
// export const syougakkoukuH28Summ = "<a href='http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A27-v2_1.html' target='_blank'>国土数値情報　小学校区データ</a>";
//
// //H22小学校区------------------------------------------------------------------------------------------------
// function SyougakkoukuH22(){
//   this.name = 'syougakkoukuH22'
//   this.source = new VectorTileSource({
//     format: new MVT(),
//     maxZoom:15,
//     url: "https://kenzkenz.github.io/h22syougaku/{z}/{x}/{y}.mvt"
//   });
//   this.style = syougakkoukuStyleFunction(22);
// }
// export  const syougakkoukuH22Obj = {};
// for (let i of mapsStr) {
//   syougakkoukuH22Obj[i] = new VectorTileLayer(new SyougakkoukuH22())
// }
// export const syougakkoukuH22Summ = "<a href='http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A27-v2_1.html' target='_blank'>国土数値情報　小学校区データ</a>";

//R03小学校区------------------------------------------------------------------------------------------------
function Syougakkouku(){
  this.name = 'syougakkouku'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/syougaku/{z}/{x}/{y}.mvt"
  });
  this.style = syougakkoukuStyleFunction(3);
  this.maxResolution = 611.496226 //zoom8
}
export  const syougakkoukuObj = {};
for (let i of mapsStr) {
  syougakkoukuObj[i] = new VectorTileLayer(new Syougakkouku())
}
export const syougakkoukuSumm = "<a href='http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A27-v2_1.html' target='_blank'>国土数値情報　小学校区データ</a>";

function SyougakkoukuR03xyz () {
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/gakku/syougakkou-r03/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 11
  })
  this.minResolution = 611.496226 //zoom8
}
export const syougakkoukuR03Obj = {};
for (let i of mapsStr) {
  syougakkoukuR03Obj[i] = new TileLayer(new SyougakkoukuR03xyz())
}

export const syougakkouku0Obj = {};
for (let i of mapsStr) {
  syougakkouku0Obj[i] = new LayerGroup({
    layers: [
      syougakkoukuR03Obj[i],
      syougakkoukuObj[i],
    ]
  })
  syougakkouku0Obj[i].values_['pointer'] = true
}

// ----------------------------------------------------------------------
// 0から100の配列を作成する。
const domain = [...Array(1000)].map((_, i) => i)
const d3OridinalColor = d3.scaleOrdinal()
    .domain(domain)
    .range(["red", "green", "blue", "darkcyan", "coral"
      , "wheat", "silver", "burlywood"
      , "lavender", "teal", "tomato", "gray", "darkslategray"
      , "orangered", "darkgray", "darkgreen"
      , "skyblue", "chartreuse", "sienna", "orchid", "lightblue"
      , "aquamarine", "sandybrown", "darkorange", "thistle"
      , "dodgerblue", "lightgreen", "goldenrod", "magenta", "cornflowerblue"
      , "crimson", "steelblue", "mediumvioletred"
      , "royalblue", "khaki", "deeppink", "midnightblue"
      , "mediumseagreen", "hotpink", "navy", "mediumaquamarine", "gold"
      , "palevioletred", "darkseagreen", "orange", "pink", "mediumblue"
      , "springgreen", "peru", "fuchsia", "deepskyblue", "darkgoldenrod"
      , "violet", "lightskyblue", "lawngreen", "chocolate", "plum"
      , "greenyellow", "saddlebrown", "mediumorchid", "powderblue", "lime"
      , "maroon", "darkorchid", "paleturquoise", "limegreen", "darkred"
      , "darkviolet", "yellowgreen", "darkmagenta", "cyan"

    ]);
function syougakkoukuStyleFunction(year) {
  return function (feature, resolution) {
    const prop = feature.getProperties()
    const geoType = feature.getGeometry().getType()
    const zoom = getZoom(resolution)
    let text = ''
    if (year === 22 || year === 28) {
      text = prop["A27_003"];
    } else if (year === 3) {
      text = prop["P29_004"]
    } else if (year === 30) {
      text = prop["P29_004"]
    } else if (year === 280) {
      text = prop["A32_003"]
    } else {
      text = prop["P29_005"];
    }
    let rgb
    let rgba
    if (prop["A27_005"] || prop["A32_005"] || prop["A32_006"]) {
      const id = Math.round(Number(prop["id"].toString().slice(-3)))
      // const id = Number(prop["id"])
      // rgb = d3.rgb(d3syougakkoukuColor(Number(prop["id"])));
      rgb = d3.rgb(d3OridinalColor(id))
      rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)"
    } else {
      rgba = "rgba(255,255,255,0)"
    }
    let font
    if (zoom <= 14) {
      font = "12px sans-serif"
    } else {
      font = "20px sans-serif"
    }
    let style
    switch (geoType) {
      case "MultiPoint":
      case "Point":
        if (zoom < 12) break;
        style = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: require('@/assets/icon/whitepin.png'),
            color: 'black'
          }),
          stroke: new Stroke({
            color: "white",
            width: 1
          }),
          text: new Text({
            font: font,
            text: text,
            offsetY: 10,
            stroke: new Stroke({
              color: "white",
              width: 3
            })
          })
        });
        break;
      case "Polygon":
      case "MultiPolygon":
        if (zoom > 10) {
          style = new Style({
            fill: new Fill({
              color: rgba
            }),
            stroke: new Stroke({
              color: "black",
              width: 2
            }),
            zIndex: 0
          });
        } else {
          style = new Style({
            fill: new Fill({
              color: rgba
            }),
            zIndex: 0
          });
        }
        break;
      default:
    }
    return style;
  }
}
// //h28中学校区---------------------------------------------------------------------------------------
// function TyuugakkoukuH28(){
//   this.name = 'tyuugakkoukuH28'
//   this.source = new VectorTileSource({
//     format: new MVT(),
//     maxZoom:15,
//     url: "https://kenzkenz.github.io/h28tyuugaku/{z}/{x}/{y}.mvt"
//   });
//   this.style = syougakkoukuStyleFunction(280);
// }
// export  const tyuugakkoukuH28Obj = {};
// for (let i of mapsStr) {
//   tyuugakkoukuH28Obj[i] = new VectorTileLayer(new TyuugakkoukuH28())
// }
// export const tyuugakkoukuH28Summ = "<a href='http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A32-v2_0.html' target='_blank'>国土数値情報　中学校区データ</a>";
//
// //h25中学校区---------------------------------------------------------------------------------------
// function TyuugakkoukuH25(){
//   this.name = 'tyuugakkoukuH25'
//   this.source = new VectorTileSource({
//     format: new MVT(),
//     maxZoom:15,
//     url: "https://kenzkenz.github.io/h25tyuugaku/{z}/{x}/{y}.mvt"
//   });
//   this.style = syougakkoukuStyleFunction(250);
// }
// export  const tyuugakkoukuH25Obj = {};
// for (let i of mapsStr) {
//   tyuugakkoukuH25Obj[i] = new VectorTileLayer(new TyuugakkoukuH25())
// }
// export const tyuugakkoukuH25Summ = "<a href='http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A32-v2_0.html' target='_blank'>国土数値情報　中学校区データ</a>";

//R03中学校区---------------------------------------------------------------------------------------
function Tyuugakkouku(){
  this.name = 'tyuugakkouku'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/tyuugaku/{z}/{x}/{y}.mvt"
  });
  this.style = syougakkoukuStyleFunction(30);
  this.maxResolution = 611.496226 //zoom8
}
export  const tyuugakkoukuObj = {};
for (let i of mapsStr) {
  tyuugakkoukuObj[i] = new VectorTileLayer(new Tyuugakkouku())
}
export const tyuugakkoukuSumm = "<a href='http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A32-v2_0.html' target='_blank'>国土数値情報　中学校区データ</a>";

function CyuugakkoukuR03xyz () {
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/gakku/cyuugakkou-r03/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 8
  })
  this.minResolution = 611.496226 //zoom8
  // this.minResolution = 38.218514 //zoom12
}
export const cyuugakkoukuR03Obj = {};
for (let i of mapsStr) {
  cyuugakkoukuR03Obj[i] = new TileLayer(new CyuugakkoukuR03xyz())
}

export const tyuugakkouku0Obj = {};
for (let i of mapsStr) {
  tyuugakkouku0Obj[i] = new LayerGroup({
    layers: [
      cyuugakkoukuR03Obj[i],
      tyuugakkoukuObj[i],
    ]
  })
  tyuugakkouku0Obj[i].values_['pointer'] = true
}









// 夜の明かり---------------------------------------------------------------------------------------
function SekaiLight () {
  this.name = 'japanLight'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:14,
    url: "https://kenzkenz.github.io/sekai-light/{z}/{x}/{y}.mvt"
  });
  this.style = japanLightStyleFunction();
  // this.useInterimTilesOnError = false
}
export  const japanLightObj = {};
for (let i of mapsStr) {
  japanLightObj[i] = new VectorTileLayer(new SekaiLight())
}
export const japanLightSumm = "<div style='width: 500px'>世界メッシュ研究所さんの世界メッシュコードを使用しています。<hr>本3次世界メッシュ夜間光統計はNASAが提供する全球夜間光画像(2012年)を元に世界メッシュ研究所が作成したものです。夜間光データの源データはアメリカ航空宇宙局(NASA)に帰属します。データの品質や信頼性について世界メッシュ研究所、NASAが一切保証するものではなく、利用者が本データセットの利用によって生じた損害または損失について世界メッシュ研究所、NASAは一切の責任を負うものではありません。Data courtesy Marc Imhoff of NASA GSFC and Christopher Elvidge of NOAA NGDC. Image by Craig Mayhew and Robert Simmon, NASA GSFC. (c) NASA </div>"
//----------------------------------------------------------------------------------
function  getZoom(resolution)  {
  let zoom = 0;
  let r = 156543.03390625; // resolution for zoom 0
  while (resolution < r) {
    r /= 2;
    zoom++;
    if (resolution > r) {
      return zoom;
    }
  }
  return zoom; // resolution was greater than 156543.03390625 so return 0
}
//----------------------------------------------------------------------------------
function japanLightStyleFunction () {
  // MVTタイルは７〜１４まで詳細 １から６は簡易
  const d3Color = d3.interpolateLab("black","yellow");
  return function(feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const text = prop["light"];
    let light100
    if(zoom>=8) {
      const lightNum = Number(prop["light"]);
      light100 = lightNum / 255;
    }else{
      light100 = Number(prop["rate"]) / 10;
    }
    const rgb = d3.rgb(d3Color(light100));
    let rgba;
    if(zoom>=8) {
      if (light100 === 1) {
        rgba = "rgba(255,165,0,0.8)";
      } else {
        rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ", 0.8 )";
      }
    }else{
      rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ", 0.8 )";
    }
    const styles = [];
    const fillStyle =
      new Style({
        fill: new Fill({
          color: rgba
        })
      });
    const strokeStyle =
      new Style({
        stroke: new Stroke({
          color: "silver",
          width: 1
        })
      });
    const textStyle =
      new Style({
        text: new Text({
          font: "14px sans-serif",
          text: text,
          placement:"point",
          fill: new Fill({
            color: "black"
          }),
          stroke: new Stroke({
            color: "white",
            width: 3
          }),
          exceedLength:true
        })
      });
    styles.push(fillStyle);
    if(zoom>=13) {
      styles.push(strokeStyle);
      styles.push(textStyle);
    }
    return styles;
  };
}
// DID地区------------------------------------------
function DidH27(){
  this.name="didh27";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/didh27/{z}/{x}/{y}.mvt"
    // url: "https://kenzkenz.xsrv.jp/mvt/didh27/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(27);
}
export  const didH27Obj = {};
for (let i of mapsStr) {
  didH27Obj[i] = new VectorTileLayer(new DidH27())
}
export const didH27Summ = "H27の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"
// h22人口集中地区---------------------------------------
function DidH22(){
  this.name="didh22";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/didh22/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(22);
}
export  const didH22Obj = {};
for (let i of mapsStr) {
  didH22Obj[i] = new VectorTileLayer(new DidH22())
}
export const didH22Summ = "H22の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"
// s35人口集中地区---------------------------------------
function DidS35(){
  this.name="dids35";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/dids35/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(35);
}
export  const didS35Obj = {};
for (let i of mapsStr) {
  didS35Obj[i] = new VectorTileLayer(new DidS35())
}
export const didS35Summ = "s35の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"
// s40人口集中地区---------------------------------------
function DidS40(){
  this.name="dids40";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/dids40/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(40);
}
export  const didS40Obj = {};
for (let i of mapsStr) {
  didS40Obj[i] = new VectorTileLayer(new DidS40())
}
export const didS40Summ = "s40の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"

// s45人口集中地区---------------------------------------
function DidS45(){
  this.name="dids45";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/dids45/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(45);
}
export  const didS45Obj = {};
for (let i of mapsStr) {
  didS45Obj[i] = new VectorTileLayer(new DidS45())
}
export const didS45Summ = "s45の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"
// s50人口集中地区---------------------------------------
function DidS50(){
  this.name="dids50";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/dids50/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(55);
}
export  const didS50Obj = {};
for (let i of mapsStr) {
  didS50Obj[i] = new VectorTileLayer(new DidS50())
}
export const didS50Summ = "s50の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"

// s55人口集中地区---------------------------------------
function DidS55(){
  this.name="dids55";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/dids55/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(55);
}
export  const didS55Obj = {};
for (let i of mapsStr) {
  didS55Obj[i] = new VectorTileLayer(new DidS55())
}
export const didS55Summ = "s55の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"
// s60人口集中地区---------------------------------------
function DidS60(){
  this.name="dids60";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/dids60/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(60);
}
export  const didS60Obj = {};
for (let i of mapsStr) {
  didS60Obj[i] = new VectorTileLayer(new DidS60())
}
export const didS60Summ = "s60の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"

// h02人口集中地区---------------------------------------
function DidH02(){
  this.name="didh02";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/didh02/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(2);
}
export  const didH02Obj = {};
for (let i of mapsStr) {
  didH02Obj[i] = new VectorTileLayer(new DidH02())
}
export const didH02Summ = "h02の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"
// h02人口集中地区---------------------------------------
function DidH07(){
  this.name="didh07";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/didh07/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(2);
}
export  const didH07Obj = {};
for (let i of mapsStr) {
  didH07Obj[i] = new VectorTileLayer(new DidH07())
}
export const didH07Summ = "h07の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"

// h12人口集中地区---------------------------------------
function DidH12(){
  this.name="didh12";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/didh12/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(2);
}
export  const didH12Obj = {};
for (let i of mapsStr) {
  didH12Obj[i] = new VectorTileLayer(new DidH12())
}
export const didH12Summ = "h12の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"
// h17人口集中地区---------------------------------------
function DidH17(){
  this.name="didh17";
  this.source = new VectorTileSource({
    overlaps:false,
    transition:0,
    format: new MVT(),
    crossOrigin: 'Anonymous',
    maxZoom:13,
    url: "https://kenzkenz.github.io/didh17/{z}/{x}/{y}.mvt"
  });
  this.style = didmvtStyleFunction(2);
}
export  const didH17Obj = {};
for (let i of mapsStr) {
  didH17Obj[i] = new VectorTileLayer(new DidH17())
}
export const didH17Summ = "h17の人口集中地区です。<br>出典＝<a href='https://nlftp.mlit.go.jp/ksj/' target='_blank'>国土数値情報</a>"

// -------------------------------------------------------------
 function didmvtStyleFunction (year) {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    const zoom = getZoom(resolution);
    const rgba = "rgba(75,0,130,0.5)";
    const styles = [];
    let text
    if (year === 27) {
      text = Number(prop["人口"]).toLocaleString()+"人";
    } else {
      text = Number(prop["A16_005"]).toLocaleString()+"人";
    }
    const fillStyle = new Style({
      fill: new Fill({
        color: rgba
      })
    });
    function strokeStyle1(width){
      const strokeStyle0 = new Style({
        stroke: new Stroke({
          color: "white",
          width: width
        })
      });
      return strokeStyle0;
    }
    const textStyle = new Style({
      text: new Text({
        font: "10px sans-serif",
        text: text,
        //offsetY: 10,
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        overflow:true,
        exceedLength:true,
        placement:"point"
      })
    });
    styles.push(fillStyle);
    if(zoom>=15) {
      styles.push(strokeStyle1(3.0));
    }else if(zoom>=12) {
      styles.push(strokeStyle1(2));
    }else if(zoom>=11) {
      styles.push(strokeStyle1(1));
    }
    if(zoom>=11) styles.push(textStyle);

    return styles;
  }
}

function Houmusyou() {
  this.name = "houmusyo";
  this.style = houmusyoStyleFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 17,
    // url: "https://hfu.github.io/rvrcl-vt/{z}/{x}/{y}.mvt"
    url: "https://x.optgeo.org/a/{z}/{x}/{y}.mvt"
  });
}
export  const houmusyouObj = {};
for (let i of mapsStr) {
  houmusyouObj[i] = new VectorTileLayer(new Houmusyou())
}
export const houmusyouSumm = ""
// ------------------------------------
function houmusyoStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    // console.log(resolution)
    // const zoom = getZoom(resolution);
    const type = prop["type"];
    let text = prop.地番
    if (resolution > 9.554628) text = "・";
    const style = new Style({
      // image: new Circle({
      //   radius: 8,
      //   fill: new Fill({
      //     color: "red"
      //   }),
      //   stroke: new Stroke({
      //     color: "white",
      //     width: 1
      //   })
      // }),

      fill: new Fill({
        color: "rgba(0,128,0,0.8)"
      }),
      text: new Text({
        font: "14px sans-serif",
        text: text,
        // placement:"point",
        // offsetY:10,
      }),
      stroke: new Stroke({
        color: 'blue',
        width: 1
      })
    });
    return style;
  }
}


function Suiro() {
  this.name = "suiro";
  this.style = suiroStyleFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 14,
    url: "https://hfu.github.io/rvrcl-vt/{z}/{x}/{y}.mvt"
  });
  this.maxResolution = 152.874057 //zoom10
}
export  const suiroObj = {};
for (let i of mapsStr) {
  suiroObj[i] = new VectorTileLayer(new Suiro())
}
export const suiroSumm = ""
// ------------------------------------
function suiroStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    // console.log(feature)
    const rivCtg = prop["rivCtg"];
    const type = prop["type"];
    let strokeColor = "dodgerblue";
    let strokeWidth = 1;
    let lineDash = [];
    switch (rivCtg) {
      case "一級河川":
        strokeColor = "mediumblue";
        strokeWidth = 2;
        lineDash = [1];
        break;
      case "二級河川":
        strokeColor = "blue";
        strokeWidth = 2;
        lineDash = [1];
        break;
      default:
        strokeColor = "blue";
        strokeWidth = 2;
        lineDash = [1];
        break;
    }
    switch (type) {
      case "人工水路（地下）":
        strokeColor = "red";
        strokeWidth = 2;
        lineDash = [2, 4];
        break;
      case "人工水路（空間）":
        strokeColor = "red";
        strokeWidth = 2;
        lineDash = [1];
        break;
      default:

    }
    if (resolution > 611.50) strokeWidth = 1;
    const style = new Style({
      stroke: new Stroke({
        color: strokeColor,
        width: strokeWidth,
        lineDash: lineDash
      })
    });
    return style;
  }
}

function Hinan() {
  this.name = "hinan";
  this.style = hinanStyleFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 15,
    url: "https://kenzkenz.github.io/hinan/{z}/{x}/{y}.mvt"
  });
}
export  const hinanObj = {};
for (let i of mapsStr) {
  hinanObj[i] = new VectorTileLayer(new Hinan())
}
export const hinanSumm = '出典：<a href="https://nlftp.mlit.go.jp/ksj/index.html" target="_blank">国土数値情報</a>'
// --------------------------------------------------
function hinanStyleFunction () {
  return function(feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const circleStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({
          color: "red"
        }),
        stroke: new Stroke({
          color: "white",
          width: 1
        })
      })
    })
    const textStyle = new Style({
          text: new Text({
            font: "14px sans-serif",
            text: prop.P20_002,
            placement:"point",
            offsetY:10,
            fill: new Fill({
              color: "black"
            }),
            stroke: new Stroke({
              color: "white",
              width: 3
            }),
            exceedLength:true
          })
        });
    styles.push(circleStyle);
    if(zoom>=15) {
      styles.push(textStyle);
    }
    // console.log(prop)
    return styles;
  };
}
//H23用途地域------------------------------------------------------------------------------------------------
function YoutoH23(){
  this.name = 'youtoH23'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/youto_h23/{z}/{x}/{y}.mvt"
  });
  this.maxResolution = '152.874057' //zoom10
  this.style = youtotiikiStyleFunction();
}
export  const youtoH23Obj = {};
for (let i of mapsStr) {
  youtoH23Obj[i] = new VectorTileLayer(new YoutoH23())
}
export const youtoH23Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A29-v2_1.html' target='_blank'>国土数値情報　用途地域</a>";

//R01用途地域------------------------------------------------------------------------------------------------
function YoutoR01(){
  this.name = 'youtoR01'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/youto_r01/{z}/{x}/{y}.mvt"
  });
  this.maxResolution = '152.874057' //zoom10
  this.style = youtotiikiStyleFunction();
}
export  const youtoR01Obj = {};
for (let i of mapsStr) {
  youtoR01Obj[i] = new VectorTileLayer(new YoutoR01())
}
export const youtoR01Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A29-v2_1.html' target='_blank'>国土数値情報　用途地域</a>";
//------------------------------------------------------
function youtotiikiStyleFunction() {
  return function (feature, resolution) {
    var prop = feature.getProperties();
    var cate = prop["A29_004"];
    var rgba = "rgba(0,0,0,0)";
    switch (cate) {
      case 1://第一種低層住居専用地域
        rgba = "rgba(51,204,153,0.8)";
        break;
      case 2://第二種低層住居専用地域
        rgba = "rgba(0,153,102,0.8)";
        break;
      case 3://第一種中高層住居専用地域
        rgba = "rgba(102,204,102,0.8)";
        break;
      case 4://第二種中高層住居専用地域
        rgba = "rgba(204,255,153,0.8)";
        break;
      case 5://第一種住居地域
        rgba = "rgba(255,255,153,0.8)";
        break;
      case 6://第二種住居地域
        rgba = "rgba(255,204,153,0.8)";
        break;
      case 7://準住居地域
        rgba = "rgba(255,204,102,0.8)";
        break;
      case 8://近隣商業地域
        rgba = "rgba(255,153,204,0.8)";
        break;
      case 9://商業地域
        rgba = "rgba(255,102,153,0.8)";
        break;
      case 10://準工業地域
        rgba = "rgba(204,153,255,0.8)";
        break;
      case 11://工業地域
        rgba = "rgba(204,255,255,0.8)";
        break;
      case 12://工業専用地域
        rgba = "rgba(102,204,255,0.8)";
        break;
      case 99://
        rgba = "rgba(0,0,0,0.1)";
        break;
    }
    var style;
    if (resolution < 125.87) {
      style = new Style({
        fill: new Fill({color: rgba}),
        stroke: new Stroke({
          color: "darkgray",
          width: 1
        })
      });
    } else {
      style = new Style({
        fill: new Fill({color: rgba})
      });
    }
    return style;
  }
}
//H18都市地域------------------------------------------------------------------------------------------------
function TosiH18(){
  this.name = 'tosiH18'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/tosi_h18/{z}/{x}/{y}.mvt"
  });
  this.style = tositiikiStyleFunction(18);
}
export  const tosiH18Obj = {};
for (let i of mapsStr) {
  tosiH18Obj[i] = new VectorTileLayer(new TosiH18())
}
export const tosiH18Summ = "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A09.html' target='_blank'>国土数値情報　都市地域</a>";

//H30都市地域------------------------------------------------------------------------------------------------
function TosiH30(){
  this.name = 'tosiH30'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/tosi_h30/{z}/{x}/{y}.mvt"
  });
  this.style = tositiikiStyleFunction();
}
export  const tosiH30Obj = {};
for (let i of mapsStr) {
  tosiH30Obj[i] = new VectorTileLayer(new TosiH30())
}
export const tosiH30Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A09.html' target='_blank'>国土数値情報　都市地域</a>";
//--------------------------------------
function tositiikiStyleFunction(year) {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    let layerNo
    if (year === 18) {
      layerNo = prop["A09_003"];
    } else {
      layerNo = prop["layer_no"];
    }
    let rgba = "black";
    let zindex = 0;
    switch (layerNo) {
      case '1':
      case 1://市街化区域
        rgba = "rgba(40,152,53,0.7)";
        break;
      case '2':
      case 2://市街化調整区域
        rgba = "rgba(239,255,3,0.7)";
        zindex = 1;
        break;
      case '3':
      case 3://その他用途地域
        rgba = "rgba(126,219,109,0.7)";
        break;
      case '4':
      case 4://用途未設定
        rgba = "rgba(253,191,111,0.7)";
        break;
    }
    let style;
    if (resolution < 125.87) {
      style = new Style({
        fill: new Fill({
          color: rgba
        }),
        stroke: new Stroke({
          color: "darkgray",
          width: 1
        }),
        zIndex: zindex
      });
    } else {
      style = new Style({
        fill: new Fill({
          color: rgba
        }),
        zIndex: zindex
      });
    }
    return style;
  }
}
//S45過疎地域------------------------------------------------------------------------------------------------
function KasoS45(){
  this.name = 'kasoS45'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/kaso_s45/{z}/{x}/{y}.mvt"
  });
  this.style = kasoStyleFunction();
}
export  const kasoS45Obj = {};
for (let i of mapsStr) {
  kasoS45Obj[i] = new VectorTileLayer(new KasoS45())
}
export const kasoS45Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A17-v4_0.html' target='_blank'>国土数値情報　過疎地域</a>";
//S60過疎地域------------------------------------------------------------------------------------------------
function KasoS60(){
  this.name = 'kasoS60'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/kaso_s60/{z}/{x}/{y}.mvt"
  });
  this.style = kasoStyleFunction();
}
export  const kasoS60Obj = {};
for (let i of mapsStr) {
  kasoS60Obj[i] = new VectorTileLayer(new KasoS60())
}
export const kasoS60Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A17-v4_0.html' target='_blank'>国土数値情報　過疎地域</a>";

//H29過疎地域------------------------------------------------------------------------------------------------
function KasoH29(){
  this.name = 'kasoH29'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/kaso_h29/{z}/{x}/{y}.mvt"
  });
  this.style = kasoStyleFunction();
}
export  const kasoH29Obj = {};
for (let i of mapsStr) {
  kasoH29Obj[i] = new VectorTileLayer(new KasoH29())
}
export const kasoH29Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A17-v4_0.html' target='_blank'>国土数値情報　過疎地域</a>";
//--------------------------------------
function kasoStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    let rgba = "black"
    switch (prop.A17_009) {
      case '01':
      case 1://過疎市町村
        rgba = "rgba(40,152,53,0.7)";
        break;
      case '02':
      case 2://過疎地域とみなされる市町村
        rgba = "rgba(239,255,3,0.7)"
        break;
      case '03':
      case 3://過疎地域とみなされる区域
        rgba = "rgba(0,0,109,0.7)"
        break;
    }
    const style = new Style({
        fill: new Fill({
          color: rgba
        }),
        stroke: new Stroke({
          color: "black",
          width: 1
        }),
      });
    return style;
  }
}
//H19公示価格------------------------------------------------------------------------------------------------
function KouziH19(mapName){
  this.name = 'kouziH19'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/kouzi_h19/{z}/{x}/{y}.mvt"
  });
  this.style = kouziStyleFunction(mapName,19);
}
export const kouziH19Obj = {};
for (let i of mapsStr) {
  kouziH19Obj[i] = new VectorTileLayer(new KouziH19(i))
}
export const kouziH19Summ = "<a href='' target='_blank'>国土数値情報　公示価格</a>";
//H25公示価格------------------------------------------------------------------------------------------------
function KouziH25(mapName){
  this.name = 'kouziH25'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/kouzi_h25/{z}/{x}/{y}.mvt"
  });
  this.style = kouziStyleFunction(mapName,25);
}
export const kouziH25Obj = {};
for (let i of mapsStr) {
  kouziH25Obj[i] = new VectorTileLayer(new KouziH25(i))
}
export const kouziH25Summ = "<a href='' target='_blank'>国土数値情報　公示価格</a>";

//H30公示価格------------------------------------------------------------------------------------------------
function KouziH30(mapName){
  this.name = 'kouziH30'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/kouzi_h30/{z}/{x}/{y}.mvt"
  });
  this.style = kouziStyleFunction(mapName,30);
}
export const kouziH30Obj = {};
for (let i of mapsStr) {
  kouziH30Obj[i] = new VectorTileLayer(new KouziH30(i))
}
export const kouziH30Summ = "<a href='' target='_blank'>国土数値情報　公示価格</a>";

//R04公示価格------------------------------------------------------------------------------------------------
function KouziR04(mapName){
  this.name = 'kouziR04'
  this.className = 'kouziR04'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/kouzi_r4_2/{z}/{x}/{y}.mvt"
  });
  this.style = kouziStyleFunction(mapName,4)
  // this.maxResolution = 152.874058 //zoom10
  // this.declutter = true
  // this.overflow = true
  // this.renderMode = 'hybrid'
  // this.renderOrder = null
  // this.renderBuffer = 10000
}
export const kouziR04Obj = {};
for (let i of mapsStr) {
  kouziR04Obj[i] = new VectorTileLayer(new KouziR04(i))
}
export const kouziR04Summ = "<a href='' target='_blank'>国土数値情報　公示価格</a>";


function KouziR05 (mapName) {
  this.useInterimTilesOnError = false
  this.name = 'kouziR04'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/kouzir05.geojson',
    format: new GeoJSON()
  });
  this.style = kouziStyleFunction(mapName,5)
}
export const kouziR05Summ = "<a href='' target='_blank'>国土数値情報　公示価格</a>";
export const kouziR05Obj = {};
for (let i of mapsStr) {
  kouziR05Obj[i] = new VectorLayer(new KouziR05(i))
}

// --------------------------------------------------
function kouziStyleFunction (mapName,year) {
  return function(feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const color = d3.scaleLinear()
        .domain([100, Number(store.state.info.kouzi[mapName])])
        .range(["blue", "red"]);
    let color2
    let text
    switch(year){
      case 30:
        color2 = color(prop.L01_091)
        text = prop.L01_023
        break
      case 25:
      case 19:
        color2 = color(prop.L01_006)
        text = prop.L01_019
        break
      case 4:
        color2 = color(Number(prop.L01_100))
        text = prop.L01_024
        break
      case 5:
        color2 = color(prop.L01_006)
        text = prop.L01_024
        break
    }
    const circleStyle = new Style({
      // image: new Icon({
      //   opacity: 1,
      //   crossOrigin: 'anonymous',
      //   src: require('@/assets/icon/whitecircle.png'),
      //   // src: 'https://kenzkenz.xsrv.jp/open-hinata/icon/eye.png',
      //   color: color2,
      //   scale: 1
      // })
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: color2
        })
      })
    })
    const textStyle = new Style({
      text: new Text({
        font: "14px sans-serif",
        text: text,
        placement:"point",
        offsetY:20,
        fill: new Fill({
          color: "black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(circleStyle);
    if(zoom>=14) {
      styles.push(textStyle)
    }
    // console.log(prop)
    return styles;
  };
}
//筆------------------------------------------------------------------------------------------------
function Hude01(){
  this.name = 'hude'
  this.extent = transformE([139.29977955579702, 41.33735893619786,146.05830163520793, 45.998925934593984])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_01/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude01Obj = {};
for (let i of mapsStr) {
  hude01Obj[i] = new VectorTileLayer(new Hude01())
}
export const hude01Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";
//------------------------------------------------------
function Hude02(){
  this.name = 'hude'
  this.extent = transformE([139.81008701276298, 40.176635777760794,141.85689925817158, 41.62744372063858])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_02/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude02Obj = {};
for (let i of mapsStr) {
  hude02Obj[i] = new VectorTileLayer(new Hude02())
}
export const hude02Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";
//--------------------------------------------------------
function Hude03(){
  this.name = 'hude'
  this.extent = transformE([140.5734586715698, 38.7906868884707,142.3349618911743, 40.61059686538772])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_03/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude03Obj = {};
for (let i of mapsStr) {
  hude03Obj[i] = new VectorTileLayer(new Hude03())
}
export const hude03Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";
//--------------------------------------------------------
function Hude04(){
  this.name = 'hude'
  this.extent = transformE([140.11761188507077, 37.83137845901042,141.9370079040527, 39.05885006240371])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_04/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude04Obj = {};
for (let i of mapsStr) {
  hude04Obj[i] = new VectorTileLayer(new Hude04())
}
export const hude04Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";
//--------------------------------------------------------
function Hude05(){
  this.name = 'hude'
  this.extent = transformE([139.3986959710234, 38.87794964062405,141.15889225811617, 40.57166905462515])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_05/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude05Obj = {};
for (let i of mapsStr) {
  hude05Obj[i] = new VectorTileLayer(new Hude05())
}
export const hude05Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";
//--------------------------------------------------------
function Hude06(){
  this.name = 'hude'
  this.extent = transformE([139.02594592303555, 37.71780786572144,140.91672198588856, 39.14842384692383])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_06/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude06Obj = {};
for (let i of mapsStr) {
  hude06Obj[i] = new VectorTileLayer(new Hude06())
}
export const hude06Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";
//--------------------------------------------------------
function Hude07(){
  this.name = 'hude'
  this.extent = transformE([138.9336633682251, 36.79038464710865,141.2795877456665, 38.11274719529956])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_07/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude07Obj = {};
for (let i of mapsStr) {
  hude07Obj[i] = new VectorTileLayer(new Hude07())
}
export const hude07Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";
//--------------------------------------------------------
function Hude08(){
  this.name = 'hude'
  this.extent = transformE([139.63015794754028, 35.42387124828295,141.0016894340515, 37.01365617294853])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_08/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude08Obj = {};
for (let i of mapsStr) {
  hude08Obj[i] = new VectorTileLayer(new Hude08())
}
export const hude08Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude09(){
  this.name = 'hude'
  this.extent = transformE([139.21003818511963, 36.16272088559815,140.40832042694092, 37.23617116563372])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_09/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude09Obj = {};
for (let i of mapsStr) {
  hude09Obj[i] = new VectorTileLayer(new Hude09())
}
export const hude09Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude10(){
  this.name = 'hude'
  this.extent = transformE([138.37014198303223, 35.89509948450777,139.94539260864258, 37.21378847961839])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_10/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude10Obj = {};
for (let i of mapsStr) {
  hude10Obj[i] = new VectorTileLayer(new Hude10())
}
export const hude10Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude11(){
  this.name = 'hude'
  this.extent = transformE([138.6806774139404, 35.59677475680269,139.94256019592285, 36.33144519001938])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_11/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude11Obj = {};
for (let i of mapsStr) {
  hude11Obj[i] = new VectorTileLayer(new Hude11())
}
export const hude11Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude12(){
  this.name = 'hude'
  this.extent = transformE([139.5164966583252, 34.84177436275702,141.14839553833008, 36.25704374210949])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_12/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude12Obj = {};
for (let i of mapsStr) {
  hude12Obj[i] = new VectorTileLayer(new Hude12())
}
export const hude12Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude13(){
  this.name = 'hude'
  this.extent = transformE([138.94487919057178, 24.157516891403702,140.03867914949237, 36.05841548392765])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_13/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude13Obj = {};
for (let i of mapsStr) {
  hude13Obj[i] = new VectorTileLayer(new Hude13())
}
export const hude13Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude14(){
  this.name = 'hude'
  this.extent = transformE([138.8973569869995, 35.09280485675225,139.9197506904602, 35.69538208890809])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_14/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude14Obj = {};
for (let i of mapsStr) {
  hude14Obj[i] = new VectorTileLayer(new Hude14())
}
export const hude14Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude15(){
  this.name = 'hude'
  this.extent = transformE([137.5999402999878, 36.673977969529105,140.30403614044187, 38.60204808269833])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_15/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude15Obj = {};
for (let i of mapsStr) {
  hude15Obj[i] = new VectorTileLayer(new Hude15())
}
export const hude15Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude16(){
  this.name = 'hude'
  this.extent = transformE([136.71001553535461, 36.2462806194322,137.79868125915527, 37.03883009228264])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_16/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude16Obj = {};
for (let i of mapsStr) {
  hude16Obj[i] = new VectorTileLayer(new Hude16())
}
export const hude16Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude17(){
  this.name = 'hude'
  this.extent = transformE([136.1002206802368, 36.000923941557744,137.434002968985, 37.92723999869058])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_17/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude17Obj = {};
for (let i of mapsStr) {
  hude17Obj[i] = new VectorTileLayer(new Hude17())
}
export const hude17Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude18(){
  this.name = 'hude'
  this.extent = transformE([135.36834239959714, 35.236120435849685,136.82664871215817, 36.51474102700951])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_18/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude18Obj = {};
for (let i of mapsStr) {
  hude18Obj[i] = new VectorTileLayer(new Hude18())
}
export const hude18Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude19(){
  this.name = 'hude'
  this.extent = transformE([138.22150468826297, 35.09334912620365,139.15738105773926, 36.0995331198404])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_19/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude19Obj = {};
for (let i of mapsStr) {
  hude19Obj[i] = new VectorTileLayer(new Hude19())
}
export const hude19Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude20(){
  this.name = 'hude'
  this.extent = transformE([137.3597002029419, 35.15452992507288,138.9057469367981, 37.0979760657369])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_20/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude20Obj = {};
for (let i of mapsStr) {
  hude20Obj[i] = new VectorTileLayer(new Hude20())
}
export const hude20Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude21(){
  this.name = 'hude'
  this.extent = transformE([136.28059387207028, 35.03567149197079,137.82488107681272, 36.49766598737261])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_21/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude21Obj = {};
for (let i of mapsStr) {
  hude21Obj[i] = new VectorTileLayer(new Hude21())
}
export const hude21Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude22(){
  this.name = 'hude'
  this.extent = transformE([137.3532199859619, 34.46647858600849,139.3178629875183, 35.73646302555349])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_22/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude22Obj = {};
for (let i of mapsStr) {
  hude22Obj[i] = new VectorTileLayer(new Hude22())
}
export const hude22Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude23(){
  this.name = 'hude'
  this.extent = transformE([136.65650900871842, 34.49405105819987,137.96105562643666, 35.51073020893553])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_23/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude23Obj = {};
for (let i of mapsStr) {
  hude23Obj[i] = new VectorTileLayer(new Hude23())
}
export const hude23Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude24(){
  this.name = 'hude'
  this.extent = transformE([135.80719470977783, 33.63423779229544,136.96773290634155, 35.39468255492508])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_24/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude24Obj = {};
for (let i of mapsStr) {
  hude24Obj[i] = new VectorTileLayer(new Hude24())
}
export const hude24Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude25(){
  this.name = 'hude'
  this.extent = transformE([135.729238986969, 34.77743380772921,136.50274515151978, 35.76947966191727])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_25/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude25Obj = {};
for (let i of mapsStr) {
  hude25Obj[i] = new VectorTileLayer(new Hude25())
}
export const hude25Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude26(){
  this.name = 'hude'
  this.extent = transformE([134.90912675857547, 34.54580238935607,136.041533946991, 35.95892033055452])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_26/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude26Obj = {};
for (let i of mapsStr) {
  hude26Obj[i] = new VectorTileLayer(new Hude26())
}
export const hude26Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude27(){
  this.name = 'hude'
  this.extent = transformE([134.9612045288086, 34.200338276692946,135.80466270446777, 35.12087388678508])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_27/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude27Obj = {};
for (let i of mapsStr) {
  hude27Obj[i] = new VectorTileLayer(new Hude27())
}
export const hude27Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude28(){
  this.name = 'hude'
  this.extent = transformE([134.0346622467041, 34.04844588780688,135.5545735359192, 35.8719075882308])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_28/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude28Obj = {};
for (let i of mapsStr) {
  hude28Obj[i] = new VectorTileLayer(new Hude28())
}
export const hude28Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude29(){
  this.name = 'hude'
  this.extent = transformE([135.5311625279185, 33.821412091976754,136.2761671712775, 34.82719927289011])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_29/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude29Obj = {};
for (let i of mapsStr) {
  hude29Obj[i] = new VectorTileLayer(new Hude29())
}
export const hude29Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude30(){
  this.name = 'hude'
  this.extent = transformE([134.97738486499406, 33.29610421155175,136.0618307054779, 34.539257963073354])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_30/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude30Obj = {};
for (let i of mapsStr) {
  hude30Obj[i] = new VectorTileLayer(new Hude30())
}
export const hude30Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude31(){
  this.name = 'hude'
  this.extent = transformE([133.04653644561765, 34.97754873651819,134.55668449401853, 35.822754502187806])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_31/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude31Obj = {};
for (let i of mapsStr) {
  hude31Obj[i] = new VectorTileLayer(new Hude31())
}
export const hude31Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude32(){
  this.name = 'hude'
  this.extent = transformE([131.6827940940857, 34.23170940273816,133.6316442489624, 36.458810558660346])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_32/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude32Obj = {};
for (let i of mapsStr) {
  hude32Obj[i] = new VectorTileLayer(new Hude32())
}
export const hude32Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude33(){
  this.name = 'hude'
  this.extent = transformE([133.3229112625122, 34.37735720960234,134.50080871582028, 35.417576199035835])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_33/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude33Obj = {};
for (let i of mapsStr) {
  hude33Obj[i] = new VectorTileLayer(new Hude33())
}
export const hude33Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude34(){
  this.name = 'hude'
  this.extent = transformE([132.03581864329306, 34.05137181766713,133.47375863893242, 35.18277388551303])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_34/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude34Obj = {};
for (let i of mapsStr) {
  hude34Obj[i] = new VectorTileLayer(new Hude34())
}
export const hude34Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude35(){
  this.name = 'hude'
  this.extent = transformE([130.78259931111435, 33.682879373503454,132.2622885364332, 34.84236026182147])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_35/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude35Obj = {};
for (let i of mapsStr) {
  hude35Obj[i] = new VectorTileLayer(new Hude35())
}
export const hude35Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude36(){
  this.name = 'hude'
  this.extent = transformE([133.61486434936523, 33.45580989422106,134.87865686416626, 34.36508341596317])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_36/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude36Obj = {};
for (let i of mapsStr) {
  hude36Obj[i] = new VectorTileLayer(new Hude36())
}
export const hude36Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude37(){
  this.name = 'hude'
  this.extent = transformE([133.43652963638303, 33.861756385783224,134.59404230117798, 34.72464836879196])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_37/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude37Obj = {};
for (let i of mapsStr) {
  hude37Obj[i] = new VectorTileLayer(new Hude37())
}
export const hude37Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude38(){
  this.name = 'hude'
  this.extent = transformE([132.09029674530032, 32.65494909744014,133.70867729187012, 34.45915421670509])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_38/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude38Obj = {};
for (let i of mapsStr) {
  hude38Obj[i] = new VectorTileLayer(new Hude38())
}
export const hude38Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude39(){
  this.name = 'hude'
  this.extent = transformE([132.39072561264035, 32.50431489991003,134.5411491394043, 34.078113953351334])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_39/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude39Obj = {};
for (let i of mapsStr) {
  hude39Obj[i] = new VectorTileLayer(new Hude39())
}
export const hude39Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude40(){
  this.name = 'hude'
  this.extent = transformE([130.057141337313, 32.94396623353168,131.28437361240947, 34.03340278739611])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_40/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude40Obj = {};
for (let i of mapsStr) {
  hude40Obj[i] = new VectorTileLayer(new Hude40())
}
export const hude40Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude41(){
  this.name = 'hude'
  this.extent = transformE([129.82159852981565, 32.87355012041051,130.55144906044004, 33.7152284176957])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_41/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude41Obj = {};
for (let i of mapsStr) {
  hude41Obj[i] = new VectorTileLayer(new Hude41())
}
export const hude41Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude42(){
  this.name = 'hude'
  this.extent = transformE([128.2349128127082, 31.995704237348633,130.49598898341947, 34.89023386619155])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_42/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude42Obj = {};
for (let i of mapsStr) {
  hude42Obj[i] = new VectorTileLayer(new Hude42())
}
export const hude42Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude43(){
  this.name = 'hude'
  this.extent = transformE([129.91195678710938, 32.04104943270438,131.37672185897827, 33.274170666993925])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_43/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude43Obj = {};
for (let i of mapsStr) {
  hude43Obj[i] = new VectorTileLayer(new Hude43())
}
export const hude43Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude44(){
  this.name = 'hude'
  this.extent = transformE([130.76267838478086, 32.71575652411805,132.14372634887692, 33.83879465741656])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_44/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude44Obj = {};
for (let i of mapsStr) {
  hude44Obj[i] = new VectorTileLayer(new Hude44())
}
export const hude44Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------------------------
function Hude45(){
  this.name = 'hude'
  this.extent = transformE([130.67389791787602, 31.32789462014621,132.07326770804468, 32.88017318420452])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_45/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude45Obj = {};
for (let i of mapsStr) {
  hude45Obj[i] = new VectorTileLayer(new Hude45())
}
export const hude45Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";
//--------------------------------------------------------
function Hude46(){
  this.name = 'hude'
  this.extent = transformE([127.64123823916296, 26.95180678728839,131.62686781429306, 32.22152765780952])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_46/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude46Obj = {};
for (let i of mapsStr) {
  hude46Obj[i] = new VectorTileLayer(new Hude46())
}
export const hude46Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";
//--------------------------------------------------------
function Hude47(){
  this.name = 'hude'
  this.extent = transformE([121.96815464834543, 23.403999045222932,131.88800437864094, 26.775877456433534])
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/hude_47/{z}/{x}/{y}.mvt"
  });
  this.style = hudeStyleFunction();
}
export  const hude47Obj = {};
for (let i of mapsStr) {
  hude47Obj[i] = new VectorTileLayer(new Hude47())
}
export const hude47Summ = "<a href='https://download.fude.maff.go.jp/' target='_blank'>筆ポリゴンダウンロードページ</a>";

//--------------------------------------
function hudeStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    let rgba = "black"
    switch (prop.land_type) {
      case 100://田
        // rgba = "rgba(40,152,53,1)";
        rgba = "green";
        break;
      case 200://畑
        // rgba = "rgba(239,255,3,1)"
        rgba = "red"
        break;
    }
    const style = new Style({
      fill: new Fill({
        color: rgba
      }),
      stroke: new Stroke({
        color: rgba,
        width: 1
      }),
    });
    return style;
  }
}
export const hude00Obj = {}
for (let i of mapsStr) {
  hude00Obj[i] = new LayerGroup({
    layers: [
      hude01Obj[i],
      hude02Obj[i],
      hude03Obj[i],
      hude04Obj[i],
      hude05Obj[i],
      hude06Obj[i],
      hude07Obj[i],
      hude08Obj[i],
      hude09Obj[i],
      hude10Obj[i],
      hude11Obj[i],
      hude12Obj[i],
      hude13Obj[i],
      hude14Obj[i],
      hude15Obj[i],
      hude16Obj[i],
      hude17Obj[i],
      hude18Obj[i],
      hude19Obj[i],
      hude20Obj[i],
      hude21Obj[i],
      hude22Obj[i],
      hude23Obj[i],
      hude24Obj[i],
      hude25Obj[i],
      hude26Obj[i],
      hude27Obj[i],
      hude28Obj[i],
      hude29Obj[i],
      hude30Obj[i],
      hude31Obj[i],
      hude32Obj[i],
      hude33Obj[i],
      hude34Obj[i],
      hude35Obj[i],
      hude36Obj[i],
      hude37Obj[i],
      hude38Obj[i],
      hude39Obj[i],
      hude40Obj[i],
      hude41Obj[i],
      hude42Obj[i],
      hude43Obj[i],
      hude44Obj[i],
      hude45Obj[i],
      hude46Obj[i],
      hude47Obj[i]
    ]
  })
}
//--------------------------------------------------------
function SansonS50(){
  this.name = 'sanson'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/sanson_s50/{z}/{x}/{y}.mvt"
  });
  this.style = sansonStyleFunction();
}
export  const sansonS50Obj = {};
for (let i of mapsStr) {
  sansonS50Obj[i] = new VectorTileLayer(new SansonS50())
}
export const sansonS50Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A24-v3_0.html' target='_blank'>国土数値情報　振興山村データ</a>"

//--------------------------------------------------------
function SansonS41(){
  this.name = 'sanson'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/sanson_s41/{z}/{x}/{y}.mvt"
  });
  this.style = sansonStyleFunction();
}
export  const sansonS41Obj = {};
for (let i of mapsStr) {
  sansonS41Obj[i] = new VectorTileLayer(new SansonS41())
}
export const sansonS41Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A24-v3_0.html' target='_blank'>国土数値情報　振興山村データ</a>"

//--------------------------------------------------------
function SansonH28(){
  this.name = 'sanson'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/sanson_h28/{z}/{x}/{y}.mvt"
  });
  this.style = sansonStyleFunction();
}
export  const sansonH28Obj = {};
for (let i of mapsStr) {
  sansonH28Obj[i] = new VectorTileLayer(new SansonH28())
}
export const sansonH28Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A24-v3_0.html' target='_blank'>国土数値情報　振興山村データ</a>"
//------------------------------------------
const sansonColor = d3.scaleOrdinal(d3.schemeCategory10);
function sansonStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    const rgb = sansonColor(prop.A24_002)
    const style = new Style({
      fill: new Fill({
        color: rgb
      }),
      stroke: new Stroke({
        color: "black",
        width: 1
      }),
    });
    return style;
  }
}
//--------------------------------------------------------
function Iryouken1zi(){
  this.name = 'iryouken1zi'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/iryouken_1zi/{z}/{x}/{y}.mvt"
  });
  this.style = iryoukenStyleFunction(1);
}
export  const iryouken1ziObj = {};
for (let i of mapsStr) {
  iryouken1ziObj[i] = new VectorTileLayer(new Iryouken1zi())
}
export const iryouken1ziSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A38-v2_0.html' target='_blank'>国土数値情報　医療圏データ</a>"

//--------------------------------------------------------
function Iryouken2zi(){
  this.name = 'iryouken2zi'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/iryouken_2zi/{z}/{x}/{y}.mvt"
  });
  this.style = iryoukenStyleFunction(2);
}
export  const iryouken2ziObj = {};
for (let i of mapsStr) {
  iryouken2ziObj[i] = new VectorTileLayer(new Iryouken2zi())
}
export const iryouken2ziSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A38-v2_0.html' target='_blank'>国土数値情報　医療圏データ</a>"
//--------------------------------------------------------
function Iryouken3zi(){
  this.name = 'iryouken3zi'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/iryouken_3zi/{z}/{x}/{y}.mvt"
  });
  this.style = iryoukenStyleFunction(3);
}
export  const iryouken3ziObj = {};
for (let i of mapsStr) {
  iryouken3ziObj[i] = new VectorTileLayer(new Iryouken3zi())
}
export const iryouken3ziSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A38-v2_0.html' target='_blank'>国土数値情報　医療圏データ</a>"

//------------------------------------------
const iryoukenColor = d3.scaleOrdinal(d3.schemeCategory10);
function iryoukenStyleFunction(iryouken) {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    let rgb
    switch (iryouken) {
      case 1:
        rgb = iryoukenColor(prop.A38a_001)
        break
      case 2:
        rgb = iryoukenColor(prop.A38b_003)
        break
      case 3:
        rgb = iryoukenColor(prop.A38c_001)
        break
    }
    const style = new Style({
      fill: new Fill({
        color: rgb
      }),
      stroke: new Stroke({
        color: "black",
        width: 1
      }),
    });
    return style;
  }
}
//--------------------------------------------------------
function Suikei500m(){
  this.name = 'suikei1km'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/suikei_500m/{z}/{x}/{y}.mvt"
  });
  this.style = suikeiStyleFunction(3);
}
export  const suikei500mObj = {};
for (let i of mapsStr) {
  suikei500mObj[i] = new VectorTileLayer(new Suikei500m())
}
export const suikei500mObjSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-mesh500h30.html' target='_blank'>国土数値情報　500mメッシュ別将来推計人口データ</a>"

//--------------------------------------------------------
function Suikei1km(){
  this.name = 'suikei1km'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/suikei_1km/{z}/{x}/{y}.mvt"
  });
  this.style = suikeiStyleFunction(3);
}
export  const suikei1kmObj = {};
for (let i of mapsStr) {
  suikei1kmObj[i] = new VectorTileLayer(new Suikei1km())
}
export const suikei1kmObjSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-mesh1000h30.html' target='_blank'>国土数値情報　1kmメッシュ別将来推計人口データ</a>"
//------------------------------------------
const suikeiColor = d3.scaleOrdinal(d3.schemeCategory10);
function suikeiStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    let rgb
    if (prop.PTN_2050) {
      const aaa = prop.PTN_2050 / prop.PTN_2020
      if (aaa > 1.1) {
        rgb = 'red'
      } else if (aaa > 1) {
        rgb = 'rgb(184,38,25)'
      } else if (aaa > 0.7) {
        rgb = 'rgb(89,119,246)'
      } else if (aaa > 0.5) {
        rgb = 'rgb(97,197,250)'
      } else if (aaa > 0.00000000000001) {
        rgb = 'rgb(140,252,114)'
      }
    } else {
      switch (prop.text) {
        case '増加':
          rgb = 'rgb(184,38,25)'
          break
        case '0%以上30%未満減少':
          rgb = 'rgb(89,119,246)'
          break
        case '30%以上50%未満減少':
          rgb = 'rgb(97,197,250)'
          break
        case '50%以上減少':
          rgb = 'rgb(140,252,114)'
          break
      }
    }
    const style = new Style({
      fill: new Fill({
        color: rgb
      }),
    });
    return style;
  }
}
//--------------------------------------------------------
function NougyouH27(){
  this.name = 'nougyou'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/nougyou_h27/{z}/{x}/{y}.mvt"
  });
  this.style = nougyouStyleFunction();
}
export  const nougyouH27Obj = {};
for (let i of mapsStr) {
  nougyouH27Obj[i] = new VectorTileLayer(new NougyouH27())
}
export const nougyouH27Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A12.html' target='_blank'>国土数値情報　農業地域データ</a>"
//------------------------------------------
function nougyouStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    let rgb
    switch (prop.LAYER_NO) {
      case 5:
        rgb = 'rgb(163,222,192)'
        break
      case 6:
        rgb = 'rgb(166,142,186)'
        break
    }

    const style = new Style({
      fill: new Fill({
        color: rgb
      }),
    });
    return style;
  }
}
//H26ダム------------------------------------------------------------------------------------------------
function DamH26(){
  this.name = 'damh26'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:15,
    url: "https://kenzkenz.github.io/dam_h26/{z}/{x}/{y}.mvt"
  });
  this.style = damStyleFunction();
}
export const damh26Obj = {};
for (let i of mapsStr) {
  damh26Obj[i] = new VectorTileLayer(new DamH26(i))
}
export const damh26Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-W01.html' target='_blank'>国土数値情報　ダムデータ</a>";
// ----------------------------------------------------------------------------
function damStyleFunction () {
  return function(feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    let text = prop.W01_001
    const circleStyle = new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: 'red'
        }),
        stroke: new Stroke({
          color: "white",
          width: 1
        })
      })
    })
    const textStyle = new Style({
      text: new Text({
        font: "14px sans-serif",
        text: text,
        placement:"point",
        offsetY:10,
        fill: new Fill({
          color: "black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(circleStyle);
    if(zoom>=11) {
      styles.push(textStyle);
    }
    return styles;
  };
}
//T9市町村------------------------------------------------------------------------------------------------
function CityT9(){
  this.name = 'city'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/city_t9/{z}/{x}/{y}.mvt"
  });
  this.style = cityStyleFunction();
}
export const cityT9Obj = {};
for (let i of mapsStr) {
  cityT9Obj[i] = new VectorTileLayer(new CityT9(i))
}
export const cityT9Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html' target='_blank'>国土数値情報　行政区域データ</a>";
//S25市町村------------------------------------------------------------------------------------------------
function CityS25(){
  this.name = 'city'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/city_s25/{z}/{x}/{y}.mvt"
  });
  this.style = cityStyleFunction();
}
export const cityS25Obj = {};
for (let i of mapsStr) {
  cityS25Obj[i] = new VectorTileLayer(new CityS25(i))
}
export const cityS25Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html' target='_blank'>国土数値情報　行政区域データ</a>";

//H07市町村------------------------------------------------------------------------------------------------
function CityH07(){
  this.name = 'city'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/city_h07/{z}/{x}/{y}.mvt"
  });
  this.style = cityStyleFunction();
}
export const cityH07Obj = {};
for (let i of mapsStr) {
  cityH07Obj[i] = new VectorTileLayer(new CityH07(i))
}
export const cityH07Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html' target='_blank'>国土数値情報　行政区域データ</a>";

//R03市町村------------------------------------------------------------------------------------------------
function CityR03(){
  this.name = 'city'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/city_r03/{z}/{x}/{y}.mvt"
  });
  this.style = cityStyleFunction();
}
export const cityR03Obj = {};
for (let i of mapsStr) {
  cityR03Obj[i] = new VectorTileLayer(new CityR03(i))
}
export const cityR03Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html' target='_blank'>国土数値情報　行政区域データ</a>";

//------------------------------------------
const cityColor = d3.scaleOrdinal(d3.schemeCategory10);
function cityStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    let id
    if (prop.N03_007) {
      id = Number(prop.N03_007.slice(0, 2))
    } else {
      id = 0
    }
    const rgb = d3.rgb(d3OridinalColor(id))
    // const rgb = d3.rgb(cityColor(id))
    const rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.8)"
    // const polygonStyle = new Style({
    //   fill: new Fill({
    //     color: rgba
    //   }),
    //   stroke: new Stroke({
    //     color: "white",
    //     width: 1
    //   })
    // });
    let polygonStyle
    if (zoom > 10) {
      polygonStyle = new Style({
        fill: new Fill({
          color: rgba
        }),
        stroke: new Stroke({
          color: "black",
          width: 2
        }),
        zIndex: 0
      });
    } else {
      polygonStyle = new Style({
        fill: new Fill({
          color: rgba
        }),
        stroke: new Stroke({
          color: "black",
          width: 1
        }),
        zIndex: 0
      });
    }
    const text = prop.N03_004
    const textStyle = new Style({
      text: new Text({
        font: "14px sans-serif",
        text: text,
        // placement:"point",
        // offsetY:10,
        fill: new Fill({
          color: "black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(polygonStyle);
    if(zoom>=9) {
      styles.push(textStyle);
    }
    return styles;
  }
}
//農業集落境界------------------------------------------------------------------------------------------------
function Kyoukai(){
  this.name = 'kyoukai'
  this.source = new VectorTileSource({
    format: new MVT(),
    minZoom:1,
    maxZoom:13,
    url: "https://kenzkenz.github.io/kyoukai/{z}/{x}/{y}.mvt"
  });
  this.style = kyoukaiStyleFunction();
}
export const kyoukaiObj = {};
for (let i of mapsStr) {
  kyoukaiObj[i] = new VectorTileLayer(new Kyoukai(i))
}
export const kyoukaiSumm = "<a href='https://www.maff.go.jp/j/tokei/census/shuraku_data/2020/ma/index.html' target='_blank'>農業集落境界</a>";

//------------------------------------------
const kyoukaiColor = d3.scaleOrdinal(d3.schemeCategory10);
function kyoukaiStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const rgb = kyoukaiColor(prop.CITY)
    const polygonStyle = new Style({
      fill: new Fill({
        color: rgb
      }),
      stroke: new Stroke({
        color: "white",
        width: 1
      })
    });
    const text = prop.RCOM_NAME
    const textStyle = new Style({
      text: new Text({
        font: "14px sans-serif",
        text: text,
        // placement:"point",
        // offsetY:10,
        fill: new Fill({
          color: "black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(polygonStyle);
    if(zoom>=9) {
      styles.push(textStyle);
    }
    return styles;
  }
}
//H17湖沼------------------------------------------------------------------------------------------------
function Kosyouh17(){
  this.name = 'kosyou'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/kosyou_h17/{z}/{x}/{y}.mvt"
  });
  this.style = kosyouStyleFunction();
}
export const kosyouH17Obj = {};
for (let i of mapsStr) {
  kosyouH17Obj[i] = new VectorTileLayer(new Kosyouh17(i))
}
export const kosyouH17Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-W09-v2_2.html' target='_blank'>国土数値情報　湖沼データ</a>";
//---------------------
function kosyouStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const rgb = 'blue'
    const polygonStyle = new Style({
      fill: new Fill({
        color: rgb
      }),
      stroke: new Stroke({
        color: "black",
        width: 2
      })
    });
    const text = prop.W09_001
    const textStyle = new Style({
      text: new Text({
        font: "14px sans-serif",
        text: text,
        fill: new Fill({
          color: "black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(polygonStyle);
    if(zoom>=9) {
      styles.push(textStyle);
    }
    return styles;
  }
}
//H27鳥獣保護区------------------------------------------------------------------------------------------------
function ChyouzyuuH27(){
  this.name = 'chyouzyuu'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/chyouzyuu_h27/{z}/{x}/{y}.mvt"
  });
  this.style = chyouzyuuStyleFunction();
}
export const chyouzyuuH27Obj = {};
for (let i of mapsStr) {
  chyouzyuuH27Obj[i] = new VectorTileLayer(new ChyouzyuuH27(i))
}
export const chyouzyuuH27Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A15.html' target='_blank'>国土数値情報　鳥獣保護区データ</a>";
//---------------------
function chyouzyuuStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const rgb = 'rgba(0,255,0,0.5)'
    const polygonStyle = new Style({
      fill: new Fill({
        color: rgb
      }),
      stroke: new Stroke({
        color: "black",
        width: 1
      })
    });
    const text = prop.A15_001
    const textStyle = new Style({
      text: new Text({
        font: "14px sans-serif",
        text: text,
        fill: new Fill({
          color: "black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(polygonStyle);
    if(zoom>=9) {
      styles.push(textStyle);
    }
    return styles;
  }
}
//H23竜巻------------------------------------------------------------------------------------------------
function TatumakiH23(){
  this.name = 'tatumaki'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/tatumaki_h23/{z}/{x}/{y}.mvt"
  });
  this.style = tatumakiStyleFunction();
}
export const tatumakiH23Obj = {};
for (let i of mapsStr) {
  tatumakiH23Obj[i] = new VectorTileLayer(new TatumakiH23(i))
}
export const tatumakiH23Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A30b.html' target='_blank'>国土数値情報　竜巻等の突風データ</a>";
// ----------------------------------------------------------------------------
function tatumakiStyleFunction () {
  return function(feature, resolution) {
    // const zoom = getZoom(resolution);
    // const prop = feature.getProperties();
    const styles = [];
    // let text = prop.W01_001
    const circleStyle = new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: 'blue'
        }),
        stroke: new Stroke({
          color: "white",
          width: 1
        })
      })
    })
    // const textStyle = new Style({
    //   text: new Text({
    //     font: "14px sans-serif",
    //     text: text,
    //     placement:"point",
    //     offsetY:10,
    //     fill: new Fill({
    //       color: "black"
    //     }),
    //     stroke: new Stroke({
    //       color: "white",
    //       width: 3
    //     }),
    //     exceedLength:true
    //   })
    // });
    styles.push(circleStyle);
    // if(zoom>=11) {
    //   styles.push(textStyle);
    // }
    return styles;
  };
}
//H30道の駅------------------------------------------------------------------------------------------------
function mitinoekiH30(){
  this.name = 'mitinoeki'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/mitinoeki_h30/{z}/{x}/{y}.mvt"
  });
  this.style = mitinoekiStyleFunction();
}
export const mitinoekiH30Obj = {};
for (let i of mapsStr) {
  mitinoekiH30Obj[i] = new VectorTileLayer(new mitinoekiH30(i))
}
export const mitinoekiH30Summ = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P35.html' target='_blank'>国土数値情報　道の駅データ</a>";
// ----------------------------------------------------------------------------
function mitinoekiStyleFunction () {
  return function(feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    let text = prop.P35_006
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 0.7],
        src: require('@/assets/icon/car.png'),
        color: "blue",
      })
    })
    const iconStyle2 = new Style({
      image: new Icon({
        anchor: [0.5, 0.7],
        src: require('@/assets/icon/car2.png'),
        color: "blue",
      })
    })
    const textStyle = new Style({
      text: new Text({
        font: "14px sans-serif",
        text: text,
        placement:"point",
        offsetY:10,
        fill: new Fill({
          color: "black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    if(zoom<=9) {
      styles.push(iconStyle);
    }else{
      styles.push(iconStyle2);
    }
    if(zoom>=11) {
      styles.push(textStyle);
    }
    return styles;
  };
}
//東京地震------------------------------------------------------------------------------------------------
function TokyoZisin(){
  this.name = 'tokyoZisin'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/tokyo/{z}/{x}/{y}.mvt"
  });
  this.style = tokyoStyleFunction();
}
export const tokyoZisinObj = {};
for (let i of mapsStr) {
  tokyoZisinObj[i] = new VectorTileLayer(new TokyoZisin(i))
}
export const tokyoZisinSumm = "<a href='https://www.toshiseibi.metro.tokyo.lg.jp/bosai/chousa_6/home.htm' target='_blank'>地震に関する地域危険度測定調査</a><br>" +
    "<img src='https://kenzkenz.xsrv.jp/open-hinata/img/tokyo.jpeg' width='400px'>" +
    "<br>総合危険度ランクで色を塗っています。"
//東京地震2------------------------------------------------------------------------------------------------
function TokyoZisin2(){
  this.name = 'tokyoZisin'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/tokyo/{z}/{x}/{y}.mvt"
  });
  this.style = tokyoStyleFunction2()
}
export const tokyoZisin2Obj = {}
for (let i of mapsStr) {
  tokyoZisin2Obj[i] = new VectorTileLayer(new TokyoZisin2(i))
}
export const tokyoZisin2Summ = "<a href='https://www.toshiseibi.metro.tokyo.lg.jp/bosai/chousa_6/home.htm' target='_blank'>地震に関する地域危険度測定調査</a><br>" +
   "<br>災害時活動困難係数で色を塗っています。"
//---------------------
function tokyoStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution)
    const prop = feature.getProperties()
    const styles = []
    let rgb = ''

    switch (prop.総合_ラ) {
      case 1:
        rgb = 'rgb(162,209,229)'
        break
      case 2:
        rgb = 'rgb(125,170,118)'
        break
      case 3:
        rgb = 'rgb(206,135,52)'
        break
      case 4:
        rgb = 'rgb(213,64,43)'
        break
      case 5:
        rgb = 'rgb(79,19,19)'
        break
    }
    const polygonStyle = new Style({
      fill: new Fill({
        color: rgb
      }),
      stroke: new Stroke({
        color: "white",
        width: 0.5
      })
    });
    const text = prop.町丁目名
    const textStyle = new Style({
      text: new Text({
        font: "14px sans-serif",
        text: text,
        fill: new Fill({
          color: "black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(polygonStyle);
    if(zoom>=13) {
      styles.push(textStyle);
    }
    return styles;
  }
}
//---------------------
function tokyoStyleFunction2() {
  return function (feature, resolution) {
    const d3Color = d3.interpolateLab("white","red");
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    const rgb = d3.rgb(d3Color(prop.災害_係));
    const polygonStyle = new Style({
      fill: new Fill({
        color: rgb
      }),
      stroke: new Stroke({
        color: "white",
        width: 0.5
      })
    });
    const text = prop.町丁目名
    const textStyle = new Style({
      text: new Text({
        font: "14px sans-serif",
        text: text,
        fill: new Fill({
          color: "black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(polygonStyle);
    if(zoom>=13) {
      styles.push(textStyle);
    }
    return styles;
  }
}

//--------------------------------------------------------
function TokuteiH28(){
  this.name = 'tokutei'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/tokutei_h28/{z}/{x}/{y}.mvt"
  });
  this.style = tokuteiStyleFunction();
}
export  const tokuteiH28Obj = {};
for (let i of mapsStr) {
  tokuteiH28Obj[i] = new VectorTileLayer(new TokuteiH28())
}
export const tokuteiSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A24-v3_0.html' target='_blank'>国土数値情報　振興山村データ</a>"
const tokuteiColor = d3.scaleOrdinal(d3.schemeCategory10);
function tokuteiStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    const rgb = tokuteiColor(prop.A25_002)
    const style = new Style({
      fill: new Fill({
        color: rgb
      }),
      stroke: new Stroke({
        color: "black",
        width: 1
      }),
    });
    return style;
  }
}

//--------------------------------------------------------

var codeList_sizen = new Array(//図式コード,"色"]
    [10101,"#d9cbae"],
    [1010101,"#d9cbae"],
    [11201,"#d9cbae"],			    [10101,"#d9cbae"],
    [1010101,"#d9cbae"],
    [11201,"#d9cbae"],
    [11202,"#d9cbae"],
    [11203,"#d9cbae"],
    [11204,"#d9cbae"],
    [10202,"#9466ab"],
    [10204,"#9466ab"],
    [2010201,"#9466ab"],
    [10205,"#cc99ff"],
    [10206,"#cc99ff"],
    [10301,"#ffaa00"],
    [10302,"#ffaa00"],
    [10303,"#ffaa00"],
    [10304,"#ffaa00"],
    [10308,"#ffaa00"],
    [10314,"#ffaa00"],
    [10305,"#ffaa00"],
    [10508,"#ffaa00"],
    [2010101,"#ffaa00"],
    [10306,"#ffaa00"],
    [10307,"#ffaa00"],
    [10310,"#ffaa00"],
    [10312,"#ffaa00"],
    [10401,"#99804d"],
    [10402,"#99804d"],
    [10403,"#99804d"],
    [10404,"#99804d"],
    [10406,"#99804d"],
    [10407,"#99804d"],
    [3010101,"#99804d"],
    [10501,"#cacc60"],
    [10502,"#cacc60"],
    [3020101,"#cacc60"],
    [10503,"#ffff33"],
    [3040101,"#ffff33"],
    [10506,"#fbe09d"],
    [10507,"#fbe09d"],
    [10801,"#fbe09d"],
    [10504,"#ffff99"],
    [10505,"#ffff99"],
    [10512,"#ffff99"],
    [3050101,"#ffff99"],
    [10601,"#a3cc7e"],
    [2010301,"#a3cc7e"],
    [10701,"#bbff99"],
    [3030101,"#bbff99"],
    [10702,"#bbff99"],
    [10705,"#bbff99"],
    [10703,"#00d1a4"],
    [10804,"#00d1a4"],
    [3030201,"#00d1a4"],
    [10704,"#6699ff"],
    [3040201,"#6699ff"],
    [3040202,"#6699ff"],
    [3040301,"#1f9999"],
    [10802,"#9f9fc4"],
    [10803,"#9f9fc4"],
    [10807,"#9f9fc4"],
    [10808,"#9f9fc4"],
    [10805,"#e5ffff"],
    [10806,"#e5ffff"],
    [10901,"#e5ffff"],
    [10903,"#e5ffff"],
    [5010201,"#e5ffff"],
    [10904,"#779999"],
    [5010301,"#779999"],
    [11001,"#85c4d1"],
    [11003,"#85c4d1"],
    [11009,"#85c4d1"],
    [11011,"#85c4d1"],
    [4010301,"#85c4d1"],
    [11002,"#8ad8b6"],
    [11004,"#ef8888"],
    [11006,"#ef8888"],
    [11007,"#ef8888"],
    [11014,"#ef8888"],
    [4010201,"#ff4f4f"],
    [11005,"#ff4f4f"],
    [11008,"#c37aff"],
    [4010101,"#c37aff"],
    [11010,"#ffe8e8"],
    [999999,"#144dfa"],
    [101,"#e6e600"],
    [102,"#00e2e6"],
    [103,"#2ae600"],
    [104,"#e60400"],
    [105,"#5e5ce6"],

    [11,"#998b79"],
    [12,"#664d55"],
    [13,"#7580D2"],
    [21,"#C9FF05"],
    [31,"#FF0116"],
    [32,"#FF5101"],
    [33,"#C975B0"],
    [34,"#FFBBFC"],
    [41,"#ffb31a"],
    [51,"#C7FFF7"],
    [61,"#FFEA01"],
    [71,"#1201FF"],

    [1,"#998c7a"],
    [3,"#FF0116"],
    [4,"#ffb31a"],
    [5,"#C7FFF7"],
    [6,"#FFEA01"],
    [7,"#1201FF"],

    ["","#85B6E7"],
    [9999, "#ff00ff"]
        [11202,"#d9cbae"],
    [11203,"#d9cbae"],
    [11204,"#d9cbae"],
    [10202,"#9466ab"],
    [10204,"#9466ab"],
    [2010201,"#9466ab"],
    [10205,"#cc99ff"],
    [10206,"#cc99ff"],
    [10301,"#ffaa00"],
    [10302,"#ffaa00"],
    [10303,"#ffaa00"],
    [10304,"#ffaa00"],
    [10308,"#ffaa00"],
    [10314,"#ffaa00"],
    [10305,"#ffaa00"],
    [10508,"#ffaa00"],
    [2010101,"#ffaa00"],
    [10306,"#ffaa00"],
    [10307,"#ffaa00"],
    [10310,"#ffaa00"],
    [10312,"#ffaa00"],
    [10401,"#99804d"],
    [10402,"#99804d"],
    [10403,"#99804d"],
    [10404,"#99804d"],
    [10406,"#99804d"],
    [10407,"#99804d"],
    [3010101,"#99804d"],
    [10501,"#cacc60"],
    [10502,"#cacc60"],
    [3020101,"#cacc60"],
    [10503,"#ffff33"],
    [3040101,"#ffff33"],
    [10506,"#fbe09d"],
    [10507,"#fbe09d"],
    [10801,"#fbe09d"],
    [10504,"#ffff99"],
    [10505,"#ffff99"],
    [10512,"#ffff99"],
    [3050101,"#ffff99"],
    [10601,"#a3cc7e"],
    [2010301,"#a3cc7e"],
    [10701,"#bbff99"],
    [3030101,"#bbff99"],
    [10702,"#bbff99"],
    [10705,"#bbff99"],
    [10703,"#00d1a4"],
    [10804,"#00d1a4"],
    [3030201,"#00d1a4"],
    [10704,"#6699ff"],
    [3040201,"#6699ff"],
    [3040202,"#6699ff"],
    [3040301,"#1f9999"],
    [10802,"#9f9fc4"],
    [10803,"#9f9fc4"],
    [10807,"#9f9fc4"],
    [10808,"#9f9fc4"],
    [10805,"#e5ffff"],
    [10806,"#e5ffff"],
    [10901,"#e5ffff"],
    [10903,"#e5ffff"],
    [5010201,"#e5ffff"],
    [10904,"#779999"],
    [5010301,"#779999"],
    [11001,"#85c4d1"],
    [11003,"#85c4d1"],
    [11009,"#85c4d1"],
    [11011,"#85c4d1"],
    [4010301,"#85c4d1"],
    [11002,"#8ad8b6"],
    [11004,"#ef8888"],
    [11006,"#ef8888"],
    [11007,"#ef8888"],
    [11014,"#ef8888"],
    [4010201,"#ff4f4f"],
    [11005,"#ff4f4f"],
    [11008,"#c37aff"],
    [4010101,"#c37aff"],
    [11010,"#ffe8e8"],
    [999999,"#144dfa"],
    [101,"#e6e600"],
    [102,"#00e2e6"],
    [103,"#2ae600"],
    [104,"#e60400"],
    [105,"#5e5ce6"],
    [9999,"#ff00ff"]
);
// 簡易版
function Sizentikei0(name,minzoom,maxzoom,url){
  this.multiply = true,
  this.name = 'sizentikei0'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:minzoom,
      maxZoom:maxzoom
    }),
    url:url
  });
  this.style = sizentikeiStyleFunction(name);
  this.useInterimTilesOnError = false
}
export  const sizentikei0Obj = {};
for (let i of mapsStr) {
  sizentikei0Obj[i] = new VectorTileLayer(new Sizentikei0('sizentikei2',1,16,"https://maps.gsi.go.jp/xyz/experimental_landformclassification1/{z}/{x}/{y}.geojson"))
}
// 詳細版
function Sizentikei(name,minzoom,maxzoom,url,zIndex){
  this.multiply = true,
  this.name = 'sizentikei'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:minzoom,
      maxZoom:maxzoom
    }),
    // zIndex:zIndex,
    url:url,
  });
  this.style = sizentikeiStyleFunction(name);
  this.zIndex = zIndex
  this.useInterimTilesOnError = false
  this.updateWhileInteracting = true

}
const sizentikeiObj1 = new VectorTileLayer(new Sizentikei('sizentikei3',1,13,"https://maps.gsi.go.jp/xyz/experimental_landformclassification3/{z}/{x}/{y}.geojson",1001))
// const sizentikeiObj1 = new VectorTileLayer(new Sizentikei('sizentikei3',1,18,"https://maps.gsi.go.jp/xyz/experimental_landformclassification1/{z}/{x}/{y}.geojson",1001))
const sizentikeiObj2 = new VectorTileLayer(new Sizentikei('sizentikei4',1,16,"https://maps.gsi.go.jp/xyz/experimental_landformclassification1/{z}/{x}/{y}.geojson",1002))
export const sizentikeiObj = {}
for (let i of mapsStr) {
  sizentikeiObj[i] = new LayerGroup({
    layers: [
      // sizentikeiObj2,
      // sizentikeiObj1
    ]
  })
}
export const sizentikeiSumm = "<a href='https://github.com/gsi-cyberjapan/experimental_landformclassification' target='_blank'>国土地理院ベクトルタイル提供実験（地形分類）</a>"
//---------------------------------------------
function Zinkoutikei(minzoom,maxzoom){
  this.multiply = true,
  this.name = 'zinkoutikei'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:minzoom,
      maxZoom:maxzoom
    }),
    url: "https://maps.gsi.go.jp/xyz/experimental_landformclassification2/{z}/{x}/{y}.geojson",
  });
  this.style = zinkoutikeiStyleFunction();
  this.useInterimTilesOnError = false
  this.updateWhileInteracting = true
}
export  const zinkoutikeiObj = {};
for (let i of mapsStr) {
  zinkoutikeiObj[i] = new VectorTileLayer(new Zinkoutikei(1,14))
}
export const zinkoutikeiSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A24-v3_0.html' target='_blank'>国土数値情報　振興山村データ</a>"
//--------------------------------------------
function sizentikeiStyleFunction(name) {
  if(name==="sizentikei3" || name==="sizentikei2") {
    return function (feature, resolution) {
      var zoom = getZoom(resolution);
      if (name==="sizentikei3") {
        if (zoom > 13) return;
      }
      var code = Number(feature.getProperties()["code"]);
      // console.log(code)
      var fillColor = 'rgba(0,0,0,0.1)';
      for (var i = 0; i < codeList_sizen.length; i++) {
        if (codeList_sizen[i][0] == code) {
          fillColor = codeList_sizen[i][1];
          break;
        }
      }
      return [new Style({
        fill: new Fill({
          color: fillColor
        }),
        zIndex:1001
      })];
    }
  } else {
    return function (feature, resolution) {
      var zoom = getZoom(resolution);
      // console.log(zoom);
      // console.log(resolution);
      //if (resolution >= 9.56) return;//9.56
      if (zoom < 14) return;
      var code = Number(feature.getProperties()["code"]);
      var fillColor = 'rgba(0,0,0,0.1)';
      for (var i = 0; i < codeList_sizen.length; i++) {
        if (codeList_sizen[i][0] == code) {
          fillColor = codeList_sizen[i][1];
          break;
        }
      }
      return [new Style({
        fill: new Fill({
          color: fillColor
        }),
        zIndex:1000
      })];
    }
  }
}
//---------------------------------------------------
function zinkoutikeiStyleFunction() {
    return function (feature, resolution) {
      var zoom = getZoom(resolution);
      // console.log(zoom);
      // console.log(resolution);
      //if (resolution >= 9.56) return;//9.56
      // if (zoom < 14) return;
      var code = Number(feature.getProperties()["code"]);
      var fillColor = 'rgba(0,0,0,0.1)';
      for (var i = 0; i < codeList_sizen.length; i++) {
        if (codeList_sizen[i][0] == code) {
          fillColor = codeList_sizen[i][1];
          break;
        }
      }
      return [new Style({
        fill: new Fill({
          color: fillColor
        })
      })];
    }
}
// 自然災害伝承碑-----------------------------------------------------
function Densyou(url){
  this.name = 'densyou'
  this.className = 'densyou'
  this.pointer = true
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:7,
      maxZoom:7
    }),
    url: url
  });
  this.style = densyouStyleFunction();
  this.useInterimTilesOnError = false
  // this.declutter = true
}
export const densyouObj = {};
for (let i of mapsStr) {
  densyouObj[i] = new VectorTileLayer(new Densyou("https://cyberjapandata.gsi.go.jp/xyz/disaster_lore_all/{z}/{x}/{y}.geojson"))
}
export const densyouFloodObj = {};
for (let i of mapsStr) {
  densyouFloodObj[i] = new VectorTileLayer(new Densyou("https://cyberjapandata.gsi.go.jp/xyz/disaster_lore_flood/{z}/{x}/{y}.geojson"))
}
export const densyouSedimentObj = {};
for (let i of mapsStr) {
  densyouSedimentObj[i] = new VectorTileLayer(new Densyou("https://cyberjapandata.gsi.go.jp/xyz/disaster_lore_sediment/{z}/{x}/{y}.geojson"))
}
export const densyouHightideObj = {};
for (let i of mapsStr) {
  densyouHightideObj[i] = new VectorTileLayer(new Densyou("https://cyberjapandata.gsi.go.jp/xyz/disaster_lore_hightide/{z}/{x}/{y}.geojson"))
}
export const densyouEarthquakeObj = {};
for (let i of mapsStr) {
  densyouEarthquakeObj[i] = new VectorTileLayer(new Densyou("https://cyberjapandata.gsi.go.jp/xyz/disaster_lore_earthquake/{z}/{x}/{y}.geojson"))
}
export const densyouTsunamiObj = {};
for (let i of mapsStr) {
  densyouTsunamiObj[i] = new VectorTileLayer(new Densyou("https://cyberjapandata.gsi.go.jp/xyz/disaster_lore_tsunami/{z}/{x}/{y}.geojson"))
}
export const densyouVolcanoObj = {};
for (let i of mapsStr) {
  densyouVolcanoObj[i] = new VectorTileLayer(new Densyou("https://cyberjapandata.gsi.go.jp/xyz/disaster_lore_volcano/{z}/{x}/{y}.geojson"))
}
export const densyouOtherObj = {};
for (let i of mapsStr) {
  densyouOtherObj[i] = new VectorTileLayer(new Densyou("https://cyberjapandata.gsi.go.jp/xyz/disaster_lore_other/{z}/{x}/{y}.geojson"))
}
function densyouStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const text = prop.LoreName
    const styles = [];
    const iconStyle = new Style({
      image: new Icon({
        src: require('@/assets/icon/densyouhi.png'),
        scale: 1.4
      })
    });
    const textStyle = new Style({
        text: new Text({
          font: "16px sans-serif",
          text: text,
          offsetY: 30,
          stroke: new Stroke({
            color: "white",
            width: 3
          })
        })
      });
    styles.push(iconStyle)
    if(zoom>=13) styles.push(textStyle)
    return styles
  }
}
// 指定緊急避難場所-----------------------------------------------------
//洪水
function Hinanzyo01(){
  this.name = 'hinanzyo01'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:1,
      maxZoom:10
    }),
    url: "https://cyberjapandata.gsi.go.jp/xyz/skhb01/{z}/{x}/{y}.geojson"
  });
  this.style = hinanzyoStyleFunction('blue')
  this.useInterimTilesOnError = false
  this.renderMode = 'vector'
}
export const hinanzyo01Obj = {};
for (let i of mapsStr) {
  hinanzyo01Obj[i] = new VectorTileLayer(new Hinanzyo01())
}
//崖崩れ、土石流及び地滑り
function Hinanzyo02(){
  this.name = 'hinanzyo02'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:1,
      maxZoom:10
    }),
    url: "https://cyberjapandata.gsi.go.jp/xyz/skhb02/{z}/{x}/{y}.geojson"
  });
  this.style = hinanzyoStyleFunction('magenta');
  this.useInterimTilesOnError = false
}
export const hinanzyo02Obj = {};
for (let i of mapsStr) {
  hinanzyo02Obj[i] = new VectorTileLayer(new Hinanzyo02())
}
//地震
function Hinanzyo04(){
  this.name = 'hinanzyo04'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:1,
      maxZoom:10
    }),
    url: "https://cyberjapandata.gsi.go.jp/xyz/skhb04/{z}/{x}/{y}.geojson"
  });
  this.style = hinanzyoStyleFunction('brown');
  this.useInterimTilesOnError = false
}
export const hinanzyo04Obj = {};
for (let i of mapsStr) {
  hinanzyo04Obj[i] = new VectorTileLayer(new Hinanzyo04())
}
//津波
function Hinanzyo05(){
  this.name = 'hinanzyo05'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:1,
      maxZoom:10
    }),
    url: "https://cyberjapandata.gsi.go.jp/xyz/skhb05/{z}/{x}/{y}.geojson"
  });
  this.style = hinanzyoStyleFunction('steelblue');
  this.useInterimTilesOnError = false
}
export const hinanzyo05Obj = {};
for (let i of mapsStr) {
  hinanzyo05Obj[i] = new VectorTileLayer(new Hinanzyo05())
}
//大規模な火事
function Hinanzyo06(){
  this.name = 'hinanzyo06'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:1,
      maxZoom:10
    }),
    url: "https://cyberjapandata.gsi.go.jp/xyz/skhb06/{z}/{x}/{y}.geojson"
  });
  this.style = hinanzyoStyleFunction('red');
  this.useInterimTilesOnError = false
}
export const hinanzyo06Obj = {};
for (let i of mapsStr) {
  hinanzyo06Obj[i] = new VectorTileLayer(new Hinanzyo06())
}
//--------------------------
function hinanzyoStyleFunction(color) {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const text = prop.name
    const styles = [];
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: require('@/assets/icon/whitepinlarge.png'),
        color: color
      })
      // image: new Circle({
      //   radius: 8,
      //   fill: new Fill({
      //     color: color
      //   }),
      //   stroke: new Stroke({
      //     color: "white",
      //     width: 1
      //   })
      // })
    });
    const textStyle = new Style({
      text: new Text({
        font: "12px sans-serif",
        text: text,
        offsetY: 10,
        stroke: new Stroke({
          color: "white",
          width: 3
        })
      })
    });
    if(zoom>=10) styles.push(iconStyle);
    if(zoom>=14) styles.push(textStyle);
    return styles;
  }
}
//郡------------------------------------------------------------------------------------------------
function Gun(){
  this.name = 'gun'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    // maxZoom:14,
    // url: "https://kenzkenz.github.io/gun2/{z}/{x}/{y}.mvt"
    url: 'https://kenzkenz3.xsrv.jp/mvt/gun115/{z}/{x}/{y}.mvt'
  });
  this.style = gunStyleFunction('PREF');
}
export  const gunObj = {};
for (let i of mapsStr) {
  gunObj[i] = new VectorTileLayer(new Gun())
}
export const gunSumm = "郡地図ver1.1.5で作成しました。<br><a href='https://booth.pm/ja/items/3053727' target='_blank'>郡地図研究会</a>";
// ----------------------------------------------------------------------
function Gunkuni(){
  this.name = 'gunkuni'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    // url: "https://kenzkenz.github.io/gun2/{z}/{x}/{y}.mvt"
    url: 'https://kenzkenz3.xsrv.jp/mvt/gun115/{z}/{x}/{y}.mvt'

  });
  this.style = gunStyleFunction('KUNI');
}
export  const gunkuniObj = {};
for (let i of mapsStr) {
  gunkuniObj[i] = new VectorTileLayer(new Gunkuni())
}
//-----------------------------------------------------------------------
function Gunbakumatu(){
  this.name = 'gunbakumatu'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom:13,
    url: "https://kenzkenz.github.io/gun0/{z}/{x}/{y}.mvt"
  });
  this.style = gunStyleFunction('KUNI');
}
export  const gunbakumatuObj = {};
for (let i of mapsStr) {
  gunbakumatuObj[i] = new VectorTileLayer(new Gunbakumatu())
}
//-------------------------------------------------------------------------
function gunStyleFunction(irowake) {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = [];
    // const rgb = d3.rgb(cityColor(prop[irowake]))
    const result = store.state.base.prefId.find(el => el.pref === prop[irowake])
    let id
    if (irowake === 'PREF') {
      if (result) {
        id = result.id
      } else {
        id = 0
      }
    } else{
      id = prop[irowake]
    }
    const rgb = d3.rgb(d3OridinalColor(id))
    const rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.8)"
    let polygonStyle
    if (zoom > 10) {
      polygonStyle = new Style({
        fill: new Fill({
          color: rgba
        }),
        stroke: new Stroke({
          color: "black",
          width: 2
        }),
        zIndex: 0
      });
    } else {
      polygonStyle = new Style({
        fill: new Fill({
          color: rgba
        }),
        stroke: new Stroke({
          color: "black",
          width: 1
        }),
        zIndex: 0
      });
    }
    const text = prop.KUNI + prop.GUN
    const textStyle = new Style({
      text: new Text({
        font: "14px sans-serif",
        text: text,
        fill: new Fill({
          color: "black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        exceedLength:true
      })
    });
    styles.push(polygonStyle);
    if(zoom>=9) {
      styles.push(textStyle);
    }
    return styles;
  }
}
//事前通行規制区間
function Kiseikukan(){
  this.name = 'kiseikukan'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:1,
      maxZoom:15
    }),
    url: "https://disaportaldata.gsi.go.jp/vector/10_jizentuukoukiseikukan/{z}/{x}/{y}.geojson"
  });
  this.style = kiseiStyleFunction();
  this.useInterimTilesOnError = false
}
export const kiseikukanObj = {};
for (let i of mapsStr) {
  kiseikukanObj[i] = new VectorTileLayer(new Kiseikukan())
}
function kiseiStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const style = new Style({
      stroke: new Stroke({
        color: 'red',
        width: zoom>9 ? 6 :2,
      })
    });
    return style;
  }
}
function Kiseikukan0 () {
  this.source = new XYZ({
    url:  "https://disaportal.gsi.go.jp/data/raster/10_jizentuukoukiseikukan/{z}/{x}/{y}.png",
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 15
  })
  this.useInterimTilesOnError = false
}
export const kiseikukan0Obj = {};
for (let i of mapsStr) {
  kiseikukan0Obj[i] = new TileLayer(new Kiseikukan0())
}
export const kiseikukan00Obj = {};
for (let i of mapsStr) {
  kiseikukan00Obj[i] = new LayerGroup({
    layers: [
      kiseikukan0Obj[i],
      kiseikukanObj[i],
    ]
  })
}
//道路冠水想定箇所
function Kansui(){
  this.name = 'kansui'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      minZoom:1,
      maxZoom:15
    }),
    url: "https://disaportal.gsi.go.jp/data/vector/10_kansui/{z}/{x}/{y}.geojson"
  });
  this.style = hinanzyoStyleFunction('orange');
  this.useInterimTilesOnError = false
}
export const kansuiObj = {};
for (let i of mapsStr) {
  kansuiObj[i] = new VectorTileLayer(new Kansui())
}
function Kansui0 () {
  this.source = new XYZ({
    url:  "https://disaportal.gsi.go.jp/data/raster/10_kansui/{z}/{x}/{y}.png",
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 15
  })
  this.useInterimTilesOnError = false
}
export const kansui0Obj = {};
for (let i of mapsStr) {
  kansui0Obj[i] = new TileLayer(new Kansui0())
}
export const kansui00Obj = {};
for (let i of mapsStr) {
  kansui00Obj[i] = new LayerGroup({
    layers: [
      kansui0Obj[i],
      kansuiObj[i],
    ]
  })
}
// ----------------------------------------------------------------------------------------
const source =  new VectorTileSource({
  format: new MVT(),
  maxZoom: 14,
  // url: "https://kenzkenz.github.io/rosen/{z}/{x}/{y}.mvt"
  url: 'https://kenzkenz3.xsrv.jp/mvt/tetsudo/{z}/{x}/{y}.mvt'
});
const source2 = new VectorTileSource({
  format: new MVT(),
  maxZoom: 14,
  // url: "https://kenzkenz.github.io/eki/{z}/{x}/{y}.mvt"
  url: 'https://kenzkenz3.xsrv.jp/mvt/eki/{z}/{x}/{y}.mvt'
});

function Rosen() {
  this.name = "rosen"
  this.className = 'rosen'
  this.style = rosenStyleFunction()
  this.source =source
  this.maxResolution = 152.874058 //zoom10
  this.declutter = true
}
export const rosenObj = {};
for (let i of mapsStr) {
  rosenObj[i] = new VectorTileLayer(new Rosen())
}
export const rosenSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N05-2023.html' target='_blank'>国土数値情報　鉄道データ</a>"

function Rosenxyz () {
  this.source = new XYZ({
    // url: 'https://kenzkenz3.xsrv.jp/rosen/{z}/{x}/{y}.png',
    url: 'https://kenzkenz3.xsrv.jp/tetsudo/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 11
  })
  this.minResolution = 76.437029 //zoom11
}
export const rosenXyz0Obj = {};
for (let i of mapsStr) {
  rosenXyz0Obj[i] = new TileLayer(new Rosenxyz())
}

// ------------------------------------
function rosenStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties()
    const zoom = getZoom(resolution)
    const genzon = prop["N05_005e"]
    let strokeColor
    let strokeWidth
    if (genzon === '9999') {
      strokeColor = "mediumblue"
      strokeWidth = zoom > 9 ? 6 : 2
    }
    const styles = []
    const lineStyle = new Style({
      stroke: new Stroke({
        color: strokeColor,
        width: strokeWidth,
      }),
      placement: 'line'
    })
    const textStyle = new Style({
      text: new Text({
        font: "20px sans-serif",
        text: prop.N05_002,
        offsetY: 10,
        fill:  new Fill({
          color:"black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        // placement: 'line'
      })
    })
    if (zoom >= 11  && zoom<=12) styles.push(textStyle)
    styles.push(lineStyle)
    return styles;
  }
}
function Rosenhaisi() {
  this.name = "rosen";
  this.style = rosenhaisiStyleFunction();
  this.source =source
  this.maxResolution = 152.874058 //zoom10
}
export  const rosenhaisiObj = {};
for (let i of mapsStr) {
  rosenhaisiObj[i] = new VectorTileLayer(new Rosenhaisi())
}

// ------------------------------------
function rosenhaisiStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const style = new Style({
      stroke: new Stroke({
        color: 'red',
        width: zoom > 9 ? 6 :2,
      })
    });
    return style;
  }
}
function Eki() {
  this.name = "eki";
  this.style = ekiStyleFunction('blue',true);
  this.source = source2
  this.maxResolution = 38.218514 //zoom12
}
export  const ekiObj = {};
for (let i of mapsStr) {
  ekiObj[i] = new VectorTileLayer(new Eki())
}
function Ekihaisi() {
  this.name = "eki";
  this.style = ekiStyleFunction('red');
  this.source = source2
  this.maxResolution = 38.218514 //zoom12
}
export  const ekihaisiObj = {};
for (let i of mapsStr) {
  ekihaisiObj[i] = new VectorTileLayer(new Ekihaisi())
}
//--------------------------
function ekiStyleFunction(color,genzonEki) {
  return function (feature,resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const text = prop.N05_011
    const genzon = prop["N05_005e"];
    const styles = [];
    let font
    if (zoom >= 17) {
      font = "20px sans-serif"
    } else {
      font = "14px sans-serif"
    }
    const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 0.7],
          src: require('@/assets/icon/eki.png'),
          color: color,
        })
    });
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        offsetY: 20,
        stroke: new Stroke({
          color: "white",
          width: 3
        })
      })
    });
    styles.push(iconStyle)
    styles.push(textStyle)
    if (genzonEki) {
      if (genzon === '9999') return styles;
    } else {
      return styles;
    }
  }
}

export const rosen0Obj = {};
for (let i of mapsStr) {
  rosen0Obj[i] = new LayerGroup({
    layers: [
      rosenhaisiObj[i],
      rosenObj[i],
      rosenXyz0Obj[i],
      ekihaisiObj[i],
      ekiObj[i]
    ]
  })
  rosen0Obj[i].values_['pointer'] = true
}
//----------------------
function Bus() {
  this.name = "bus";
  this.style = busStyleFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 13,
    url: "https://kenzkenz.github.io/bus/{z}/{x}/{y}.mvt"
  });
  this.maxResolution = 76.437029 //zoom11
}
export const busSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N07-v2_0.html' target='_blank'>国土数値情報　バスデータ</a>"
export  const busObj = {};
for (let i of mapsStr) {
  busObj[i] = new VectorTileLayer(new Bus())
}

function Busxyz () {
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/bus/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 11
  })
  this.minResolution = 76.437029 //zoom11
}
export const busXyz0Obj = {};
for (let i of mapsStr) {
  busXyz0Obj[i] = new TileLayer(new Busxyz())
}

// ------------------------------------
function busStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    let width
    if (zoom <= 12) {
      width = 2
    } else if (zoom <= 13) {
      width = 4
    } else {
      width = 6
    }
    const style = new Style({
      stroke: new Stroke({
        color: 'blue',
        // width: zoom>9 ? 6 :2,
        width:width,
      })
    });
    return style;
  }
}
//----------------------
function Bustei() {
  this.name = "bustei";
  this.style = busteiStyleFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 13,
    url: "https://kenzkenz.github.io/bustei/{z}/{x}/{y}.mvt"
  });
  this.maxResolution = 19.109258
}
export  const busteiObj = {};
for (let i of mapsStr) {
  busteiObj[i] = new VectorTileLayer(new Bustei())
}
//--------------------------
function busteiStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const text = prop.P11_001
    const styles = [];
    let font
    if (zoom >= 17) {
      font = "20px sans-serif"
    } else {
      font = "14px sans-serif"
    }
    const iconStyle = new Style({
      image: new Icon({
        // anchor: [0.5, 1],
        src: require('@/assets/icon/whitecircle.png'),
        color: 'black',
        scale: zoom>=15 ? 1.5: 1
      })
    })
    // const iconStyle = new Style({
    //   image: new Icon({
    //     anchor: [0.5, 1],
    //     src: require('@/assets/icon/blackpinmini.png'),
    //   })
    // });
    // const iconStyle2 = new Style({
    //   image: new Icon({
    //     anchor: [0.5, 1],
    //     src: require('@/assets/icon/blackpin.png'),
    //   })
    // });
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        offsetY: 18,
        stroke: new Stroke({
          color: "white",
          width: 3
        })
      })
    });
    // if (zoom>=15) {
    //   styles.push(iconStyle2);
    // } else {
    //   styles.push(iconStyle);
    // }]
    styles.push(iconStyle);
    if(zoom>=15) {
      styles.push(textStyle);
    }
    return styles;
  }
}
export const bus0Obj = {};
for (let i of mapsStr) {
  bus0Obj[i] = new LayerGroup({
    layers: [
        busObj[i],
      // busMiniObj[i],
      busteiObj[i],
      busXyz0Obj[i]
    ]
  })
}

// 岡山埋蔵文化財
function OkayamaMai() {
  this.name = "okayamamai";
  this.style = okayamamaiFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 15,
    url: "https://kenzkenz.github.io/okayama/{z}/{x}/{y}.mvt"
  });
}
export const okayamamaiSumm = "<a href='https://www.okayama-opendata.jp/resources/10378' target='_blank'>岡山県　埋蔵文化財</a>"
export  const okayamamaiiObj = {};
for (let i of mapsStr) {
  okayamamaiiObj[i] = new VectorTileLayer(new OkayamaMai())
}

// ------------------------------------
function okayamamaiFunction() {
  return function (feature, resolution) {
    const style = new Style({
      fill: new Fill({
        color: 'green'
      }),
      stroke: new Stroke({
        color: 'black',
        width: 1,
      })
    });
    return style;
  }
}
// 熊本県埋蔵文化財----------------------------------------------------------
function kumamotoMai() {
  this.name = "kumamotomai";
  this.style = kumamotomaiFunction('m_cont2');
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 17,
    // url: "https://mtile.pref.miyazaki.lg.jp/tile/mvt/iseki/kumamotoken/{z}/{x}/{y}.mvt"
    url: "https://kenzkenz.github.io/kumamotoiseki/{z}/{x}/{y}.mvt"
  });
}
export const kumamotomaiSumm = "<a href='https://www.pref.kumamoto.jp/soshiki/125/90282.html' target='_blank'>熊本県　遺跡地図</a>"
export  const kumamotomaiObj = {};
for (let i of mapsStr) {
  kumamotomaiObj[i] = new VectorTileLayer(new kumamotoMai())
}
function kumamotomaiFunction(text) {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const geoType = feature.getGeometry().getType();
    const styles = [];
    switch (geoType){
      case "MultiLineString":
      case "LineString":
        const lineStyle = new Style({
          stroke: new Stroke({
            color:"red",
            width:1
          })
        });
        styles.push(lineStyle)
        break;
      case "MultiPoint":
      case "Point":
        const iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: require('@/assets/icon/whitepin.png'),
            color: 'orange',
          }),
          zIndex: 9
        });
        const iconStyleLerge = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: require('@/assets/icon/whitepinlarge.png'),
            color: 'orange',
          }),
          zIndex: 9
        });
        const textStyle = new Style({
          text: new Text({
            font: "10px sans-serif",
            text: prop[text],
            offsetY: 10,
            stroke: new Stroke({
              color: "white",
              width: 3
            }),
            zIndex: 9
          })
        })
        if (zoom>=11 && zoom<=12) styles.push(iconStyle)
        if (zoom>=13) styles.push(iconStyleLerge)
        if (zoom>=13) styles.push(textStyle)
        break;
      case "Polygon":
      case "MultiPolygon":
          const fillStyle = new Style({
            fill: new Fill({
              color:"rgba(0,128,0,0.8)"
            }),
            stroke: new Stroke({
              color: "gray",
              width: 1
            }),
            zIndex: 0
          });
          styles.push(fillStyle)
        break;
      default:
    }
    return styles;
  }
}
// 東京文化財---------------------------------------------------------------
function TokyoBunkazai () {
  this.useInterimTilesOnError = false
  this.name = 'tokyobunkazai'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/tokyobunkazai.geojson',
    format: new GeoJSON()
  });
  this.style = tokyobunkazaiFunction()
}
export const tokyobunkazaiSumm = "<a href='https://catalog.data.metro.tokyo.lg.jp/dataset/t000021d0000000017' target='_blank'>TOKYO OPENDATA</a>"
export const tokyobunkazaiObj = {};
for (let i of mapsStr) {
  tokyobunkazaiObj[i] = new VectorLayer(new TokyoBunkazai())
}
function tokyobunkazaiFunction() {
  return function (feature, resolution) {
    const style = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: require('@/assets/icon/whitepin.png'),
        color: 'green'
      })
    })
    return style;
  }
}

// 全国旧石器時代遺跡------------------------------------------------------------
function Kyuusekki() {
  this.name = "kyusekki"
  this.className = 'kyusekki'
  this.style = kyuusekkiFunction()
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 15,
    url: "https://mtile.pref.miyazaki.lg.jp/tile/mvt/iseki/zenkoku/{z}/{x}/{y}.mvt"
  });
  this.maxResolution = 152.874057 //zoom10
  // this.declutter = true
}
export const kyuusekkiSumm = "<a href='http://palaeolithic.jp/data/index.htm' target='_blank'>データベース『日本列島の旧石器時代遺跡』</a>"
export  const kyuusekkiObj = {}
for (let i of mapsStr) {
  kyuusekkiObj[i] = new VectorTileLayer(new Kyuusekki())
}
export  const kyuusekkiHmObj = {}
for (let i of mapsStr) {
  kyuusekkiHmObj[i] = new Heatmap(new Kyuusekki())
}
function kyuusekkiFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const styles = []
    const imageStyle = new Style({
      image: new Icon({
        src: require('@/assets/icon/whitecircle.png'),
        color: 'green'
      })
    })
    const textStyle = new Style({
      text: new Text({
        font: "16px sans-serif",
        text: prop["遺跡名"],
        // offsetY: 25,
        offsetY: 18,
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        zIndex: 9
      })
    })
    styles.push(imageStyle)
    if (zoom >= 14) styles.push(textStyle)
    return styles
  }
}

function kyuusekkiGeojson () {
  this.useInterimTilesOnError = false
  this.name = 'kyusekki'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/zenkokuiseki2.geojson',
    format: new GeoJSON()
  });
  this.style = kyuusekkiFunction()
}
export const kyuusekkiGeojsonObj = {};
for (let i of mapsStr) {
  kyuusekkiGeojsonObj[i] = new VectorLayer(new kyuusekkiGeojson())
}

// 全奥旧石器webgl----------------------------------------------------------------------
function KyuusekkiWebGl() {
  this.name = "kyuusekki";
  this.style = kyuusekkiwebglstyle;
  this.source= new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/zenkokuiseki2.geojson',
    // url:'https://openlayers.org/en/latest/examples/data/geojson/world-cities.geojson',
    format: new GeoJSON()
  })
  this.minResolution = 152.874057 //zoom10
}
const kyuusekkiwebglstyle = {
  symbol: {
    symbolType: 'image',
    anchor: [0.5, 1],
    src: require('@/assets/icon/whitepinlarge.png'),
    color: 'green',
    size: 32
  }
}
export  const kyuusekkiWebGlObj = {};
for (let i of mapsStr) {
  kyuusekkiWebGlObj[i] = new WebGLPointsLayer(new KyuusekkiWebGl())
}
function Kyusekkixyz () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/kyusekki/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 11
  })
  this.minResolution = 152.874057 //zoom10
}
export const kyusekkiXyzObj = {}
for (let i of mapsStr) {
  kyusekkiXyzObj[i] = new TileLayer(new Kyusekkixyz())
}
//-------------
export const kyuusekki0Obj = {}
for (let i of mapsStr) {
  kyuusekki0Obj[i] = new LayerGroup({
    layers: [
      kyuusekkiObj[i],
      // kyuusekkiWebGlObj[i],
      // kyuusekkiGeojsonObj[i],
      kyusekkiXyzObj[i],
    ]
  })
  kyuusekki0Obj[i].values_['pointer'] = true
}


// 国指定文化財等データベース
function BunkazaiDb() {
  this.name = "bunkazaidb";
  this.style = bunkazaidbFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 15,
    url: "https://mtile.pref.miyazaki.lg.jp/tile/mvt/bunkatyoudb/{z}/{x}/{y}.mvt"
  });
}
export const bunkazaidbSumm = "<a href='https://kunishitei.bunka.go.jp/bsys/index' target='_blank'>国指定文化財等データベース</a><br>" +
    "文化庁のデータベースからcsvを取得しました。"
export  const bunkazaidbObj = {};
for (let i of mapsStr) {
  bunkazaidbObj[i] = new VectorTileLayer(new BunkazaiDb())
}
function bunkazaidbFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const style = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: require('@/assets/icon/whitepin.png'),
        color: 'green'
      })
    })
    const styleLarge = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: require('@/assets/icon/whitepinlarge.png'),
        color: 'green'
      }),
      text: new Text({
        font: "10px sans-serif",
        text: prop["名称"],
        offsetY: 10,
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        zIndex: 9
      })
    })
    if (zoom<=13) {
      return style
    } else {
      return styleLarge
    }
  }
}
// 	全国縄文・弥生集落遺跡
function Yayoiiseki() {
  this.name = "yayoiiseki";
  this.style = bunkazaidbFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 15,
    url: "https://mtile.pref.miyazaki.lg.jp/tile/mvt/iseki/yoyoi/{z}/{x}/{y}.mvt"
  });
}
export const yayoiisekiSumm = "<a href='' target='_blank'></a>"
export  const yayoiisekiObj = {};
for (let i of mapsStr) {
  yayoiisekiObj[i] = new VectorTileLayer(new Yayoiiseki())
}
// 富山県埋蔵文化財
function Toyamamaibun() {
  this.name = "toyamamaibun";
  this.style = okayamamaiFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 17,
    url: "https://kenzkenz.github.io/toyama/{z}/{x}/{y}.mvt"
  });
}
export const toyamamaibunSumm = "<a href='https://opendata.pref.toyama.jp/dataset/gis-maibun/resource/7031917f-42c7-41d9-9f78-41ef72a10adc' target='_blank'>富山県埋蔵文化財</a>"
export  const toyamamaibunObj = {};
for (let i of mapsStr) {
  toyamamaibunObj[i] = new VectorTileLayer(new Toyamamaibun())
}
// 北海道埋蔵文化財包蔵地---------------------------------------------------
function Hokkaidoumaibun() {
  this.name = "hokkaidoumaibun";
  this.style = standardFunction('SiteName');
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 17,
    url: "https://kenzkenz.github.io/hokkaidou/{z}/{x}/{y}.mvt"
  });
}
export const hokkaidoumaibunSumm = "<a href='https://www.harp.lg.jp/opendata/dataset/1245.html' target='_blank'>北海道埋蔵文化財包蔵地</a>"
export  const hokkaidoumaibunObj = {};
for (let i of mapsStr) {
  hokkaidoumaibunObj[i] = new VectorTileLayer(new Hokkaidoumaibun())
}
export function standardFunction(text) {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const geoType = feature.getGeometry().getType();
    const styles = [];
    switch (geoType){
      case "MultiLineString":
      case "LineString":
        const lineStyle = new Style({
          stroke: new Stroke({
            color:"red",
            width:1
          })
        });
        styles.push(lineStyle)
        break;
      case "MultiPoint":
      case "Point":
        const iconStyle = new Style({
          image: new Icon({
            // src: require('@/assets/icon/whitepin.png'),
            src: require('@/assets/icon/whitecircle.png'),
            color: 'red',
            scale: 1,
          }),
          zIndex: 9
        });
        const iconStyleLerge = new Style({
          image: new Icon({
            // anchor: [0.5, 1],
            src: require('@/assets/icon/whitecircle.png'),
            color: 'red',
            scale: 1.5,
          }),
          zIndex: 9
        });
        const textStyle = new Style({
          text: new Text({
            font: "14px sans-serif",
            text: prop[text],
            offsetY: 15,
            fill:  new Fill({
              color:"black"
            }),
            stroke: new Stroke({
              color: "white",
              width: 3
            }),
            zIndex: 9
          })
        })
        if (zoom>=13) {
          styles.push(iconStyleLerge)
        } else {
          styles.push(iconStyle)
        }
        if (zoom>=13) styles.push(textStyle)
        break;
      case "Polygon":
      case "MultiPolygon":
        const fillStyle = new Style({
          fill: new Fill({
            color:"rgba(0,128,0,0.8)"
          }),
          stroke: new Stroke({
            color: "gray",
            width: 1
          }),
          zIndex: 0
        });
        styles.push(fillStyle)
        break;
      default:
    }
    return styles;
  }
}
// 北海道太平洋沿岸の津波浸水想定---------------------------------------------------
function HokkaidouTunamiT() {
  this.name = "hokkaidouTunamiT";
  this.style = hokkaidoutunamiFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 15,
    url: "https://kenzkenz.github.io/hokkaido_tunami_t/{z}/{x}/{y}.mvt"
  });
  this.useInterimTilesOnError = false
}
export const hokkaidouTunamiTSumm = "<a href='https://www.harp.lg.jp/opendata/dataset/105.html' target='_blank'>北海道の津波浸水想定の公表資料</a>"
export  const hokkaidouTunamiTObj = {};
for (let i of mapsStr) {
  hokkaidouTunamiTObj[i] = new VectorTileLayer(new HokkaidouTunamiT())
}
// 	北海道日本海沿岸の津波浸水想定---------------------------------------------------
function HokkaidouTunami() {
  this.name = "hokkaidouTunami";
  this.style = hokkaidoutunamiFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 15,
    url: "https://kenzkenz.github.io/hokkaido_tunami/{z}/{x}/{y}.mvt"
  });
  this.useInterimTilesOnError = false
}
export const hokkaidouTunamiSumm = "<a href='https://www.harp.lg.jp/opendata/dataset/105.html' target='_blank'>北海道の津波浸水想定の公表資料</a>"
export  const hokkaidouTunamiObj = {};
for (let i of mapsStr) {
  hokkaidouTunamiObj[i] = new VectorTileLayer(new HokkaidouTunami())
}
function hokkaidoutunamiFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const styles = []
    const prop = feature.getProperties();
    const level = prop.level
    const max = prop.max
    const maxSin = prop.MAX_SIN
    let color
    if (level) {
      switch (level) {
        case 1://0.3
          color = "rgba(0,255,0,0.7)";
          break;
        case 2://1
          color = "rgba(255,230,0,0.7)";
          break;
        case 3://2
          color = "rgba(255,153,0,0.7)";
          break;
        case 4://2〜5
          color = "rgba(239,117,152,0.7)";
          break;
        case 5://10
          color = "rgba(255,40,0,0.7)";
          break;
        case 6://20
          color = "rgba(180,0,104,0.7)";
          break;
        case 7:
          color = "rgba(128,0,255,0.7)";
          break;
      }
    } else if (max) {
      if (max < 0.3) {
        color = "rgba(0,255,0,0.7)";
      } else if (max < 1) {
        color = "rgba(255,230,0,0.7)";
      } else if (max < 2) {
        color = "rgba(255,153,0,0.7)";
      } else if (max < 5) {
        color = "rgba(239,117,152,0.7)";
      } else if (max < 10) {
        color = "rgba(255,40,0,0.7)";
      } else if (max < 20) {
        color = "rgba(180,0,104,0.7)";
      } else {
        color = "rgba(128,0,255,0.7)";
      }
    } else if (maxSin) {
      if (maxSin < 0.3) {
        color = "rgba(0,255,0,0.7)";
      } else if (maxSin < 1) {
        color = "rgba(255,230,0,0.7)";
      } else if (maxSin < 2) {
        color = "rgba(255,153,0,0.7)";
      } else if (maxSin < 5) {
        color = "rgba(239,117,152,0.7)";
      } else if (maxSin < 10) {
        color = "rgba(255,40,0,0.7)";
      } else if (maxSin < 20) {
        color = "rgba(180,0,104,0.7)";
      } else {
        color = "rgba(128,0,255,0.7)";
      }
    }
    const fillStyle = new Style({
      fill: new Fill({
        color: color
      }),
    });
    const strokeStyle = new Style({
      stroke: new Stroke({
        color: 'black',
        width: 1,
      })
    });
    if (zoom>=16) styles.push(strokeStyle)
    styles.push(fillStyle)
    return styles;
  }
}
// 日本遺産---------------------------------------------------------------
function Nihonisan () {
  this.useInterimTilesOnError = false
  this.name = 'nihonisan'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/nihonisan.geojson',
    format: new GeoJSON()
  });
  this.style = standardFunction('name')
}
export const nihonisanSumm = "<a href='https://japan-heritage.bunka.go.jp/ja/' target='_blank'>日本遺産ポータルサイト</a><br>" +
                             "<a href='https://fukuno.jig.jp/4026' target='_blank'>福野泰介の一日一創</a>"
export const nihonisanObj = {};
for (let i of mapsStr) {
  nihonisanObj[i] = new VectorLayer(new Nihonisan())
}
// 土木学会選奨土木遺産------------------------------------------------------
function Dobokuisan () {
  this.useInterimTilesOnError = false
  this.name = 'dobokuisan'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/dobokuisan.geojson',
    format: new GeoJSON()
  });
  this.style = standardFunction('構造物名')
}
export const dobokuisanSumm = "<a href='https://note.com/htahathata/n/n2bd5e7877f93' target='_blank'>土木学会選奨土木遺産</a>"
export const dobokuisanObj = {};
for (let i of mapsStr) {
  dobokuisanObj[i] = new VectorLayer(new Dobokuisan())
}
// 日本遺産ヒートマップ------------------------------------------------------
function NihonisanHeatmap () {
  this.useInterimTilesOnError = false
  this.name = 'nihonisanheatmap'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/nihonisan.geojson',
    format: new GeoJSON()
  });
  this.style = standardFunction('name')
}
export const nihonisanheatmapSumm = "<a href='https://japan-heritage.bunka.go.jp/ja/' target='_blank'>日本遺産ポータルサイト</a><br>" +
    "<a href='https://fukuno.jig.jp/4026' target='_blank'>福野泰介の一日一創</a>"
export const nihonisanheatmapObj = {};
for (let i of mapsStr) {
  nihonisanheatmapObj[i] = new Heatmap(new NihonisanHeatmap())
}
// 選挙区---------------------------------------------------------------
function senkyoku2022() {
  this.name = "senkyoku";
  this.style = senkyokuStyleFunction();
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 13,
    url: "https://kenzkenz.github.io/senkyoku2022/{z}/{x}/{y}.mvt"
  });
}
export const senkyokuSumm = "<a href='https://nszw.jp/index.php/opendata?fbclid=IwAR2-LZqgPYEPuhAmfqFMKaghuOyAGdNLBPN4mUOhhciep8ZNsUIUnrr4V5E' target='_blank'>地域・交通データ研究所</a>"
export  const senkyoku2022Obj = {};
for (let i of mapsStr) {
  senkyoku2022Obj[i] = new VectorTileLayer(new senkyoku2022())
}
//------------------------------------------
const senkyokuColor = d3.scaleOrdinal(d3.schemeCategory10);
function senkyokuStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    const rgb = senkyokuColor(prop.ken)
    const style = new Style({
      fill: new Fill({
        color: rgb
      }),
      stroke: new Stroke({
        color: "black",
        width: 1
      }),
    });
    return style;
  }
}
// 郵便区---------------------------------------------------------------
function Yubinnku () {
  this.useInterimTilesOnError = false
  this.name = 'yubinku'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/yubinku_editmini.geojson',
    format: new GeoJSON()
  });
  this.style = yubinkuColorStyleFunction('name')
}
export const yubinkuSumm = "<a href='https://hanishina.github.io/maps/yubindata.html' target='_blank'>郵便番号境界データ</a>"
export const yubinkuObj = {};
for (let i of mapsStr) {
  yubinkuObj[i] = new VectorLayer(new Yubinnku())
}
//------------------------------------------
const yubinkuColor = d3.scaleOrdinal(d3.schemeCategory10);
function yubinkuColorStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    const rgb = yubinkuColor(prop.ken)
    const zoom = getZoom(resolution);
    const styles = []
    const fillStyle = new Style({
      fill: new Fill({
        color: rgb
      }),
      stroke: new Stroke({
        color: "black",
        width: 1
      }),
    });
    const textStyle = new Style({
      text: new Text({
        font: "12px sans-serif",
        text: prop.fullcode + '\n\n' + prop.name,
        offsetY: 12,
        fill:  new Fill({
          color:"black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        zIndex: 9
      })
    })
    styles.push(fillStyle)
    if (zoom>=11) styles.push(textStyle)
    return styles;
  }
}

// 地名---------------------------------------------------------------
function chimei() {
  this.useInterimTilesOnError = false
  this.name = 'chimei'
  this.source = new VectorTileSource({
    format: new MVT(),
    minZoom: 11,
    maxZoom: 14,
    url: "https://kenzkenz.github.io/chimei/{z}/{x}/{y}.mvt"
  });
  this.style = chimeiStyleFunction()
  this.maxResolution = 76.437028 //zoom11
  // this.declutter = true
  // this.overflow = true
}
export const chimeiSumm = "<a href='https://geoshape.ex.nii.ac.jp/nrct/' target='_blank'>『日本歴史地名大系』地名項目データセット20231124</a>"
export const chimeiObj = {};
for (let i of mapsStr) {
  chimeiObj[i] = new VectorTileLayer(new chimei())
}

function Chimeixyz () {
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/chimei/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 11
  })
  this.minResolution = 76.437029 //zoom11
}
export const chimeiXyz0Obj = {};
for (let i of mapsStr) {
  chimeiXyz0Obj[i] = new TileLayer(new Chimeixyz())
}
function chimeiStyleFunction() {
  return function (feature,resolution) {
    const prop = feature.getProperties();
    const zoom = getZoom(resolution);
    let text = prop.名称
    let font
    if (zoom <= 13) {
      font = "14px sans-serif"
    } else {
      font = "20px sans-serif"
    }
    const styles = []
    const imageStyle = new Style({
      image: new Icon({
        // anchor: [0.5, 1],
        // src: require('@/assets/icon/whitepin.png'),
        src: require('@/assets/icon/red.png'),
      }),
    })
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        placement:"point",
        offsetY:25,
        stroke: new Stroke({
          color: "white",
          width: 3
        })
      })
    })
    styles.push(imageStyle)
    styles.push(textStyle)
    return styles;
  }
}

export const chimei0Obj = {};
for (let i of mapsStr) {
  chimei0Obj[i] = new LayerGroup({
    layers: [
      chimeiXyz0Obj[i],
      chimeiObj[i],
    ]
  })
  chimei0Obj[i].values_['pointer'] = true
}

// 明治国道---------------------------------------------------------------
function Meijikokudo () {
  this.name = 'meijikokudo'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/meijikokudo.geojson',
    format: new GeoJSON()
  });
  this.style = meijikokudoStyleFunction('Name')
}
export const meijikokudoSumm = "<a href='https://note.com/smatsu/n/n7fac14777686' target='_blank'>明治期における国道（明治国道）の比定路線および経過地</a>"
export const meijikokudoObj = {};
for (let i of mapsStr) {
  meijikokudoObj[i] = new VectorLayer(new Meijikokudo())
}
export function meijikokudoStyleFunction(text) {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties();
    const geoType = feature.getGeometry().getType();
    const styles = [];
    switch (geoType){
      case "MultiLineString":
      case "LineString":
        const lineStyle = new Style({
          stroke: new Stroke({
            color:"red",
            width:6
          })
        });
        styles.push(lineStyle)
        break;
      case "MultiPoint":
      case "Point":
        const iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: require('@/assets/icon/whitepin.png'),
            color: 'orange',
          }),
          zIndex: 9
        });
        const iconStyleLerge = new Style({
          image: new Icon({
            // anchor: [0.5, 1],
            src: require('@/assets/icon/whitepinlarge.png'),
            color: 'black',
          }),
          zIndex: 9
        });
        const textStyle = new Style({
          text: new Text({
            font: "16px sans-serif",
            text: prop[text],
            offsetY: 10,
            fill:  new Fill({
              color:"red"
            }),
            stroke: new Stroke({
              color: "white",
              width: 3
            }),
            zIndex: 9
          })
        })
        // styles.push(iconStyle)
        // if (zoom>=13) styles.push(iconStyleLerge)
        if (zoom>=13) styles.push(textStyle)
        break;
      default:
    }
    return styles;
  }
}

// 予報区---------------------------------------------------------------
function Yohouku1 () {
  this.name = 'Yohouku1'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/yohouku1.geojson',
    format: new GeoJSON()
  });
  this.style = yuhoukuStyleFunction()
}
export const yohoukuSumm = "<a href='' target='_blank'></a>"
export const yohouku1Obj = {};
for (let i of mapsStr) {
  yohouku1Obj[i] = new VectorLayer(new Yohouku1())
}
function yuhoukuStyleFunction() {
  return function (feature, resolution) {
    const prop = feature.getProperties();
    let rgb
    let rgba
    if (prop.code) {
      rgb = d3.rgb(d3OridinalColor(Number(prop.code.slice(0, 2))))
      rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)"
    } else {
      rgba = 'black'
    }
    const zoom = getZoom(resolution);
    const styles = []
    const fillStyle = new Style({
      fill: new Fill({
        color: rgba
      }),
      stroke: new Stroke({
        color: "black",
        width: 1
      }),
    });
    const textStyle = new Style({
      text: new Text({
        font: "20px sans-serif",
        text: prop.name,
        offsetY: 12,
        fill:  new Fill({
          color:"black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        zIndex: 9
      })
    })
    styles.push(fillStyle)
    if (zoom>=8) styles.push(textStyle)
    return styles;
  }
}
// 河川---------------------------------------------------------------
function Kasenline() {
  this.className = 'kasenline'
  this.name = 'kasenline'
  this.source = new VectorTileSource({
    format: new MVT(),
    maxZoom: 14,
    url:'https://kenzkenz3.xsrv.jp/mvt/kasenline/{z}/{x}/{y}.mvt',
  });
  this.style = kasenStyleFunction()
  this.maxResolution = 76.437028 //zoom11
  this.declutter = true
}
export const kasenLineSumm = "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-W05.html' target='_blank'>国土数値情報　河川データ</a>"
export const kasenLineObj = {};
for (let i of mapsStr) {
  kasenLineObj[i] = new VectorTileLayer(new Kasenline())
}
function Ksenlinexyz () {
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/kasenline/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 11
  })
  this.minResolution = 76.437029 //zoom11
}
export const kasenLinexyzObj = {};
for (let i of mapsStr) {
  kasenLinexyzObj[i] = new TileLayer(new Ksenlinexyz())
}
export const kasenLine0Obj = {};
for (let i of mapsStr) {
  kasenLine0Obj[i] = new LayerGroup({
    layers: [
      kasenLinexyzObj[i],
      kasenLineObj[i],
    ]
  })
  kasenLine0Obj[i].values_['pointer'] = true
}
export function kasenStyleFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution)
    const prop = feature.getProperties()
    const styles = [];
    let text = prop.W05_004
    if (text === '名称不明') text = ''
    let width
    let font
    if (zoom >= 15) {
      width = 6
      font = "20px sans-serif"
    } else if (zoom >= 13) {
      width = 2
      font = "16px sans-serif"
    } else {
      width = 1
      font = "14px sans-serif"
    }
    const lineStyle = new Style({
      stroke: new Stroke({
        color: 'blue',
        width: width
      })
    })
    styles.push(lineStyle)
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        offsetY: 10,
        fill:  new Fill({
          color:"blue"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        // placement: 'line'
      })
    })
    if (zoom>=13) styles.push(textStyle)
    return styles;
  }
}

// 全国Q地図橋梁-----------------------------------------------------
function Qbridge(){
  this.name = 'qBridge'
  this.className = 'qBridge'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      maxZoom:14
    }),
    url: "https://mapdata.qchizu.xyz/vector/mlit_road2019/bridge2/{z}/{x}/{y}.geojson"
  });
  this.style = qStyleFunction('red')
  this.declutter = true
  this.maxResolution = 9.554629 //zoom14
}
export const qBridgeObj = {};
for (let i of mapsStr) {
  qBridgeObj[i] = new VectorTileLayer(new Qbridge())
}
export const qSumm2 = '<a href="https://info.qchizu.xyz/" target="_blank">全国Q地図さん</a>が作成しました。'

function Qbridgexyz () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mapdata.qchizu.xyz/vector/mlit_road2019/bridge2/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 13
  })
  this.minResolution = 9.554629 //zoom14
}
export const qBridgeXyzObj = {}
for (let i of mapsStr) {
  qBridgeXyzObj[i] = new TileLayer(new Qbridgexyz())
}
export const qBridge0Obj = {}
for (let i of mapsStr) {
  qBridge0Obj[i] = new LayerGroup({
    layers: [
      qBridgeObj[i],
      qBridgeXyzObj[i],
    ]
  })
  qBridge0Obj[i].values_['pointer'] = true
}
// ------------------------------------
function qStyleFunction(color) {
  return function (feature,resolution) {
    const prop = feature.getProperties()
    const zoom = getZoom(resolution)
    let text = prop._html
    let font
    let offsetY
    if (zoom >= 17) {
      font = "20px sans-serif"
      offsetY = 28
    } else {
      font = "14px sans-serif"
      offsetY = 24
    }
    const styles = []
    const imageStyle = new Style({
      // image: new Icon({
      //   src: require('@/assets/icon/whitecircle.png'),
      //   color: color,
      //   scale: 1.1
      // }),
      image: new Circle({
        radius: 10,
        fill: new Fill({
          color: color
        }),
        stroke: new Stroke({
          color: "white",
          width: 1
        })
      })
    })
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        placement:"point",
        offsetY: offsetY,
        fill:  new Fill({
          color:"black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        // textAlign: "center",
        // textBaseline: "bottom",
      }),
    });
    styles.push(imageStyle)
    styles.push(textStyle)
    return styles;
  }
}
// 全国Q地図ため池-----------------------------------------------------
function Qtameike(){
  this.name = 'qTameike'
  this.className = 'qTameike'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      maxZoom:14
    }),
    url: "https://mapdata.qchizu.xyz/vector/maff-pond20200925/{z}/{x}/{y}.geojson"
  });
  this.style = qStyleFunction('blue')
  this.declutter = true
  this.maxResolution = 9.554629 //zoom14
}
export const qTameikeObj = {}
for (let i of mapsStr) {
  qTameikeObj[i] = new VectorTileLayer(new Qtameike())
}
function Qtameikexyz () {
  this.source = new XYZ({
    url: 'https://mapdata.qchizu.xyz/vector/maff-pond20200925/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 13
  })
  this.minResolution = 9.554629 //zoom14
}
export const qTameikeXyzObj = {}
for (let i of mapsStr) {
  qTameikeXyzObj[i] = new TileLayer(new Qtameikexyz())
}
export const qTameike0Obj = {}
for (let i of mapsStr) {
  qTameike0Obj[i] = new LayerGroup({
    layers: [
      qTameikeXyzObj[i],
      qTameikeObj[i],
    ]
  })
  qTameike0Obj[i].values_['pointer'] = true
}
// 全国Q地図トンネル-----------------------------------------------------
function Qtunnel(){
  this.name = 'qTunnel'
  this.className = 'qTunnel'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      maxZoom:10
    }),
    url: "https://mapdata.qchizu.xyz/vector/mlit_road2019/tunnel/{z}/{x}/{y}.geojson"
  });
  this.style = qStyleFunction('red')
  this.declutter = true
  this.maxResolution = 152.874057 //zoom10
}
export const qTunnelObj = {}
for (let i of mapsStr) {
  qTunnelObj[i] = new VectorTileLayer(new Qtunnel())
}
function Qtunnelxyz () {
  this.source = new XYZ({
    url: 'https://mapdata.qchizu.xyz/vector/mlit_road2019/tunnel/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 9
  })
  this.minResolution = 152.874057 //zoom10
}
export const qTunnelXyzObj = {}
for (let i of mapsStr) {
  qTunnelXyzObj[i] = new TileLayer(new Qtunnelxyz())
}
export const qTunnel0Obj = {}
for (let i of mapsStr) {
  qTunnel0Obj[i] = new LayerGroup({
    layers: [
      qTunnelXyzObj[i],
      qTunnelObj[i],
    ]
  })
  qTameike0Obj[i].values_['pointer'] = true
}
// 全国Q地図シエッド-----------------------------------------------------
function Qshed(){
  this.name = 'qShed'
  this.className = 'qShed'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      maxZoom:10
    }),
    url: "https://mapdata.qchizu.xyz/vector/mlit_road2019/shed/{z}/{x}/{y}.geojson"
  });
  this.style = qStyleFunction('red')
  this.declutter = true
  this.maxResolution = 152.874057 //zoom10
}
export const qShedObj = {}
for (let i of mapsStr) {
  qShedObj[i] = new VectorTileLayer(new Qshed())
}
function Qshedlxyz () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mapdata.qchizu.xyz/vector/mlit_road2019/shed/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 9
  })
  this.minResolution = 152.874057 //zoom10
}
export const qShedXyzObj = {}
for (let i of mapsStr) {
  qShedXyzObj[i] = new TileLayer(new Qshedlxyz())
}
export const qShed0Obj = {}
for (let i of mapsStr) {
  qShed0Obj[i] = new LayerGroup({
    layers: [
      qShedXyzObj[i],
      qShedObj[i],
    ]
  })
  qShed0Obj[i].values_['pointer'] = true
}
// 全国Q地図大型カルバート-----------------------------------------------------
function Qculvert(){
  this.name = 'qCculvert'
  this.className = 'qCculvert'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      maxZoom:10
    }),
    url: "https://mapdata.qchizu.xyz/vector/mlit_road2019/culvert/{z}/{x}/{y}.geojson"
  });
  this.style = qStyleFunction('red')
  this.declutter = true
  this.maxResolution = 152.874057 //zoom10
}
export const qzCulvertObj = {}
for (let i of mapsStr) {
  qzCulvertObj[i] = new VectorTileLayer(new Qculvert())
}
function Qculvertxyz () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mapdata.qchizu.xyz/vector/mlit_road2019/culvert/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 9
  })
  this.minResolution = 152.874057 //zoom10
}
export const qCulvertXyzObj = {}
for (let i of mapsStr) {
  qCulvertXyzObj[i] = new TileLayer(new Qculvertxyz())
}
export const qzCulvert0Obj = {}
for (let i of mapsStr) {
  qzCulvert0Obj[i] = new LayerGroup({
    layers: [
      qCulvertXyzObj[i],
      qzCulvertObj[i],
    ]
  })
  qzCulvert0Obj[i].values_['pointer'] = true
}
// 全国Q地図横断歩道橋-----------------------------------------------------
function Qfootbridge(){
  this.name = 'qFootbridge'
  this.className = 'qFootbridge'
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      maxZoom:12
    }),
    url: "https://mapdata.qchizu.xyz/vector/mlit_road2019/footbridge/{z}/{x}/{y}.geojson"
  });
  this.style = qStyleFunction('red')
  this.declutter = true
  this.maxResolution = 38.218514 //zoom12
}
export const qFootbridgeObj = {}
for (let i of mapsStr) {
  qFootbridgeObj[i] = new VectorTileLayer(new Qfootbridge())
}
function Qfootbridgexyz () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mapdata.qchizu.xyz/vector/mlit_road2019/footbridge/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 11
  })
  this.minResolution = 38.218514 //zoom12
}
export const qFootbridgeXyzObj = {}
for (let i of mapsStr) {
  qFootbridgeXyzObj[i] = new TileLayer(new Qfootbridgexyz())
}
export const qFootbridge0Obj = {}
for (let i of mapsStr) {
  qFootbridge0Obj[i] = new LayerGroup({
    layers: [
      qFootbridgeXyzObj[i],
      qFootbridgeObj[i],
    ]
  })
  qFootbridge0Obj[i].values_['pointer'] = true
}
// 全国Q地図門型標識等マップ-----------------------------------------------------
function Qsign(){
  this.name = 'qSign'
  this.className = 'qSign'
  this.preload =
  this.source = new VectorTileSource({
    format: new GeoJSON({defaultProjection:'EPSG:4326'}),
    tileGrid: new createXYZ({
      maxZoom:12
    }),
    url: "https://mapdata.qchizu.xyz/vector/mlit_road2019/sign/{z}/{x}/{y}.geojson"
  });
  this.style = qStyleFunction('red')
  this.declutter = true
  this.maxResolution = 38.218514 //zoom12
}
export const qSignObj = {}
for (let i of mapsStr) {
  qSignObj[i] = new VectorTileLayer(new Qsign())
}
function Qsignexyz () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mapdata.qchizu.xyz/vector/mlit_road2019/sign/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 0,
    maxZoom: 11
  })
  this.minResolution = 38.218514 //zoom12
}
export const qSignXyzObj = {}
for (let i of mapsStr) {
  qSignXyzObj[i] = new TileLayer(new Qsignexyz())
}
export const qSign0Obj = {}
for (let i of mapsStr) {
  qSign0Obj[i] = new LayerGroup({
    layers: [
      qSignXyzObj[i],
      qSignObj[i],
    ]
  })
  qSign0Obj[i].values_['pointer'] = true
}
// 五街道---------------------------------------------------------------
function Gokaido () {
  this.name = 'gokaido'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/gokaido.geojson',
    format: new GeoJSON()
  });
  this.style = gokaidoStyleFunction('Name')
}
export const gokaidoSumm = "<a href='https://github.com/japan-road-jp/Gokaodo-Map/tree/main' target='_blank'>Gokaodo-Map</a>"
export const gokaidoObj = {};
for (let i of mapsStr) {
  gokaidoObj[i] = new VectorLayer(new Gokaido())
}
export function gokaidoStyleFunction() {
  return function (feature, resolution) {
    const styles = [];
    const lineStyle = new Style({
      stroke: new Stroke({
        color:"red",
        width:6
      })
    });
    styles.push(lineStyle)
    return styles;
  }
}

// 神社---------------------------------------------------------------
function Jinjya () {
  this.name = 'jinjya'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/jinjya.geojson',
    format: new GeoJSON()
  });
  this.style = jinjyaFunction('red')
}
export const jinjyaSumm =
    "<div style=width:200px;>" +
    "延喜式神名帳（えんぎしき じんみょうちょう）は、延長5年（927年）にまとめられた『延喜式』の巻九・十のことで、当時「官社」に指定されていた全国の神社一覧である。<br>" +
    "<a href='https://www.buccyake-kojiki.com/' target='_blank'>神社と古事記</a><br>" +
    "<a href='https://www.google.com/maps/d/viewer?fbclid=IwAR3_9yVuDQWgHI2Etj4zoIje7dSFl132GXAlzVtM47hXrBP_ni0b8NZUWOA_aem_AYjBm902Rpnpd3PQ5UUniJ1uL7rtOX-uPNvyzxEeSMuW5ADe4sud0XeBgSyRjLJ8frTIfA2qmXo7fa5rYbc0YLXn&mid=15k5Q8wLzs9G3verQJCbFDBHscjb-ZDo&ll=35.33953886570337%2C135.4594819&z=6' target='_blank'>Google My Maps</a>" +
    "</div>"
export const jinjyaObj = {};
for (let i of mapsStr) {
  jinjyaObj[i] = new VectorLayer(new Jinjya())
}
function jinjyaFunction(color) {
  return function (feature,resolution) {
    const prop = feature.getProperties()
    const zoom = getZoom(resolution)
    let text = prop.Name
    let font
    if (zoom >= 14) {
      font = "20px sans-serif"
    } else {
      font = "14px sans-serif"
    }
    const styles = []
    const imageStyle = new Style({
      // image: new Icon({
      //   src: require('@/assets/icon/whitecircle.png'),
      //   color: color
      // })
      image: new Icon({
        src: require('@/assets/icon/red.png'),
      }),
    })
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: text,
        placement:"point",
        offsetY: 20,
        fill:  new Fill({
          color:"black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        })
      }),
    });
    styles.push(imageStyle)
    if (zoom >= 11) styles.push(textStyle)
    return styles;
  }
}

// 一等三角点---------------------------------------------------------------
function Ittosankakuten () {
  this.name = 'ittosankakuten'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/itto.geojson',
    format: new GeoJSON()
  });
  this.style = sankakutenFunction()
}
export const ittosankakutenSumm = "<a href='https://sokuseikagis1.gsi.go.jp/top.html' target='_blank'>基準点成果等閲覧サービス</a>"
export const ittosankakutenObj = {};
for (let i of mapsStr) {
  ittosankakutenObj[i] = new VectorLayer(new Ittosankakuten())
}
function sankakutenFunction() {
  return function (feature, resolution) {
    const zoom = getZoom(resolution)
    const prop = feature.getProperties()
    const styles = []
    let font
    let offsetY
    if (zoom >= 10) {
      font = "20px sans-serif"
      offsetY = 20
    } else {
      font = "14px sans-serif"
      offsetY = 15
    }
    const imageStyle = new Style({
      image: new Icon({
        src: require('@/assets/icon/whitecircle.png'),
        color: 'green',
        scale: 1.1
      })
    })
    const textStyle = new Style({
      text: new Text({
        font: font,
        text: prop.Name,
        placement:"point",
        offsetY: offsetY,
        fill:  new Fill({
          color:"black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        // textAlign: "center",
        // textBaseline: "bottom",
      }),
    });
    styles.push(imageStyle)
    if (zoom >= 8) styles.push(textStyle)
    return styles;
  }
}

// Wiki---------------------------------------------------------------
const wikiVectorSource = new WikiCommons({
  strategy: Loadingstrategy.tile(
      Tilegrid.createXYZ({minZoom:14,maxZoom:14,tileSize:512})
  ),
  lang:"ja"
})

function Wiki () {
  this.name = 'wiki'
  this.pointer = true
  this.source = wikiVectorSource
  this.style = wikiStileFunction()
  this.maxResolution = 76.437028 //zoom11
  // this.declutter = true
}
export const wikiSumm = "<a href='https://commons.wikimedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8?uselang=ja' target='_blank'>ウィキメディア・コモンズ</a>"
export const wikiObj = {};
for (let i of mapsStr) {
  wikiObj[i] = new VectorLayer(new Wiki())
}
function wikiStileFunction() {
  return function (feature, resolution) {
    const styles = []
    const imageStyle = new Style({
      image: new Icon({
        src: require('@/assets/icon/whitecircle.png'),
        color: 'hotpink',
        scale: 1.5
      })
    })
    styles.push(imageStyle)
    return styles;
  }
}
// 市区町村---------------------------------------------------------------
function Shikuchoson () {
  this.useInterimTilesOnError = false
  this.name = 'shikuchoson'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/shikuchoson.geojson',
    format: new GeoJSON()
  });
  this.style = shikuchosonFunction('shi')
}
export const shikuchosonSumm = "<a href='https://opendata.resas-portal.go.jp/' target='_blank'>RESAS</a><br>" +
                               "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P34.html#!' target='_blank'>国土数値情報</a>"
export const shikuchosonObj = {};
for (let i of mapsStr) {
  shikuchosonObj[i] = new VectorLayer(new Shikuchoson())
}
// ---------------------------
function Kencho () {
  this.useInterimTilesOnError = false
  this.name = 'kencho'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/kencho.geojson',
    format: new GeoJSON()
  });
  this.style = shikuchosonFunction('ken')
}
export const kenchoSumm = "<a href='https://opendata.resas-portal.go.jp/' target='_blank'>RESAS</a><br>" +
    "<a href='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P34.html#!' target='_blank'>国土数値情報</a>"
export const kenchoObj = {};
for (let i of mapsStr) {
  kenchoObj[i] = new VectorLayer(new Kencho())
}
function shikuchosonFunction(yakusyo) {
  return function (feature, resolution) {
    const zoom = getZoom(resolution);
    const prop = feature.getProperties()
    const styles = []
    let text
    if (yakusyo=== 'shi') {
      text = prop.P34_003
    } else {
      text = prop.P28_005
    }
    const iconStyle = new Style({
      image: new Icon({
        src: require('@/assets/icon/whitecircle.png'),
        color: 'red'
      })
    })
    const textStyle = new Style({
      text: new Text({
        font: "20px sans-serif",
        text: text,
        offsetY: 16,
        fill:  new Fill({
          color:"black"
        }),
        stroke: new Stroke({
          color: "white",
          width: 3
        }),
        zIndex: 9
      })
    })
    styles.push(iconStyle)
    if (zoom>=10) styles.push(textStyle)
    return styles;
  }
}










function aaa() {
  this.source =  new VectorTileSource({
    format: new MVT({}),
    url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf'
  })
  this.minZoom = 5
  // this.maxZoom = 16
  this.renderBuffer = 100
  // this.style = stylingVectorTile
}
export  const vectorObj = {};
for (let i of mapsStr) {
  vectorObj[i] = new VectorTileLayer(new aaa())
}









// テスト---------------------------------------------------------------
function Test() {
  this.name = "senkyoku";
  this.style = senkyokuStyleFunction();
  this.source = new VectorTileSource({
    format: new MVTFormat(),
    maxZoom: 13,
    url: "https://rinya-hyogo.geospatial.jp/2023/rinya/tile/tree_species/{z}/{x}/{y}.pbf"
    // url:'https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf'
  });
}
export const testSumm = "<a href='' target='_blank'></a>"
export  const testObj = {};
for (let i of mapsStr) {
  testObj[i] = new VectorTileLayer(new Test())
}

// WebGlのテスト--------------------------------------------------------------------
function TestWebGl() {
  this.style = webglstyle;
  this.source= new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/zenkokuiseki2.geojson',
    // url:'https://openlayers.org/en/latest/examples/data/geojson/world-cities.geojson',
    format: new GeoJSON()
  })
}
const webglstyle = {
  symbol: {
    symbolType: 'image',
    // anchor: [0.5, 0.7],
    src: 'https://kenzkenz.xsrv.jp/open-hinata/img/redpinmini.png',
    size: 32,
    // color: 'blue'
  }
}
export  const testWebGlObj = {};
for (let i of mapsStr) {
  testWebGlObj[i] = new WebGLPointsLayer(new TestWebGl())
}
// ---------------------------------------------------------------------------------
// // data source for map
// const source0 = new VectorSource({
//   loader: async function () {
//     // Fetch the flatgeobuffer
//     const response = await fetch('https://wata909.github.io/fudepoly47/fude_tsukuba.fgb')
//     // ...and parse all its features
//     for await (let feature of flatgeobuf.deserialize(response.body)) {
//       feature.getGeometry()//.transform('EPSG:4326', 'EPSG:3857')
//       // add each feature to the map, after projecting it to
//       this.addFeature(feature)
//     }
//   }
// });
// function Testfgb () {
//   this.useInterimTilesOnError = false
//   this.name = 'meijikokudo'
//   this.source = source0
//   this.style = meijikokudoStyleFunction('Name')
// }
// export  const testWebGlObj2 = {};
// for (let i of mapsStr) {
//   testWebGlObj2[i] = new VectorLayer(new Testfgb())
// }

// Style function
function getFeatureStyle (feature) {
  return function (feature, resolution) {
    // const styles = []
    // const imageStyle = new Style({
    //   image: new Icon({
    //     src: require('@/assets/icon/whitecircle.png'),
    //     color: 'hotpink',
    //     scale: 1.5
    //   })
    // })
    // styles.push(imageStyle)
    // return styles;
    var st= [];
    // Font style
    const imageStyle = new Style({
      image: new FontSymbol({
        glyph: 'fa-star',
        form: 'marker',
        radius: 20,
        offsetY: -15,
        gradient: true,
        fontSize: 1.0,
        fontStyle: '',
        // rotation: 0*Math.PI/180,
        rotateWithView: false,
        color: 'white',
        fill: new Fill({
          color: 'green',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 2,
        }),
      }),
      stroke: new Stroke({
        width: 3,
        color: 'white'
      }),
      fill: new Fill({
        color: [255, 136, 0, 0.6]
      })
    })
    // const shadow = new Style(
    //     {	image: new Shadow(
    //           {	radius: 15,
    //             blur: 5,
    //             offsetX: 0,
    //             offsetY: 0,
    //             fill: new Fill(
    //                 {	color: "rgba(0,0,0,0.5)"
    //                 })
    //           }),
    //       zIndex:-1
    //
    //     })
    st.push(imageStyle)
    // st.push(shadow)
    return st;

  }



  // var st= [];
  // // Font style
  // st.push ( new Style({
  //   image: new FontSymbol({
  //     form: 'hexagone',
  //     // gradient: $("#gradient").prop('checked'),
  //     glyph: 'maki-building',
  //     text: '999',    // text to use if no glyph is defined
  //     font: 'sans-serif',
  //     fontSize: '20px',
  //     // fontStyle: $("#style").val(),
  //     // radius: Number($("#radius").val()),
  //     // rotation: Number($("#rotation").val())*Math.PI/180,
  //     // rotateWithView: $("#rwview").prop('checked'),
  //     // // with ol > 6
  //     // displacement: [0, $("#offset").prop('checked') ? Number($("#radius").val()) : 0] ,
  //     // // with ol < 6
  //     // offsetY: $("#offset").prop('checked') ? -Number($("#radius").val()) : 0,
  //     color: 'black',
  //     fill: new Fill({
  //       color: 'black'
  //     }),
  //     stroke: new Stroke({
  //       color: 'whitw',
  //       width: 3
  //     })
  //   }),
  //   stroke: new Stroke({
  //     width: 2,
  //     color: '#f80'
  //   }),
  //   fill: new Fill({
  //     color: [255, 136, 0, 0.6]
  //   })
  // }));
  // return st;
}