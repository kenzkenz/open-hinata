選択可能なレイヤーを全て表示するツリーのvueファイル。
<template>
    <tree :data="treeData" :options="treeOptions" @node:selected="onNodeSelected"/>
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
        treeData: Layers.Layers,
        treeOptions: {} // 今の所なにも設定していない
      }
    },
    methods: {
      onNodeSelected: function (node) {
        if (node.children.length === 0) {
          console.log(node.data.id)
          this.$store.commit('base/unshiftLayerList', {
            value: {
              id: node.data.id,
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
            this.$store.commit('base/pushDialogsInfo', {mapName: this.mapName, dialog: infoDialog});
          }
        }
        node.unselect()// セレクト状態を解除。解除しないと続けて押せない。
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
</style>
