<template>
    <div class="dialog-div" :style="this.dialog.style" @mousedown="dialogMouseDown">
        <div class="drag-handle" v-my-drag-handle></div>
            <div>
                <div class="close-btn-div" @click="closeBtn"><i class="fa-solid fa-xmark hover close-btn"></i></div>
                <slot></slot>
            </div>
    </div>
</template>

<script>
  export default {
    name: 'Dialog',
    props: ['dialog'],
    methods: {
      closeBtn () {
        this.dialog.style.display = 'none'
      },
      dialogMouseDown () {
        this.$store.commit('base/incrDialogMaxZindex');
        this.dialog.style["z-index"] = this.$store.state.base.dialogMaxZindex
      }
    },
    computed: {
      s_flg: function () {
        const result = this.$store.state.base.dialogArr.find(el => el.name === this.dialog.name);
        return result.flg
      }
    }
  }
</script>

<style scoped>
    .dialog-div{
        position: absolute;
        z-index: 10;
        background-color: #fff;
        box-shadow:2px 2px 5px #787878;
        border: 1px solid whitesmoke;
        border-radius: 4px;
        transition: opacity 1s;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .drag-handle{
        height: 30px;
        padding: 5px;
        background-color: rgba(0,60,136,0.5);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        cursor: grab;
        /*width: 50px;*/
    }
    .close-btn-div{
        position: absolute;
        top: 0;
        right: 5px;
        cursor: pointer;
        color: #fff;
        z-index: 2;
    }
    .close-btn-div{
      font-size:1.5em;
    }
    .hover:hover{
        color: blue;
    }
    .hover-white:hover{
        color: white;
    }

    /* 1秒かけて透明度を遷移 */
    .v-enter-active, .v-leave-active {
        transition: opacity 1s;
    }
    /* 見えなくなるときの透明度 */
    .v-enter, .v-leave-to {
        opacity: 0;
    }
</style>
