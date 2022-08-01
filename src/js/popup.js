import store from './store'
export function popUp(layers,features,overlay,evt,content) {
  let cont
  const coordinate = evt.coordinate;
  switch (layers[0].get('name') ) {
    // 小学校区
    case 'syougakkouku':
      if(features[0].properties_.A27_001) {
        cont = '市区町村コード＝' + features[0].properties_.A27_001 + '<br>' +
                    '設置主体=' + features[0].properties_.A27_002+ '<br>' +
                    '名称＝' + features[0].properties_.A27_003+ '<br>' +
                    '所在地＝' + features[0].properties_.A27_004+ '<br>'
      } else {
        cont = '市区町村コード＝' + features[0].properties_.A27_005 + '<br>' +
                    '設置主体=' + features[0].properties_.A27_006+ '<br>' +
                    '名称＝' + features[0].properties_.A27_007+ '<br>' +
                    '所在地＝' + features[0].properties_.A27_008+ '<br>'
      }
      break;
    // 中学校区
    case 'tyuugakkouku' :
      if(features[0].properties_.A32_001) {
        cont = '市区町村コード＝' + features[0].properties_.A32_001 + '<br>' +
                    '設置主体=' + features[0].properties_.A32_002 + '<br>' +
                    '名称＝' + features[0].properties_.A32_003 + '<br>' +
                    '所在地＝' + features[0].properties_.A32_004 + '<br>'
      } else {
        cont = '市区町村コード＝' + features[0].properties_.A32_006 + '<br>' +
                    '設置主体=' + features[0].properties_.A32_007 + '<br>' +
                    '名称＝' + features[0].properties_.A32_008 + '<br>' +
                    '所在地＝' + features[0].properties_.A32_009 + '<br>'
      }
       break;
     // 夜の明かり
    case 'japanLight':
      cont = '明るさレベル＝' +  features[0].properties_.light
      break
  }
  content.innerHTML = cont
  if (cont) overlay.setPosition(coordinate);
}
//----------------------------------------------------------------------------------------
export function popUpShinsuishin(rgba) {
    const r = rgba[0]
    const g = rgba[1]
    const b = rgba[2]
    let cont
    if(r===255 && g===255 && b===179) {
      cont = "洪水浸水深　0.5m未満"
    }else if(r===247 && g===245 && b===169) {
      cont = "洪水浸水深　0.5m未満"
    }else if(r===255 && g===216 && b===192) {
      cont = "洪水浸水深　0.5〜3.0m"
    }else if(r===255 && g===183 && b===183) {
      cont = "洪水浸水深　3.0〜5.0m"
    }else if(r===255 && g===145 && b===145) {
      cont = "洪水浸水深　5.0〜10.0m"
    }else if(r===242 && g===133 && b===201) {
      cont = "洪水浸水深　10.0〜20.0m"
    }else if(r===220 && g===122 && b===220) {
      cont = "洪水浸水深　20.0m以上"
    }
    store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpTunami(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===255 && g===255 && b===179) {
    cont = "津波浸水深　0.3m未満"
  }else if(r===247 && g===245 && b===169) {
    cont = "津波浸水深　0.3~0.5m"
  }else if(r===248 && g===225 && b===166) {
    cont = "津波浸水深　0.5~1.0m"
  }else if(r===255 && g===216 && b===192) {
    cont = "津波浸水深　1.0~3.0m"
  }else if(r===255 && g===183 && b===183) {
    cont = "津波浸水深　3.0~5.0m"
  }else if(r===255 && g===145 && b===145) {
    cont = "津波浸水深　5.0~10.0m"
  }else if(r===242 && g===133 && b===201) {
    cont = "津波浸水深　10.0~20.0m"
  }else if(r===220 && g===122 && b===220) {
    cont = "津波浸水深　20.0m以上"
  }
  store.commit('base/popUpContUpdate',cont)
}
//----------------------------------------------------------------------------------------
export function popUpKeizoku(rgba) {
  const r = rgba[0]
  const g = rgba[1]
  const b = rgba[2]
  let cont
  if(r===160 && g===210 && b===255) {
    cont = "浸水継続　12時間未満"
  }else if(r===0 && g===65 && b===255) {
    cont = "浸水継続　12時間~1日未満"
  }else if(r===250 && g===245 && b===0) {
    cont = "浸水継続　1日~3日未満"
  }else if(r===255 && g===153 && b===0) {
    cont = "浸水継続　3日~1週間未満"
  }else if(r===255 && g===40 && b===0) {
    cont = "浸水継続　1週間~2週間未満"
  }else if(r===180 && g===0 && b===104) {
    cont = "浸水継続　2週間~4週間未満"
  }else if(r===96 && g===0 && b===96) {
    cont = "浸水継続　4週間以上~"
  }
  store.commit('base/popUpContUpdate',cont)
  }
