# elzoomo
Simple element zoom and pan helper.

### Usage
Load elzoomo  

```
<script src="../elzoomo.js"></script>
```

#### 1. Auto initialization via data-attribute
```
<div class="elzoomo">
    <img src="img.jpg" 
    alt="dummy"
    data-zoom='{"minScale":0.1,"maxScale":10,"zoom":1,"zoomStep":1.001, "toolbar":true}' >
</div>
```


#### 2. Manual initialization
```
<img id="elzoomoImg" src="img.jpg" alt="dummy" >
```

```
let elzoomoEl = document.getElementById('elzoomoImg');
let options = { "minScale": 0.1, "maxScale": 10, "zoom": 1, "zoomStep": 1.001, "toolbar": true }
initZoomEl(elzoomoEl, options)
```

#### Options

```
// min and max scales
minScale: 1,
maxScale: 10,
// initial zoom
zoom: 1,
// zoom steps via mousewheel
zoomStep: 1.001,
// scale svg strokes
scaleStroke: false,
// show zoom buttons
toolbar: true
```
