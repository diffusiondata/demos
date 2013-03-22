// COPYRIGHT (c) 2013 Push Technology Ltd.

var paper;
var mouseDown = undefined;
var coords = { x: 0, y: 0, w: 0, h: 0, zoom: 1 };
var offset = { x: 0, y: 0 };
var lines = {};
var trains = {};

var global_attrs = {
    'line_outline' : {'stroke': '#000000', 'stroke-width': 6, 'stroke-linecap': 'round' },
    'line_default' : {'stroke-width': 4, 'stroke-linecap': 'round' },
    'station' : {'stroke' : '#000000', 'stroke-width': 2 },
    'moving': { 'fill': '#77ff77', 'stroke': '#000000', 'stroke-width': 2 },
    'stationary': { 'fill': '#ff7777', 'stroke': '#000000', 'stroke-width': 2 }
};

var current_line = 'C';

