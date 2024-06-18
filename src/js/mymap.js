// マップ関係の関数
import store from './store'
import 'ol/ol.css'
import Map from 'ol/Map'
import Overlay from 'ol/Overlay';
import View from 'ol/View'
import { transform, fromLonLat } from 'ol/proj'
import { ScaleLine } from 'ol/control';
// import Toggle from 'ol-ext/control/Toggle'
import Colorize from 'ol-ext/filter/Colorize'
import Synchronize from 'ol-ext/interaction/Synchronize'
import Lego from 'ol-ext/filter/Lego'
import Notification from 'ol-ext/control/Notification'
import * as Layers from './layers'
import * as PopUp from './popup'
import {defaults as defaultInteractions, DragRotateAndZoom, Modify, Snap} from 'ol/interaction'
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import axios from "axios"
let maxZndex = 0
let legoFilter = null;
import Draw from 'ol/interaction/Draw'
import Transform from 'ol-ext/interaction/Transform'
import DragAndDrop from 'ol/interaction/DragAndDrop.js'
import PinchRotate from 'ol/interaction/PinchRotate'
import {GPX, GeoJSON, IGC, KML, TopoJSON} from 'ol/format.js'
import {standardFunction} from "@/js/layers-mvt";
import {Fill, Stroke, Style, Text} from "ol/style"
import * as turf from '@turf/turf';
import Select from 'ol/interaction/Select.js'
import {click, pointerMove, altKeyOnly} from 'ol/events/condition.js';
import {Circle, LineString} from "ol/geom"
import Feature from 'ol/Feature'
import {moveEnd} from "./permalink"
import Dialog from 'ol-ext/control/Dialog'
import Icon from 'ol/style/Icon'
import * as d3 from "d3"
import width from "ol-ext/util/input/Width";

// ドロー関係-------------------------------------------------------------------------------

export  const drawLayer2 = new VectorLayer({
    // pointer: true,
    // className: 'drawLayer2',
    name: 'drawLayer2',
    source: new VectorSource({wrapX: false}),
    style: drawLayer2StyleFunction()
})
export const pointInteraction = new Draw({
    source: drawLayer2.getSource(),
    type: 'Point',
})
export const modifyInteraction2 = new Modify ({
    source: drawLayer2.getSource(),
})
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
function drawLayer2StyleFunction() {
    return function (feature, resolution) {
        const zoom = getZoom(resolution);
        const prop = feature.getProperties();
        const styles = []
        const iconStyle = new Style({
            image: new Icon({
                src: require('@/assets/icon/whitecircle.png'),
                color: 'red',
                scale: 1.5
            })
        })
        const textStyle = new Style({
            text: new Text({
                font: "16px sans-serif",
                text: prop.name,
                offsetY: 20,
                fill: new Fill({
                    color: "black"
                }),
                stroke: new Stroke({
                    color: "white",
                    width: 3
                }),
            })
        });
        if(zoom>=12) styles.push(textStyle)
        styles.push(iconStyle)
        return styles;
    }
}
export  const danmenLayer = new VectorLayer({
    name: 'drawSource',
    source: new VectorSource({wrapX: false}),
    style: danmenStyleFunction()
})
function danmenStyleFunction() {
    return function (feature, resolution) {
        const styles = []
        const iconStyle = new Style({
            image: new Icon({
                src: require('@/assets/icon/whitecircle.png'),
                color: 'red'
            })
        })
        styles.push(iconStyle)
        return styles;
    }
}
const drawSource = new VectorSource({wrapX: false})
export  const drawLayer = new VectorLayer({
    // zIndex: 999999,
    name: 'drawSource',
    // pointer: true,
    source: drawSource,
    // altitudeMode: 'clampToGround',
    style: drawStylefunction()
})
export const selectInteraction = new Select({
    layers: [drawLayer]
})

function drawStylefunction (){
    return function (feature, resolution) {
        const prop = feature.getProperties()
        const geoType = feature.getGeometry().getType()
        // console.log(prop.distance)
        // console.log(prop)
        const styles = []
        const lineStyle = new Style({
            stroke: new Stroke({
                color:"red",
                width:3
            })
        });
        const textStyle = new Style({
            text: new Text({
                font: "24px sans-serif",
                text: prop.distance,
                offsetY: 30,
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
        const textStyle2 = new Style({
            text: new Text ({
                text:'\uf047',
                font:"20px Fontawesome",
                fill: new Fill({ color:[255,255,255,0.8] }),
                stroke: new Stroke({ width:2, color:'red' })
            })
        })
        styles.push(lineStyle)
        styles.push(textStyle)
        if (geoType === 'Circle') styles.push(textStyle2)
        return styles
    }
}

export const danmenInteraction = new Draw({
    source: drawSource,
    type: 'LineString',
    // freehand:true
})
export const lineInteraction = new Draw({
    source: drawSource,
    type: 'LineString',
})
export const polygonInteraction = new Draw({
    source: drawSource,
    type: 'Polygon',
})
export const circleInteraction = new Draw({
    source: drawSource,
    type: 'Circle',
})
export const modifyInteraction = new Modify ({
    source: drawSource,
})
export const snapnteraction = new Snap ({
    source: drawSource,
})

export function measure (geoType,feature,coordAr) {
    if (geoType === 'LineString') {
        let tDistance = 0
        for (var i = 0; i < coordAr.length - 1; i++) {
            // const fromCoord = turf.point(transform(coordAr[i], "EPSG:3857", "EPSG:4326"))
            // const toCoord = turf.point(transform(coordAr[i + 1], "EPSG:3857", "EPSG:4326"))
            const fromCoord = turf.point(turf.toWgs84(coordAr[i]))
            const toCoord = turf.point(turf.toWgs84(coordAr[i + 1]))
            tDistance = tDistance + turf.distance(fromCoord, toCoord, {units: 'kilometers'})
        }
        let tDistance2 = tDistance
        if (tDistance > 10) {
            // tDistance2 = tDistance
            tDistance = tDistance.toFixed(2) + 'km'
        } else {
            // tDistance2 = tDistance * 1000
            tDistance = (tDistance * 1000).toFixed(2) + 'm'
        }
        console.log(tDistance2)
        feature.setProperties({distance: tDistance})
        return {'tDistance':tDistance,'tDistance2':tDistance2}
    } else if (geoType === 'Polygon') {
        let tPolygon = turf.polygon(coordAr)
        tPolygon = turf.toWgs84(tPolygon)
        let tArea = turf.area(tPolygon)
        if (tArea < 1000000) {
            // tArea = String((Math.floor(tArea*100)/100)) + "m2"
            tArea = tArea.toFixed(2) + "m2"
        } else {
            // tArea = String((Math.floor(tArea/1000000*100)/100)) + "km2"
            tArea = (tArea / 1000000).toFixed(2) + "km2"
        }
        feature.setProperties({distance: tArea})
    } else if (geoType === 'Circle') {
        const extent = feature.getGeometry().getExtent()
        const fromCoord = turf.point(turf.toWgs84([extent[0],extent[1]]))
        const toCoord = turf.point(turf.toWgs84([extent[2],extent[1]]))
        let distance = turf.distance(fromCoord, toCoord, {units: 'kilometers'}) / 2
        if (distance > 10) {
            distance = '半径' + distance.toFixed(2) + 'km'
        } else {
            distance = '半径' + (distance * 1000).toFixed(2) + 'm'
        }
        feature.setProperties({distance: distance})
    }
}

function danmen(feature) {
    d3.select('#map01 .loadingImg').style("display","block")

    // const feature = event.feature
    const coordAr = feature.getGeometry().getCoordinates()
    const geoType = feature.getGeometry().getType()
    console.log(feature)
    console.log(coordAr)
    console.log(geoType)
    if (geoType !==  'LineString') return
    const tDistance = (measure (geoType,feature,coordAr).tDistance)
    const tDistance2 = (measure (geoType,feature,coordAr).tDistance2)
    const splitCount = 300;
    const split = tDistance2/splitCount;
    const coodARsprit = []
    const kyoriArr = []
    for(let i = 0; i < splitCount; i++) {
        const line = turf.toWgs84(turf.lineString(coordAr));
        const kyori = split * i;
        const along = turf.along(line, kyori);
        const coord = along["geometry"]["coordinates"];
        coodARsprit.push(coord)
        kyoriArr.push(kyori)
    }

    async function created() {
        const fetchData = coodARsprit.map((coord) => {
            return axios
                .get('https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php',{
                    params: {
                        dataType: "json",
                        lon: coord[0],
                        lat: coord[1],
                    }
                })
        })
        await Promise.all([
            ...fetchData
        ])
            .then((response) => {
                d3.select('#map01 .loadingImg').style("display","none")

                console.log(response)
                const dataSet = response.map((valu,index) => {
                    let kyori = kyoriArr[index]
                    let tani
                    let erev
                    if (tDistance2 > 10) {
                        tani = 'km'
                    } else {
                        kyori = kyori * 1000
                        tani = 'm'
                    }
                    const coord =coodARsprit[index]
                    erev = valu.data.elevation
                    if (erev === "-----") erev = 0

                    return {'erev':erev,'kyori':kyori,
                        'tDistance': tDistance,'tDistance2': tDistance2, 'tani':tani, 'coord':coord}
                })
                dialogOpen(dataSet)
            })
            .catch(function (response) {
            })
    }
    function dialogOpen(dataSet){
        store.commit('base/incrDialog2Id');
        store.commit('base/incrDialogMaxZindex');
        const diialog =
            {
                id: store.state.base.dialog2Id,
                name:'erev',
                style: {
                    display: 'block',
                    top: '60px',
                    width: '500px',
                    // left: '10px',
                    right:'10px',
                    'z-index':store.state.base.dialogMaxZindex
                }
            }
        store.state.base.erevArr = dataSet
        console.log(dataSet)
        store.commit('base/pushDialogs2',{mapName: 'map01', dialog: diialog})
    }
    created()
}
danmenInteraction.on('drawend', function (event) {
    const feature = event.feature
    danmen(feature)
    history ('断面図')
})

modifyInteraction.on('modifyend', function (event) {
    console.log(event.features.array_[0].ol_uid)
    const feature = event.features.array_[0]
    const coordAr = event.features.array_[0].getGeometry().getCoordinates()
    const geoType = event.features.array_[0].getGeometry().getType()
    measure (geoType,feature,coordAr)
    moveEnd()
    if (store.state.base.drawType === 'danmen') danmen(feature)
})

drawLayer.getSource().on("change", function(e) {
    // moveEnd()
    history ('ドロー')
})

lineInteraction.on('drawend', function (event) {
    const feature = event.feature;
    const coordAr = feature.getGeometry().getCoordinates()
    const geoType = feature.getGeometry().getType()
    measure (geoType,feature,coordAr)
    moveEnd()
})

polygonInteraction.on('drawend', function (event) {
    const feature = event.feature;
    const coordAr = feature.getGeometry().getCoordinates()
    const geoType = feature.getGeometry().getType()
    measure (geoType,feature,coordAr)
})

circleInteraction.on('drawend', function (event) {
    const feature = event.feature;
    const coordAr = feature.getGeometry().getCoordinates()
    const geoType = feature.getGeometry().getType()
    measure (geoType,feature,coordAr)
})

export const transformInteraction = new Transform ({
    enableRotatedTransform: false,
    scale:false,
    rotate:false,
    keepRectangle: false,
    stretch:false,
})

// ダイアログ
export const dialog = new Dialog({ fullscreen: true, zoom: true, closeBox: true });

export const dialogMap = new Dialog({ hideOnClick: false, className: 'center' });
// dialogMap.on('button', function(e) {
//     alert(e.button)
// });
//-------------------------------------------------------------------------------------------
export const overlay = []
export function initMap (vm) {
    const map01 = document.getElementById('map01');
    map01.addEventListener('mouseleave', () => {
        moveEnd()
    })
    // const cesiumDiv = document.querySelector('.cesium-btn-div, .cesium-btn-up, .cesium-btn-down, .cesium-btn-left, .cesium-btn-right')
    // cesiumDiv.addEventListener("touchstart", (e) => {
    //     if (e.touches.length > 1) {
    //         e.preventDefault();
    //     }
    // }, { passive: false });

    // マップ作製ループ用の配列を作成
    const maps = [
        {mapName: 'map01', map:store.state.base.map01},
        {mapName: 'map02', map:store.state.base.map02},
        // {mapName: 'map03', map:store.state.base.map03},
        // {mapName: 'map04', map:store.state.base.map04}
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
        // const overlay = []
        overlay[i] = new Overlay({
            element: container,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        })
        closer.onclick = () => {
            overlay[i].setPosition(undefined);
            closer.blur();
            document.querySelector('.center-target').style.zIndex = 1
            return false;
        }
        const markerElement = document.getElementById(maps[i].mapName + '-marker');
        const marker = []
        marker[i] = new Overlay({
            element: markerElement
        })
        markerElement.onclick = () => {
            marker[i].setPosition(undefined);
            return false;
        }
        const currentPositionElement = document.getElementById(maps[i].mapName + '-current-position');
        const currentPosition = []
        currentPosition[i] = new Overlay({
            element: currentPositionElement
        })

        // マップ作製
        const mapName = maps[i].mapName
        const map = new Map({
            interactions: defaultInteractions().extend([
                new DragRotateAndZoom()
            ]),
            layers: [drawLayer],
            overlays: [overlay[i],marker[i],currentPosition[i]],
            target: mapName,
            view: view01
        });
        // マップをストアに登録
        store.commit('base/setMap', {mapName: maps[i].mapName, map});
        //デフォルトで設定されているインタラクション（PinchRotate）を使用不可に
        const interactions = map.getInteractions().getArray();
        const pinchRotateInteraction = interactions.filter(function(interaction) {
            return interaction instanceof PinchRotate;
        })[0];
        pinchRotateInteraction.setActive(false);

        // ------------------------
        pointInteraction.on('drawend', function (event) {
            const feature = event.feature;
            const coordAr = feature.getGeometry().getCoordinates()
            const geoType = feature.getGeometry().getType()
            store.state.base.editFeature = feature
            // map.removeInteraction(pointInteraction)
            store.state.base.togglePoint = false
            store.state.base.dialogs.dialogEdit.style.display = 'block'
            overlay[i].setPosition(undefined)
            moveEnd()
        })



        //-----------------------




        // コントロール追加---------------------------------------------------------------------------

        map.addControl(new ScaleLine());
        const notification = new Notification();
        map.addControl(notification);
        store.commit('base/setNotifications',{mapName:mapName, control: notification});
        if (i==1) {
            store.state.base.maps.map01.addInteraction(new Synchronize({ maps: [store.state.base.maps.map02]}));
            store.state.base.maps.map02.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01]}));
            // store.state.base.maps.map01.addInteraction(new Synchronize({ maps: [store.state.base.maps.map02,store.state.base.maps.map03,store.state.base.maps.map04]}));
            // store.state.base.maps.map02.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map03,store.state.base.maps.map04]}));
            // store.state.base.maps.map03.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map02,store.state.base.maps.map04]}));
            // store.state.base.maps.map04.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map02,store.state.base.maps.map03]}));
        }
        let dragAndDropInteraction;
        function setInteraction() {
            // const map = store.state.base.maps.map01;
            if (dragAndDropInteraction) {
                map.removeInteraction(dragAndDropInteraction);
            }
            dragAndDropInteraction = new DragAndDrop({
                formatConstructors: [
                    GPX,
                    GeoJSON,
                    IGC,
                    // use constructed format to set options
                    new KML({extractStyles: true}),
                    TopoJSON,
                ],
            })
            dragAndDropInteraction.on('addfeatures', function (event) {
                map.addInteraction(modifyInteraction)
                // map.addInteraction(transformInteraction)
                // const vectorSource = new VectorSource({
                //     features: event.features,
                // })
                event.features.forEach((feature) => {
                    drawLayer.getSource().addFeature(feature)
                })
                drawLayer.getSource().getFeatures().forEach((feature) =>{
                    if (feature.getGeometry().getType() === 'GeometryCollection') {
                        drawLayer.getSource().removeFeature(feature)
                        const distance = feature.getProperties().distance
                        console.log(feature.getProperties().distance)
                        const circle = new Circle(feature.get('center'), feature.get('radius'));
                        const newFeature = new Feature(circle);
                        newFeature.setProperties({distance: distance})
                        drawLayer.getSource().addFeature(newFeature)
                        moveEnd()
                    }
                })
                map.addLayer(drawLayer)
                map.getView().fit(drawLayer.getSource().getExtent())
            })
            map.addInteraction(dragAndDropInteraction)
        }
        setInteraction()
        //現在地取得
        // const success = (pos) =>{
        //     const lon = pos.coords.longitude;
        //     const lat = pos.coords.latitude;
        //     // map.getView().setCenter(transform([lon,lat],"EPSG:4326","EPSG:3857"));
        //     const center = transform([lon,lat],"EPSG:4326","EPSG:3857")
        //     map.getView().animate({
        //         center: center,
        //         duration: 500
        //     });
        // }
        // const  fail = (error) =>{alert('位置情報の取得に失敗しました。エラーコード：' + error.code)}
        // let interval
        // const stop = () => {clearInterval(interval)}
        // const  currentPosition = new Toggle(
        //     {	html: '<i class="fa-solid fa-location-crosshairs"></i>',
        //         // {	html: '現',
        //         className: "current-position",
        //         active:true,
        //         onToggle: function(active)
        //         {
        //             if(!active) {
        //                 notification.show("現在地を取得します。<br>戻すときはもう一回クリック",5000)
        //                 interval = setInterval(function(){
        //                     navigator.geolocation.getCurrentPosition(success, fail);
        //                 },2000);
        //             } else {
        //                 stop()
        //             }
        //         }
        //     }
        // );
        // if (mapName === 'map01') map.addControl(currentPosition);
        // コントロール追加ここまで----------------------------------------------------------------------

        // イベント追加---------------------------------------------------------------

        // フィーチャーにマウスがあたったとき
        map.on("pointermove",function(evt){
            //少しでも処理を早めるためにMw5レイヤーがあったら抜ける。-----------
            // const layers00 = evt.map.getLayers().getArray();
            // let mw5 = layers00.find(el => el.get('mw'));
            // if (mw5) return //ここで抜ける



            //ここを復活----------------------------------------------------------
            // document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "default"
            const map = evt.map;
            // const option = {
            //   layerFilter: function (layer) {
            //     return layer.get('name') === 'Mw5center' || layer.get('name') === 'Mw20center';
            //   }
            // };
            // const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            //     return feature;
            // })
            // if (feature) {
            //     document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "pointer"
            // }
            // // --------------------------------------------------------------------------------



            // // 特定のラスターでカーソルを変える
            const pixel = (map).getPixelFromCoordinate(evt.coordinate);
            const layersObj = [];
            //マウスがあたった箇所のレイヤーを複数取得する
            (map).forEachLayerAtPixel(pixel,function(layer, rgba){
                // console.log(layer.get('name'))
                layersObj.push({
                    layer,
                    rgba
                });
            })
            // let layerNames = layersObj.filter((object) =>{
            //     if (object.layer.get('name') === 'drawSource') return
            //     if (object.layer.get('name') === 'drawLayer2') return
            //     if (object.layer.get('name') === undefined) return
            //     return object
            // })
            const layerNames = layersObj.map((object) =>{
                return object.layer.get('name')
            })
            async function pointerCreate() {
                let fetchData = layerNames.map((layerName) => {
                    let server
                    let zoom
                    // console.log(layerName)
                    switch (layerName) {
                        case 'shinsuishin':
                            server = 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin/'
                            zoom = 17
                            break
                        case 'shinsuishinK':
                            server = 'https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_newlegend_kuni_data/'
                            zoom = 17
                            break
                        case 'tunami':
                            server = 'https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/'
                            zoom = 17
                            break
                        case 'keizoku':
                            server = 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_keizoku_kuni_data/'
                            zoom = 17
                            break
                        case 'takasio':
                            server = 'https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/'
                            zoom = 17
                            break
                        case 'tameike':
                            server = 'https://disaportal.gsi.go.jp/data/raster/07_tameike/'
                            zoom = 17
                            break
                        case 'ekizyouka':
                            server = 'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_zenkoku/'
                            zoom = 15
                            break
                        case 'dosya':
                            server = 'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/'
                            zoom = 17
                            break
                        case 'doseki':
                            server = 'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukikenkeiryu/'
                            zoom = 17
                            break
                        case 'kyuukeisya':
                            server = 'https://disaportaldata.gsi.go.jp/raster/05_kyukeisyachihoukai/'
                            zoom = 17
                            break
                        case 'zisuberi':
                            server = 'https://disaportaldata.gsi.go.jp/raster/05_jisuberikikenkasyo/'
                            zoom = 17
                            break
                        case 'nadare':
                            server = 'https://disaportaldata.gsi.go.jp/raster/05_nadarekikenkasyo/'
                            zoom = 17
                            break
                        case 'jisin':
                            server = 'https://maps.gsi.go.jp/xyz/jishindo_yosoku/'
                            zoom = 15
                            break
                        case 'morido':
                            server = 'https://disaportaldata.gsi.go.jp/raster/daikiboumoritsuzouseichi/'
                            zoom = 15
                            break
                        case 'dojyou':
                            server = 'https://soil-inventory.rad.naro.go.jp/tile/figure/'
                            zoom = 12
                            break
                        case 'sitti':
                            server = 'https://cyberjapandata.gsi.go.jp/xyz/swale/'
                            zoom = 16
                            break
                        case 'nantoraraster':
                            server = 'https://kenzkenz3.xsrv.jp/mvt/miyazaki/nantoraraster2/'
                            zoom = 15
                            break
                        case 'nantorashindraster':
                            server = 'https://kenzkenz3.xsrv.jp/mvt/miyazaki/nantorashindoraster/'
                            zoom = 13
                            break
                        case 'nantoraekijyokaraster':
                            server = 'https://kenzkenz3.xsrv.jp/mvt/miyazaki/nantoraekijyokaraster/'
                            zoom = 13
                            break
                    }
                    if (server) return getRgb0(evt,server,zoom)
                })
                fetchData = fetchData.filter((v) =>{
                    return v
                })
                await Promise.all([
                    ...fetchData
                ])
                    .then((response) => {
                        let flg = false
                        response.forEach((v) =>{
                            if (v[3]) flg = true
                        })
                        if (flg) {
                            document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "pointer"
                        } else {
                            document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "default"
                            const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                                return feature;
                            })
                            if (feature) {
                                document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "pointer"
                            } else {
                                document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "default"
                            }
                        }
                        rgbaArr = []
                        funcArr = []
                    })
            }
            if (window.innerWidth > 1000) pointerCreate()



            // OL6ではバグのため動かない。無理やり動かすにはlayer.jsのレイヤーにthis.className = 'hoge'と
            // 入れるといいが今度は合成が効かなくなる
            // const pixel = (map).getPixelFromCoordinate(evt.coordinate);
            // const layers = [];
            // const layers00 = evt.map.getLayers().getArray();
            // let mw5 = layers00.find(el => el.get('mw'));
            // if (mw5) return
            // if (!mw5) {
            //     try {
            //         (map).forEachLayerAtPixel(evt.pixel,function(layer){
            //             layers.push(layer);
            //         });
            //     } catch (error) {}
            // }
            // const tgtLayers = layers.filter(function(layer) {
            //     return layer.get('pointer');
            // })
            // if (tgtLayers.length>0) {
            //     document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "pointer"
            // }
        });
        // シングルクリック------------------------------------------------------------------------------------

        // 洪水,津波,継続,普通のフィーチャー用-----------------------------------------------------------------


        map.on('singleclick', function (evt) {
            rgbaArr = []
            funcArr = []
            overlay[i].setPosition(undefined)
            d3.select('#' + mapName + ' .loadingImg').style("display","block")
            document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "wait"
            // document.querySelector('.center-target').style.zIndex = 1
            // store.commit('base/popUpContReset')
            // //処理を早くするため抜ける。---------------------------------------------------
            // const layers0 = map.getLayers().getArray();
            // const hazardLayers = layers0.filter(el => el.get('pointer'));
            // if (hazardLayers.length===0) return
            //-------------------------------------------------------------------------
            // d3.select('.loadingImg').style("display","block")
            const pixel = (map).getPixelFromCoordinate(evt.coordinate);
            const layersObj = [];
            //マウスがあたった箇所のレイヤーを複数取得する
            (map).forEachLayerAtPixel(pixel,function(layer, rgba){
                // console.log(layer.get('name'))
                layersObj.push({
                    layer,
                    rgba
                });
            })
            let layerNames = layersObj.filter((object) =>{
                if (object.layer.get('name') === 'drawSource') return
                if (object.layer.get('name') === 'drawLayer2') return
                if (object.layer.get('name') === undefined) return
                return object
            })
            layerNames = layerNames.map((object) =>{
                return object.layer.get('name')
            })
            // シームレス地質図-------------------------------------------------------------------------------
            function popupSeamless(evt) {
                return new Promise(resolve => {
                    const coordinate = evt.coordinate;
                    const coord4326 = transform(coordinate, "EPSG:3857", "EPSG:4326");
                    const point = coord4326[1] + "," + coord4326[0];
                    const url = 'https://gbank.gsj.jp/seamless/v2/api/1.2/legend.json'
                    axios.get(url, {
                        params: {
                            point:point
                        }
                    }) .then(function (response) {
                        // console.log(response.data.symbol)
                        if (response.data.symbol) {
                            const cont =
                                '<div style=width:300px>形成時代 = ' + response.data["formationAge_ja"] +
                                '<hr>グループ = ' + response.data["group_ja"] +
                                '<hr>岩相 = ' + response.data["lithology_ja"] + '</div>'
                            resolve(cont)
                        } else {
                            resolve('')
                        }
                    });
                })
            }
            // -------------------------------------------------------------------------------
            async function popupCreate() {
                const fetchData = layerNames.map((layerName) => {
                    let server
                    let zoom
                    let func
                    switch (layerName) {
                        case 'shinsuishin':
                            server = 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin/'
                            zoom = 17
                            func = PopUp.popUpShinsuishin
                            break
                        case 'shinsuishinK':
                            server = 'https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_newlegend_kuni_data/'
                            zoom = 17
                            func = PopUp.popUpShinsuishin
                            break
                        case 'tunami':
                            server = 'https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/'
                            zoom = 17
                            func = PopUp.popUpTunami
                            break
                        case 'keizoku':
                            server = 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_keizoku_kuni_data/'
                            zoom = 17
                            func = PopUp.popUpKeizoku
                            break
                        case 'takasio':
                            server = 'https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/'
                            zoom = 17
                            func = PopUp.popUpTakasio
                            break
                        case 'tameike':
                            server = 'https://disaportal.gsi.go.jp/data/raster/07_tameike/'
                            zoom = 17
                            func = PopUp.popUpTameike
                            break
                        case 'ekizyouka':
                            server = 'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_zenkoku/'
                            zoom = 15
                            func = PopUp.popUpEkizyouka
                            break
                        case 'dosya':
                            server = 'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/'
                            zoom = 17
                            func = PopUp.popUpDosya
                            break
                        case 'doseki':
                            server = 'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukikenkeiryu/'
                            zoom = 17
                            func = PopUp.popUpDoseki
                            break
                        case 'kyuukeisya':
                            server = 'https://disaportaldata.gsi.go.jp/raster/05_kyukeisyachihoukai/'
                            zoom = 17
                            func = PopUp.popUpKyuukeisya
                            break
                        case 'zisuberi':
                            server = 'https://disaportaldata.gsi.go.jp/raster/05_jisuberikikenkasyo/'
                            zoom = 17
                            func = PopUp.popUpZisuberi
                            break
                        case 'nadare':
                            server = 'https://disaportaldata.gsi.go.jp/raster/05_nadarekikenkasyo/'
                            zoom = 17
                            func = PopUp.popUpNadare
                            break
                        case 'jisin':
                            server = 'https://maps.gsi.go.jp/xyz/jishindo_yosoku/'
                            zoom = 15
                            func = PopUp.popUpJisin
                            break
                        case 'morido':
                            server = 'https://disaportaldata.gsi.go.jp/raster/daikiboumoritsuzouseichi/'
                            zoom = 15
                            func = PopUp.popUpMorido
                            break
                        case 'dojyou':
                            server = 'https://soil-inventory.rad.naro.go.jp/tile/figure/'
                            zoom = 12
                            func = PopUp.popUpDojyou
                            break
                        case 'sitti':
                            server = 'https://cyberjapandata.gsi.go.jp/xyz/swale/'
                            zoom = 16
                            func = PopUp.popUpTisitu
                            break
                        case 'nantoraraster':
                            server = 'https://kenzkenz3.xsrv.jp/mvt/miyazaki/nantoraraster2/'
                            zoom = 15
                            func = PopUp.popUpNantora
                            break
                        case 'nantorashindraster':
                            server = 'https://kenzkenz3.xsrv.jp/mvt/miyazaki/nantorashindoraster/'
                            zoom = 13
                            func = PopUp.popUpNantoraShindo
                            break
                        case 'nantoraekijyokaraster':
                            server = 'https://kenzkenz3.xsrv.jp/mvt/miyazaki/nantoraekijyokaraster/'
                            zoom = 13
                            func = PopUp.popUpNantoraEkijyoka
                            break
                    }
                    if (server) return getRgb0(evt,server,zoom,func)
                })
                // ----------------------------------------------------
                const layers0 = map.getLayers().getArray()
                const seamlessLayer = layers0.find(el => el.get('name') === 'seamless')
                if (seamlessLayer) {
                    if (seamlessLayer.getVisible()) fetchData.push(popupSeamless(evt))
                }
                // ------------------------------------------------------
                // console.log(fetchData)
                await Promise.all([
                    ...fetchData
                ])
                    .then((response) => {
                        // console.log(response)
                        // console.log(rgbaArr,funcArr)
                        let html = ''
                        const aaa = rgbaArr.map((rgba,i) =>{
                            return {'layerName':layerNames[i] ,'rgba':rgba,'func':funcArr[i]}
                        })
                        // console.log(html)
                        aaa.forEach((value) =>{
                            if (value.func(value.rgba)) html += value.func(value.rgba)
                        })
                        if (seamlessLayer) html += response[response.length-1]
                        if (html) html += '<hr>'
                        // console.log(html)
                        const pixel = (evt.map).getPixelFromCoordinate(evt.coordinate);
                        const features = [];
                        const layers = [];
                        evt.map.forEachFeatureAtPixel(pixel,function(feature,layer){
                            features.push(feature);
                            layers.push(layer);
                        })
                        if(features.length) {
                            if (layers[0]) {
                                PopUp.popUp(evt.map, layers, features, overlay[i], evt, content, html)
                                rgbaArr = []
                                funcArr = []
                            }
                        } else {
                            PopUp.popUp(evt.map,null,null,overlay[i],evt,content, html)
                            rgbaArr = []
                            funcArr = []
                        }
                        d3.select('#' + mapName + ' .loadingImg').style("display","none")
                        document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "default"
                    })
            }
            popupCreate()
        })
        // 大正古地図用-----------------------------------------------------------------
        map.on('singleclick', function (evt) {

            const feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature) {
                    return feature;
                });
            if (feature) return;


            //少しでも処理を早めるために古地図レイヤーがなかったら抜ける。
            const layers = map.getLayers().getArray();
            let kotizuLayer = layers.find(el => el.get('dep'));
            if (!kotizuLayer) return //ここで抜ける

            //  洪水浸水想定と重ねるときは動作させない
            const layers0 = map.getLayers().getArray();
            const hazardLayers = layers0.filter(el => el.get('pointer'));
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
            drawLayer2.setZIndex(maxZndex)
        })
        //--------------------------------------------------------------------------------
        // シームレス地質図ポップアップ用
        map.on('singleclick', function (evt) {
            // const layers0 = map.getLayers().getArray();
            // const seamlessLayer = layers0.find(el => el.get('name') === 'seamless');
            // if (seamlessLayer) PopUp.popupSeamless(overlay[i],evt,content)
        })
        //------------------------------------------------------------------------------------------------------
        // 米軍地形図用
        map.on('singleclick', function (evt) {


            const feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature) {
                    return feature;
                });
            if (feature) return;


            const layers = map.getLayers().getArray();
            //  洪水浸水想定と重ねるときは動作させない
            const hazardLayers = layers.filter(el => el.get('pointer'));
            if (hazardLayers.length>0) return

            const resultUsaAll = layers.find(el => el === Layers.usaall[mapName]);
            const resultUsatokyoall = layers.find(el => el === Layers.usatokyoall[mapName]);
            let gLayers;
            if (resultUsaAll || resultUsatokyoall) {
                if (resultUsaAll) gLayers = Layers.usaall[mapName].values_.layers.array_;
                if (resultUsatokyoall) gLayers = Layers.usatokyoall[mapName].values_.layers.array_;
                // console.log(gLayers.length)
                const lon = evt.coordinate[0], lat = evt.coordinate[1];
                for (let i in gLayers) {
                    const extent2 = gLayers[i].values_['extent2'];
                    if(extent2) {
                        const lonMin = extent2[0], lonMax = extent2[2], latMin = extent2[1], latMax = extent2[3];
                        if (lonMin < lon && lonMax > lon) {
                            if (latMin < lat && latMax > lat) {
                                maxZndex++
                                gLayers[i].setZIndex(maxZndex)

                            } else {
                                gLayers[i].setZIndex(undefined)
                            }
                        }
                    }
                }

                drawLayer2.setZIndex(maxZndex)

            }
        })

        //------------------------------------------------------------------------------------------------------
        // 旧版地形図用
        map.on('singleclick', function (evt) {
            const map = evt.map;
            const option = {
                layerFilter: function (layer) {
                    return layer.get('name') === 'Mw5center'
                        || layer.get('name') === 'Mw20center'
                        || layer.get('name') === 'drawLayer2';
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
                const mwId = prop.id
                if (uri) {
                    store.commit('base/updateDialogShow',true)
                    store.commit('base/updateSuUrl', uri)
                    store.commit('base/updateMwId', mwId)
                }
                return
            }
            //  洪水浸水想定と重ねるときは動作させない
            const layers0 = map.getLayers().getArray();
            const hazardLayers = layers0.filter(el => el.get('pointer'));
            if (hazardLayers.length>0) return

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

                drawLayer2.setZIndex(maxZndex)

            }
        })

        const removeLastPoint = function(evt){
            // console.log(evt.keyCode)
            if(evt.keyCode == 27){
                // const selectCollection = selectInteraction.getFeatures();
                // drawLayer.getSource().removeFeature(selectCollection.item(0))
                lineInteraction.removeLastPoint()
                polygonInteraction.removeLastPoint()
                circleInteraction.removeLastPoint()
            }
        }
        if (i == 0) {
            document.addEventListener('keydown', removeLastPoint, false)
        }

        // const selectInteraction = new Select({
        //     layers: [drawLayer]
        // })
        // map.addInteraction(selectInteraction)


        map.on('click', function (evt) {
            // const pixel = map.getPixelFromCoordinate(evt.coordinate);
            // const features = [];
            // const layers = [];
            // map.forEachFeatureAtPixel(pixel,function(feature,layer){
            //     features.push(feature);
            //     layers.push(layer);
            // })
            // console.log(features[1].getProperties())
            // console.log(layers)
            // layers[1].getSource().removeFeature(features[1])
        })

        // 普通のフィーチャー用------------------------------------------------------------

        // map.on('singleclick', function (evt) {
        //     // moveEnd()
        //     // dialogMap.show({ content: 'Hello World!', title: 'Hello'})
        //     document.querySelector('.center-target').style.zIndex = 1
        //     // console.log(JSON.stringify(transform(evt.coordinate, "EPSG:3857", "EPSG:4326")));
        //     overlay[i].setPosition(undefined)
        //     const pixel = (evt.map).getPixelFromCoordinate(evt.coordinate);
        //     const features = [];
        //     const layers = [];
        //     evt.map.forEachFeatureAtPixel(pixel,function(feature,layer){
        //         features.push(feature);
        //         layers.push(layer);
        //     })
        //     console.log(layers,features)
        //     if(features.length){
        //         if(layers[0]) {
        //             PopUp.popUp(evt.map,layers,features,overlay[i],evt,content)
        //             return
        //         }
        //     }
        // })

        // シングルクリック終わり
        //----------------------------------------------------------------------------------------
        const getElevation = (event) =>{
            let z = Math.floor(map.getView().getZoom())
            if(z>9) z=9;
            // const coord = event.coordinate // こっちにするとマウスの標高を取得する。
            const coord =map.getView().getCenter()
            const R = 6378137;// 地球の半径(m);
            const x = ( 0.5 + coord[ 0 ] / ( 2 * R * Math.PI ) ) * Math.pow( 2, z );
            const y = ( 0.5 - coord[ 1 ] / ( 2 * R * Math.PI ) ) * Math.pow( 2, z );
            const e = event;
            const zoom = String(Math.floor(map.getView().getZoom() * 100) / 100)
            // vm.zoom[mapName] = 'zoom=' + zoom
            // vm.zoom[mapName] = ''
            getElev( x, y, z, function( h ) {
                // const zoom = String(Math.floor(map.getView().getZoom() * 100) / 100)
                if (h !=='e') {
                    // console.log(h)
                    vm.zoom[mapName] = 'zoom=' + zoom + '  中心の標高' + h + 'm'
                } else {
                    // vm.zoom[mapName] = 'zoom=' + zoom
                    vm.zoom[mapName] = '標高取得できませんでした。'
                }
            } );
            // const zoom = String(Math.floor(map.getView().getZoom() * 100) / 100)
            // vm.zoom[mapName] = 'zoom=' + zoom
        }
        // const win = window.navigator.userAgent.includes('Win')
        map.on('moveend', function (event) {
            // console.log(777)
            moveEnd()
            getElevation(event)
            // map.render();
        });
        map.on("pointermove",function(event){
            getElevation(event)
        });
        // ****************
        // 産総研さん作成の関数
        // getElev, タイル座標とズームレベルを指定して標高値を取得する関数
        //  rx, ry: タイル座標(実数表現）z: ズームレベル
        //	thenは終了時に呼ばれるコールバック関数
        //	成功時には標高(単位m)，無効値の場合は'e'を返す
        // ****************
        function getElev( rx, ry, z, then ) {
            // const elevServer = 'https://gsj-seamless.jp/labs/elev2/elev/' // 海あり
            const elevServer = 'https://tiles.gsj.jp/tiles/elev/mixed/'
            // const elevServer = 'https://tiles.gsj.jp/tiles/elev/land/' // 陸地のみ
            const x = Math.floor( rx )				// タイルX座標
            const y = Math.floor( ry )				// タイルY座標
            const i = ( rx - x ) * 256			// タイル内i座標
            const j = ( ry - y ) * 256			// タイル内j座標
            const img = new Image();
            // let  h = 'e'
            img.crossOrigin = 'anonymous';
            img.alt = "";
            img.onload = function(){
                const canvas = document.createElement( 'canvas' )
                const context = canvas.getContext( '2d' )
                let  h = 'e'
                canvas.width = 1;
                canvas.height = 1;
                context.drawImage( img, i, j, 1, 1, 0, 0, 1, 1 );
                const data = context.getImageData( 0, 0, 1, 1 ).data;
                if (data) {
                    if ( data[ 3 ] === 255 ) {
                        h = data[ 0 ] * 256 * 256 + data[ 1 ] * 256 + data[ 2 ];
                        h = ( h < 8323072 ) ? h : h - 16777216;
                        h /= 100;
                    }
                }
                then( h );
            }
            // console.log(elevServer + z + '/' + y + '/' + x + '.png?res=cm')
            img.src = elevServer + z + '/' + y + '/' + x + '.png?res=cm';
        }
    }
}
// -------------------------------------------------------------------------------------
let rgbaArr = []
let funcArr = []
function getRgb( rx, ry, z, server) {
    return new Promise(resolve => {
        const x = Math.floor( rx )				// タイルX座標
        const y = Math.floor( ry )				// タイルY座標
        const i = ( rx - x ) * 256			// タイル内i座標
        const j = ( ry - y ) * 256			// タイル内j座標
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.alt = "";
        // ----------------------------------------
        // function load(_url){
        //     var xhr;
        //     xhr = new XMLHttpRequest();
        //     xhr.open("HEAD", _url,false);
        //     xhr.send(null);
        //     return xhr.status;
        // }
        // var url = server + z + '/' + x + '/' + y + '.png';
        // if(load(url) != 200){
        //     resolve('err')
        // }
        // ----------------------------------------


        // const loadImage = async() => {
        //     const img = new Image();
        //     img.src = server + z + '/' + x + '/' + y + '.png';
        //     try {
        //         await img.decode()
        //         const canvas = document.createElement( 'canvas' )
        //         const context = canvas.getContext( '2d' )
        //         canvas.width = 1;
        //         canvas.height = 1;
        //         context.drawImage( img, i, j, 1, 1, 0, 0, 1, 1 );
        //         const rgb = context.getImageData( 0, 0, 1, 1 ).data;
        //         resolve(rgb)
        //     }catch(encodingError){
        //         resolve('err')
        //     }
        // }
        // loadImage()


        // img.src = server + z + '/' + x + '/' + y + '.png';
        // try {
        //     img.decode()
        //     const canvas = document.createElement( 'canvas' )
        //     const context = canvas.getContext( '2d' )
        //     canvas.width = 1;
        //     canvas.height = 1;
        //     context.drawImage( img, i, j, 1, 1, 0, 0, 1, 1 );
        //     const rgb = context.getImageData( 0, 0, 1, 1 ).data;
        //     resolve(rgb)
        // }catch(encodingError){
        //     resolve('err')
        // }


        img.onload = function(){
            const canvas = document.createElement( 'canvas' )
            const context = canvas.getContext( '2d' )
            canvas.width = 1;
            canvas.height = 1;
            context.drawImage( img, i, j, 1, 1, 0, 0, 1, 1 );
            const rgb = context.getImageData( 0, 0, 1, 1 ).data;
            resolve(rgb)
        }
        img.onerror = function(){
            resolve('err')
        }
        img.src = server + z + '/' + x + '/' + y + '.png';

    })
}
//-----------------------------------------------------------------------------------
async function getRgb0(event,server,zoom,func) {
    let z
    if (zoom) {
        z= zoom
    // } else {
    //     z = Math.floor(map.getView().getZoom());
    }
    const coord = event.coordinate
    const R = 6378137;// 地球の半径(m);
    const x = ( 0.5 + coord[ 0 ] / ( 2 * R * Math.PI ) ) * Math.pow( 2, z );
    const y = ( 0.5 - coord[ 1 ] / ( 2 * R * Math.PI ) ) * Math.pow( 2, z );
    const result = await getRgb( x, y, z, server);
    if (result) {
        // console.log(result)
        rgbaArr.push(result)
        funcArr.push(func)
        return result
    }

}

//現在地取得
let interval
export function currentPosition () {
    const bottomRightDivOlbtn = document.querySelector('.bottom-right-div .olbtn')

    const currentPosition1 = store.state.base.maps['map01'].overlays_.getArray()[2]
    const currentPosition2 = store.state.base.maps['map02'].overlays_.getArray()[2]
    // const currentPosition3 = store.state.base.maps['map03'].overlays_.getArray()[2]
    // const currentPosition4 = store.state.base.maps['map04'].overlays_.getArray()[2]

    store.commit('base/toggleCurrentPosition')
    const map = store.state.base.maps['map01'];
    const success = (pos) =>{
        const lon = pos.coords.longitude;
        const lat = pos.coords.latitude;
        // map.getView().setCenter(transform([lon,lat],"EPSG:4326","EPSG:3857"));
        const center = transform([lon,lat],"EPSG:4326","EPSG:3857")
        map.getView().animate({
            center: center,
            duration: 500
        });
        currentPosition1.setPosition(center)
        currentPosition2.setPosition(center)
        // currentPosition3.setPosition(center)
        // currentPosition4.setPosition(center)
    }
    const  fail = (error) =>{alert('位置情報の取得に失敗しました。エラーコード：' + error.code)}
    // let interval
    const stop = () => {clearInterval(interval)}
    if (store.state.base.currentPosition) {
        bottomRightDivOlbtn.style.backgroundColor = "red"
        interval = setInterval(function(){
            navigator.geolocation.getCurrentPosition(success, fail);
        },1000);
    } else {
        bottomRightDivOlbtn.style.backgroundColor = ""
        stop()
        currentPosition1.setPosition(undefined)
        currentPosition2.setPosition(undefined)
        // currentPosition3.setPosition(undefined)
        // currentPosition4.setPosition(undefined)
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
        // store.state.base.maps.map03.setView(viewArr[1]);
        // store.state.base.maps.map04.setView(viewArr[2]);
        // console.log(store.state.base.maps.map01.interactions)
        store.state.base.maps.map01.removeInteraction(store.state.base.maps.map01.getInteractions().array_[10])
        store.state.base.maps.map02.removeInteraction(store.state.base.maps.map02.getInteractions().array_[10])
        // store.state.base.maps.map03.removeInteraction(store.state.base.maps.map03.getInteractions().array_[10])
        // store.state.base.maps.map04.removeInteraction(store.state.base.maps.map04.getInteractions().array_[10])
        // 2回削除する。
        store.state.base.maps.map01.removeInteraction(store.state.base.maps.map01.getInteractions().array_[10])
        store.state.base.maps.map02.removeInteraction(store.state.base.maps.map02.getInteractions().array_[10])
        // store.state.base.maps.map03.removeInteraction(store.state.base.maps.map03.getInteractions().array_[10])
        // store.state.base.maps.map04.removeInteraction(store.state.base.maps.map04.getInteractions().array_[10])
    } else {
        store.state.base.maps.map02.setView(map01View);
        // store.state.base.maps.map03.setView(map01View);
        // store.state.base.maps.map04.setView(map01View)
        store.state.base.maps.map01.addInteraction(new Synchronize({ maps: [store.state.base.maps.map02,store.state.base.maps.map03,store.state.base.maps.map04]}));
        store.state.base.maps.map02.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map03,store.state.base.maps.map04]}));
    //     store.state.base.maps.map03.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map02,store.state.base.maps.map04]}));
    //     store.state.base.maps.map04.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map02,store.state.base.maps.map03]}));
    }
}

export function resize () {
    store.state.base.maps.map01.updateSize();
    store.state.base.maps.map02.updateSize();
    // store.state.base.maps.map03.updateSize();
    // store.state.base.maps.map04.updateSize()
}

export function history (layer,url) {
    const ua = navigator.userAgent
    const width = window.screen.width;
    const height = window.screen.height;
    const referrer = document.referrer
    axios
        .get('https://kenzkenz.xsrv.jp/open-hinata/php/layer.php',{
            params: {
                layer: layer,
                screen: width + ' x ' + height,
                ua: ua,
                referrer:referrer,
                url: url
            }
        })
}

export function watchLayer (map, thisName, newLayerList,oldLayerList) {
    //まず最初に全てのレイヤー（old）を削除する。
    oldLayerList[0].forEach(value => {
        map.removeLayer(value.layer);
    })

    // console.log(newLayerList)
    // const layer = newLayerList[0][0].title
    // history (layer)
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
        layer['myZindex'] = myZindex++

        map.addLayer(layer);
        if (newLayerList[0][i].check === undefined) {
            newLayerList[0][i].check = true
            layer.setVisible(true)
        } else {
            layer.setVisible(newLayerList[0][i].check)
        }

        if (layer.values_.layers) {
            const gLayers = layer.values_.layers.array_;
            for (let j in gLayers) {
                if (newLayerList[0][i].multipli===false) {
                    gLayers[j].on("prerender", function (evt) {
                        evt.context.globalCompositeOperation = 'source-over';
                    });
                    gLayers[j].on("postrender", function (evt) {
                        evt.context.globalCompositeOperation = '';
                    });
                } else if (newLayerList[0][i].multipli===undefined) {
                    if (layer.get('multiply')) {
                        newLayerList[0][i].multipli = true
                        gLayers[j].on("prerender", function (evt) {
                            evt.context.globalCompositeOperation = 'multiply';
                        });
                        gLayers[j].on("postrender", function (evt) {
                            evt.context.globalCompositeOperation = 'source-over';
                        })
                    } else {
                        gLayers[j].on("prerender", function (evt) {
                            evt.context.globalCompositeOperation = 'source-over';
                        });
                        gLayers[j].on("postrender", function (evt) {
                            evt.context.globalCompositeOperation = '';
                        })
                    }
                } else {
                    gLayers[j].on("prerender", function(evt){
                        evt.context.globalCompositeOperation = 'multiply';
                    });
                    gLayers[j].on("postrender", function(evt){
                        evt.context.globalCompositeOperation = 'source-over';
                    });
                }
            }
        }
        if (newLayerList[0][i].multipli===false) {
            layer.on("prerender", function (evt) {
                evt.context.globalCompositeOperation = 'source-over';
            });
            layer.on("postrender", function (evt) {
                evt.context.globalCompositeOperation = '';
            })
        } else if(newLayerList[0][i].multipli===undefined) {
            if (layer.get('multiply')) {
                newLayerList[0][i].multipli = true
                layer.on("prerender", function (evt) {
                    evt.context.globalCompositeOperation = 'multiply';
                });
                layer.on("postrender", function (evt) {
                    evt.context.globalCompositeOperation = 'source-over';
                })
            } else {
                layer.on("prerender", function (evt) {
                    evt.context.globalCompositeOperation = 'source-over';
                });
                layer.on("postrender", function (evt) {
                    evt.context.globalCompositeOperation = '';
                })
            }
        } else {
            layer.on("prerender", function(evt){
                evt.context.globalCompositeOperation = 'multiply';
            });
            layer.on("postrender", function(evt){
                evt.context.globalCompositeOperation = 'source-over';
            });
        }

        // グループレイヤーのとき
        if (layer.values_.layers) {
            layer.values_.layers.getArray(0).forEach(object =>{
                object.setOpacity(newLayerList[0][i].opacity)
            })
        }
        layer.setOpacity(newLayerList[0][i].opacity)
        // 新規追加したレイヤーだけにズームとセンターを設定する。
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
    // drawLayer.set("altitudeMode","clampToGround")
    map.removeLayer(drawLayer)
    map.addLayer(drawLayer)
    map.removeLayer(drawLayer2)
    map.addLayer(drawLayer2)
    map.removeLayer(danmenLayer)
    map.addLayer(danmenLayer)
}

export function opacityChange (item) {
    // グループレイヤーのとき
    if (item.layer.values_.layers) {
        item.layer.values_.layers.getArray(0).forEach(object =>{
            object.setOpacity(item.opacity)
        })
    }
    item.layer.setOpacity(item.opacity);
}

export function checkLayer (item, layerList, name) {
    store.commit('base/updateList', {value: layerList, mapName: name});
    try {
        if (item.check===false) {
            item.layer.setVisible(false)
        }else{
            item.layer.setVisible(true)
        }
    } catch( e ) {
    }
}
export function multipliLayer (item, layerList, name) {
    store.commit('base/updateList', {value: layerList, mapName: name});
    const map = store.state.base.maps[name];
    console.log(item.multipli)
    console.log(item.layer)
    if (item.layer.values_.layers) {
        const gLayers = item.layer.values_.layers.array_;
        for (let i in gLayers) {
            if (item.multipli===false) {
                gLayers[i].on("prerender", function(evt){
                    evt.context.globalCompositeOperation = 'source-over';
                });
                gLayers[i].on("postrender", function(evt){
                    evt.context.globalCompositeOperation = '';
                });
            }else{
                gLayers[i].on("prerender", function(evt){
                    evt.context.globalCompositeOperation = 'multiply';
                });
                gLayers[i].on("postrender", function(evt){
                    evt.context.globalCompositeOperation = 'source-over';
                });
            }
        }
    }

    if (item.multipli===false) {
        item.layer.on("prerender", function(evt){
            evt.context.globalCompositeOperation = 'source-over';
        });
        item.layer.on("postrender", function(evt){
            evt.context.globalCompositeOperation = '';
        });
    } else {
        console.log(item.layer)
        // item.layer.className = 'hoge'
        item.layer.on("prerender", function(evt){
            evt.context.globalCompositeOperation = 'multiply';
        });
        item.layer.on("postrender", function(evt){
            evt.context.globalCompositeOperation = 'source-over';
        });
    }
    map.render();
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
export function addressSerch (name,address) {
    const map = store.state.base.maps[name];
    const marker1 = store.state.base.maps['map01'].overlays_.getArray()[1]
    const marker2 = store.state.base.maps['map02'].overlays_.getArray()[1]
    // const marker3 = store.state.base.maps['map03'].overlays_.getArray()[1]
    // const marker4 = store.state.base.maps['map04'].overlays_.getArray()[1]
    console.log(address)
    // 140.097, 37.856のように座標をいれた時の処理
    const splitAddress = address.split(',')
    let lonLat
    if (Number(splitAddress[0]) > Number(splitAddress[1])) {
        lonLat = [splitAddress[0],splitAddress[1]]
    } else {
        lonLat = [splitAddress[1],splitAddress[0]]
    }
    lonLat = transform(lonLat, "EPSG:4326", "EPSG:3857")
    if (lonLat[0] && lonLat[1]) {
        map.getView().setCenter(lonLat);
        map.getView().setZoom(14)
        marker1.setPosition(lonLat)
        return
    }
    // 通常の住所をいれた時の処理
    if (address === '') {
        marker1.setPosition(undefined);
        marker2.setPosition(undefined);
        // marker3.setPosition(undefined);
        // marker4.setPosition(undefined);
    } else {
        axios
            .get('https://msearch.gsi.go.jp/address-search/AddressSearch?q=' + address)
            .then(function (response) {
                const lonLat = response.data[0].geometry.coordinates
                map.getView().setCenter(transform(lonLat, "EPSG:4326", "EPSG:3857"));
                map.getView().setZoom(14)
                marker1.setPosition(transform(lonLat, "EPSG:4326", "EPSG:3857"));
                marker2.setPosition(transform(lonLat, "EPSG:4326", "EPSG:3857"));
            //     marker3.setPosition(transform(lonLat, "EPSG:4326", "EPSG:3857"));
            //     marker4.setPosition(transform(lonLat, "EPSG:4326", "EPSG:3857"));
            })
            .catch(function (error) {
            })
            .finally(function () {
            });
    }
}
export function ChangeFilter (item, layerList,name,presetName){
    if(presetName==='') {
        const layer = layerList.find((el) => el.id === item.id).layer;
        layer.removeFilter()
    } else {
        const layer = layerList.find((el) => el.id === item.id).layer;
        // const map = store.state.base.maps[name];
        // const layers = map.getLayers().getArray();
        console.log(presetName)
        const filter = new Colorize();
        layer.removeFilter()
        layer.addFilter(filter);
        filter.setFilter(presetName)
    }
}




