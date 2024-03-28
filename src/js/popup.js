import store from './store'
import { transform, fromLonLat } from 'ol/proj.js'
import axios from 'axios'
import figureRGB from './figureRGB'
export function popUp(map,layers,features,overlay,evt,content) {
  let cont
  const coordinate = evt.coordinate;
  console.log(layers[0].get('name'))
  console.log(coordinate)
  console.log(features[0])
  const prop = features[0].getProperties();
  const geoType = features[0].getGeometry().getType();
  const geometry = features[0].getGeometry()
  let lonLat
  if (geoType === 'Polygon') {
    lonLat = transform([coordinate[0],coordinate[1]], "EPSG:3857", "EPSG:4326")
  } else {
    lonLat = transform([geometry.extent_[0],geometry.extent_[1]], "EPSG:3857", "EPSG:4326")
  }
  const lon = lonLat[0]
  const lat = lonLat[1]
  const streetView = '<a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + lat + ',' + lon + '&hl=ja" target="_blank">Street Viewを開く</a></div>'

  console.log(geoType)
  console.log(prop)
  switch (layers[0].get('name') ) {
    // 小学校区
    case 'syougakkoukuH28':
    case 'syougakkoukuH22':
      console.log(prop)
      if(prop.A27_001) {
        cont = '<div style=width:200px>市区町村コード＝' + prop.A27_001 + '<br>' +
            '設置主体=' + prop.A27_002 + '<br>' +
            '名称＝' + prop.A27_003 + '<br>' +
            '所在地＝' + prop.A27_004 + '<br>' +
            streetView +
            '</div>'
      } else {
        cont = '<div style=width:200px>市区町村コード＝' + prop.A27_005 + '<br>' +
            '設置主体=' + prop.A27_006 + '<br>' +
            '名称＝' + prop.A27_007 + '<br>' +
            '所在地＝' + prop.A27_008 + '<br>' +
            'id＝' + prop.id + '<br>'+
            streetView +
            '</div>'
      }
      break;
    case 'syougakkouku':
      if(prop.A27_001) {
        cont = '<div style=width:200px>市区町村コード＝' + prop.A27_001 + '<br>' +
                    '設置主体=' + prop.A27_002 + '<br>' +
                    '名称＝' + prop.A27_004 + '<br>' +
                    '所在地＝' + prop.A27_005 + '<br>'+
                    'id＝' + prop.id + '<br>'+
                    streetView +
               '</div>'
      } else {
        cont = '<div style=width:200px>市区町村コード＝' + prop.P29_001 + '<br>' +
                    '名称＝' + prop.P29_004 + '<br>' +
                    '所在地＝' + prop.P29_005 + '<br>'+
                    streetView +
               '</div>'
      }
      break;
    // 中学校区
    case 'tyuugakkouku' :
      if(prop.A32_001) {
        cont = '<div style=width:200px>市区町村コード＝' + prop.A32_001 + '<br>' +
                    '設置主体=' + prop.A32_002 + '<br>' +
                    '名称＝' + prop.A32_004 + '<br>' +
                    '所在地＝' + prop.A32_005 + '<br>' +
                    'id＝' + prop.id + '<br>'+
                     streetView +
                    '</div>'
      } else {
        cont = '<div style=width:200px>市区町村コード＝' + prop.P29_001 + '<br>' +
                    '名称＝' + prop.P29_004 + '<br>' +
                    '所在地＝' + prop.P29_005 + '<br>' +
                     streetView +
                     '</div>'
      }
      break;
    case 'tyuugakkoukuH25' :
      if(prop.A32_001) {
        cont = '<div style=width:200px>市区町村コード＝' + prop.A32_001 + '<br>' +
            '設置主体=' + prop.A32_002 + '<br>' +
            '名称＝' + prop.A32_003 + '<br>' +
            'id＝' + prop.id + '<br>'+
            streetView +
            '</div>'
      } else {
        cont = '<div style=width:200px>市区町村コード＝' + prop.P29_001 + '<br>' +
            '名称＝' + prop.P29_005 + '<br>' +
            '所在地＝' + prop.P29_006 + '<br>' +
            streetView +
            '</div>'
      }
       break;
    case 'tyuugakkoukuH28' :
      if(prop.A32_001) {
        cont = '<div style=width:200px>市区町村コード＝' + prop.A32_001 + '<br>' +
            '設置主体=' + prop.A32_002 + '<br>' +
            '名称＝' + prop.A32_003 + '<br>' +
            'id＝' + prop.id + '<br>'+
            streetView +
            '</div>'
      } else {
        cont = '<div style=width:200px>市区町村コード＝' + prop.A32_006 + '<br>' +
            '設置主体=' + prop.A32_007 + '<br>' +
            '名称＝' + prop.A32_008 + '<br>' +
            '所在地＝' + prop.A32_009 + '<br>' +
            streetView +
            '</div>'
      }
      break;
    case 'youtoH23' :
    case 'youtoR01' :
      cont = '<div style=width:200px>都道府県名＝' + prop.A29_002 + '<br>' +
          '市区町村名=' + prop.A29_003 + '<br>' +
          '用途地域分類＝' + prop.A29_004 + '<br>' +
          '用途地域名＝' + prop.A29_005 + '<br>' +
          '建ぺい率＝' + prop.A29_006 + '<br>' +
          '容積率＝' + prop.A29_007 + '<br>' +
          streetView +
          '</div>'
      break;
    case 'tosiH30' :
      switch (prop.layer_no) {
        case 1://市街化区域
          cont = "<div style=width:100px>市街化区域</div>";
          break;
        case 2://市街化調整区域
          cont = "<div style=width:100px>市街化調整区域</div>";
          break;
        case 3://その他用途地域
          cont = "<div style=width:100px>その他用途地域</div>";
          break;
        case 4://用途未設定
          cont = "<div style=width:100px>用途未設定</div>";
          break;
      }
    case 'tosiH18' :
      switch (prop.A09_003) {
        case '1'://市街化区域
          cont = "<div style=width:100px>市街化区域</div>";
          break;
        case '2'://市街化調整区域
          cont = "<div style=width:100px>市街化調整区域</div>";
          break;
        case '3'://その他用途地域
          cont = "<div style=width:100px>その他用途地域</div>";
          break;
        case '4':
          cont = "<div style=width:100px>用途未設定</div>";
          break;
      }
      break;
    case 'kasoS45' :
    case 'kasoS60' :
    case 'kasoH29' :
      switch (prop.A17_009) {
        case '01':
        case 1:
          cont = "<div style=width:100px>過疎市町村</div>";
          break;
        case '02':
        case 2:
          cont = "<div style=width:220px>過疎地域とみなされる市町村</div>";
          break;
        case '03':
        case 3:
          cont = "<div style=width:200px>過疎地域とみなされる区域</div>";
          break;
      }
      cont = cont + '<hr>' + prop.A17_006
      break;
     // 夜の明かり
    case 'japanLight':
      if(map.getView().getZoom()>7) cont = '<div style=width:150px>明るさレベル＝' +  prop.light +'</div>'
      break
    case 'didh27':
      cont = '<div style=width:150px>人口=' + prop.人口.toLocaleString() + '人</div>'
      break
    case 'dids40':
    case 'dids50':
    case 'dids60':
    case 'didh07':
    case 'didh17':
    case 'didh12':
    case 'didh02':
    case 'dids55':
    case 'dids45':
    case 'dids35':
    case 'didh22':
      cont = '<div style=width:150px>人口=' + Number(prop.A16_005).toLocaleString() + '人</div>'
      break
    case 'suiro':
      cont = '<div style=width:250px>区分＝' + prop.rivCtg + '<br>タイプ＝' + prop.type + '</div>'
      break
    case 'hinan':
      if (prop.P20_005 !== -1) {
        cont = '<div style=width:200px>' + prop.P20_002 + '<br>' + prop.P20_003 + '<br>収容人数：' + prop.P20_005 + '人</div>'
      } else {
        cont = '<div style=width:200px>' + prop.P20_002 + '<br>' + prop.P20_003 + '</div>'
      }
      break
    case 'kouziR04':
      cont = '<div style=width:200px>' + prop.L01_024 +'<br>公示価格＝' + Number(prop.L01_100).toLocaleString() + '円</div>'
      break
    case 'kouziH25':
    case 'kouziH19':
      cont = '<div style=width:200px>' + prop.L01_019 +'<br>公示価格＝' + Number(prop.L01_006).toLocaleString() + '円</div>'
      break
    case 'kouziH30':
      cont = '<div style=width:200px>' + prop.L01_023 +'<br>公示価格＝' + Number(prop.L01_091).toLocaleString() + '円</div>'
      break
    case 'hude':
      if (prop.land_type === 100) {
        cont = '<div style=width:50px>' + '田</div>'
      } else {
        cont = '<div style=width:50px>' + '畑</div>'
      }
      break
    case 'sanson':
      cont = '<div style=width:100px>' + prop.A24_003 + prop.A24_006 + '</div>'
      break
    case 'iryouken1zi':
      cont = '<div style=width:100px>' + prop.A38a_002 + '</div>'
      break
    case 'iryouken2zi':
      cont = '<div style=width:100px>' +prop.A38b_004 + '</div>'
      break
    case 'iryouken3zi':
      cont = '<div style=width:100px>' + prop.A38c_001 + '</div>'
      break
    case 'suikei1km':
      if (prop.PTN_2015) {
        cont = '<div style=width:200px>2020年人口＝' + prop.PTN_2020 +
            '<br>2050年人口＝' + prop.PTN_2050 +
            '<br>2050/2020＝' + Math.floor(prop.PTN_2050 / prop.PTN_2020 * 100) + '%</div>'
      } else {
        cont = '<div style=width:200px>' + prop.text + '</div>'
      }
      break
    case 'nougyou':
      if (prop.LAYER_NO === 5) {
        cont = '<div style=width:100px>' + '農業地域 ' + '</div>'
      } else {
        cont = '<div style=width:100px>' + '農用地区域' + '</div>'
      }
        break
    case 'damh26':
      cont = '<div style=width:150px>ダム名＝' + prop.W01_001 + '</div>'
      break
    case 'city':
      cont = '<div style=width:100px>' + prop.N03_004 + '</div>'
      break
    case 'kyoukai':
      cont = '<div style=width:100px>' + prop.RCOM_NAME + '</div>'
      break
    case 'kosyou':
      cont = '<div style=width:150px>' + prop.W09_001 + '</div>'
      break
    case 'chyouzyuu':
      cont = '<div style=width:100px>' + prop.A15_001 + '</div>'
      break
    case 'tatumaki':
      cont = '<div style=width:250px>' + prop.A30b_005 + prop.A30b_006 + prop.A30b_007 +
            '<br>' + prop.A30b_002 +
            '<br>発生日時' + prop.A30b_003 + '</div>'
      break
    case 'mitinoeki':
      cont = "<div style=width:150px><a href=" + prop.P35_007 + " target='_blank'>" + prop.P35_006 + "</a></div>"
      break
    case 'tokyoZisin':
      cont = '<div style=width:300px>地区名＝' + prop.区市町村名 + prop.町丁目名 +
             '<br>建物倒壊危険度ランク＝' + prop.建物_ラ +
             '<br>建物倒壊危険度順位＝' + prop.建物_順 +
             '<br>火災危険度ランク＝' + prop.火災_ラ +
             '<br>火災危険度順位＝' + prop.火災_順 +
             '<br>総合危険度ランク＝' + prop.総合_ラ +
             '<br>総合危険度順位＝' + prop.総合_順 +
             '<br>災害時活動困難係数＝' + prop.災害_係 + '<br>' +
             streetView +
             '</div>'
      break
    case 'tokutei':
      cont = '<div style=width:120px>' + prop.A25_003 + prop.A25_006 + '</div>'
      break
    case 'houmusyo':
      cont = '<div style=width:150px>' + prop.大字名 + prop.地番 + '</div>'
      break
    case 'sizentikei0':
    case 'sizentikei':
    case 'zinkoutikei':
      const codeList_sizen2 = new Array(//2次元配列 [図式コード,"地形分類名","成因など","リスク"]
          [999999,"地図を拡大すると表示されます。","",""],
          [100,"数値地図25000(土地条件)","地図を拡大すると表示されます。",""],
          [101,"数値地図25000(土地条件)","地図を拡大すると表示されます。",""],
          [102,"治水地形分類図(更新版)","地図を拡大すると表示されます。",""],
          [103,"脆弱地形調査","地図を拡大すると表示されます。",""],
          [104,"土地条件図","地図を拡大すると表示されます。",""],
          [105,"沿岸海域土地条件図","地図を拡大すると表示されます。",""],
          [10101,"山地","尾根や谷からなる土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
          [11201,"山地","尾根や谷からなる土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
          [11202,"山地","尾根や谷からなる土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
          [11203,"山地","尾根や谷からなる土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
          [11204,"山地","尾根や谷からなる土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
          [1010101,"山地","尾根や谷からなる土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
          [10202,"崖･段丘崖","台地の縁にある極めて急な斜面や、山地や海岸沿いなどの岩場。","周辺では大雨や地震の揺れによる崖崩れなどの土砂災害のリスクがある。"],
          [10204,"崖･段丘崖","台地の縁にある極めて急な斜面や、山地や海岸沿いなどの岩場。","周辺では大雨や地震の揺れによる崖崩れなどの土砂災害のリスクがある。"],
          [2010201,"崖･段丘崖","台地の縁にある極めて急な斜面や、山地や海岸沿いなどの岩場。","周辺では大雨や地震の揺れによる崖崩れなどの土砂災害のリスクがある。"],
          [10205,"地すべり地形","斜面が下方に移動し、斜面上部の崖と不規則な凹凸のある移動部分からなる土地。山体の一部が重力により滑ってできる。","大雨・雪解けにより多量の水分が土中に含まれたり、地震で揺れたりすることで、土地が滑って土砂災害を引き起こすことがある。"],
          [10206,"地すべり地形","斜面が下方に移動し、斜面上部の崖と不規則な凹凸のある移動部分からなる土地。山体の一部が重力により滑ってできる。","大雨・雪解けにより多量の水分が土中に含まれたり、地震で揺れたりすることで、土地が滑って土砂災害を引き起こすことがある。"],
          [10301,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10302,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10303,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10304,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10308,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10314,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10305,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10508,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [2010101,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10306,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10307,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10310,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10312,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
          [10401,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
          [10402,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
          [10403,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
          [10404,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
          [10406,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
          [10407,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
          [3010101,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
          [10501,"扇状地","山麓の谷の出口から扇状に広がる緩やかな斜面。谷口からの氾濫によって運ばれた土砂が堆積してできる。","山地からの出水による浸水や、谷口に近い場所では土石流のリスクがある。比較的地盤は良いため、地震の際には揺れにくい。下流部では液状化のリスクがある。"],
          [10502,"扇状地","山麓の谷の出口から扇状に広がる緩やかな斜面。谷口からの氾濫によって運ばれた土砂が堆積してできる。","山地からの出水による浸水や、谷口に近い場所では土石流のリスクがある。比較的地盤は良いため、地震の際には揺れにくい。下流部では液状化のリスクがある。"],
          [3020101,"扇状地","山麓の谷の出口から扇状に広がる緩やかな斜面。谷口からの氾濫によって運ばれた土砂が堆積してできる。","山地からの出水による浸水や、谷口に近い場所では土石流のリスクがある。比較的地盤は良いため、地震の際には揺れにくい。下流部では液状化のリスクがある。"],
          [10503,"自然堤防","現在や昔の河川に沿って細長く分布し、周囲より0.5～数メートル高い土地。河川が氾濫した場所に土砂が堆積してできる。","洪水に対しては比較的安全だが、大規模な洪水では浸水することがある。縁辺部では液状化のリスクがある。"],
          [3040101,"自然堤防","現在や昔の河川に沿って細長く分布し、周囲より0.5～数メートル高い土地。河川が氾濫した場所に土砂が堆積してできる。","洪水に対しては比較的安全だが、大規模な洪水では浸水することがある。縁辺部では液状化のリスクがある。"],
          [10506,"天井川","周囲の土地より河床が高い河川。人工的な河川堤防が築かれることで、固定された河床に土砂が堆積してできる。","ひとたび天井川の堤防が決壊すれば、氾濫流が周辺に一気に拡がるため注意が必要。"],
          [10507,"天井川","周囲の土地より河床が高い河川。人工的な河川堤防が築かれることで、固定された河床に土砂が堆積してできる。","ひとたび天井川の堤防が決壊すれば、氾濫流が周辺に一気に拡がるため注意が必要。"],
          [10801,"天井川","周囲の土地より河床が高い河川。人工的な河川堤防が築かれることで、固定された河床に土砂が堆積してできる。","ひとたび天井川の堤防が決壊すれば、氾濫流が周辺に一気に拡がるため注意が必要。"],
          [10504,"砂州・砂丘","主に現在や昔の海岸･湖岸･河岸沿いにあり、周囲よりわずかに高い土地。波によって打ち上げられた砂や礫、風によって運ばれた砂が堆積することでできる。","通常の洪水では浸水を免れることが多い。縁辺部では強い地震によって液状化しやすい。"],
          [10505,"砂州・砂丘","主に現在や昔の海岸･湖岸･河岸沿いにあり、周囲よりわずかに高い土地。波によって打ち上げられた砂や礫、風によって運ばれた砂が堆積することでできる。","通常の洪水では浸水を免れることが多い。縁辺部では強い地震によって液状化しやすい。"],
          [10512,"砂州・砂丘","主に現在や昔の海岸･湖岸･河岸沿いにあり、周囲よりわずかに高い土地。波によって打ち上げられた砂や礫、風によって運ばれた砂が堆積することでできる。","通常の洪水では浸水を免れることが多い。縁辺部では強い地震によって液状化しやすい。"],
          [3050101,"砂州・砂丘","主に現在や昔の海岸･湖岸･河岸沿いにあり、周囲よりわずかに高い土地。波によって打ち上げられた砂や礫、風によって運ばれた砂が堆積することでできる。","通常の洪水では浸水を免れることが多い。縁辺部では強い地震によって液状化しやすい。"],
          [10601,"凹地・浅い谷","台地や扇状地、砂丘などの中にあり、周辺と比べてわずかに低い土地。小規模な流水の働きや、周辺部に砂礫が堆積して相対的に低くなる等でできる。","大雨の際に一時的に雨水が集まりやすく、浸水のおそれがある。地盤は周囲（台地･段丘など）より軟弱な場合があり、とくに周辺が砂州・砂丘の場所では液状化のリスクがある。"],
          [2010301,"凹地・浅い谷","台地や扇状地、砂丘などの中にあり、周辺と比べてわずかに低い土地。小規模な流水の働きや、周辺部に砂礫が堆積して相対的に低くなる等でできる。","大雨の際に一時的に雨水が集まりやすく、浸水のおそれがある。地盤は周囲（台地･段丘など）より軟弱な場合があり、とくに周辺が砂州・砂丘の場所では液状化のリスクがある。"],
          [3030101,"氾濫平野","起伏が小さく、低くて平坦な土地。洪水で運ばれた砂や泥などが河川周辺に堆積したり、過去の海底が干上がったりしてできる。","河川の氾濫に注意。地盤は海岸に近いほど軟弱で、地震の際にやや揺れやすい。液状化のリスクがある。沿岸部では高潮に注意。"],
          [10701,"氾濫平野","起伏が小さく、低くて平坦な土地。洪水で運ばれた砂や泥などが河川周辺に堆積したり、過去の海底が干上がったりしてできる。","河川の氾濫に注意。地盤は海岸に近いほど軟弱で、地震の際にやや揺れやすい。液状化のリスクがある。沿岸部では高潮に注意。"],
          [10702,"氾濫平野","起伏が小さく、低くて平坦な土地。洪水で運ばれた砂や泥などが河川周辺に堆積したり、過去の海底が干上がったりしてできる。","河川の氾濫に注意。地盤は海岸に近いほど軟弱で、地震の際にやや揺れやすい。液状化のリスクがある。沿岸部では高潮に注意。"],
          [10705,"氾濫平野","起伏が小さく、低くて平坦な土地。洪水で運ばれた砂や泥などが河川周辺に堆積したり、過去の海底が干上がったりしてできる。","河川の氾濫に注意。地盤は海岸に近いほど軟弱で、地震の際にやや揺れやすい。液状化のリスクがある。沿岸部では高潮に注意。"],
          [10703,"後背低地･湿地","主に氾濫平野の中にあり、周囲よりわずかに低い土地。洪水による砂や礫の堆積がほとんどなく、氾濫水に含まれる泥が堆積してできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が極めて軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。沿岸部では高潮に注意。"],
          [10804,"後背低地･湿地","主に氾濫平野の中にあり、周囲よりわずかに低い土地。洪水による砂や礫の堆積がほとんどなく、氾濫水に含まれる泥が堆積してできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が極めて軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。沿岸部では高潮に注意。"],
          [3030201,"後背低地･湿地","主に氾濫平野の中にあり、周囲よりわずかに低い土地。洪水による砂や礫の堆積がほとんどなく、氾濫水に含まれる泥が堆積してできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が極めて軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。沿岸部では高潮に注意。"],
          [10704,"旧河道","かつて河川の流路だった場所で、周囲よりもわずかに低い土地。流路の移動によって河川から切り離されて、その後に砂や泥などで埋められてできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。"],
          [3040201,"旧河道","かつて河川の流路だった場所で、周囲よりもわずかに低い土地。流路の移動によって河川から切り離されて、その後に砂や泥などで埋められてできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。"],
          [3040202,"旧河道","かつて河川の流路だった場所で、周囲よりもわずかに低い土地。流路の移動によって河川から切り離されて、その後に砂や泥などで埋められてできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。"],
          [3040301,"落堀","河川堤防沿いにある凹地状の土地。洪水のときに、堤防を越えた水によって地面が侵食されてできる。","河川の氾濫や堤防からの越水に注意。周囲の地盤に比べて軟弱なことが多い。液状化のリスクが大きい。"],
          [10802,"河川敷･浜","調査時の河川敷や、調査時または明治期等に浜辺、岩礁である土地。","河川の増水や高波で冠水する。河川敷は液状化のリスクが大きい。"],
          [10803,"河川敷･浜","調査時の河川敷や、調査時または明治期等に浜辺、岩礁である土地。","河川の増水や高波で冠水する。河川敷は液状化のリスクが大きい。"],
          [10807,"河川敷･浜","調査時の河川敷や、調査時または明治期等に浜辺、岩礁である土地。","河川の増水や高波で冠水する。河川敷は液状化のリスクが大きい。"],
          [10808,"河川敷･浜","調査時の河川敷や、調査時または明治期等に浜辺、岩礁である土地。","河川の増水や高波で冠水する。河川敷は液状化のリスクが大きい。"],
          [10805,"水部","調査時において、海や湖沼、河川などの水面である場所。",""],
          [10806,"水部","調査時において、海や湖沼、河川などの水面である場所。",""],
          [10901,"水部","調査時において、海や湖沼、河川などの水面である場所。",""],
          [10903,"水部","調査時において、海や湖沼、河川などの水面である場所。",""],
          [5010201,"水部","調査時において、海や湖沼、河川などの水面である場所。",""],
          [10904,"旧水部","江戸時代もしくは明治期から調査時までの間に海や湖、池･貯水池であり、過去の地形図などから水部であったと確認できる土地。その後の土砂の堆積や土木工事により陸地になったところ。","地盤が軟弱である。液状化のリスクが大きい。沿岸部では高潮に注意。"],
          [5010301,"旧水部","江戸時代もしくは明治期から調査時までの間に海や湖、池･貯水池であり、過去の地形図などから水部であったと確認できる土地。その後の土砂の堆積や土木工事により陸地になったところ。","地盤が軟弱である。液状化のリスクが大きい。沿岸部では高潮に注意。"],
          [11001,"切土地","山地、台地の縁などの斜面を切取りにより造成した土地。","切取り斜面によっては、大雨や地震により斜面崩壊のリスクがある。地盤は一般的に良好。"],
          [11003,"切土地","山地、台地の縁などの斜面を切取りにより造成した土地。","切取り斜面によっては、大雨や地震により斜面崩壊のリスクがある。地盤は一般的に良好。"],
          [11009,"切土地","山地、台地の縁などの斜面を切取りにより造成した土地。","切取り斜面によっては、大雨や地震により斜面崩壊のリスクがある。地盤は一般的に良好。"],
          [11011,"切土地","山地、台地の縁などの斜面を切取りにより造成した土地。","切取り斜面によっては、大雨や地震により斜面崩壊のリスクがある。地盤は一般的に良好。"],
          [4010301,"切土地","山地、台地の縁などの斜面を切取りにより造成した土地。","切取り斜面によっては、大雨や地震により斜面崩壊のリスクがある。地盤は一般的に良好。"],
          [11002,"農耕平坦化地","山地などを切り開いて整地した農耕地。","大雨や地震により崩壊するリスクがある。"],
          [11005,"高い盛土地","周辺よりも約2m以上盛土した造成地。主に海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","海や湖沼、河川を埋め立てた場所では、強い地震の際に液状化のリスクがある。山間部の谷を埋め立てた造成地では、大雨や地震により地盤崩壊のリスクがある。"],
          [4010201,"高い盛土地","周辺よりも約2m以上盛土した造成地。主に海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","海や湖沼、河川を埋め立てた場所では、強い地震の際に液状化のリスクがある。山間部の谷を埋め立てた造成地では、大雨や地震により地盤崩壊のリスクがある。"],
          [11008,"干拓地","水面や低湿地を堤防で締め切って排水して、新たな陸地になった土地。過去の地形図や資料から、干拓されたことが確認できる場所。","一般に海･湖水面より低いため、洪水時に氾濫水が留まりやすい。沿岸部では特に高潮に対して注意が必要。地盤は軟弱で、地震による揺れも大きくなりやすい。液状化のリスクがある。"],
          [4010101,"干拓地","水面や低湿地を堤防で締め切って排水して、新たな陸地になった土地。過去の地形図や資料から、干拓されたことが確認できる場所。","一般に海･湖水面より低いため、洪水時に氾濫水が留まりやすい。沿岸部では特に高潮に対して注意が必要。地盤は軟弱で、地震による揺れも大きくなりやすい。液状化のリスクがある。"],
          [11004,"盛土地･埋立地","周囲の地表より高く盛土した土地や、海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","高さが十分でない場合には浸水のリスクがある。山地や台地では降雨･地震により地盤崩壊のリスクがある。低地では液状化のリスクがあり、海や湖沼･河川を埋め立てた場所では特に注意。"],
          [11006,"盛土地･埋立地","周囲の地表より高く盛土した土地や、海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","高さが十分でない場合には浸水のリスクがある。山地や台地では降雨･地震により地盤崩壊のリスクがある。低地では液状化のリスクがあり、海や湖沼･河川を埋め立てた場所では特に注意。"],
          [11007,"盛土地･埋立地","周囲の地表より高く盛土した土地や、海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","高さが十分でない場合には浸水のリスクがある。山地や台地では降雨･地震により地盤崩壊のリスクがある。低地では液状化のリスクがあり、海や湖沼･河川を埋め立てた場所では特に注意。"],
          [11014,"盛土地･埋立地","周囲の地表より高く盛土した土地や、海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","高さが十分でない場合には浸水のリスクがある。山地や台地では降雨･地震により地盤崩壊のリスクがある。低地では液状化のリスクがあり、海や湖沼･河川を埋め立てた場所では特に注意。"],
          [11010,"改変工事中","調査時に土地の改変工事が行われていた土地。",""],
          [9999,"拡大すると地形分類が表示されます。","",""],

          [11,"山地","起伏が大きな尾根と谷からなる地形。","土砂災害に注意。"],
          [12,"残丘状地形","周囲から孤立して突出した岩峰または台地状の地形（約260万年前よりも古い時代の火山岩からなるものに限る）。","土砂災害に注意。とくに周縁部の崖では、落石や斜面崩壊に注意。"],
          [13,"カルスト地形","石灰岩が雨水で溶けてできた地形。尾根や谷が少なく、しばしば陥没地形がみられる。","地盤の陥没に注意。周縁部の崖では、落石や斜面崩壊に注意。"],
          [21,"丘陵・小起伏地","起伏が小さな尾根と谷からなる地形。","土砂災害に注意。"],

          [31,"火山地形（明瞭）","火山噴火によってできた急斜面のうち、比較的新しい時代にできた地形。溶岩流などの詳細な地形が多く残されている部分。","火山噴火、土砂災害に注意。"],
          [32,"火山地形（やや不明瞭）","火山噴火によってできた急斜面のうち、比較的古い時代にできた地形。侵食作用によって削られて、火山の大まかな地形のみを残している部分。","土砂災害に注意。"],
          [33,"火山性丘陵","火山噴出物や、火山から運ばれた土砂によってできた緩やかな斜面が、その後の侵食作用によって削られてできた地形。起伏が小さな尾根と谷からなる。","土砂災害に注意。"],
          [34,"火山麓地形","火山噴出物や、火山から運ばれた土砂によってできた緩やかな斜面。比較的新しい時代の火砕流や火山斜面の侵食によって生じた土砂が堆積してできた地形。","火山噴火、土砂災害に注意。"],
          [41,"台地・段丘","低地が隆起してできた台地状の地形。低地との境界などには侵食による崖（段丘崖）がみられることが多い。","段丘崖の周辺では、落石や崖崩れに注意。"],
          [51,"低地","河川や海の流れによって運ばれた砂礫や泥が堆積してできた平坦地。または、その流れの侵食によってできた平坦地。","河川氾濫、高潮、液状化に注意。地震時に揺れやすい。"],
          [61,"砂丘","風によって運ばれた砂が小高く堆積してできた地形。","周縁部や、周囲よりも低い場所では、液状化に注意。地震時に揺れやすい。"],
          [71,"湖","自然にできた湖。下流部が土砂や火山噴出物などで塞がれたり、土地が沈降したりしてできる。",""],

          [1,"山地・丘陵","尾根と谷からなる地形。","土砂災害に注意。"],
          [3,"火山地形","火山噴出物や、火山から運ばれた土砂によってできた地形。","火山噴火、土砂災害に注意。"],
          [4,"台地・段丘","低地が隆起してできた台地状の地形。低地との境界などには侵食による崖（段丘崖）がみられることが多い。","段丘崖の周辺では、落石や崖崩れに注意。"],
          [5,"低地","河川や海の流れによって運ばれた砂礫や泥が堆積してできた平坦地。または、その流れの侵食によってできた平坦地。","河川氾濫、高潮、液状化に注意。地震時に揺れやすい。"],
          [6,"砂丘","風によって運ばれた砂が小高く堆積してできた地形。","周縁部や、周囲よりも低い場所では、液状化に注意。地震時に揺れやすい。"],
          [7,"湖","自然にできた湖。下流部が土砂や火山噴出物などで塞がれたり、土地が沈降したりしてできる。",""]
      );
      var code = prop.code
        console.log(code)
      var landFormName="",naritachi="",risk="";
      var list = codeList_sizen2;
      for(var i=0;i<list.length;i++){
        if(list[i][0]==code){//ズーム率によって数値型になったり文字型になったりしている模様
          landFormName = list[i][1];
          naritachi = list[i][2];
          risk = list[i][3];
          break;
        }
      }
      cont = '<div style=width:300px>分類名=' + landFormName + '<hr>' +
             '成り立ち=' + naritachi + '<hr>' +
             'リスク=' + risk + '<hr>' +
             streetView +
             '</div>'
      break
    case 'densyou':
      console.log(prop.geometry.extent_[0])
      const lonLat1 = transform([prop.geometry.extent_[0],prop.geometry.extent_[1]], "EPSG:3857", "EPSG:4326")
      const lon1 = lonLat1[0]
      const lat1 = lonLat1[1]
      cont = '<div style="width:400px;font-size:small">碑名=' + prop.LoreName + '<hr>' +
          '災害名=' + prop.DisasterName + '<hr>' +
          '災害種別=' + prop.DisasterKind + '<hr>' +
          '所在地=' + prop.Address + '<hr>' +
          '建立年=' + prop.LoreYear + '<hr>' +
          '伝承内容=' + prop.DisasterInfo + '<hr>' +
          '<a href="' + prop.Image + '" target="_blank"><img height="200" src="' + prop.Image + '"></a>' +
          '<br><a href="https://www.google.com/maps?q=' + lat1 + ',' + lon1 + '" target="_blank">GoogleMapsで開く</a>' +
          '　<a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + lat + ',' + lon + '&hl=ja" target="_blank">Street Viewを開く</a></div>'
          '</div>'
      break
    case 'hinanzyo01':
    case 'hinanzyo02':
    case 'hinanzyo04':
    case 'hinanzyo05':
    case 'hinanzyo06':
      let cont1 = ''
      const array = [
          {disaster:'disaster1', cont:'洪水　'},
          {disaster:'disaster2', cont: '崖崩れ、土石流及び地滑り　'},
          {disaster:'disaster3', cont:'高潮　'},
          {disaster:'disaster4', cont:'地震　'},
          {disaster:'disaster5', cont:'津波　'},
          {disaster:'disaster6', cont:'大規模な火事　'},
          {disaster:'disaster7', cont:'内水氾濫　'},
          {disaster:'disaster8', cont:'火山現象　'}
      ]
      Object.entries(array).forEach(
          entries => {
            if (prop[entries[1].disaster] === 1) {
              cont1 += entries[1].cont
            }
          }
      );
      console.log(cont1)
      cont = '<div style=width:200px>名称=' + prop.name + '<hr>' +
          '所在地=' + prop.address + '<hr>' +
          '対応している災害の種別＝<br>' + cont1 + '</div>'
      break
    case 'gunbakumatu':
    case 'gunkuni':
    case 'gun':
      cont = '<div style=width:100px>国=' + prop.KUNI + '<hr>' +
          '郡=' + prop.GUN + '<hr>' +
          '県=' + prop.PREF + '</div>'
      break
    case 'kansui':
      const str = prop.description;
      const pattern = new RegExp( '(?<= href=).*?(?=target)' );
      console.log(str.match(pattern)[0])
      cont = '<div style=width:200px>' + prop.name + '<hr>' +
          '<a href=' + str.match(pattern)[0] + ' target="_blank">箇所表</a>'+ '<hr>' +
          streetView +
          '</div>'
      break
    case 'kiseikukan':
      cont = '<div style=width:200px>' + prop.A1 + prop.A2 + '</div>'
      break
    case 'railroad':
      if (geoType === 'LineString') {
        cont = '<div style=width:200px>運営会社=' + prop.N05_003 + '<hr>' +
            '路線名=' + prop.N05_002 + '</div>'
      } else {
        cont = '<div style=width:200px>' +
            '駅名=' + prop.N05_011 + '</div>'
      }
      break
    case 'rosen':
        cont = '<div style=width:200px>運営会社=' + prop.N05_003 + '<hr>' +
            '路線名=' + prop.N05_002 + '</div>'
      break
    case 'eki':
      cont = '<div style=width:200px>運営会社=' + prop.N05_003 + '<hr>' +
          '路線名=' + prop.N05_002 + '<hr>' +
          '駅名=' + prop.N05_011 + '<hr>' +
          streetView +
          '</div>'
      break
    case 'bus':
      cont = '<div style=width:200px>事業者名=' + prop.N07_001 + '<hr>' +
          '備考=' + prop.N07_002 + '</div>'
      break
    case 'bustei':
      cont = '<div style=width:200px>事業者名=' + prop.P11_002 + '<hr>' +
          'バス停名=' + prop.P11_001 + '<hr>' +
          // 'バス系統=' + prop.P11_003_01 + '<hr>' +
          streetView +
          '</div>'
      break
    case 'okayamamai':
      cont = '<div style=width:300px;font-size:small;>' +
          '遺跡名=' + prop.遺跡名 + '<hr>' +
          '所在地=' + prop.所在地 + '<hr>' +
          '代表的な=' + prop.代表的な + '<hr>' +
          '詳細な種=' + prop.詳細な種 + '<hr>' +
          '主な時代=' + prop.主な時代 + '<hr>' +
          '主な出土=' + prop.主な出土 + '<hr>' +
          '遺跡の残=' + prop.遺跡の残 + '<hr>' +
          '遺跡概_1=' + prop.遺跡概_1 + '<hr>' +
           '</div>'
      break
    case 'kumamotomai':
      if(!prop["ITM01_NAME"]) {
        cont = '<div style=width:300px;font-size:small;>' +
            '遺跡番号=' + prop.m_cont1 + '<hr>' +
            '遺跡名称=' + prop.m_cont2 + '<hr>' +
            '所在地=' + prop.m_cont3 + '<hr>' +
            '時代=' + prop.m_cont4 + '<hr>' +
            '種別=' + prop.m_cont5 + '<hr>' +
            '指定分類=' + prop.m_cont6 + '<hr>' +
            '概要=' + prop.m_cont7 + '<hr>' +
            // '<a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + lat + ',' + lon + '&hl=ja" target="_blank">Street Viewを開く</a></div>'
            streetView +
            '</div>'
      } else {
        cont = '<div style=width:300px;font-size:small;>' +
            '遺跡番号=' + prop.ITM01_VAL + '<hr>' +
            '遺跡名称=' + prop.ITM02_VAL + '<hr>' +
            '備考1=' + prop.ITM03_VAL + '<hr>' +
            '備考2=' + prop.ITM04_VAL + '<hr>' +
            '備考3=' + prop.ITM05_VAL + '<hr>' +
            '指定分類=' + prop.ITM06_VAL + '<hr>' +
            streetView +
            '</div>'
      }
      break
    case 'tokyobunkazai':
      cont = '<div style=width:300px;font-size:small;>' +
          '名称=' + prop.名称 + '<hr>' +
          '住所=' + prop.住所 + '<hr>' +
          '種類=' + prop.種類 + '<hr>' +
          '説明=' + prop.説明 + '<hr>' +
          streetView +
          '</div>'
      break
    case 'kyuusekki':
      cont = '<div style=width:300px;font-size:small;>' +
          '遺跡名=' + prop.遺跡名 + '<hr>' +
          '読み方=' + prop.遺跡名読み方 + '<hr>' +
          '所在地=' + prop.所在地 + '<hr>' +
          '標高=' + prop.標高 + '<hr>' +
          '文献=' + prop.文献 + '<hr>' +
          '調査歴=' + prop.調査歴 + '<hr>' +
          '作成年月日=' + prop.作成年月日 + '<hr>' +
          '作成者=' + prop.作成者 + '<hr>' +
          '</div>'
      break
    case 'bunkazaidb':
      cont = '<div style=width:300px;font-size:small;>' +
          '台帳ID=' + prop.台帳ID + '<hr>' +
          '管理対象ID=' + prop.管理対象ID + '<hr>' +
          '名称=<a href="https://kunishitei.bunka.go.jp/heritage/detail/' + prop.台帳ID  + '/' + prop.管理対象ID + '" target="_blank" >' + prop.名称 + '</a><hr>' +
          '文化財種類=' + prop.文化財種類 + '<hr>' +
          '種別1=' + prop.種別1 + '<hr>' +
          '種別2=' + prop.種別2 + '<hr>' +
          '重文指定年月日=' + prop.重文指定年月日 + '<hr>' +
          '都道府県=' + prop.都道府県 + '<hr>' +
          '所在地=' + prop.所在地 + '<hr>' +
          streetView +
          '</div>'
      break
    case 'toyamamaibun':
      cont = '<div style=width:300px;font-size:small;>' +
          '名称=' + prop.名称 + '<hr>' +
          'かな=' + prop.かな + '<hr>' +
          '市町村=' + prop.市町村 + '<hr>' +
          '所在地=' + prop.所在地 + '<hr>' +
          '文献=' + prop.文献 + '<hr>' +
          '旧称等=' + prop.旧称等 + '<hr>' +
          '現況=' + prop.現況 + '<hr>' +
          '番号=' + prop.番号 + '<hr>' +
          '発掘=' + prop.発掘 + '<hr>' +
          '立地=' + prop.立地 + '<hr>' +
          '面積=' + prop.面積 + '<hr>' +
          '</div>'
      break
    case 'hokkaidoumaibun':
      cont = '<div style=width:300px;font-size:small;>' +
          '名称=' + prop.SiteName + '<hr>' +
          '所在地=' + prop.所在地 + '<hr>' +
          '出土遺物=' + prop.出土遺物 + '<hr>' +
          '時代=' + prop.時代 + '<hr>' +
          '標高=' + prop.標高 + '<hr>' +
          '種別=' + prop.種別 + '<hr>' +
          '立地=' + prop.立地 + '<hr>' +
          streetView +
          '</div>'
      break
    case 'hokkaidouTunami':
    case 'hokkaidouTunamiT':
      let sinsui = ''
      if (prop.max) {
        cont = '<div style=width:200px;>' +
            '浸水想定=' + prop.max + 'メートル' +
            '</div>'
      } else if (prop.MAX_SIN) {
          cont = '<div style=width:200px;>' +
              '浸水想定=' + prop.MAX_SIN + 'メートル' +
              '</div>'
      } else {
        switch (prop.level) {
          case 1://0.3
            sinsui = '0.3メートル未満'
            break;
          case 2://1
            sinsui = '0.3〜1メートル未満'
            break;
          case 3://2
            sinsui = '1〜2メートル未満'
            break;
          case 4://2〜5
            sinsui = '2〜5メートル未満'
            break;
          case 5://10
            sinsui = '5〜10メートル未満'
            break;
          case 6://20
            sinsui = '10〜20メートル未満'
            break;
          case 7:
            sinsui = '20メートル以上'
            break;
        }
        cont = '<div style=width:250px;>' +
            '浸水想定=' + sinsui + '<hr>' +
            'ズームすると詳細な浸水想定を表示します。'
            '</div>'
      }
      break
    case 'chimei':
    case 'dobokuisan':
    case 'draganddrop':
      cont = '<div style=width:300px;max-height:500px;overflow:scroll;font-size:small;>'
      Object.keys(prop).forEach(function(key) {
        if (key !== 'geometry') {
          // cont += key + '=' + prop[key] + '<hr>'
          cont += key + '=' + prop[key] + '<br>'
        }
      })
      cont += streetView +'<div>'
      break
    case 'nihonisanheatmap':
    case 'nihonisan':
      cont = '<div style=width:200px;font-size:small;>' +
          '名称=<a href="https://japan-heritage.bunka.go.jp/ja/stories/story' +  ('000' + prop.jhno).slice(-3) + '/" target="_blank" >' + prop.name + '</a><hr>' +
          '読み=' + prop.yomi + '<br>' +
          '所在地=' + prop.spot + '<br>' +
          '指定等=' + prop.status + '<br>' +
          '<a href="' + prop.image + '" target="_blank"><img width="200px" src="' + prop.image + '"></a><hr>' +
          streetView +
          '</div>'
      break
    case 'senkyoku':
      cont = '<div style=width:150px;>' +
          '選挙区=' + prop.kuname +
          '</div>'
      break
    case 'yubinku':
      cont = '<div style=width:200px;>' +
          '郵便番号=' + prop.fullcode + '<br>' +
          '郵便区名=' + prop.name + '<br>' +
          '読み=' + prop.yomi + '<br>' +
          '都道府県=' + prop.ken + '<br>' +
          '地域=' + prop.area +
          '</div>'
      break
    case 'meijikokudo':
      cont = '<div style=width:200px;>' +
          '名称=' + prop.Name + '<br>' +
          '</div>'
      break
  }
  content.innerHTML = cont
  if (cont && cont !== undefined) overlay.setPosition(coordinate);
}
//----------------------------------------------------------------------------------------
export function popupSeamless(overlay,evt,content) {
  const coordinate = evt.coordinate;
  const coord4326 = transform(coordinate, "EPSG:3857", "EPSG:4326");
  const point = coord4326[1] + "," + coord4326[0];
  console.log("https://gbank.gsj.jp/seamless/v2/api/1.2/legend.json/?point=" + point);
  const url = 'https://gbank.gsj.jp/seamless/v2/api/1.2/legend.json'
  axios.get(url, {
    params: {
      point:point
    }
  }) .then(function (response) {
    console.log(response.data)
    const cont =
        '<div style=width:300px>形成時代 = ' + response.data["formationAge_ja"] +
        '<hr>グループ = '+ response.data["group_ja"] +
        '<hr>岩相 = ' + response.data["lithology_ja"] + '</div>'
    content.innerHTML = cont
    if (response.data.symbol) {
      overlay.setPosition(coordinate)
    } else {
      overlay.setPosition(undefined);
    }
  });
}
//----------------------------------------------------------------------------------------
export function popUpShinsuishin(rgba,coordinate) {
    const lonLat = transform([coordinate[0],coordinate[1]], "EPSG:3857", "EPSG:4326")
    const lon = lonLat[0]
    const lat = lonLat[1]
    const streetView = '<a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + lat + ',' + lon + '&hl=ja" target="_blank">Street Viewを開く</a></div>'
    const r = rgba[0]
    const g = rgba[1]
    const b = rgba[2]
    let cont
    if(r===255 && g===255 && b===179 || r===248 && g===225 && b===166) {
      cont = "<div style=width:200px>洪水浸水深　0.5m未満</div>"
    }else if(r===247 && g===245 && b===169) {
      cont = "<div style=width:200px>洪水浸水深　0.5m未満</div>"
    }else if(r===255 && g===216 && b===192) {
      cont = "<div style=width:200px>洪水浸水深　0.5〜3.0m</div>"
    }else if(r===255 && g===183 && b===183) {
      cont = "<div style=width:200px>洪水浸水深　3.0〜5.0m</div>"
    }else if(r===255 && g===145 && b===145) {
      cont = "<div style=width:200px>洪水浸水深　5.0〜10.0m</div>"
    }else if(r===242 && g===133 && b===201) {
      cont = "<div style=width:200px>洪水浸水深　10.0〜20.0m</div>"
    }else if(r===220 && g===122 && b===220) {
      cont = "<div style=width:200px>洪水浸水深　20.0m以上</div>"
    }
    cont += streetView
    store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpTunami(rgba,coordinate) {
  const lonLat = transform([coordinate[0],coordinate[1]], "EPSG:3857", "EPSG:4326")
  const lon = lonLat[0]
  const lat = lonLat[1]
  const streetView = '<a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + lat + ',' + lon + '&hl=ja" target="_blank">Street Viewを開く</a></div>'

  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===255 && b===179) {
    cont = "<div style=width:200px>津波浸水深　0.3m未満</div>"
  }else if(r===247 && g===245 && b===169) {
    cont = "<div style=width:200px>津波浸水深　0.3~0.5m</div>"
  }else if(r===248 && g===225 && b===166) {
    cont = "<div style=width:200px>津波浸水深　0.5~1.0m</div>"
  }else if(r===255 && g===216 && b===192) {
    cont = "<div style=width:200px>津波浸水深　1.0~3.0m</div>"
  }else if(r===255 && g===183 && b===183) {
    cont = "<div style=width:200px>津波浸水深　3.0~5.0m</div>"
  }else if(r===255 && g===145 && b===145) {
    cont = "<div style=width:200px>津波浸水深　5.0~10.0m</div>"
  }else if(r===242 && g===133 && b===201) {
    cont = "<div style=width:200px>津波浸水深　10.0~20.0m</div>"
  }else if(r===220 && g===122 && b===220) {
    cont = "<div style=width:200px>津波浸水深　20.0m以上</div>"
  }
  cont += streetView
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpKeizoku(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===160 && g===210 && b===255) {
    cont = "<div style=width:200px>浸水継続　12時間未満</div>"
  }else if(r===0 && g===65 && b===255) {
    cont = "<div style=width:200px>浸水継続　12時間~1日未満</div>"
  }else if(r===250 && g===245 && b===0) {
    cont = "<div style=width:200px>浸水継続　1日~3日未満</div>"
  }else if(r===255 && g===153 && b===0) {
    cont = "<div style=width:200px>浸水継続　3日~1週間未満</div>"
  }else if(r===255 && g===40 && b===0) {
    cont = "<div style=width:200px>浸水継続　1週間~2週間未満</div>"
  }else if(r===180 && g===0 && b===104) {
    cont = "<div style=width:200px>浸水継続　2週間~4週間未満</div>"
  }else if(r===96 && g===0 && b===96) {
    cont = "<div style=width:200px>浸水継続　4週間以上~</div>"
  }
  store.commit('base/popUpContUpdate',cont)
  }
//----------------------------------------------------------------------------------------
export function popUpTakasio(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===255 && b===179) {
    cont = "<div style=width:200px>高潮浸水深　0.3m未満</div>"
  }else if(r===247 && g===245 && b===169) {
    cont = "<div style=width:200px>高潮浸水深　0.3~0.5m</div>"
  }else if(r===248 && g===225 && b===166) {
    cont = "<div style=width:200px>高潮浸水深　0.5~1.0m</div>"
  }else if(r===255 && g===216 && b===192) {
    cont = "<div style=width:200px>高潮浸水深　1.0~3.0m</div>"
  }else if(r===255 && g===183 && b===183) {
    cont = "<div style=width:200px>高潮浸水深　3.0~5.0m</div>"
  }else if(r===255 && g===145 && b===145) {
    cont = "<div style=width:200px>高潮浸水深　5.0~10.0m</div>"
  }else if(r===242 && g===133 && b===201) {
    cont = "<div style=width:200px>高潮浸水深　10.0~20.0m</div>"
  }else if(r===220 && g===122 && b===220) {
    cont = "<div style=width:200px>高潮浸水深　20.0m以上</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpDosya(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===229 && g===200 && b===49) {
    cont = "<div style=width:300px>土砂災害の危険性：土石流警戒区域(指定前)（山腹が崩壊して生じた土石等又は渓流の土石等が水と一体となって流下する自然現象）</div>"
  }else if(r===230 && g===201 && b===49) {
    cont = "<div style=width:300px>土砂災害の危険性：土石流警戒区域(指定前)（山腹が崩壊して生じた土石等又は渓流の土石等が水と一体となって流下する自然現象)</div>"
  }else if(r===229 && g===200 && b===50) {
    cont = "<div style=width:300px>土砂災害の危険性：土石流警戒区域(指定前)（山腹が崩壊して生じた土石等又は渓流の土石等が水と一体となって流下する自然現象)</div>"
  }else if(r===230 && g===200 && b===49) {
    cont = "<div style=width:300px>土砂災害の危険性：土石流警戒区域(指定前)（山腹が崩壊して生じた土石等又は渓流の土石等が水と一体となって流下する自然現象)</div>"
  }else if(r===230 && g===200 && b===50) {
    cont = "<div style=width:300px>土砂災害の危険性：土石流警戒区域(指定済)（山腹が崩壊して生じた土石等又は渓流の土石等が水と一体となって流下する自然現象）</div>"
  }else if(r===165 && g===0 && b===33) {
    cont = "<div style=width:300px>土砂災害の危険性：土石流特別警戒区域(指定済)（山腹が崩壊して生じた土石等又は渓流の土石等が水と一体となって流下する自然現象）</div>"
  }else if(r===169 && g===10 && b===34) {
    cont = "<div style=width:300px>土砂災害の危険性：土石流特別警戒区域(指定前)（山腹が崩壊して生じた土石等又は渓流の土石等が水と一体となって流下する自然現象）</div>"
  }else if(r===226 && g===190 && b===49) {
    cont = "?"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpDoseki(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===245 && g===153 && b===101) {
    cont = "<div style=width:300px>土砂災害の危険性：土石流危険渓流（土石流の発生の危険性があり、人家等に被害を与えるおそれがある渓流）</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpKyuukeisyai(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===224 && g===224 && b===254) {
    cont = "<div style=width:300px>土砂災害の危険性：急傾斜地崩壊危険箇所（傾斜度30°かつ高さ5m以上の急傾斜地で人家等に被害を与えるおそれのある箇所）</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpZisuberi(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===235 && b===223) {
    cont = "<div style=width:300px>土砂災害の危険性：地すべり危険箇所（地すべりが発生している又は地すべりが発生するおそれがある区域のうち、人家等に被害を与えるおそれのある箇所）</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpNadare(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===255 && b===101) {
    cont = "<div style=width:300px>土砂災害の危険性：雪崩危険箇所（雪崩災害のおそれがある地域において、雪崩により人家等に被害を与えるおそれのある箇所）</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpTameike(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===0 && g===0 && b===255) {
    cont = "<div style=width:300px>ため池決壊によって浸水が想定される区域</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===200 && g===0 && b===255) {
    cont = "<div style=width:200px>埋立地や旧河道</div>"
  }else if(r===255 && g===40 && b===0) {
    cont = "<div style=width:200px>干拓地や自然堤防など</div>"
  }else if(r===255 && g===170 && b===0) {
    cont = "<div style=width:200px>緩勾配の谷底低地、緩勾配の扇状地など</div>"
  }else if(r===255 && g===245 && b===0) {
    cont = "<div style=width:200px>急勾配の谷底低地、急勾配の扇状地など</div>"
  }else if(r===200 && g===200 && b===203) {
    cont = "<div style=width:200px>山地や丘陵など</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka01(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===255) {
    cont = "<div style=width:200px>液状化発生確率20%〜</div>"
  }else if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化発生確率10%〜20%</div>"
  }else if(r===255 && g===145 && b===0) {
    cont = "<div style=width:200px>液状化発生確率1%〜10%</div>"
  }else if(r===255 && g===209 && b===0) {
    cont = "<div style=width:200px>液状化発生確率0.1%〜1%</div>"
  }else if(r===243 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化発生確率0.1%未満</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka02(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化指数＝15〜</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化指数＝5〜15</div>"
  }else if(r===50 && g===232 && b===43) {
    cont = "<div style=width:200px>液状化指数＝0〜5</div>"
  }else if(r===12 && b===225) {
    cont = "<div style=width:200px>液状化指数＝0</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化の可能性が極めて小さい</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka03(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化可能性大</div>"
  }else if(r===247 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化可能性中</div>"
  }else if(r===46 && g===255 && b===56) {
    cont = "<div style=width:200px>液状化可能性無</div>"
  }else if(r===198 && g===255 && b===249) {
    cont = "<div style=width:200px>判定対象外</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka04(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化の危険性が極めて高い</div>"
  }else if(r===255 && g===200 && b===0) {
    cont = "<div style=width:200px>液状化の危険性が高い</div>"
  }else if(r===203 && g===255 && b===165) {
    cont = "<div style=width:200px>液状化の危険性がやや高い</div>"
  }else if(r===3 && g===227 && b===0) {
    cont = "<div style=width:200px>液状化の危険性は低い</div>"
  }else if(r===213 && g===213 && b===213) {
    cont = "<div style=width:200px>液状化の危険性はかなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka05(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===247 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===55 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===179 && g===255 && b===250) {
    cont = "<div style=width:200px>液状化危険度＝極めて低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka06(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===176 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化の危険度あり（大）</div>"
  }else if(r===225 && g===51 && b===24) {
    cont = "<div style=width:200px>液状化の危険度あり（中）</div>"
  }else if(r===226 && g===159 && b===87) {
    cont = "<div style=width:200px>液状化の危険度あり（小）</div>"
  }else if(r===255 && g===242 && b===47) {
    cont = "<div style=width:200px>液状化の危険度低</div>"
  }else if(r===211 && g===211 && b===211) {
    cont = "<div style=width:200px>液状化の危険度不明</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka07(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===4) {
    cont = "<div style=width:200px>液状化危険度は極めて高い</div>"
  }else if(r===255 && g===145 && b===67) {
    cont = "<div style=width:200px>液状化危険度は高い</div>"
  }else if(r===255 && g===255 && b===103) {
    cont = "<div style=width:200px>液状化危険度は低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度はかなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka08(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化指数＝30〜</div>"
  }else if(r===255 && g===213 && b===0) {
    cont = "<div style=width:200px>液状化指数＝15〜30</div>"
  }else if(r===255 && g===255 && b===85) {
    cont = "<div style=width:200px>液状化指数＝5〜15</div>"
  }else if(r===185 && g===185 && b===185) {
    cont = "<div style=width:200px>液状化指数＝0〜5</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化指数＝0</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka09(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化指数＝30〜</div>"
  }else if(r===255 && g===221 && b===0) {
    cont = "<div style=width:200px>液状化指数＝15〜30</div>"
  }else if(r===243 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化指数＝5〜15</div>"
  }else if(r===121 && g===253 && b===255) {
    cont = "<div style=width:200px>液状化指数＝0〜5</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化指数＝0</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka10(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===255 && g===217 && b===26) {
    cont = "<div style=width:200px>液状化危険度＝やや高い</div>"
  }else if(r===38 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===4 && g===0 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝きわめて低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝液状化対象外</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka12(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===255 && g===162 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝やや高い</div>"
  }else if(r===66 && g===255 && b===56) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===0 && g===25 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝極めて低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝判定対象外</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka13(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化指数＝5</div>"
  }else if(r===1 && g===1 && b===255) {
    cont = "<div style=width:200px>液状化指数＝0から5</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka14(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===247 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===0 && g===255 && b===42) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===0 && g===29 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝かなり低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝液状化対象外</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka16(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===4) {
    cont = "<div style=width:200px>危険度A</div>"
  }else if(r===247 && g===255 && b===0) {
    cont = "<div style=width:200px>危険度B</div>"
  }else if(r===123 && g===255 && b===0) {
    cont = "<div style=width:200px>危険度C</div>"
  }else if(r===0 && g===55 && b===255) {
    cont = "<div style=width:200px>危険度D</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka17(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===238 && g===0 && b===3) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===222 && g===89 && b===205) {
    cont = "<div style=width:200px>液状化危険度＝やや高い</div>"
  }else if(r===230 && g===234 && b===102) {
    cont = "<div style=width:200px>液状化危険度＝やや低い</div>"
  }else if(r===79 && g===214 && b===237) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝ほとんどない</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka18(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===4) {
    cont = "<div style=width:200px>液状化判定＝可能性が極めて高い</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化判定＝可能性が高い</div>"
  }else if(r===21 && g===205 && b===0) {
    cont = "<div style=width:200px>液状化判定＝可能性が低い</div>"
  }else if(r===116 && g===91 && b===255) {
    cont = "<div style=width:200px>液状化判定＝可能性なし</div>"
  }else if(r===0 && g===13 && b===255) {
    cont = "<div style=width:200px>液状化判定＝判定対象外</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka19(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===249 && g===124 && b===141) {
    cont = "<div style=width:200px>液状化発生の可能性が高い</div>"
  }else if(r===255 && g===239 && b===94) {
    cont = "<div style=width:200px>液状化発生の可能性がある</div>"
  }else if(r===153 && g===255 && b===186) {
    cont = "<div style=width:200px>液状化発生の可能性が低い</div>"
  }else if(r===169 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化発生の可能性が極めて低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化対象層なし</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka20(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===255 && g===251 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝やや高い</div>"
  }else if(r===46 && g===255 && b===56) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===12 && g===0 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝極めて低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>なし</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka21(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===4) {
    cont = "<div style=width:200px>液状化指数＝15〜</div>"
  }else if(r===255 && g===197 && b===6) {
    cont = "<div style=width:200px>液状化指数＝5〜15</div>"
  }else if(r===255 && g===251 && b===0) {
    cont = "<div style=width:200px>液状化指数＝0〜5</div>"
  }else if(r===205 && g===205 && b===205) {
    cont = "<div style=width:200px>液状化指数＝0</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka22(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化可能性ランク＝大</div>"
  }else if(r===247 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化可能性ランク＝中</div>"
  }else if(r===46 && g===255 && b===56) {
    cont = "<div style=width:200px>液状化可能性ランク＝小</div>"
  }else if(r===184 && g===255 && b===195) {
    cont = "<div style=width:200px>液状化可能性ランク＝なし</div>"
  }else if(r===184 && g===184 && b===184) {
    cont = "<div style=width:200px>対象外</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka23(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===255 && g===252 && b===65) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===103 && g===255 && b===73) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===242 && g===255 && b===226) {
    cont = "<div style=width:200px>液状化危険度＝極めて低い</div>"
  }else if(r===212 && g===212 && b===212) {
    cont = "<div style=width:200px>液状化対象層なし</div>"
  }else if(r===162 && g===162 && b===162) {
    cont = "<div style=width:200px>計算対象外</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka24(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===0 && g===255 && b===51) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===202 && g===255 && b===211) {
    cont = "<div style=width:200px>液状化危険度＝極めて低い</div>"
  }else if(r===205 && g===205 && b===205) {
    cont = "<div style=width:200px>液状化対象層なし</div>"
  }else if(r===114 && g===114 && b===114) {
    cont = "<div style=width:200px>計算対象外</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka25(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===242 && g===127 && b===107) {
    cont = "<div style=width:200px>液状化可能性大</div>"
  }else if(r===254 && g===189 && b===171) {
    cont = "<div style=width:200px>液状化可能性中</div>"
  }else if(r===255 && g===229 && b===229) {
    cont = "<div style=width:200px>液状化可能性小</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化可能性なし</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka26(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===136 && g===0 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝高</div>"
  }else if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝中</div>"
  }else if(r===255 && g===169 && b===112) {
    cont = "<div style=width:200px>液状化危険度＝低</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝なし</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka27(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化指数＝25〜 激しい</div>"
  }else if(r===255 && g===200 && b===0) {
    cont = "<div style=width:200px>液状化指数＝20〜25 激しい</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化指数＝15〜20</div>"
  }else if(r===105 && g===255 && b===127) {
    cont = "<div style=width:200px>液状化指数＝10〜15 中程度</div>"
  }else if(r===0 && g===219 && b===32) {
    cont = "<div style=width:200px>液状化指数＝5〜10 程度は小さい</div>"
  }else if(r===114 && g===246 && b===255) {
    cont = "<div style=width:200px>液状化指数＝0〜5 ほとんどなし</div>"
  }else if(r===197 && g===197 && b===197) {
    cont = "<div style=width:200px>液状化指数＝なし</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka28(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度は極めて高い</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度は高い</div>"
  }else if(r===0 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度は低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度はかなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka29(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===196 && b===0) {
    cont = "<div style=width:200px>液状化指数＝15〜</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化指数＝10〜15</div>"
  }else if(r===42 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化指数＝5〜10</div>"
  }else if(r===55 && g===0 && b===255) {
    cont = "<div style=width:200px>液状化指数＝0〜5</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka30(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化指数＝30〜</div>"
  }else if(r===255 && g===189 && b===7) {
    cont = "<div style=width:200px>液状化指数＝15〜30</div>"
  }else if(r===255 && g===255 && b===4) {
    cont = "<div style=width:200px>液状化指数＝5〜15</div>"
  }else if(r===11 && g===255 && b===23) {
    cont = "<div style=width:200px>液状化指数＝0〜5</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化指数＝0</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka31(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===4) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===255 && g===196 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===72 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===25 && g===0 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝かなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka32(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===4) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===255 && g===217 && b===46) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===0 && g===255 && b===51) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===29 && g===0 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝極めて低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka33(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度は極めて高い</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度は高い</div>"
  }else if(r===0 && g===255 && b===29) {
    cont = "<div style=width:200px>液状化危険度は低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度はかなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka34(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===236 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化指数＝30〜</div>"
  }else if(r===253 && g===161 && b===0) {
    cont = "<div style=width:200px>液状化指数＝15〜30</div>"
  }else if(r===254 && g===250 && b===27) {
    cont = "<div style=width:200px>液状化指数＝5〜15</div>"
  }else if(r===13 && g===111 && b===247) {
    cont = "<div style=width:200px>液状化指数＝0〜5</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka35(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===4) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===255 && g===251 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝かなり高い</div>"
  }else if(r===0 && g===255 && b===242) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===25 && g===0 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝かなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka36(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度が極めて高い</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度が高い</div>"
  }else if(r===0 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度は低い</div>"
  }else if(r===208 && g===208 && b===208) {
    cont = "<div style=width:200px>液状化危険度はかなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka37(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===188 && b===51) {
    cont = "<div style=width:200px>危険度A　液状化危険度はかなり高い</div>"
  }else if(r===244 && g===255 && b===48) {
    cont = "<div style=width:200px>危険度B　液状化危険度は高い</div>"
  }else if(r===111 && g===236 && b===48) {
    cont = "<div style=width:200px>危険度C　液状化危険度は低い</div>"
  }else if(r===214 && g===214 && b===214) {
    cont = "<div style=width:200px>危険度D　液状化危険度はかなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka38(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===254 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===255 && g===168 && b===2) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===7 && g===108 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝かなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka39(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化可能性＝大</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化可能性＝中</div>"
  }else if(r===0 && g===225 && b===18) {
    cont = "<div style=width:200px>液状化可能性＝小</div>"
  }else if(r===0 && g===255 && b===251) {
    cont = "<div style=width:200px>液状化可能性＝なし</div>"
  }else if(r===209 && g===209 && b===209) {
    cont = "<div style=width:200px>液状化可能性＝対象層なし</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka40(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===5 && b===21) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===247 && g===255 && b===3) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===6 && g===193 && b===3) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===43 && g===128 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝かなり低い</div>"
  }else if(r===169 && g===171 && b===174) {
    cont = "<div style=width:200px>液状化危険度＝対象層なし</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka41(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===255 && g===200 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===0 && g===255 && b===29) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===17 && g===0 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝かなり低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝なし</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka42(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度が極めて高い</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度が高い</div>"
  }else if(r===0 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化危険度は低い</div>"
  }else if(r===128 && g===128 && b===128) {
    cont = "<div style=width:200px>液状化危険度はかなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka43(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===131 && b===112) {
    cont = "<div style=width:200px>液状化の可能性が高い</div>"
  }else if(r===131 && g===255 && b===177) {
    cont = "<div style=width:200px>液状化の可能性がある</div>"
  }else if(r===157 && g===254 && b===255) {
    cont = "<div style=width:200px>液状化の可能性が低い</div>"
  }else if(r===255 && g===255 && b===255) {
    cont = "<div style=width:200px>液状化の可能性はない</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka44(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度が極めて高い</div>"
  }else if(r===238 && g===255 && b===49) {
    cont = "<div style=width:200px>液状化危険度が高い</div>"
  }else if(r===23 && g===255 && b===96) {
    cont = "<div style=width:200px>液状化危険度が低い</div>"
  }else if(r===180 && g===180 && b===180) {
    cont = "<div style=width:200px>液状化危険度がかなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka45(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化可能性＝大</div>"
  }else if(r===255 && g===255 && b===0) {
    cont = "<div style=width:200px>液状化可能性＝中</div>"
  }else if(r===46 && g===255 && b===56) {
    cont = "<div style=width:200px>液状化可能性＝小</div>"
  }else if(r===209 && g===209 && b===209) {
    cont = "<div style=width:200px>液状化可能性＝なし</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka46(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化危険度＝極めて高い</div>"
  }else if(r===238 && g===255) {
    cont = "<div style=width:200px>液状化危険度＝高い</div>"
  }else if(r===6 && g===193 && b===3) {
    cont = "<div style=width:200px>液状化危険度＝低い</div>"
  }else if(r===103 && g===215 && b===255) {
    cont = "<div style=width:200px>液状化危険度＝かなり低い</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpEkizyouka47(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===0 && b===0) {
    cont = "<div style=width:200px>液状化指数＝15〜</div>"
  }else if(r===255 && g===182 && b===79) {
    cont = "<div style=width:200px>液状化指数＝5〜15</div>"
  }else if(r===146 && g===242 && b===43) {
    cont = "<div style=width:200px>液状化指数＝0〜5</div>"
  }else if(r===6 && g===173 && b===3) {
    cont = "<div style=width:200px>液状化指数＝0</div>"
  }
  store.commit('base/popUpContUpdate',cont)
}

//----------------------------------------------------------------------------------------
export function popUpJisin(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if (r === 224 && g === 199 && b === 224) {
    cont = "<div style=width:200px>高い 26%以上</div>"
  } else if (r === 254 && g === 209 && b === 199) {
    cont = "<div style=width:200px>高い 6%〜26%</div>"
  } else if (r === 254 && g === 229 && b === 149) {
    cont = "<div style=width:200px>高い 3%〜6%</div>"
  } else if (r === 254 && g === 254 && b === 189) {
    cont = "<div style=width:200px>やや高い 0.1%〜3%</div>"
  }
  store.commit('base/popUpContUpdate', cont)
}
//----------------------------------------------------------------------------------------
export function popUpMorido(rgba,coordinate) {
  const lonLat = transform([coordinate[0],coordinate[1]], "EPSG:3857", "EPSG:4326")
  const lon = lonLat[0]
  const lat = lonLat[1]
  const streetView = '<a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + lat + ',' + lon + '&hl=ja" target="_blank">Street Viewを開く</a></div>'
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if (r === 155 && g === 255 && b === 155) {
    cont = "<div style=width:200px>盛土区分＝谷埋め型</div>"
  } else if (r === 155 && g === 155 && b === 255) {
    cont = "<div style=width:200px>盛土区分＝腹付け型</div>"
  } else if (r === 254 && g === 229 && b === 149) {
    cont = "<div style=width:200px>高い 3%〜6%</div>"
  } else if (r === 254 && g === 254 && b === 189) {
    cont = "<div style=width:200px>やや高い 0.1%〜3%</div>"
  }
  cont += streetView
  store.commit('base/popUpContUpdate', cont)
}
//----------------------------------------------------------------------------------------
export function popUpDojyou(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  let url
  let a
  const result = figureRGB.find((value) =>{
    return value[0] === r && value[1] === g && value[2] === b
  })
  if (result) {
    if (result[3].slice(0,1) === 'A' ||
        result[3].slice(0,1) === 'B' ||
        result[3].slice(0,1) === 'C') {
      url = result[3].slice(0,1)
      a = "<a href='https://soil-inventory.rad.naro.go.jp/explain/" + url + ".html' target='_blank'>" + result[4] + "</a>"
    } else if(result[3].slice(0,1) === 'Z') {
      a = result[4]
    } else {
      url = result[3].slice(0,2)
      a = "<a href='https://soil-inventory.rad.naro.go.jp/explain/" + url + ".html' target='_blank'>" + result[4] + "</a>"
    }
    cont = "<div style=width:300px;font-size:small>" +
        "土壌分類名：" + a +
        "<br>土壌分類記号：" + result[3] +
        "<br>" + result[5] +
        "</div>"
  }
  store.commit('base/popUpContUpdate', cont)
}
//----------------------------------------------------------------------------------------
export function popUpTisitu(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  const figureRGB =[
        [254,227,200,"砂礫地","土地の表面が砂と小石のところ。砂や礫でできた荒地、風の運搬作用によって砂が堆積してできた砂丘も含む。",""],
        [254,200,200,"泥地","常にぬかるんでいて植物が存在せず、通過が困難な土地。",""],
        [228,172,123,"泥炭地","｢泥炭地｣と記された範囲。",""],
        [200,200,228,"湿地","概ね湿潤で葦(あし)などの植物が生えるような土地のこと。",""],
        [209,234,255,"干潟・砂浜","満潮時には、海面に没する地形。",""],
        [147,200,254,"河川、湖沼、海面","河川や水路、湖沼と記された範囲及び、河口部から海上の範囲。養魚場や貯木場、小規模な農業用の池なども含む。",""],
        [251,247,176,"田（水田、陸田）","水田は稲や蓮などを栽培する田で四季を通じて水がある土地のこと。陸田は稲を栽培する田で冬季に水が涸れ、歩けるような土地のこと。乾田とも言う。",""],
        [225,227,118,"深田","膝ぐらいまでぬかる泥深い田もしくは小舟を用いて耕作するような田のこと。沼田とも言う。",""],
        [227,227,200,"塩田","海水から食塩を取るために設けた砂浜の設備。",""],
        [162,222,162,"草地","牧草を栽培する土地や｢草｣と記された範囲。ただし、山地や台地上のものは取得しない。",""],
        [173,200,147,"荒地","開墾されたことがないまたは、かつては開墾されていたが長期間荒れ果てたところ。ただし、山地や台地上のものは取得しない。",""],
        [119,227,201,"ヨシ（芦葦）","蘆｣、｢芦｣、｢葦｣、｢葮｣、｢蓮｣と記された範囲。または芦葦記号。",""],
        [173,255,173,"茅","茅｣、｢萱｣と記された範囲。",""],
        [144,73,11,"堤防","河川の氾濫や海水の浸入を防ぐため、河岸･海岸に沿って設けた土石の構築物。",""],
      ]

  const result = figureRGB.find((value) =>{
    return value[0] === r && value[1] === g && value[2] === b
  })
  if (result) {

    cont = "<div style=width:300px;font-size:small>" +
        result[3] + "<hr>" +
        "説明＝" + result[4] +
        "</div>"
  }
  store.commit('base/popUpContUpdate', cont)
}