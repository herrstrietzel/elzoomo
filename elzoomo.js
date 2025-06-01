initZoomEls()

function initZoomEls() {
    let els = document.querySelectorAll('[data-zoom]');

    els.forEach(el => {
        el.classList.add('elzoomo-el');
        let container = el.parentNode;
        let options = JSON.parse(el.dataset.zoom)
        initZoomEl(container, el, options);
    })
}


function initZoomEl(container, el, options) {

    options = {
        ...{
            minScale: 1,
            maxScale: 10,
            zoom: 1,
            zoomStep: 1.01,
            snapToOrigin:false
        },
        ...options
    };


    // init matrix
    let mtx = { a: options.zoom, b: 0, c: 0, d: options.zoom, e: 0, f: 0 };


    // initial scale 
    if(options.zoom!=1) setTransforms(el, mtx)

    /**
     * Event Listeners
     */

    // Mouse drag for panning
    container.addEventListener('mousedown', (e) => {
        e.preventDefault();

        let startX = e.clientX;
        let startY = e.clientY;
        let el = e.currentTarget.firstElementChild;

        function onMouseMove(e) {
            let dx = startX - e.clientX;
            let dy = startY - e.clientY;

            mtx = updateTranslate(mtx, dx, dy);

            // apply transforms
            setTransforms(el, mtx)

            // save last offsets
            startX = e.clientX;
            startY = e.clientY;
        }

        function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });


    // Wheel zoom
    container.addEventListener('wheel', (e) => {
        let { zoomStep, minScale, maxScale, snapToOrigin } = options;
        let zoomFactor = (zoomStep ** -e.deltaY) || 1;

        let el = e.currentTarget.firstElementChild;
        let scaleNew = mtx.a * zoomFactor

        // update scaling
        mtx = updateScale(mtx, e, scaleNew, minScale, maxScale, snapToOrigin);

        // apply transforms
        setTransforms(el, mtx)

        e.preventDefault();
    }, { passive: false });

}


function setTransforms(el, mtx) {
    el.style.transform = `matrix(${Object.values(mtx).join(', ')})`;
}

/**
 * Zoom:
 * update scale values
 */
function updateScale(mtx, e, newScale, minScale, maxScale, snapToOrigin=false) {
    let clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    let scale = clamp(newScale, minScale || 1, maxScale || 10);
    let el = e.currentTarget.firstElementChild;

    let [prevScale, translateX, translateY] = [mtx.a, mtx.e, mtx.f];

    if(snapToOrigin && scale === 1){
        return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
    }

    if (scale === prevScale) return mtx;

    let scaleRatio = scale / prevScale - 1;
    let { left, top, width, height } = el.getBoundingClientRect();

    let cx = (e?.clientX || 0) - left - width / 2;
    let cy = (e?.clientY || 0) - top - height / 2;

    translateX = translateX - scaleRatio * cx;
    translateY = translateY - scaleRatio * cy;

    // update matrix
    mtx = { a: scale, b: 0, c: 0, d: scale, e: translateX, f: translateY };
    return mtx
}


/**
 * Pan:
 * update translate values
 */
function updateTranslate(mtx, dx, dy) {

    let [scale, translateX, translateY] = [mtx.a, mtx.e, mtx.f];

    // update matrix
    mtx = { a: scale, b: 0, c: 0, d: scale, e: translateX - dx, f: translateY - dy };
    return mtx
}
