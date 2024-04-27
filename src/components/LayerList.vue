選択可能なレイヤーを全て表示するツリーのvueファイル。
<template>
  <div>
    <input type="text" placeholder="地図を抽出します..." v-model="treeFilter" class="filter-field">
    <tree
        :filter="treeFilter"
        :data="treeData"
        :options="treeOptions"
        @node:selected="onNodeSelected"/>
  </div>
</template>

<script>
  import LiquorTree from 'liquor-tree'
  import * as Layers from '../js/layers'
  export default {
    name: 'LayerList',
    props: ['mapName'],
    components: {
      [LiquorTree.name]: LiquorTree
    },
    data () {
      return {
        treeFilter: '',
        treeData: Layers.Layers,
        treeOptions: {
          filter: {
            emptyText: '見つかりませんでした。'
          }
        }
      }
    },
    methods: {
      onNodeSelected: function (node) {
        if (node.children.length === 0) {
          console.log(node.data)
          const layerList = this.$store.getters['base/layerList'](this.mapName)
          // リストをクリックしたときに既にlayerListに存在する時は削除する
          const deleteLayer = layerList.find(value => {
            return value.id === node.data.id
          })
          if (deleteLayer) {
            // 削除された新しいlayerList配列を作る。
            const newLayerList = layerList.filter(value => {
              return value.id !== deleteLayer.id
            });
            this.$store.commit('base/updateList', {value: newLayerList, mapName: this.mapName})
          } else {
            // 通常の追加
            this.$store.commit('base/unshiftLayerList', {
              value: {
                id: node.data.id,
                multipli: node.multipli,
                check: node.data.check,
                title: node.text,
                layer: node.data.layer,
                opacity: node.data.opacity,
                zoom:node.data.zoom,
                center:node.data.center,
                addFlg:true,
                summary: node.data.summary,
                component: node.data.component
              },
              mapName: this.mapName
            });

            if (node.data.component) {
              const top = this.$store.state.base.dialogs[this.mapName].style.top;
              const left = Number(this.$store.state.base.dialogs[this.mapName].style.left.replace(/px/,"")) + document.querySelector('#' + this.mapName + ' .dialog-div').clientWidth + 10 + 'px';
              const infoDialog =
                {
                  id: node.data.id,
                  multipli: node.multipli,
                  check: node.data.check,
                  title: node.text,
                  summary: node.data.summary,
                  component: node.data.component,
                  style: {
                    display: 'block',
                    top: top,
                    left: left,
                    'z-index': 9
                  }
                };
              this.$store.commit('base/deketeDialogsInfo',{mapName: this.mapName})
              this.$store.commit('base/pushDialogsInfo', {mapName: this.mapName, dialog: infoDialog});
            }
          }
        }
        node.unselect()
      }
    }
  }
</script>

<style>
    /*非scopedでないと反映しなかったため*/
    .tree-root{
        margin: 0;
    }
    .tree-content{
        padding: 0;
        height: 24px;
    }
    .tree-anchor{
        margin-left: 0;
        padding: 0;
    }
    .filter-field{
      margin: 5px;
      width: 97%;
    }
</style>
