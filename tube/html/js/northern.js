lines['N'] = { name: 'Northern' };
lines['N'].stations = {
    MOR : {name: 'Morden', x: 100, y: 200, routes:['SWM']},
    SWM : {name: 'South Wimbledon', x: 200, y: 200, routes: ['MOR', 'CLW']},
    CLW : {name: 'Colliers Wood', x: 300, y: 200, routes: ['SWM', 'TBY']},
    TBY : {name: 'Tooting Broadway', x: 400, y: 200, routes: ['CLW', 'TBE']},
    TBE : {name: 'Tooting Bec', x: 500, y: 200, routes: ['TBY', 'BAL']},
    BAL : {name: 'Balham', x: 600, y: 200, routes: ['TBE', 'CPS']},
    CPS : {name: "Clapham South", x: 700, y: 200, routes: ['BAL', 'CPC']},
    CPC : {name: 'Clapham Common', x: 800, y: 200, routes: ['CPS', 'CPN']},
    CPN : {name: 'Clapham North', x: 900, y: 200, routes: ['CPC', 'STK']},
    STK : {name: 'Stockwell', x: 1000, y: 200, routes: ['CPN', 'OVL']},
    OVL : {name: 'Oval', x: 1100, y: 200, routes: ['STK', 'KEN']},
    KEN : {name: 'Kennington', x: 1200, y: 200, routes: ['OVL', 'ELE','WLO']},

    ELE : {name: 'Elephant and Castle', x: 1300, y: 300, routes: ['KEN', 'BOR']},
    BOR : {name: 'Borough', x: 1400, y: 300, routes: ['ELE', 'LON']},
    LON : {name: 'London Bridge', x: 1500, y: 300, routes: ['BOR','BNK']},
    BNK : {name: 'Bank', x: 1600, y: 300, routes: ['LON', 'MGT']},
    MGT : {name: 'Moorgate', x: 1700, y: 300, routes: ['BNK', 'OLD']},
    OLD : {name: 'Old Street', x: 1800, y: 300, routes: ['MGT', 'ANG']},
    ANG : {name: 'Angel', x: 1900, y: 300, routes: ['OLD', 'KXX']},
    KXX : {name: "King's Cross St Pancras", x: 2000, y: 300, routes: ['ANG', 'EUS']},
    EUS : {name: 'Euston', x: 2100, y: 200, routes: ['KXX', 'WST','MCR', 'CTN']},

    WLO : {name: 'Waterloo', x: 1300, y: 100, routes: ['KEN', 'EMB']},
    EMB : {name: 'Embankment', x: 1400, y: 100, routes: ['WLO', 'CHX']},
    CHX : {name: 'Charing Cross', x: 1500, y: 100, routes: ['EMB', 'LSQ']},
    LSQ : {name: 'Leicester Square', x: 1600, y: 100, routes: ['CHX', 'TCR']},
    TCR : {name: 'Tottenham Court Road', x: 1700, y: 100, routes: ['LSQ', 'GST']},
    GST : {name: 'Goodge Street', x: 1800, y: 100, routes: ['TCR', 'WST']},
    WST : {name: 'Warren Street', x: 1900, y: 100, routes: ['GST', 'EUS']},

    MCR : {name: 'Mornington Crescent', x: 2200, y: 300, routes: ['EUS', 'CTN']},

    CTN : {name: 'Camden Town', x: 2300, y: 200, routes: ['EUS', 'MCR','CHF','KTN']},

    CHF : {name: 'Chalk Farm', x: 2400, y: 100, routes: ['CTN', 'BPK']},
    BPK : {name: 'Belsize Park', x: 2500, y: 100, routes: ['CHF', 'HMP']},
    HMP : {name: 'Hampstead', x: 2600, y: 100, routes: ['BPK', 'GGR']},
    GGR : {name: 'Golders Green', x: 2700, y: 100, routes: ['HMP', 'BTX']},
    BTX : {name: 'Brent Cross', x: 2800, y: 100, routes: ['GGR', 'HND']},
    HND : {name: 'Hendon Central', x: 2900, y: 100, routes: ['BTX', 'COL']},
    COL : {name: 'Colindale', x: 3000, y: 100, routes: ['HND', 'BUR']},
    BUR : {name: 'Burnt Oak', x: 3100, y: 100, routes: ['COL', 'EDG']},
    EDG : {name: 'Edgware', x: 3200, y: 100, routes: ['BUR']},


    KTN : {name: 'Kentish Town', x: 2400, y: 300, routes: ['CTN', 'TPK']},
    TPK : {name: 'Tufnell Park', x: 2500, y: 300, routes: ['KTN', 'ARC']},
    ARC : {name: 'Archway', x: 2600, y: 300, routes: ['TPK', 'HIG']},
    HIG : {name: 'Highgate', x: 2700, y: 300, routes: ['ARC', 'EFY']},
    EFY : {name: 'East Finchley', x: 2800, y: 300, routes: ['HIG', 'FYC']},
    FYC : {name: 'Finchley Central', x: 2900, y: 300, routes: ['EFY', 'MHE', 'WFY' ]},

    MHE : {name: 'Mill Hill East', x: 3000, y: 200, routes: ['FYC']},    

    WFY : {name: 'West Finchley', x: 3000, y: 300, routes: ['FYC', 'WSP']},
    WSP : {name: 'Woodside Park', x: 3100, y: 300, routes: ['WFY', 'TOT']},
    TOT : {name: 'Totteridge and Whetstone', x: 3200, y: 300, routes: ['WSP', 'HBT']},
    HBT : {name: 'High Barnet', x: 3300, y: 300, routes: ['TOT']}
};

global_attrs['line_N'] = {'stroke': '#000000', 'fill': '#000000' };
global_attrs['station_N'] = { 'fill': '#000000' };
