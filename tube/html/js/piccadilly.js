lines['P'] = { name: 'Piccadilly' };
lines['P'].stations = {
    UXB : {name: 'Uxbridge', x: 100, y: 100, routes:['HDN']},
    HDN : {name: 'Hillingdon', x: 200, y: 100, routes: ['UXB', 'ICK']},
    ICK : {name: 'Ickenham', x: 300, y: 100, routes: ['HDN', 'RUI']},
    RUI : {name: 'Ruislip', x: 400, y: 100, routes: ['ICK', 'RUM']},
    RUM : {name: 'Ruislip Manor', x: 500, y: 100, routes: ['RUI', 'ETE']},
    ETE : {name: 'Eastcote', x: 600, y: 100, routes: ['RUM', 'RLN']},
    RLN : {name: 'Rayners Lane', x: 700, y: 100, routes: ['ETE', 'SHR']},
    SHR : {name: 'South Harrow', x: 800, y: 100, routes: ['RLN', 'SHL']},
    SHL : {name: 'Sudbury Hill', x: 900, y: 100, routes: ['SHR', 'STN']},
    STN : {name: 'Sudbury Town', x: 1000, y: 100, routes: ['SHL', 'ALP']},
    ALP : {name: 'Alperton', x: 1100, y: 100, routes: ['STN', 'PRY']},
    PRY : {name: 'Park Royal', x: 1200, y: 100, routes: ['ALP', 'NEL']},
    NEL : {name: 'North Ealing', x: 1300, y: 100, routes: ['PRY', 'ECM']},
    ECM : {name: 'Ealing Common', x: 1400, y: 100, routes: ['NEL', 'ACT']},
    ACT : {name: 'Acton Town', x: 1500, y: 100, routes: ['ECM','SEL','TGR']},

    TGR : {name: 'Turnham Green', x: 1600, y: 100, routes: ['ACT', 'HMD']},
    HMD : {name: 'Hammersmith', x: 1700, y: 100, routes: ['TGR', 'BCT']},
    BCT : {name: 'Barons Court', x: 1800, y: 100, routes: ['HMD', 'ECT']},
    ECT : {name: "Earl's Court", x: 1900, y: 100, routes: ['BCT', 'GRD']},
    GRD : {name: 'Gloucester Road', x: 2000, y: 100, routes: ['ECT', 'SKN']},
    SKN : {name: 'South Kensignton', x: 2100, y: 100, routes: ['GRD', 'KNB']},
    KNB : {name: 'Knightsbridge', x: 2200, y: 100, routes: ['SKN', 'HPC']},
    HPC : {name: 'Hyde Park Corner', x: 2300, y: 100, routes: ['KNB', 'GPK']},
    GPK : {name: 'Green Park', x: 2400, y: 100, routes: ['HPC', 'PIC']},
    PIC : {name: 'Piccadilly', x: 2500, y: 100, routes: ['GPK', 'LSQ']},
    LSQ : {name: 'Leicester Square', x: 2600, y: 100, routes: ['PIC', 'COV']},
    COV : {name: 'Covent Garden', x: 2700, y: 100, routes: ['LSQ', 'HOL']},
    HOL : {name: 'Holborn', x: 2800, y: 100, routes: ['COV', 'RSQ']},
    RSQ : {name: 'Russell Square', x: 2900, y: 100, routes: ['HOL', 'KXX']},
    KXX : {name: "King's Cross St Pancras", x: 3000, y: 100, routes: ['RSQ', 'CRD']},
    CRD : {name: "Caledonian Road", x: 3100, y: 100, routes: ['KXX', 'HRD']},
    HRD : {name: 'Holloway Road', x: 3200, y: 100, routes: ['CRD', 'ARL']},
    ARL : {name: 'Arsenal', x: 3300, y: 100, routes: ['HRD', 'FPK']},
    FPK : {name: 'Finsbury Park', x: 3400, y: 100, routes: ['ARL', 'MNR']},
    MNR : {name: 'Manor House', x: 3500, y: 100, routes: ['FPK', 'TPL']},
    TPL : {name: 'Turnpike Lane', x: 3600, y: 100, routes: ['MNR', 'WGN']},
    WGN : {name: 'Wood Green', x: 3700, y: 100, routes: ['TPL', 'BGR']},
    BGR : {name: 'Bounds Green', x: 3800, y: 100, routes: ['WGN', 'AGR']},
    AGR : {name: 'Arnos Grove', x: 3900, y: 100, routes: ['BGR', 'SGT']},
    SGT : {name: 'Southgate', x: 4000, y: 100, routes: ['AGR', 'OAK']},
    OAK : {name: 'Oakwood', x: 4100, y: 100, routes: ['SGT', 'CFS']},
    CFS : {name: 'Cockfosters', x: 4200, y: 100, routes: ['OAK']},

    SEL : {name: 'South Ealing', x: 1500, y: 200, routes: ['ACT', 'NFD']},
    NFD : {name: 'Northfields', x: 1400, y: 200, routes: ['SEL', 'BOS']},
    BOS : {name: 'Boston Manor', x: 1300, y: 200, routes: ['NFD', 'OST']},
    OST : {name: 'Osterley', x: 1200, y: 200, routes: ['BOS', 'HNE']},
    HNE : {name: 'Hounslow', x: 1100, y: 200, routes: ['OST', 'HNC']},
    HNC : {name: 'Hounslow Central', x: 1000, y: 200, routes: ['HNE', 'HNW']},
    HNW : {name: 'Hounslow West', x: 900, y: 200, routes: ['HNC', 'HTX']},
    HTX : {name: 'Hatton Cross', x: 800, y: 200, routes: ['HNW', 'HRC', 'HTF']},
    HRC : {name: 'Heathrow Terminals 123', x: 700, y: 200, routes: ['HTX', 'HRV', 'HTF']},
    HTF : {name: 'Heathrow Terminal 4', x: 700, y: 300, routes: ['HTX', 'HRC']},
    HRV : {name: 'Heathrow Terminal 5', x: 400, y: 200, routes: ['HRC']}
};

global_attrs['line_P'] = {'stroke': '#045081', 'fill': '#045081' };
global_attrs['station_P'] = { 'fill': '#045081' };
