lines['M'] = { name: 'Metropolitan' };
lines['M'].stations = {
    AME : {name: 'Amersham', x: 100, y: 200, routes:['CLF']},
    CLF : {name: 'Chalfont and Latimer', x: 200, y: 200, routes: ['AME', 'CWD']},
    CWD : {name: 'Chorleywood', x: 300, y: 200, routes: ['CLF', 'RKY']},
    RKY : {name: 'Rickmansworth', x: 400, y: 200, routes: ['CWD', 'MPK']},
    MPK : {name: 'Moor Park', x: 500, y: 200, routes: ['RKY', 'NWD', 'CRX']},

    CRX : {name: 'Croxley', x: 500, y: 100, routes: ['MPK', 'WAT']},
    WAT : {name: "Watford", x: 400, y: 100, routes: ['CRX']},

    NWD : {name: 'Northwood', x: 600, y: 200, routes: ['MPK', 'NWH']},
    NWH : {name: "Northwood Hills", x: 700, y: 200, routes: ['NWD', 'PIN']},
    PIN : {name: 'Pinner', x: 800, y: 200, routes: ['NWD', 'NHR']},
    NHR : {name: 'North Harrow', x: 900, y: 200, routes: ['PIN', 'HOH']},
    HOH : {name: 'Harrow on the Hill', x: 1000, y: 200, routes: ['NHR', 'WHR','NWP']},

    WHR : {name: 'West Harrow', x: 1000, y: 300, routes: ['HOH', 'RLN']},
    RLN : {name: 'Rayners Lane', x: 900, y: 300, routes: ['WHR', 'ETE']},
    ETE : {name: 'Eastcore', x: 800, y: 300, routes: ['RLN', 'RUM']},
    RUM : {name: 'Ruislip Manor', x: 700, y: 300, routes: ['ETE', 'RUI']},
    RUI : {name: 'Ruislip', x: 600, y: 300, routes: ['RUM', 'ICK']},
    ICK : {name: 'Ickenham', x: 500, y: 300, routes: ['RUI', 'HDN']},
    HDN : {name: 'Hillingdon', x: 400, y: 300, routes: ['ICK', 'UXB']},
    UXB : {name: 'Uxbridge', x: 300, y: 300, routes: ['HDN']},

    NWP : {name: 'Northwick Park', x: 1100, y: 200, routes: ['HOH', 'WPK']},
    WPK : {name: 'Wembley Park', x: 1200, y: 200, routes: ['NWP', 'FRD']},
    FRD : {name: 'Finchley Road', x: 1300, y: 200, routes: ['WPK', 'BST']},
    BST : {name: 'Baker Street', x: 1400, y: 200, routes: ['FRD', 'GPS']},
    GPS : {name: 'Great Portland Street', x: 1500, y: 200, routes: ['BST','ESQ']},
    ESQ : {name: 'Euston Square', x: 1600, y: 200, routes: ['GPS','KXX']},
    KXX : {name: "King's Cross St Pancras", x: 1600, y: 200, routes: ['ESQ','FAR']},
    FAR : {name: 'Farringdon', x: 1700, y: 200, routes: ['KXX','BAR']},
    BAR : {name: 'Barbican', x: 1800, y: 200, routes: ['FAR','MGT']},
    MGT : {name: 'Moorgate', x: 1900, y: 200, routes: ['BAR','LST']},
    LST : {name: 'Liverpool Street', x: 2000, y: 200, routes: ['MGT','ALD']},
    ALD : {name: 'Aldgate', x: 2100, y: 200, routes: ['LST']}
};

global_attrs['line_M'] = {'stroke': '#893267', 'fill': '#893267' };
global_attrs['station_M'] = { 'fill': '#893267' };
