lines['W'] = { name: 'Waterloo & City' };
lines['W'].stations = {
    WLO : {name: 'Waterloo', x: 200, y: 100, routes: ['BNK']},
    BNK : {name: 'Bank', x: 100, y: 100, routes:['WLO']}
};

global_attrs['line_W'] = {'stroke': '#70C3CE', 'fill': '#686e72' };
global_attrs['station_W'] = { 'fill': '#70C3CE' };
