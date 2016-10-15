var Keyboard = require("keyboard");


var CELLSIZE = 10;
var W = CELLSIZE * 64 + 1;
var H = CELLSIZE * 64 + 1;

var g_imageData;
var g_symbols;
var g_palette = [
    [0,0,0], [255,255,255], [255,0,0], [0,255,0],
    [0,0,255], [255, 255, 0], [255, 0, 255], [0, 255, 255]
];
var g_layer = 0;
var g_x = 2;
var g_y = 0;
var g_ctx;
var g_cursorX = 0;
var g_cursorY = 0;
var g_cursor;

exports.start = function() {
    g_cursor = document.getElementById('cursor');
    var canvas = document.getElementById('zoom');
    canvas.width = W;
    canvas.height = H;
    g_ctx = canvas.getContext('2d');

    var img = new Image();
    img.onload = function() {
        init( img );
    };
    img.onerror = function(err) {
        console.error( err );
    };
    img.src = "css/app/symbols.png";
};


function  init(imgSymbols) {
    g_imageData = getImageData( imgSymbols );
    g_symbols = g_imageData.data;
    refresh();
    document.addEventListener('keydown', function(evt) {
        switch (evt.key.toUpperCase()) {
        case "S":
            save();
            break;
        case "ARROWRIGHT":
            if (Keyboard.test("CONTROL")) {
                g_x = (g_x + 1) % 16;
                refresh();
            } else {
                cursor(g_cursorX + 1, g_cursorY);
            }
            break;
        case "ARROWLEFT":
            if (Keyboard.test("CONTROL")) {
                g_x = (g_x + 15) % 16;
                refresh();
            } else {
                cursor(g_cursorX - 1, g_cursorY);
            }
            break;
        case "ARROWDOWN":
            if (Keyboard.test("CONTROL")) {
                g_y = (g_y + 1) % 16;
                refresh();
            } else {
                cursor(g_cursorX, g_cursorY + 1);
            }
            break;
        case "ARROWUP":
            if (Keyboard.test("CONTROL")) {
                g_y = (g_y + 15) % 16;
                refresh();
            } else {
                cursor(g_cursorX, g_cursorY - 1);
            }
            break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
            setPixel(g_x * 16 + g_cursorX, g_y * 16 + g_cursorY, g_layer, parseInt(evt.key));
            refresh();
            break;
        case " ":
            setPixel(g_x * 16 + g_cursorX, g_y * 16 + g_cursorY, g_layer, 0);
            refresh();
            break;
        }
    });
}

function refresh() {
    g_ctx.clearRect(0, 0, W, H);
    var x, y;

    for (y=0 ; y<64 ; y++) {
        for (x=0 ; x<64 ; x++) {
            g_ctx.fillStyle = getColor(g_x * 16 + x, g_y * 16 + y);
            g_ctx.fillRect(1 + x * CELLSIZE, 1 + y * CELLSIZE, CELLSIZE - 1, CELLSIZE - 1);
        }
    }

    g_ctx.strokeStyle = "#f00";
    for (y=0 ; y<5 ; y++) {
        g_ctx.moveTo(0, .5 + y * 16 * CELLSIZE);
        g_ctx.lineTo(W, .5 + y * 16 * CELLSIZE);
        g_ctx.stroke();
        g_ctx.moveTo(.5 + y * 16 * CELLSIZE, 0);
        g_ctx.lineTo(.5 + y * 16 * CELLSIZE, H);
        g_ctx.stroke();
    }
}

function cursor(x, y) {
    x = x % 64;
    y = y % 64;
    while (x < 0) x += 64;
    while (y < 0) y += 64;
    g_cursorX = x;
    g_cursorY = y;
    g_cursor.style.left = (g_cursorX * CELLSIZE - 1) + "px";
    g_cursor.style.top = (g_cursorY * CELLSIZE - 1) + "px";

    for (var pen=1; pen<8; pen++) {
        if (Keyboard.test("" + pen)) {
            setPixel(g_x * 16 + g_cursorX, g_y * 16 + g_cursorY, g_layer, pen);
            refresh();
            break;
        }
    }
    if (Keyboard.test(" ")) {
        setPixel(g_x * 16 + g_cursorX, g_y * 16 + g_cursorY, g_layer, 0);
        refresh();
    }
}

function getColor(x, y, layer) {
    if( typeof layer === 'undefined' ) layer = g_layer;
    var pixel = getPixel(x, y, layer);
    var color = g_palette[pixel];
    return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
};

function getPixel(x, y, layer) {
    return g_symbols[layer + 4 * (x + y * 256)] >> 5;
}

/**
 * color is between 0 and 7 inclusive.
 */
function setPixel(x, y, layer, color) {
    g_symbols[layer + 4 * (x + y * 256)] = color << 5;
}

function getImageData( img ) {
    var canvas = document.createElement( 'canvas' );
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData( 0, 0, img.width, img.height );
}

function save() {
    var canvas = document.createElement( 'canvas' );
    canvas.width = 256;
    canvas.height = 256;
    var ctx = canvas.getContext('2d');
    ctx.putImageData(g_imageData, 0, 0);
console.info("[page.sprite] g_imageData=...", g_imageData);
    window.open( canvas.toDataURL('image/png', 1.0), "save" );
}
