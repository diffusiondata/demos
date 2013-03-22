lines['J'] = { name: 'Jubilee' };
lines['J'].stations = {
	STA : {name: 'Stanmore', x: 100, y: 100, routes:['CPK']},
	CPK : {name: 'Canons Park', x: 200, y: 100, routes: ['STA', 'QBY']},
	QBY : {name: 'Queensbury', x: 300, y: 100, routes: ['CPK', 'KBY']},
	KBY : {name: 'Kingsbury', x: 400, y: 100, routes: ['QBY', 'WPK']},
	WPK : {name: 'Wembley Park', x: 500, y: 100, routes: ['KBY', 'NEA']},
	NEA : {name: 'Neasden', x: 600, y: 100, routes: ['WPK', 'DHL']},
	DHL : {name: 'Dollis Hill', x: 700, y: 100, routes: ['NEA', 'WLG']},
	WLG : {name: 'Willesden Green', x: 800, y: 100, routes: ['DHL', 'KIL']},
	KIL : {name: 'Kilburn', x: 900, y: 100, routes: ['WLG', 'WHD']},
	WHD : {name: 'West Hampstead', x: 1000, y: 100, routes: ['KIL', 'FRD']},
	FRD : {name: 'Finchley Road', x: 1100, y: 100, routes: ['WHM', 'SWC']},
	SWC : {name: 'Swiss Cottage', x: 1200, y: 100, routes: ['FRD', 'SJW']},
	SJW : {name: 'St. Johns Wood', x: 1300, y: 100, routes: ['SWC', 'BST']},
	BST : {name: 'Baker Street', x: 1400, y: 100, routes: ['SJW', 'BDS']},
	BDS : {name: 'Bond Street', x: 1500, y: 100, routes: ['BST', 'GPK']},
	GPK : {name: 'Green Park', x: 1600, y: 100, routes: ['BDS', 'WMS']},
	WMS : {name: 'Westminster', x: 1700, y: 100, routes: ['GPK', 'WLO']},
	WLO : {name: 'Waterloo', x: 1800, y: 100, routes: ['WMS', 'SWK']},
	SWK : {name: 'Southwark', x: 1900, y: 100, routes: ['WLO', 'LON']},
	LON : {name: 'London Bridge', x: 2000, y: 100, routes: ['SWK', 'BER']},
	BER : {name: 'Bermondsey', x: 2100, y: 100, routes: ['LON', 'CWR']},
	CWR : {name: 'Canada Water', x: 2200, y: 100, routes: ['BER', 'CWF']},
	CWF : {name: 'Canary Wharf', x: 2300, y: 100, routes: ['CWR', 'NGW']},
	NGW : {name: 'North Greenwich', x: 2400, y: 100, routes: ['CWF', 'CNT']},
	CNT : {name: 'Canning Town', x: 2500, y: 100, routes: ['NGW', 'WHM']},
	WHM : {name: 'West Ham', x: 2600, y: 100, routes: ['CNT', 'SFD']},
	SFD : {name: 'Stratford', x: 2700, y: 100, routes: ['WHM']}
};

global_attrs['line_J'] = {'stroke': '#686e72', 'fill': '#686e72' };
global_attrs['station_J'] = { 'fill': '#686e72' };
