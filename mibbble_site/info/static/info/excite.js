/* Transmute the Canvi */
let setCanvasDimensions = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let setOriginCoords = (canvas) => {
  return [canvas.width / 2, canvas.height / 2]
}

/* Illustration Instructions */
let drawVector = (c, [ax,ay], [bx,by], strokeStyle="#000000") => {
  c.beginPath();
  c.moveTo(ax, ay);
  c.lineTo(bx, by);
  c.strokeStyle = strokeStyle;
  c.stroke();
}

let drawArc = (c, x, y, radius, strokeStyle="#000000", r1=0, r2=Math.PI * 2, reverse=false) => {
  c.beginPath();
  c.arc(x, y, radius, r1, r2, reverse);
  c.strokeStyle = strokeStyle;
  c.stroke();
}

/* Utilities */
let createRange = (min, max) => {
    var range = [];
    for (let i = min; i <= max; i++) {
        range.push(i);
    }
    return range;
}

/* Tethers on a function */
class Point {
  constructor(c, x, y){
    this.c = c;
    this.x = x;
    this.y = y;
  }
  visualize(radius, strokeStyle) {
    drawArc(this.c, this.x, this.y, radius, strokeStyle);
  }
}

class Origin extends Point { /* Fixed */ }

class Excitation extends Point { /* Trauma */ }

class Reflection extends Point { /* Definition */ }

class Meridian {
  constructor(origin){
    this.origin = origin
  }
  visualize(strokeStyle){
    const ax = this.origin.x;
    const ay = this.origin.y;
    const bx = this.origin.x;
    const by = 0;
    drawVector(this.origin.c, [ax,ay], [bx,by], strokeStyle);

    const cx = this.origin.x;
    const cy = window.innerHeight;
    drawVector(this.origin.c, [ax,ay], [cx,cy], strokeStyle);
  }
}

class Divisor { /* Schizo */
  constructor(origin, excitation){
    this.origin = origin;
    /* b = y - mx */
    var _slope = (excitation.y - origin.y) / (excitation.x - origin.x); /* m */
    this.intercept = excitation.y - _slope * excitation.x; /* b */
    this.slope = -1 * (1 / _slope); /* -1/m */
  }
  visualize(strokeStyle0, strokeStyle1) {
    const ax = this.origin.x;
    const ay = this.origin.y;
    const bx = 0;
    const by = this.slope * (bx - ax) + ay;
    drawVector(this.origin.c, [ax,ay], [bx,by], strokeStyle0);

    const cx = window.innerWidth;
    const cy = this.slope * (cx - ax) + ay;
    drawVector(this.origin.c, [ax,ay], [cx,cy], strokeStyle1);
  }
}

let rotate = (cx, cy, x, y, angle) => {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

/* Iterability */
let update = (canvas, c, actors) => {}

let render = (canvas, c, actors) => {

  if (styleChapterII) {
    c.fillStyle = "#000011"; /* I: haxy */
    c.fillRect(0, 0, canvas.width / 2, canvas.height);

    c.fillStyle = "#110000"; /* II: need to abstract */
    c.fillRect(canvas.width / 2, 0, canvas.width, canvas.height);
  } else {
    c.fillStyle = "#000033"; /* I: haxy */
    c.fillRect(0, 0, canvas.width / 2, canvas.height);

    c.fillStyle = "#330000"; /* II: need to abstract */
    c.fillRect(canvas.width / 2, 0, canvas.width, canvas.height);
  }

  var strokeStyle = "#FF0000";
  actors["excitations"].forEach((exc, i) => {
    exc.visualize(20, strokeStyle);
  });

  strokeStyle = "#0000FF";
  actors["reflections"].forEach((ref, i) => {
    const range = createRange(0, 5);
    range.forEach((idx) => {
          ref.visualize(idx * idx, strokeStyle);
    });

  });

  strokeStyle = "#909090";
  actors["origins"].forEach((orig, i) => {
    const range = createRange(0, 10);
    range.forEach((idx) => {
      orig.visualize(idx * idx * idx, strokeStyle);
    });
  });

  strokeStyle = "#F0F0F0";
  actors["meridians"].forEach((mer, i) => {
    const range = createRange(0, 10);
    range.forEach((idx) => {
      mer.visualize(strokeStyle);
    });
  });


  var strokeStyle0 = "#0000AA";
  var strokeStyle1 = "#AA0000";
  actors["divisors"].forEach((div, i) => {
    div.visualize(strokeStyle0, strokeStyle1);
  });

}

let snap = (canvas, c, actors) => {
  return () => {
    update(canvas, c, actors);
    render(canvas, c, actors);
    const _snap = snap(canvas, c, actors);
    window.requestAnimationFrame(_snap);
  }
}

/* Contextualize Interactions */
let traumatize = (c, actors) => {
  return addEventListener('click', (event) => {

    if (!haltClicks) {
      /* descriminate based on origin and meridian */
      const excitation = new Excitation(c, event.x, event.y);
      actors["excitations"].push(excitation);

      actors["origins"].forEach((orig, i) => {
        const divisor = new Divisor(orig, excitation);
        actors["divisors"].push(divisor);
        /* for the new divisor, create the reflection */
        const rx = orig.x - (event.x - orig.x);
        const ry = orig.y - (event.y - orig.y);
        actors["reflections"].push(new Reflection(c, rx, ry));

      });
    }
  });
}

var haltClicks = false;
var styleChapterII = false;

function IIstyle() {
  haltClicks = true;
  styleChapterII = true;

  fuk = document.createTextNode("Fuk");
  d = document.createElement("div");
  d.setAttribute("class", "exclamation");
  d.append(fuk);

  b = document.getElementById("body");
  b.append(d);

  return setTimeout(() => { /* stops click bleed */
    actors["excitations"] = [];
    actors["reflections"] = [];
    actors["divisors"] = [];
    haltClicks = false;
    d.remove();
  }, 2500);
}

/* I: Information Persistence (global narration) */
var actors = {
  "excitations": [],
  "reflections": [],
  "origins": [],
  "meridians": [],
  "divisors": []
};

/* Configure and launch process */
window.onload = () => {

  /* I: Objects */
  const _canvas_1 = document.getElementById("canvas_1");
  const _c1 = canvas_1.getContext('2d');

  /* I: Processes */
  const _traumatize_1 = traumatize(_c1, actors);
  const _snap_1 = snap(_canvas_1, _c1, actors);

  /* I: Instantiation and Manifestation */
  setCanvasDimensions(_canvas_1);

  _x1 = 0; _y1 = 0;
  _ret = setOriginCoords(_canvas_1);
  _x1 = _ret[0]; _y1 = _ret[1];

  const o = new Origin(_c1, _x1, _y1)
  actors["origins"].push(o);
  actors["meridians"].push(new Meridian(o));

  window.requestAnimationFrame(_snap_1);

  /* II: Example */

}
