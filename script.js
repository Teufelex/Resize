const el = document.querySelector(".item");
const resizers = document.querySelectorAll(".resizer");

const RESIZE = {
  properties: {
    isResizing: false,
    prevX: 0,
    prevY: 0,
  },

  dragged(e) {
    if (!RESIZE.properties.isResizing) {
      let newX = RESIZE.properties.prevX - e.clientX;
      let newY = RESIZE.properties.prevY - e.clientY;

      const rect = el.getBoundingClientRect();

      el.style.left = rect.left - newX + "px";
      el.style.top = rect.top - newY + "px";

      RESIZE.properties.prevX = e.clientX;
      RESIZE.properties.prevY = e.clientY;
    }
  },

  dragEnd() {
    window.removeEventListener("mousemove", RESIZE.dragged);
    window.removeEventListener("mouseup", RESIZE.dragEnd);
  },

  draggable(e) {
    RESIZE.properties.prevX = e.clientX;
    RESIZE.properties.prevY = e.clientY;

    window.addEventListener("mousemove", RESIZE.dragged);
    window.addEventListener("mouseup", RESIZE.dragEnd);
  },

  mousedown(e) {
    let currentResizer = e.target;
    RESIZE.properties.isResizing = true;

    let prevX = e.clientX;
    let prevY = e.clientY;

    const mousemove = (e) => {
      const rect = el.getBoundingClientRect();
      let diff = rect.width / rect.height || 1;

      if (currentResizer.classList.contains("se")) {
        let newWidth = rect.width - (prevX - e.clientX);
        el.style.width = newWidth + "px";
        el.style.height = newWidth / diff + "px";
      } else if (currentResizer.classList.contains("sw")) {
        let newWidth = rect.width + (prevX - e.clientX);
        el.style.width = newWidth + "px";
        el.style.height = newWidth / diff + "px";
        el.style.left = rect.left - (prevX - e.clientX) + "px";
      } else if (currentResizer.classList.contains("ne")) {
        let newWidth = rect.width - (prevX - e.clientX);
        el.style.width = rect.width - (prevX - e.clientX) + "px";
        el.style.height = newWidth / diff + "px";
        el.style.top = rect.top - (newWidth / diff - rect.height) + "px";
      } else if (currentResizer.classList.contains("nw")){
        let newWidth = rect.width + (prevX - e.clientX);
        el.style.width = rect.width + (prevX - e.clientX) + "px";
        el.style.height = newWidth / diff + "px";
        el.style.top = rect.top - (newWidth / diff - rect.height) + "px";
        el.style.left = rect.left - (prevX - e.clientX) + "px";
      } else if (currentResizer.classList.contains("w")){
        el.style.width = rect.width + (prevX - e.clientX) + "px";
        el.style.left = rect.left - (prevX - e.clientX) + "px";
      } else if (currentResizer.classList.contains("e")) {
        el.style.width = rect.width - (prevX - e.clientX) + "px";
      } else if (currentResizer.classList.contains("s")){
        el.style.height = rect.height + (prevY - e.clientY) + "px";
        el.style.top = rect.top - (prevY - e.clientY) + "px";
      } else {
        el.style.height = rect.height - (prevY - e.clientY) + "px";
      }

      prevX = e.clientX;
      prevY = e.clientY;
    }

    const mouseup = () => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      RESIZE.properties.isResizing = false;
    }

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
  },

  controls() {
    for (let resizer of resizers) 
      resizer.addEventListener("mousedown", this.mousedown);
  }
}

el.ondragstart = () => {
  return false;
}

el.addEventListener("mousedown", RESIZE.draggable);
RESIZE.controls();