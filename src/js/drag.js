const drag = {
  install (Vue) {
    var store = new Vue({
      data: {
        dragTarget: '9999',
        dragging: false,
        yDifference:  0,
        xDifference: 0
      }
    });
    const startDrag = (el) => {
      const e = window.event;
      store.dragging = true;
      store.dragTarget = el;
      if (e.changedTouches) {
        const touchObject = e.changedTouches[0];
        store.yDifference = touchObject.pageY - store.dragTarget.offsetTop;
        store.xDifference = touchObject.pageX - store.dragTarget.offsetLeft
      } else {
        store.yDifference = e.clientY - store.dragTarget.offsetTop;
        store.xDifference = e.clientX - store.dragTarget.offsetLeft
      }
    };
    const doDrag = () => {
      if (store.dragging) {
        const e = window.event;
        let x = 0;
        let y = 0;
        if (e.changedTouches) {
          const touchObject = e.changedTouches[0];
          y = touchObject.pageY - store.yDifference;
          x = touchObject.pageX - store.xDifference
        } else {
          y = e.clientY - store.yDifference;
          x = e.clientX - store.xDifference
        }
        if (y < 10) y = 0;
        store.dragTarget.style.top = y + 'px';
        store.dragTarget.style.left = x + 'px';
      }
    };
    const stopDrag = () => {
      store.dragging = false;
    };
    Vue.directive('my-drag-handle', {
      bind: (el) => {
        el.addEventListener("mousedown", function() {
          startDrag(el.parentNode);
        }, false);
        el.addEventListener("touchstart", function() {
          startDrag(el.parentNode);
        }, false);
      }
    });
    Vue.directive('my-drag', {
      bind: (el) => {
        el.addEventListener("mousedown", function() {
          startDrag(el);
        }, false);
      }
    });
    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', doDrag);
    window.addEventListener('touchend', stopDrag);
  }
};
export default drag
