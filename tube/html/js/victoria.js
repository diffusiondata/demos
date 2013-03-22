// COPYRIGHT (c) 2013 Push Technology Ltd.

lines['V'] = { name: 'Victoria' };
lines['V'].stations = {
    WAL : {name: 'Walthamstow Central', x: 1600, y: 100, routes:['BHR']},
    BHR : {name: 'Blackhorse Road', x: 1500, y: 100, routes: ['WAL', 'TTH']},
    TTH : {name: 'Tottenham Hale', x: 1400, y: 100, routes: ['BHR', 'SVS']},
    SVS : {name: 'Seven Sisters', x: 1300, y: 100, routes: ['TTH', 'FPK']},
    FPK : {name: 'Finsbury Park', x: 1200, y: 100, routes: ['SVS', 'HBY']},
    HBY : {name: 'Highbury and Islington', x: 1100, y: 100, routes: ['FPK', 'KXX']},
    KXX : {name: "King's Cross St Pancras", x: 1000, y: 100, routes: ['HBY', 'EUS']},
    EUS : {name: 'Euston', x: 900, y: 100, routes: ['KXX', 'WST']},
    WST : {name: 'Warren Street', x: 800, y: 100, routes: ['EUS', 'OXD']},
    OXD : {name: 'Oxford Circus', x: 700, y: 100, routes: ['WST', 'GPK']},
    GPK : {name: 'Green Park', x: 600, y: 100, routes: ['OXD', 'VIC']},
    VIC : {name: 'Vistoria', x: 500, y: 100, routes: ['GPK', 'PIM']},
    PIM : {name: 'Pimlico', x: 400, y: 100, routes: ['VIC', 'VUX']},
    VUX : {name: 'Vauxhall', x: 300, y: 100, routes: ['PIM', 'STK']},
    STK : {name: 'Stockwell', x: 200, y: 100, routes: ['VUX','BRX']},
    BRX : {name: 'Brixton', x: 100, y: 100, routes: ['STK']}
};

global_attrs['line_V'] = {'stroke': '#009fe0', 'fill': '#009fe0' };
global_attrs['station_V'] = { 'fill': '#009fe0' };
