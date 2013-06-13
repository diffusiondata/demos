/* 
	Copyright 2013 Push Technology Ltd

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

    	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.

*/

function Widget( attributes ) {
	this.attributes = attributes;
	
	this.amount = null;
	
	this.theBidTLR = null;
    this.theOfferTLR = null;
	
	this.sell = { row: null, price: null, quotient: null, remainder: null };
	this.buy = { row: null, price: null, quotient: null, remainder: null };
};


Widget.prototype.render = function() {
	var el = $('<li></li>').attr( { "class": 'widget', id: 'w'+this.attributes.id } );

	el.append( $('<h2></h2').text( this.attributes.instrument ) );
	el.append( '<input type="text" placeholder="Amount (1000)"></input>');
	el.append( '<table><tr></tr></table>' );

	var cols = [ "Sell", "Buy" ];
	for( var i = 0; i < cols.length; i++ ) {
		var col = cols[i].toLowerCase();
		var cell = $('<td></td>').addClass('prices').addClass( col ).append( '<strong>' + cols[i] + '</strong><sup></sup><span></span>' );
	
		el.find('tr').append( cell );
		
		this[ col ].row = cell;
		this[ col ].quotient = cell.find('sup');
		this[ col ].remainder = cell.find( 'span' );
	}
	
	this.amount = el.find( 'input' );
	
	this.sell.row.on( "click", { type: "SELL" }, $.proxy( this.trade, this ) );
	this.buy.row.on( "click", { type: "BUY" }, $.proxy( this.trade, this ) );
	
	return el;
};
	
Widget.prototype.trade = function ( e ) {
	if( e.data.type == "SELL" ) {
		var price = this.sell.price;
	} else {
		var price = this.buy.price;
	}
	
	var amount = this.amount.val() || 1000;

	App.prototype.sendCommand( "TRADE", [ this.attributes.sessionid, "FX", this.attributes.instrument, e.data.type, amount,  price], 123 );
};
 
 Widget.prototype.updateSingle = function( target, newPrice, oldPrice ) {
	
	if ( newPrice > oldPrice ) {
		target.row.removeClass('down').addClass('up');
	} else {
		target.row.removeClass('up').addClass('down');
	}
	
	var parts = newPrice.split(".");
	if( parts[1].length == 1 ) {
		parts[1] += "0";
	}
	
	target.quotient.text( parts[0] ); 
	target.remainder.text( parts[1] );
	
	target.price = parts.join(".");
};
    
Widget.prototype.updateOffer = function(webClientMessage){
	try {
		var price = webClientMessage.getBody();

		this.updateSingle( this.buy, price, this.buy.price );
	} catch (e) {
	  //  DiffusionClient.trace(e);
	}
};

Widget.prototype.updateBid = function(webClientMessage){
	try {
		var price = webClientMessage.getBody();

		this.updateSingle( this.sell, price, this.sell.price );
	} catch (e) {
	//    DiffusionClient.trace(e);
	}
};

Widget.prototype.init = function() {
	var el = this.render();
	
	this.theBidTLR = DiffusionClient.addTopicListener( this.attributes.topicAlias + "B", this.updateBid, this );
	this.theOfferTLR = DiffusionClient.addTopicListener( this.attributes.topicAlias + "O", this.updateOffer, this );
	
	return el;
};

