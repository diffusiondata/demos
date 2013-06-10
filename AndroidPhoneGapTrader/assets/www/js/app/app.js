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
   
function App( config ) {
	this.config = $.extend( this.defaults, config );
	
	this.trades = [];
	this.widgets = [];
	
	this.user = {
		username : "",
		sessionid : ""
	};
	
	this.topicListeners = {
		me : null,
		all : null
	};
};

App.prototype.init = function() {
	this.initConnection();
}

App.prototype.initConnection = function() {
	var context = this;
	var connectionDetails = {
		//wsURL : "ws://" + this.config.connection.url,
			disableWS : true,
		XHRURL : "http://" + this.config.connection.url,
		debug : context.config.debug,
		topic: "Commands",
		onDataFunction: function() {},		// No need for onDataFunction as each widget will handle it's own subscriptions
		onCallbackFunction : function() {
											context.initLogin();	// Once we've connected we establish a user session
										}
	};

	DiffusionClient.addTopicListener("^Commands$", this.processCommands, this );
	
	DiffusionClient.connect( connectionDetails );
}

App.prototype.initLogin = function() {
	var user = prompt( "Please enter a username" );
	this.sendCommand( "LOGON", [user,"password"], "0" );
};

App.prototype.handleLogin = function(msg) {
	this.user.sessionid = msg.getFields(1)[0];
	this.user.username = msg.getFields(1)[1];
	
	DiffusionClient.addTopicListener("^Assets/FX$", this.processWidgets, this );
	DiffusionClient.subscribe( "^Assets/FX" );
	
	DiffusionClient.addTopicListener("^Accounts/"+this.user.username+"/EVENTS", this.processEvents, this );
	DiffusionClient.subscribe("^Accounts/"+this.user.username+"/EVENTS");
	
	this.subscribeTradesAll();
	DiffusionClient.subscribe("^Accounts/.*/TRADES");
	
	$('#profile-name').text( "Hi, " + this.user.username );
	$('#profile').delay(300).fadeIn('slow');
	
	var self = this;
	
	$('#show-me').click( function() {
		var active = $(this).attr('checked');

		if( active ) {
			self.subscribeTradesMe();
		} else {
			self.subscribeTradesAll();
		}
	});
	//DIffusionClient.removeTopicListener("^Assets/FX$");
};

App.prototype.subscribeTradesMe = function() {
	DiffusionClient.removeTopicListener( this.topicListeners.all );
	this.topicListeners.me = DiffusionClient.addTopicListener("^Accounts/" + this.user.username + "/TRADES", this.processTrades, this );
}

App.prototype.subscribeTradesAll = function() {
	DiffusionClient.removeTopicListener( this.topicListeners.me );
	this.topicListeners.all = DiffusionClient.addTopicListener("^Accounts/.*/TRADES", this.processTrades, this );
}


App.prototype.displayToast = function(msg) {
	var toast = $('<div></div>').addClass('toast').text( "Trade accepted" );
	var top = $('body').scrollTop();
	var left = ( $('body').width() / 2) - ( toast.width() / 2 );
	
	toast.css( {top: top + 20, left: left } ).hide().appendTo('body').fadeIn().delay( 900 ).fadeOut( function() {
		$(this).remove();
	});
}

App.prototype.processWidgets = function( message ) {	
	var fields = message.getFields(0), context = this;
	for ( var i = 0; i < fields.length; i++) {
		var data = fields[i];
		var attributes = {
			id: i,
			tenor: "SPOT",
			instrument: data,
			sessionid : context.user.sessionid,
			topicAlias: "Assets/FX/"+data+"/"
		};

		var widget = new Widget( attributes );
		this.config.widgets.el.append( widget.init() );
		this.widgets.push( widget );
	}

	this.config.widgets.el.sortable({
		placeholder: 'placeholder',
		forcePlaceholderSize: true,
		update: function(e,ui) {
			var newIndex = ui.item.index();
			App.prototype.sendCommand( "EVENT", [ context.user.sessionid, "MOVE", ui.item.attr('id'), newIndex ], 123 );
		}
	});
	
	
	DiffusionClient.subscribe("Assets/FX/.*/B,Assets/FX/.*/O");       
//	DiffusionClient.addTopicListener("^Assets/FX/", this.processData, this );
}

App.prototype.processEvents = function( msg ) {
	var parts = msg.getFields(0);
	//console.log(parts);
	if( parts[1] == "MOVE" ) {
		var widget = $('#'+parts[2]);
		var index = parts[3];
		var target = this.config.widgets.el.find('li').eq(index);
		
		var currPos = widget.offset();
		var newPos = target.offset();
		
		var placeholder = $( '<li class="placeholder"></li>' ).css({height:target.height()}).insertBefore( this.config.widgets.el.find('li').eq(index) );
		console.log( newPos );
		widget.css({position:'absolute', top:currPos.top, left:currPos.left, width:target.width()}).detach().insertAfter(placeholder).animate({top:newPos.top,left:newPos.left}, 700, function() {
				placeholder.remove();
				$(this).css({position:'static'});
				$(this)[0].style.removeProperty('width');
				$(this)[0].style.removeProperty('height');
		});
	}
}

App.prototype.processTrades = function( msg ) {
	var parts = msg.getFields(0);
	var log = $("<tr></tr>");
	
	//console.log( "Got Trade log with: ", parts );
	
	for( var p in this.config.blotter.template ) {
		if( parts[ this.config.blotter.template[p] ] == undefined ) return;
		
		var value = parts[ this.config.blotter.template[p] ];
		
		if( p == 'date' ) {
			var date = value.split( " " );
			value = date[1];
		}
		
		log.append( "<td>" + value + "</td>" );
	}
	
	log.hide().prependTo( this.config.blotter.el ).slideUp(0).delay(100).fadeIn().slideDown();
	
	this.trades.push( parts );
};

App.prototype.initData = function() {
//	this.chart = new Chart();
}
App.prototype.processData = function( message) {
//	this.chart.update();
}

App.prototype.processCommands = function( message ) {
	var cmd = message.getUserHeaders()[1].toLowerCase();
	
	//console.log( "Got command: " + cmd, message.getFields(1) );
	
	if( this.commands[ cmd ] ) {
		this.commands[ cmd ].call( this, message );
	}
}

App.prototype.sendCommand = function( cmd, parts, header ) {
	var header = header || "";
	var msg = new TopicMessage( "Commands" );

	msg.addUserHeader( header );
	msg.addUserHeader( cmd );
	msg.setMessage( parts.join( "\u0002" ) );

	console.log( "sending message: " + cmd, parts );
	
	DiffusionClient.sendTopicMessage( msg );
}

App.prototype.commands = {
	logon: App.prototype.handleLogin,
	trade: App.prototype.displayToast,
	event: function() {}
};

App.prototype.defaults = {
	debug : false,
	connection : {
		url : "demo2.pushtechnology.com:80"
	},
	blotter: { 
		template: { },
		el : null
	},
	widgets: {
		el : null
	}
};
