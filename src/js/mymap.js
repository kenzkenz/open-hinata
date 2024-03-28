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
import Colorize from 'ol-ext/filter/Colorize'
import Synchronize from 'ol-ext/interaction/Synchronize'
import Lego from 'ol-ext/filter/Lego'
import Notification from 'ol-ext/control/Notification'
import * as Layers from './layers'
import * as PopUp from './popup'
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import axios from "axios";
let maxZndex = 0;
let legoFilter = null;
import DragAndDrop from 'ol/interaction/DragAndDrop.js';
import PinchRotate from 'ol/interaction/PinchRotate';
import {GPX, GeoJSON, IGC, KML, TopoJSON} from 'ol/format.js';
import {standardFunction} from "@/js/layers-mvt";
import {popUpTisitu} from "./popup";
import layer from "@/components/Layer";
import {usatokyoall} from "./layers";
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
        closer.onclick = () => {
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

        //デフォルトで設定されているインタラクション（PinchRotate）を使用不可に
        const interactions = map.getInteractions().getArray();
        const pinchRotateInteraction = interactions.filter(function(interaction) {
            return interaction instanceof PinchRotate;
        })[0];
        pinchRotateInteraction.setActive(false);

        // コントロール追加---------------------------------------------------------------------------
        // const centerTarget = new Target({composite: 'difference'})
        // map.addControl(centerTarget);
        // map.removeControl(centerTarget)
        map.addControl(new ScaleLine());
        const notification = new Notification();
        map.addControl(notification);
        store.commit('base/setNotifications',{mapName:mapName, control: notification});
        if (i==3) {
            store.state.base.maps.map01.addInteraction(new Synchronize({ maps: [store.state.base.maps.map02,store.state.base.maps.map03,store.state.base.maps.map04]}));
            store.state.base.maps.map02.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map03,store.state.base.maps.map04]}));
            store.state.base.maps.map03.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map02,store.state.base.maps.map04]}));
            store.state.base.maps.map04.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map02,store.state.base.maps.map03]}));
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
            });
            dragAndDropInteraction.on('addfeatures', function (event) {
                const vectorSource = new VectorSource({
                    features: event.features,
                });
                map.addLayer(
                    new VectorLayer({
                        source: vectorSource,
                        style: standardFunction(),
                        zIndex: 999999,
                        name: 'draganddrop'
                    })
                );
                map.getView().fit(vectorSource.getExtent());
            });
            map.addInteraction(dragAndDropInteraction);
        }
        setInteraction();
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

        // イベント追加---------------------------------------------------------------

        // フィーチャーにマウスがあたったとき
        map.on("pointermove",function(evt){
            //少しでも処理を早めるためにMw5レイヤーがあったら抜ける。-----------
            // const layers00 = evt.map.getLayers().getArray();
            // let mw5 = layers00.find(el => el.get('mw'));
            // if (mw5) return //ここで抜ける
            //----------------------------------------------------------
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
            // ----------------------------------
            // 特定のラスターでカーソルを変える
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
        // 洪水,津波,継続用-----------------------------------------------------------------
        map.on('singleclick', function (evt) {
            // 普通のフィーチャー用
            const pixel0 = (map).getPixelFromCoordinate(evt.coordinate);
            const features = [];
            const layers = [];
            (map).forEachFeatureAtPixel(pixel0,function(feature,layer){
                features.push(feature);
                layers.push(layer);
            });
            if(features.length){
                PopUp.popUp(map,layers,features,overlay[i],evt,content)
                return
            }
            //------------------------------------------------------
            store.commit('base/popUpContReset')
            //処理を早くするため抜ける。
            const layers0 = map.getLayers().getArray();
            const hazardLayers = layers0.filter(el => el.get('pointer'));
            if (hazardLayers.length===0) return
            //-------------------------------------------------------------------------
            const pixel = (map).getPixelFromCoordinate(evt.coordinate);
            const layersObj = [];
            //マウスがあたった箇所のレイヤーを複数取得する
            (map).forEachLayerAtPixel(pixel,function(layer, rgba){
                console.log(layer.get('name'))
                layersObj.push({
                    layer,
                    rgba
                });
            })
            layersObj.forEach(object =>{
                console.log(object.layer.get('name'))
                const getColor0 =  (event,server,popup,zoom) =>{
                    let z
                    if (zoom) {
                        z= zoom
                    } else {
                        z = Math.floor(map.getView().getZoom());
                    }
                    const coord = event.coordinate
                    const R = 6378137;// 地球の半径(m);
                    const x = ( 0.5 + coord[ 0 ] / ( 2 * R * Math.PI ) ) * Math.pow( 2, z );
                    const y = ( 0.5 - coord[ 1 ] / ( 2 * R * Math.PI ) ) * Math.pow( 2, z );
                    const e = event;
                    // const server = 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin/'
                    // document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "wait"
                    getColor( x, y, z, server,   function( rgb ) {
                        const coordinate = evt.coordinate;
                        popup(rgb,coordinate)
                        const cont = store.state.base.popUpCont
                        content.innerHTML = cont
                        if (cont.includes('undefined') || cont==='') {
                            overlay[i].setPosition(undefined)
                        } else {
                            overlay[i].setPosition(coordinate);
                        }
                        // document.querySelector('#' + mapName + ' .ol-viewport').style.cursor = "default"
                    } );
                }
                switch (object.layer.get('name')){
                    // case 'tunami':
                    case 'shinsuishin':
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin/',PopUp.popUpShinsuishin,17)
                        break;
                    case 'shinsuishinK':
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_newlegend_kuni_data/',PopUp.popUpShinsuishin,17)
                        break;
                    case 'tunami':
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/',PopUp.popUpTunami,17)
                        break;
                    case 'keizoku':
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_keizoku_kuni_data/',PopUp.popUpKeizoku,17)
                        break;
                    case 'takasio':
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/',PopUp.popUpTakasio,17)
                        break;
                    case 'dosya':
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/',PopUp.popUpDosya,17)
                        break;
                    case 'doseki':
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukikenkeiryu/',PopUp.popUpDoseki,17)
                        break;
                    case 'kyuukeisya':
                        // PopUp.popUpKyuukeisyai(object.rgba)
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/05_kyukeisyachihoukai/',PopUp.popUpKyuukeisyai,17)
                        break;
                    case 'zisuberi':
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/05_jisuberikikenkasyo/',PopUp.popUpZisuberi,17)
                        break;
                    case 'nadare':
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/05_nadarekikenkasyo/',PopUp.popUpNadare,17)
                        break;
                    case 'tameike':
                        getColor0(evt,'https://disaportal.gsi.go.jp/data/raster/07_tameike/',PopUp.popUpTameike,17)
                        break;
                    case 'ekizyouka':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_zenkoku/',PopUp.popUpEkizyouka,15)
                        break;
                    case 'ekizyouka01':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/01_hokkai/',PopUp.popUpEkizyouka01,15)
                        break;
                    case 'ekizyouka02':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/02_aomori/',PopUp.popUpEkizyouka02,15)
                        break;
                    case 'ekizyouka03':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/03_iwate/',PopUp.popUpEkizyouka03,15)
                        break;
                    case 'ekizyouka04':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/04_miyagi/',PopUp.popUpEkizyouka04,15)
                        break;
                    case 'ekizyouka05':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/05_akita/',PopUp.popUpEkizyouka05,15)
                        break;
                    case 'ekizyouka06':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/06_yamagata/',PopUp.popUpEkizyouka06,15)
                        break;
                    case 'ekizyouka07':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/07_fukushima/',PopUp.popUpEkizyouka07,15)
                        break;
                    case 'ekizyouka08':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/08_ibaraki/',PopUp.popUpEkizyouka08,15)
                        break;
                    case 'ekizyouka09':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/09_tochigi/',PopUp.popUpEkizyouka09,15)
                        break;
                    case 'ekizyouka10':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/10_gumma/',PopUp.popUpEkizyouka10,15)
                        break;
                    case 'ekizyouka12':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/12_chiba/',PopUp.popUpEkizyouka12,15)
                        break;
                    case 'ekizyouka13':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/13_tokyo/',PopUp.popUpEkizyouka13,15)
                        break;
                    case 'ekizyouka14':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/14_kanagawa/',PopUp.popUpEkizyouka14,15)
                        break;
                    case 'ekizyouka16':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/16_toyama/',PopUp.popUpEkizyouka16,15)
                        break;
                    case 'ekizyouka17':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/17_ishikawa/',PopUp.popUpEkizyouka17,15)
                        break;
                    case 'ekizyouka18':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/18_fukui/',PopUp.popUpEkizyouka18,15)
                        break;
                    case 'ekizyouka19':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/19_yamanashi/',PopUp.popUpEkizyouka19,15)
                        break;
                    case 'ekizyouka20':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/20_nagano/',PopUp.popUpEkizyouka20,15)
                        break;
                    case 'ekizyouka21':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/21_gifu/',PopUp.popUpEkizyouka21,15)
                        break;
                    case 'ekizyouka22':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/22_shizuoka/',PopUp.popUpEkizyouka22,15)
                        break;
                    case 'ekizyouka23':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/23_aichi/',PopUp.popUpEkizyouka23,15)
                        break;
                    case 'ekizyouka24':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/24_mie/',PopUp.popUpEkizyouka24,15)
                        break;
                    case 'ekizyouka25':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/25_shiga/',PopUp.popUpEkizyouka25,15)
                        break;
                    case 'ekizyouka26':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/26_kyoto/',PopUp.popUpEkizyouka26,15)
                        break;
                    case 'ekizyouka27':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/27_osaka/',PopUp.popUpEkizyouka27,15)
                        break;
                    case 'ekizyouka28':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/28_hyogo/',PopUp.popUpEkizyouka28,15)
                        break;
                    case 'ekizyouka29':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/29_nara/',PopUp.popUpEkizyouka29,15)
                        break;
                    case 'ekizyouka30':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/30_wakayama/',PopUp.popUpEkizyouka30,15)
                        break;
                    case 'ekizyouka31':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/31_tottori/',PopUp.popUpEkizyouka31,15)
                        break;
                    case 'ekizyouka32':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/32_shimane/',PopUp.popUpEkizyouka32,15)
                        break;
                    case 'ekizyouka33':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/33_okayama/',PopUp.popUpEkizyouka33,15)
                        break;
                    case 'ekizyouka34':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/34_hiroshima/',PopUp.popUpEkizyouka34,15)
                        break;
                    case 'ekizyouka35':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/35_yamaguchi/',PopUp.popUpEkizyouka35,15)
                        break;
                    case 'ekizyouka36':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/36_tokushima/',PopUp.popUpEkizyouka36,15)
                        break;
                    case 'ekizyouka37':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/37_kagawa/',PopUp.popUpEkizyouka37,15)
                        break;
                    case 'ekizyouka38':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/38_ehime/',PopUp.popUpEkizyouka38,15)
                        break;
                    case 'ekizyouka39':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/39_kochi/',PopUp.popUpEkizyouka39,15)
                        break;
                    case 'ekizyouka40':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/40_fukuoka/',PopUp.popUpEkizyouka40,15)
                        break;
                    case 'ekizyouka41':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/41_saga/',PopUp.popUpEkizyouka41,15)
                        break;
                    case 'ekizyouka42':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/42_nagasaki/',PopUp.popUpEkizyouka42,15)
                        break;
                    case 'ekizyouka43':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/43_kumamoto/',PopUp.popUpEkizyouka43,15)
                        break;
                    case 'ekizyouka44':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/44_oita/',PopUp.popUpEkizyouka44,15)
                        break;
                    case 'ekizyouka45':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/45_miyazaki/',PopUp.popUpEkizyouka45,15)
                        break;
                    case 'ekizyouka46':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/46_kagoshima/',PopUp.popUpEkizyouka46,15)
                        break;
                    case 'ekizyouka47':
                        getColor0(evt,'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_pref/47_okinawa/',PopUp.popUpEkizyouka47,15)
                        break;
                    case 'jisin':
                        getColor0(evt,'https://maps.gsi.go.jp/xyz/jishindo_yosoku/',PopUp.popUpJisin,15)
                        break;
                    case 'morido':
                        getColor0(evt,'https://disaportaldata.gsi.go.jp/raster/daikiboumoritsuzouseichi/',PopUp.popUpMorido,15)
                        break;
                    case 'dojyou':
                        getColor0(evt,'https://soil-inventory.rad.naro.go.jp/tile/figure/',PopUp.popUpDojyou,12)
                        break;
                    case 'sitti':
                        getColor0(evt,'https://cyberjapandata.gsi.go.jp/xyz/swale/',PopUp.popUpTisitu,16)
                        break;
                    default:
                }
            });
            // const coordinate = evt.coordinate;
            // const cont = store.state.base.popUpCont
            // content.innerHTML = cont
            // if (cont.includes('undefined') || cont==='') {
            //     overlay[i].setPosition(undefined)
            // } else {
            //     overlay[i].setPosition(coordinate);
            // }
            // store.commit('base/popUpContReset')
        })

         function getColor( rx, ry, z, server,then ) {
            // const elevServer = 'https://gsj-seamless.jp/labs/elev2/elev/'
            // const elevServer = 'https://tiles.gsj.jp/tiles/elev/mixed/'
            // const server = 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin/'
            const x = Math.floor( rx )				// タイルX座標
            const y = Math.floor( ry )				// タイルY座標
            const i = ( rx - x ) * 256			// タイル内i座標
            const j = ( ry - y ) * 256			// タイル内j座標
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.alt = "";
            img.onload = function(){
                const canvas = document.createElement( 'canvas' )
                const context = canvas.getContext( '2d' )
                let  h = 'e'
                canvas.width = 1;
                canvas.height = 1;
                context.drawImage( img, i, j, 1, 1, 0, 0, 1, 1 );
                const rgb = context.getImageData( 0, 0, 1, 1 ).data;
                console.log(rgb)
                then( rgb );
            }
            img.src = server + z + '/' + x + '/' + y + '.png';
        }
        // 大正古地図用-----------------------------------------------------------------
        map.on('singleclick', function (evt) {
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
        })
        //--------------------------------------------------------------------------------
// シームレス地質図ポップアップ用
        map.on('singleclick', function (evt) {
            const layers0 = map.getLayers().getArray();
            const seamlessLayer = layers0.find(el => el.get('name') === 'seamless');
            if (seamlessLayer) PopUp.popupSeamless(overlay[i],evt,content)
        })
//--------------------------------------------------------------------------------
// ポップアップ用
//         map.on('singleclick', function (evt) {
//             const pixel = (map).getPixelFromCoordinate(evt.coordinate);
//             const features = [];
//             const layers = [];
//             (map).forEachFeatureAtPixel(pixel,function(feature,layer){
//                 features.push(feature);
//                 layers.push(layer);
//             });
//             if(features.length){
//                 PopUp.popUp(map,layers,features,overlay[i],evt,content)
//             }
//         })
        //------------------------------------------------------------------------------------------------------
        // 米軍地形図用
        map.on('singleclick', function (evt) {
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
                console.log(gLayers.length)
                const lon = evt.coordinate[0], lat = evt.coordinate[1];
                for (let i in gLayers) {
                    const extent2 = gLayers[i].values_['extent2'];
                    if(extent2) {
                        const lonMin = extent2[0], lonMax = extent2[2], latMin = extent2[1], latMax = extent2[3];
                        if (lonMin < lon && lonMax > lon) {
                            if (latMin < lat && latMax > lat) {
                                maxZndex++
                                gLayers[i].setZIndex(maxZndex)

                                // if (gLayers[i].getZIndex()) {
                                //     gLayers[i].setZIndex(undefined)
                                // } else {
                                //     maxZndex++
                                //     gLayers[i].setZIndex(maxZndex)
                                // }

                            } else {
                                gLayers[i].setZIndex(undefined)
                            }
                        }
                    }
                }
            }
        })
        //------------------------------------------------------------------------------------------------------
        // 旧版地形図用
        map.on('singleclick', function (evt) {

            // 普通のフィーチャー用
            // const pixel00 = (evt.map).getPixelFromCoordinate(evt.coordinate);
            // const features = [];
            // const layers00 = [];
            // (evt.map).forEachFeatureAtPixel(pixel00,function(feature,layer){
            //     features.push(feature);
            //     layers00.push(layer);
            // });
            // if(features.length){
            //     PopUp.popUp(evt.map,layers00,features,overlay[i],evt,content)
            //     return
            // }
            //------------------------------------------------------

            console.log(JSON.stringify(transform(evt.coordinate, "EPSG:3857", "EPSG:4326")));
            const map = evt.map;

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
                const mwId = prop.id
                store.commit('base/updateDialogShow',true)
                store.commit('base/updateSuUrl', uri)
                store.commit('base/updateMwId', mwId)
            }
            // 普通のフィーチャー用
            const pixel00 = (evt.map).getPixelFromCoordinate(evt.coordinate);
            const features = [];
            const layers00 = [];
            (evt.map).forEachFeatureAtPixel(pixel00,function(feature,layer){
                features.push(feature);
                layers00.push(layer);
            });
            if(features.length){
                PopUp.popUp(evt.map,layers00,features,overlay[i],evt,content)
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
            }
        });
        //----------------------------------------------------------------------------------------
        const getElevation = (event) =>{
            let z = Math.floor(map.getView().getZoom())
            if(z>14) z=14;
            // const coord = event.coordinateこっちにするとマウスの標高を取得する。
            const coord =map.getView().getCenter()
            const R = 6378137;// 地球の半径(m);
            const x = ( 0.5 + coord[ 0 ] / ( 2 * R * Math.PI ) ) * Math.pow( 2, z );
            const y = ( 0.5 - coord[ 1 ] / ( 2 * R * Math.PI ) ) * Math.pow( 2, z );
            const e = event;
            getElev( x, y, z, function( h ) {
                const zoom = String(Math.floor(map.getView().getZoom() * 100) / 100)
                if (h !=='e') {
                    // console.log(h)
                    vm.zoom[mapName] = 'zoom=' + zoom + '  中心の標高' + h + 'm'
                } else {
                    vm.zoom[mapName] = 'zoom=' + zoom
                }
            } );

            // const zoom = String(Math.floor(map.getView().getZoom() * 100) / 100)
            // vm.zoom[mapName] = 'zoom=' + zoom
        }
        // const win = window.navigator.userAgent.includes('Win')
        map.on('moveend', function (event) {
            getElevation(event)
            // map.render();
        });
        map.on("pointermove",function(event){
            // if (win)
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
            // const elevServer = 'https://gsj-seamless.jp/labs/elev2/elev/'
            // const elevServer = 'https://tiles.gsj.jp/tiles/elev/mixed/'
            const elevServer = 'https://tiles.gsj.jp/tiles/elev/land/'
            const x = Math.floor( rx )				// タイルX座標
            const y = Math.floor( ry )				// タイルY座標
            const i = ( rx - x ) * 256			// タイル内i座標
            const j = ( ry - y ) * 256			// タイル内j座標
            const img = new Image();
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
                // console.log(data)
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
        // const elements = document.querySelectorAll(".ol-scale-line, .ol-zoom, .zoom-div")
        const elements = document.querySelectorAll(".ol-scale-line")
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
        console.log(store.state.base.maps.map01.interactions)
        store.state.base.maps.map01.removeInteraction(store.state.base.maps.map01.getInteractions().array_[10])
        store.state.base.maps.map02.removeInteraction(store.state.base.maps.map02.getInteractions().array_[10])
        store.state.base.maps.map03.removeInteraction(store.state.base.maps.map03.getInteractions().array_[10])
        store.state.base.maps.map04.removeInteraction(store.state.base.maps.map04.getInteractions().array_[10])
        // 2回削除する。
        store.state.base.maps.map01.removeInteraction(store.state.base.maps.map01.getInteractions().array_[10])
        store.state.base.maps.map02.removeInteraction(store.state.base.maps.map02.getInteractions().array_[10])
        store.state.base.maps.map03.removeInteraction(store.state.base.maps.map03.getInteractions().array_[10])
        store.state.base.maps.map04.removeInteraction(store.state.base.maps.map04.getInteractions().array_[10])
    } else {
        store.state.base.maps.map02.setView(map01View);
        store.state.base.maps.map03.setView(map01View);
        store.state.base.maps.map04.setView(map01View)
        store.state.base.maps.map01.addInteraction(new Synchronize({ maps: [store.state.base.maps.map02,store.state.base.maps.map03,store.state.base.maps.map04]}));
        store.state.base.maps.map02.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map03,store.state.base.maps.map04]}));
        store.state.base.maps.map03.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map02,store.state.base.maps.map04]}));
        store.state.base.maps.map04.addInteraction(new Synchronize({ maps: [store.state.base.maps.map01,store.state.base.maps.map02,store.state.base.maps.map03]}));
    }
}

export function resize () {
    store.state.base.maps.map01.updateSize();
    store.state.base.maps.map02.updateSize();
    store.state.base.maps.map03.updateSize();
    store.state.base.maps.map04.updateSize()
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
    console.log(newLayerList[0][0].title)
    const layer = newLayerList[0][0].title
    history (layer)
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
        if (newLayerList[0][i].check === undefined) {
            newLayerList[0][i].check = true
            layer.setVisible(true)
        } else {
            layer.setVisible(newLayerList[0][i].check)
        }

        if (layer.values_.layers) {
            const gLayers = layer.values_.layers.array_;
            for (let j in gLayers) {
                if (newLayerList[0][i].multipli===false || newLayerList[0][i].multipli===undefined){
                    gLayers[j].on("prerender", function(evt){
                        evt.context.globalCompositeOperation = 'source-over';
                    });
                    gLayers[j].on("postrender", function(evt){
                        evt.context.globalCompositeOperation = '';
                    });
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

        if (newLayerList[0][i].multipli===false || newLayerList[0][i].multipli===undefined) {
            layer.on("prerender", function(evt){
                evt.context.globalCompositeOperation = 'source-over';
            });
            layer.on("postrender", function(evt){
                evt.context.globalCompositeOperation = '';
            });
        }else{
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
        console.log(9999)
        item.layer.on("prerender", function(evt){
            evt.context.globalCompositeOperation = 'source-over';
        });
        item.layer.on("postrender", function(evt){
            evt.context.globalCompositeOperation = '';
        });
    } else {
        console.log(8888)
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
    if (address === '') {
        const lonLat = [140.097, 37.856]
        map.getView().setCenter(transform(lonLat, "EPSG:4326", "EPSG:3857"));
        map.getView().setZoom(6)
    } else {
        axios
            .get('https://msearch.gsi.go.jp/address-search/AddressSearch?q=' + address)
            .then(function (response) {
                const lonLat = response.data[0].geometry.coordinates
                map.getView().setCenter(transform(lonLat, "EPSG:4326", "EPSG:3857"));
                map.getView().setZoom(14)
            })
            .catch(function (error) {
                console.log(error);
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


