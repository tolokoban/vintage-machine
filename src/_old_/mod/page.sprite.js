var Keyboard = require("keyboard");
var File = require("file");

var HEXA = "0123456789ABCDEF";

var CELLSIZE = 10;
var W = CELLSIZE * 64 + 1;
var H = CELLSIZE * 64 + 1;


var g_symbols;
var g_palette = [
    [0,0,0], [255,255,255], [255,0,0], [0,255,0],
    [0,0,255], [255, 255, 0], [255, 0, 255], [0, 255, 255]
];
var g_layer = 0;
var g_x = 0;
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

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "css/app/symbols.arr", true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function (oEvent) {
        var arrayBuffer = xhr.response;
        if (arrayBuffer) {
            g_symbols = new Uint8Array(arrayBuffer);
            console.info("[page.sprite.start] g_symbols=...", g_symbols);
            init();
        }
    };
    xhr.send( null );
};


function  init() {
    refresh();
    document.addEventListener('keydown', function(evt) {
        switch (evt.key.toUpperCase()) {
        case "X":
            exchange();
            break;
        case "S":
            save();
            break;
        case "L":
            load();
            break;
        case "ARROWRIGHT":
            if (Keyboard.test("CONTROL")) {
                if (g_x < 12) {
                    g_x = (g_x + 1) % 16;
                    refresh();
                }
            } else {
                cursor(g_cursorX + 1, g_cursorY);
            }
            break;
        case "ARROWLEFT":
            if (Keyboard.test("CONTROL")) {
                if (g_x > 0) {
                    g_x = (g_x + 15) % 16;
                    refresh();
                }
            } else {
                cursor(g_cursorX - 1, g_cursorY);
            }
            break;
        case "ARROWDOWN":
            if (Keyboard.test("CONTROL")) {
                if (g_y < 12) {
                    g_y = (g_y + 1) % 16;
                    refresh();
                }
            } else {
                cursor(g_cursorX, g_cursorY + 1);
            }
            break;
        case "ARROWUP":
            if (Keyboard.test("CONTROL")) {
                if (g_y > 0) {
                    g_y = (g_y + 15) % 16;
                    refresh();
                }
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
            cursor(g_cursorX, g_cursorY);
            break;
        case " ":
            setPixel(g_x * 16 + g_cursorX, g_y * 16 + g_cursorY, g_layer, 0);
            cursor(g_cursorX, g_cursorY);
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

    document.getElementById('pos').textContent = HEXA[g_layer] + HEXA[g_x] + HEXA[g_y];
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
            break;
        }
    }
    if (Keyboard.test(" ")) {
        setPixel(g_x * 16 + g_cursorX, g_y * 16 + g_cursorY, g_layer, 0);
    }

    // Draw the pixel.
    g_ctx.fillStyle = getColor(g_x * 16 + x, g_y * 16 + y);
    g_ctx.fillRect(1 + x * CELLSIZE, 1 + y * CELLSIZE, CELLSIZE - 1, CELLSIZE - 1);
}

function getColor(x, y, layer) {
    if( typeof layer === 'undefined' ) layer = g_layer;
    var pixel = getPixel(x, y, layer);
    var color = g_palette[pixel];
    return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
};

function getPixel(x, y, layer) {
    return g_symbols[layer + 4 * (x + y * 256)] & 7;
}

/**
 * color is between 0 and 7 inclusive.
 */
function setPixel(x, y, layer, color) {
    g_symbols[layer + 4 * (x + y * 256)] = color & 7;
}

function save() {
    console.info("[page.sprite.save] g_symbols=...", g_symbols);
    var blob = new Blob([g_symbols], {type: 'application/octet-binary'});
    console.info("[page.sprite] blob=...", blob);
    File.saveAs( blob, "symbols.arr" );
}


function load() {
    var img = new Image();
    img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = 256;
        var ctx = canvas.getContext('2d');
        ctx.drawImage( img, 0, 0 );
        var imageData = ctx.getImageData(0, 0, 256, 256);
        var data = imageData.data;
        g_symbols = new Uint8Array(256*256*4);
        for (var idx=0 ; idx<data.length ; idx+=4) {
            g_symbols[idx] = data[idx] > 127 ? 1 : 0;
            g_symbols[idx + 1] = g_symbols[idx + 2] = g_symbols[idx + 3] = 0;
        }
        console.info("[page.sprite.load] g_symbols=...", g_symbols);
        refresh();
    };
    img.src = "css/app/symbols.original.jpg";
}

function exchange() {
    var row, col, i, j, k, tmp;
    for (row = 0 ; row < 15 ; row++) {
        for (col = row + 1 ; col < 16 ; col++) {
            for (j = 0 ; j < 16 ; j++) {
                for (i = 0 ; i < 16 ; i++) {
                    for (k = 0 ; k < 4 ; k++) {
                        tmp = g_symbols[4 * (256*(row * 16 + j) + col * 16 + i) + k];
                        g_symbols[4 * (256*(row * 16 + j) + col * 16 + i) + k] =
                            g_symbols[4 * (256*(col * 16 + j) + row * 16 + i) + k];
                        g_symbols[4 * (256*(col * 16 + j) + row * 16 + i) + k] = tmp;
                    }
                }
            }
        }
    }
    refresh();
}
