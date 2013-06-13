DiffusionClient=new function(){this.version="4.0";this.buildNumber="2_1";this.isInvalidFunction=false;
this.listeners=new Array();this.credentials=null;this.topicListenerRef=0;this.isDebugging=false;this.serverProtocolVersion=-1;
this.messageLengthSize=-1;if(navigator.appVersion.match("MSIE")=="MSIE"){this.isIE=true}else{this.isIE=false
}if(navigator.appVersion.match("MSIE 9.0")=="MSIE 9.0"){this.isIE9=true}else{this.isIE9=false}if(navigator.userAgent.indexOf("Firefox")==-1){this.isFirefox=false
}else{this.isFirefox=true}if(navigator.platform.indexOf("Win")==-1){this.isWindows=false}else{this.isWindows=true
}this.connect=function(B,C){if(C){this.setCredentials(C)}this.connectionDetails=this.extend(new DiffusionClientConnectionDetails(),B);
if(this.connectionDetails.debug==true){this.setDebugging(true)}this.trace(navigator.userAgent);this.trace("DiffusionClient: Version "+this.version+" build "+this.buildNumber);
if(typeof B.onInvalidClientFunction=="function"){this.isInvalidFunction=true}setTimeout(function(){if(DiffusionClient.diffusionTransport.isConnected==false){if(typeof DiffusionClient.connectionDetails.callbackFunction=="function"){DiffusionClient.connectionDetails.callbackFunction(false)
}}},this.connectionDetails.timeoutMS);var A=document.getElementById("DiffusionContainer");if(A==null){A=document.createElement("div");
A.id="DiffusionContainer";A.style.width="0px";A.style.height="0px";document.body.appendChild(A)}this.diffusionTransport=new DiffusionClientTransport();
this.diffusionTransport.cascade();window.onbeforeunload=function(){if(typeof DiffusionClient.connectionDetails.onBeforeUnloadFunction=="function"){DiffusionClient.connectionDetails.onBeforeUnloadFunction()
}if(DiffusionClient.diffusionTransport!=null){if(DiffusionClient.diffusionTransport.isConnected){DiffusionClient.close()
}}};document.onkeydown=this.checkEscape;document.onkeypress=this.checkEscape};this.isConnected=function(){if(DiffusionClient.diffusionTransport){return DiffusionClient.diffusionTransport.isConnected
}return false};this.setCredentials=function(A){if(A!=null){this.credentials=this.extend(new DiffusionClientCredentials(),A)
}};this.getCredentials=function(){return this.credentials};this.subscribe=function(A){if(this.isTransportValid()){this.diffusionTransport.subscribe(A)
}};this.unsubscribe=function(A){if(this.isTransportValid()){this.diffusionTransport.unsubscribe(A)}};
this.sendTopicMessage=function(B){if(this.isTransportValid()){var A=B.getMessage();if((A!=null&&A!="")||B.userHeaders!=null){this.diffusionTransport.sendTopicMessage(B)
}}};this.send=function(A,B){if(this.isTransportValid()){if(B!=null&&B!=""){this.diffusionTransport.send(A,B)
}}};this.sendCredentials=function(A){if(this.isTransportValid()){this.setCredentials(A);this.diffusionTransport.sendCredentials(A)
}};this.ping=function(){if(this.isTransportValid()){this.diffusionTransport.ping()}};this.acknowledge=function(B){if(this.isTransportValid()){var A=B.getAckID();
if(A!=null){this.diffusionTransport.sendAckResponse(A);B.setAcknowledged()}}};this.fetch=function(A,B){if(this.isTransportValid()){if(B){this.diffusionTransport.fetch(A,B)
}else{this.diffusionTransport.fetch(A,null)}}};this.isTransportValid=function(){if(!this.diffusionTransport){return false
}else{return this.diffusionTransport.isValid()}};this.close=function(){if(this.diffusionTransport!=null){this.diffusionTransport.close()
}};this.addTopicListener=function(B,D,A){var C=this.topicListenerRef++;if(typeof A=="undefined"){A=arguments.callee
}this.listeners.push({regex:new RegExp(B),fp:D,handle:C,thisContext:A});return C};this.removeTopicListener=function(B){var C;
for(var A=0;A<this.listeners.length;A++){C=this.listeners[A];if(C.handle==B){this.listeners.splice(A,1);
return }}};this.removeAllTopicListeners=function(){this.listeners=new Array()};this.checkEscape=function(A){if(!A){A=event
}if(A.keyCode==27){return false}};this.extend=function(C,A){for(var B in A){C[B]=A[B]}return C};this.bind=function(A,B){return function(){var C=Array.prototype.slice.call(arguments,0);
return A.apply(B,C)}};this.getClientID=function(){return this.diffusionTransport.clientID};this.getClientProtocolVersion=function(){return 3
};this.getTransportName=function(){return this.diffusionTransport.transportName};this.getServerProtocolVersion=function(){return this.serverProtocolVersion
};this.setDebugging=function(A){if(A==false){this.trace=function(B){};this.isDebugging=false}else{this.isDebugging=true;
if(window.console&&window.console.log){this.trace=function(B){console.log(DiffusionClient.timestamp()+B)
}}else{if(window.opera&&opera.postError){this.trace=function(B){opera.postError(DiffusionClient.timestamp()+B)
}}else{this.isDebugging=false;this.trace=function(B){}}}}};this.trace=function(A){};this.timestamp=function(){var A=new Date();
return A.getHours()+":"+A.getMinutes()+":"+A.getSeconds()+"."+A.getMilliseconds()+" : "};this.getLastInteraction=function(){return this.diffusionTransport.getLastInteraction()
};this.hasFlash=function(B){if(window.ActiveXObject){try{obj=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
ver=obj.GetVariable("$version").replace(/([a-z]|[A-Z]|\s)+/,"").split(",");if(ver[0]>=B){return true}}catch(D){return false
}}if(navigator.plugins&&navigator.mimeTypes.length){try{var A=navigator.plugins["Shockwave Flash"];if(A&&A.description){ver=A.description.replace(/([a-z]|[A-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split(".");
if(ver[0]>=B){return true}}else{return false}}catch(C){return false}}};this.hasSilverlight=function(){try{var B=null;
if(this.isIE){B=new ActiveXObject("AgControl.AgControl");if(B){return B.isVersionSupported("4.0.5")}else{return false
}}if(navigator.plugins["Silverlight Plug-In"]){container=document.createElement("div");document.body.appendChild(container);
container.innerHTML='<embed type="application/x-silverlight" src="data:," />';B=container.childNodes[0];
var A=B.isVersionSupported("4.0.5");document.body.removeChild(container);return A}return false}catch(C){return false
}};this.getWebSocket=function(B){var A=null;if("WebSocket" in window){A=new WebSocket(B)}else{if("MozWebSocket" in window){A=new MozWebSocket(B)
}}return A}};DiffusionClientTransport=function(){this.isConnected=false;this.messageCount=0;this.isClosing=false;
this.clientID;this._cd=DiffusionClient.connectionDetails;this._dc=DiffusionClient;this.transportName;
this.aliasMap=new Array();this.transports=new Array();this.transports.push({name:"WebSocket",transport:new DiffusionWSTransport()});
this.transports.push({name:"Flash",transport:new DiffusionFlashTransport()});this.transports.push({name:"Silverlight",transport:new DiffusionSilverlightTransport()});
this.transports.push({name:"XmlHttpRequest",transport:new DiffusionXHRTransport()});this.transports.push({name:"Iframe",transport:new DiffusionIframeTransport});
this.nextAckSequence=0;this.ackManager=new Array();this.lastInteraction};DiffusionClientTransport.prototype.cascade=function(){if(this.transports.length>0){var A=this.transports.shift();
this.transport=A.transport;this.transportName=A.name;if(typeof this._cd.onCascadeFunction=="function"){this._cd.onCascadeFunction(A.name)
}DiffusionClient.trace("Transport: cascade: about to attempt to connect to "+A.name);this.lastInteraction=new Date().getTime();
this.transport.connect()}else{if(typeof this._cd.onCascadeFunction=="function"){this._cd.onCascadeFunction("None")
}if(typeof this._cd.onCallbackFunction=="function"){this._cd.onCallbackFunction(false)}}};DiffusionClientTransport.prototype.getLastInteraction=function(){return this.lastInteraction
};DiffusionClientTransport.prototype.isValid=function(){if(this.isConnected==false||this.isClosing==true){if(this._dc.isInvalidFunction){this._cd.onInvalidClientFunction()
}return false}this.lastInteraction=new Date().getTime();return true};DiffusionClientTransport.prototype.connectionRejected=function(){this.isConnected=false;
if(typeof DiffusionClient.connectionDetails.onConnectionRejectFunction=="function"){DiffusionClient.connectionDetails.onConnectionRejectFunction()
}};DiffusionClientTransport.prototype.close=function(){this.isConnected=false;this.isClosing=true;if(this.transport!=null){this.transport.close()
}};DiffusionClientTransport.prototype.sendTopicMessage=function(B){DiffusionClient.trace("Sending topic message..."+B.getMessage());
if(B.getAckRequired()){var A=new DiffusionAckProcess(B);this.ackManager[B.getAckID()]=A}this.transport.sendTopicMessage(B)
};DiffusionClientTransport.prototype.send=function(A,B){DiffusionClient.trace("Sending ..."+B);this.transport.send(A,B)
};DiffusionClientTransport.prototype.subscribe=function(A){DiffusionClient.trace("Subscribe ... "+A);
this.transport.subscribe(A)};DiffusionClientTransport.prototype.unsubscribe=function(A){DiffusionClient.trace("Unsubscribe ... "+A);
this.transport.unsubscribe(A)};DiffusionClientTransport.prototype.sendAckResponse=function(A){DiffusionClient.trace("Send ack response "+A);
this.transport.sendAckResponse(A)};DiffusionClientTransport.prototype.sendCredentials=function(A){DiffusionClient.trace("Send credentials ");
this.transport.sendCredentials(A)};DiffusionClientTransport.prototype.fetch=function(A,B){if(B){DiffusionClient.trace("Fetch "+A+" : "+B);
this.transport.fetch(A,B)}else{DiffusionClient.trace("Fetch "+A);this.transport.fetch(A,null)}};DiffusionClientTransport.prototype.connected=function(A){this._dc.trace("Client ID = "+A);
this.isConnected=true;this.clientID=A;if(typeof this._cd.onCallbackFunction=="function"){this._cd.onCallbackFunction(true)
}this.lastInteraction=new Date().getTime()};DiffusionClientTransport.prototype.ping=function(){if(!this.isClosing&&!this.isClosed){this.transport.ping(new Date().getTime())
}};DiffusionClientTransport.prototype.handleMessages=function(C){this.lastInteraction=new Date().getTime();
try{if(C!=""){var B=C.split("\u0008");do{var O=B.shift();var I=O.charCodeAt(0);switch(I){case 28:if(typeof this._cd.onAbortFunction=="function"){this._cd.onAbortFunction()
}this.isClosing=true;return ;case 24:if(typeof this._cd.onPingFunction=="function"){this._cd.onPingFunction(new PingMessage(O))
}break;case 25:var F=O.split("\u0002")[0];var K=F.substr(1,(F.length-2));this.transport.sendClientPingResponse(K);
break;case 27:if(typeof this._cd.onServerRejectedCredentialsFunction=="function"){this._cd.onServerRejectedCredentialsFunction()
}break;case 29:if(typeof this._cd.onLostConnectionFunction=="function"){this._cd.onLostConnectionFunction()
}this.isClosing=true;return ;case 32:var L=parseInt(O.substr(1,(O.length-1)));this.processAckResponse(L);
break;case 35:var C=O.substr(1,(O.length-2));var F=C.split("\u0002");var G=F[0].split("!");if(G.length>1){delete this.aliasMap[G[1]]
}if(typeof this._cd.onTopicStatusFunction=="function"){var E=null;if(G.length>1){E=G[1]}var N=new TopicStatusMessage(G[0],E,F[1]);
this._cd.onTopicStatusFunction(N)}break;default:try{var H=new WebClientMessage(O,this.messageCount++);
if(H.isAckMessage()&&this._cd.autoAck){this.transport.sendAckResponse(H.getAckID());H.setAcknowledged()
}var D=H.getTopic();if(H.isInitialTopicLoad()){var E=D.split("!");if(E.length==2){this.aliasMap[E[1]]=E[0];
H.setTopic(E[0])}}else{if(D.charCodeAt(0)==33){H.setTopic(this.aliasMap[D.substr(1)])}}this._cd.onDataFunction(H);
var M=DiffusionClient.listeners.length;if(M>0){do{--M;var A=DiffusionClient.listeners[M];if(H.getTopic().match(A.regex)){try{A.fp.apply(A.thisContext,[H])
}catch(J){DiffusionClient.trace("Problem with topicListener "+A.handle+" : "+J)}}}while(M)}}catch(J){DiffusionClient.trace("DiffusionClient: Error processing data "+J)
}break}}while(B.length)}}catch(J){DiffusionClient.trace("DiffusionClient:  Error processing data "+J)
}};DiffusionClientTransport.prototype.getNextAckID=function(){return this.nextAckSequence++};DiffusionClientTransport.prototype.processAckResponse=function(B){var A=this.ackManager[B];
if(A!=null){A.cancel();delete this.ackManager[B]}};DiffusionWSTransport=function(){this.webSocket;this.hasConnected=false;
this.timeoutVar};DiffusionWSTransport.prototype.send=function(A,B){this.writeBytes("\u0015"+A+"\u0001"+B)
};DiffusionWSTransport.prototype.sendTopicMessage=function(C){var A;if(C.getAckRequired()){A="\u001F"+C.getTopic()+"\u0002"+C.getAckID()
}else{A="\u0015"+C.getTopic()}var B=C.getUserHeaders();if(B!=null&&B.length>0){A+="\u0002";A+=B.join("\u0002")
}A+="\u0001";A+=C.getMessage();this.writeBytes(A)};DiffusionWSTransport.prototype.sendCredentials=function(A){this.writeBytes("\u001a"+A.toRecord())
};DiffusionWSTransport.prototype.subscribe=function(A){this.writeBytes("\u0016"+A)};DiffusionWSTransport.prototype.unsubscribe=function(A){this.writeBytes("\u0017"+A)
};DiffusionWSTransport.prototype.ping=function(A){this.writeBytes("\u0018"+A)};DiffusionWSTransport.prototype.sendAckResponse=function(A){this.writeBytes("\u0020"+A)
};DiffusionWSTransport.prototype.fetch=function(A,B){if(B!=null){this.writeBytes("\u0021"+A+"\u0002"+B)
}else{this.writeBytes("\u0021"+A)}};DiffusionWSTransport.prototype.close=function(){this.writeBytes("\u001D");
if(this.webSocket!=null){this.webSocket.onclose=null;this.webSocket.close()}};DiffusionWSTransport.prototype.sendClientPingResponse=function(A){this.writeBytes("\u0019"+A)
};DiffusionWSTransport.prototype.connect=function(){var C=DiffusionClient.connectionDetails;if(C.disableWS){DiffusionClient.diffusionTransport.cascade();
return }DiffusionClient.trace("WebSocket connect");try{var B=C.wsURL+C.context+"/diffusion?t="+DiffusionClient.connectionDetails.topic+"&v="+DiffusionClient.getClientProtocolVersion()+"&ty=WB";
if(DiffusionClient.credentials!=null){B+="&username="+DiffusionClient.credentials.username+"&password="+DiffusionClient.credentials.password
}DiffusionClient.trace("WebSocket URL: "+B);var A=DiffusionClient.getWebSocket(B);if(A==null){DiffusionClient.diffusionTransport.cascade();
return }this.webSocket=A;this.webSocket.onopen=DiffusionClient.bind(this.onWSConnect,this);this.webSocket.onmessage=this.onWSHandshake;
this.webSocket.onclose=DiffusionClient.bind(this.onWSClose,this);this.timeoutVar=setTimeout(DiffusionClient.bind(this.onTimeout,this),C.wsTimeout)
}catch(D){DiffusionClient.trace("WebSocket connect exception "+D);clearTimeout(this.timeoutVar);DiffusionClient.diffusionTransport.cascade();
return }};DiffusionWSTransport.prototype.writeBytes=function(A){try{this.webSocket.send(A)}catch(B){Diffusion.trace("WebSocket: Unable to send message: "+A)
}};DiffusionWSTransport.prototype.onTimeout=function(){if(!this.hasConnected){DiffusionClient.trace("WebSocket Timeout Cascade");
this.webSocket.onopen=null;this.webSocket.onmessage=null;this.webSocket.onclose=null;if(this.WebSocket!=null){this.webSocket.close()
}DiffusionClient.diffusionTransport.cascade()}};DiffusionWSTransport.prototype.onWSConnect=function(A){this.hasConnected=true;
DiffusionClient.trace("onWSConnect");clearTimeout(this.timeoutVar)};DiffusionWSTransport.prototype.onWSHandshake=function(A){var B=A.data.split("\u0002");
DiffusionClient.serverProtocolVersion=parseInt(B.shift());if(B[0]=="100"){this.onmessage=DiffusionClient.diffusionTransport.transport.onWSMessage;
DiffusionClient.diffusionTransport.connected(B[1])}else{if(B[0]=="111"){DiffusionClient.diffusionTransport.connectionRejected()
}}};DiffusionWSTransport.prototype.onWSMessage=function(A){DiffusionClient.trace("WebSocket: "+A.data);
DiffusionClient.diffusionTransport.handleMessages(A.data)};DiffusionWSTransport.prototype.onWSClose=function(A){DiffusionClient.trace("onWSClose "+this.hasConnected);
clearTimeout(this.timeoutVar);if(!this.hasConnected){DiffusionClient.diffusionTransport.cascade();return 
}if(DiffusionClient.diffusionTransport.isClosing!=true){if(typeof DiffusionClient.connectionDetails.onLostConnectionFunction=="function"){DiffusionClient.connectionDetails.onLostConnectionFunction();
DiffusionClient.diffusionTransport.isClosing=true}}};DiffusionFlashTransport=function(){this.flashConnection=null;
this.segments=new Array()};DiffusionFlashTransport.prototype.close=function(){try{if(this.flashConnection!=null){this.flashConnection.close()
}}catch(A){}};DiffusionFlashTransport.prototype.sendTopicMessage=function(A){this.flashConnection.sendTopicMessage(A.toRecord())
};DiffusionFlashTransport.prototype.sendCredentials=function(A){this.flashConnection.sendCredentials(A.toRecord())
};DiffusionFlashTransport.prototype.send=function(B,A){this.flashConnection.send(B,A)};DiffusionFlashTransport.prototype.subscribe=function(A){this.flashConnection.subscribe(A)
};DiffusionFlashTransport.prototype.unsubscribe=function(A){this.flashConnection.unsubscribe(A)};DiffusionFlashTransport.prototype.ping=function(A){this.flashConnection.ping(A)
};DiffusionFlashTransport.prototype.fetch=function(A,B){if(B){A+="\u0003"+B}this.flashConnection.fetch(A)
};DiffusionFlashTransport.prototype.connect=function(){var B=DiffusionClient.connectionDetails;if(B.disableFlash){DiffusionClient.diffusionTransport.cascade();
return }if(!DiffusionClient.hasFlash(9)){DiffusionClient.diffusionTransport.cascade();return }DiffusionClient.trace("Flash connect");
this.clearPlugin();var D=DiffusionClient.connectionDetails.context+B.libPath+"/DiffusionClient.swf?v=4.0_2_1&host="+B.flashHost+"&port="+B.flashPort+"&topic="+B.topic;
D+="&batch=DiffusionClient.diffusionTransport.transport.onFlashBatch&callback=DiffusionClient.diffusionTransport.transport.onFlashConnect&onDataEvent=DiffusionClient.diffusionTransport.handleMessages";
D+="&transport="+B.flashTransport+"&durl="+B.flashURL+"&tio="+B.flashTimeout;if(DiffusionClient.credentials!=null){D+="&username="+DiffusionClient.credentials.username+"&password="+DiffusionClient.credentials.password
}if(DiffusionClient.isDebugging){D+="&onTrace=DiffusionClient.trace"}if(DiffusionClient.isIE){D+="&date="+new Date()
}var C='<object width="0" height="0" id="DiffusionClientFlash" type="application/x-shockwave-flash" data="'+D+'" >';
C+='<param name="allowScriptAccess" value="always" />';C+='<param name="bgcolor" value="#ffffff" />';
C+='<param name="movie" value="'+D+'" />';C+='<param name="scale" value="noscale" />';C+='<param name="salign" value="lt" />';
C+="</object>";var A=document.getElementById("DiffusionContainer");var E=document.createElement("div");
E.innerHTML=C;A.appendChild(E);this.timeoutVar=setTimeout(DiffusionClient.bind(this.onTimeout,this),B.cascadeTimeout)
};DiffusionFlashTransport.prototype.onTimeout=function(){DiffusionClient.trace("Flash Timeout Cascade");
this.clearPlugin();DiffusionClient.diffusionTransport.cascade()};DiffusionFlashTransport.prototype.clearPlugin=function(){try{var A=document.getElementById("DiffusionContainer");
var C=document.getElementById("DiffusionClientFlash");if(C!=null){var B=C.parentNode;B.removeChild(C);
A.removeChild(B)}}catch(D){}};DiffusionFlashTransport.prototype.onFlashConnect=function(A){clearTimeout(this.timeoutVar);
if(A==false){DiffusionClient.trace("Flash Connection not successful.");DiffusionClient.diffusionTransport.cascade();
return }else{var B=A.split("\u0002");DiffusionClient.serverProtocolVersion=B[0];DiffusionClient.trace("Flash Connection successful.");
this.flashConnection=document.DiffusionClientFlash;if(this.flashConnection==null){this.flashConnection=window.DiffusionClientFlash
}DiffusionClient.diffusionTransport.connected(B[1])}};DiffusionFlashTransport.prototype.onFlashBatch=function(A){if(A.charAt(0)=="\u0003"){this.segments.push(A.substr(1));
DiffusionClient.diffusionTransport.handleMessages(this.segments.join(""));this.segments=new Array()}else{this.segments.push(A);
DiffusionClient.trace("Segment "+this.segments.length)}};DiffusionSilverlightTransport=function(){this.silverlightConnection=null
};DiffusionSilverlightTransport.prototype.close=function(){if(this.silverlightConnection!=null){this.silverlightConnection.close()
}};DiffusionSilverlightTransport.prototype.send=function(B,A){this.silverlightConnection.send(B,A)};DiffusionSilverlightTransport.prototype.sendTopicMessage=function(A){this.silverlightConnection.sendTopicMessage(A.toRecord())
};DiffusionSilverlightTransport.prototype.sendCredentials=function(A){this.silverlightConnection.sendCredentials(A.toRecord())
};DiffusionSilverlightTransport.prototype.subscribe=function(A){this.silverlightConnection.subscribe(A)
};DiffusionSilverlightTransport.prototype.unsubscribe=function(A){this.silverlightConnection.unsubscribe(A)
};DiffusionSilverlightTransport.prototype.ping=function(A){this.silverlightConnection.ping(A)};DiffusionSilverlightTransport.prototype.sendAckResponse=function(A){this.silverlightConnection.sendAckResponse(A)
};DiffusionSilverlightTransport.prototype.fetch=function(A,B){if(B){A+="\u0003"+B}this.silverlightConnection.fetch(A)
};DiffusionSilverlightTransport.prototype.connect=function(){var B=DiffusionClient.connectionDetails;
if(B.disableSilverlight){DiffusionClient.diffusionTransport.cascade();return }if(!DiffusionClient.hasSilverlight()){DiffusionClient.diffusionTransport.cascade();
return }DiffusionClient.trace("Silverlight connect");this.clearPlugin();var G=DiffusionClient.connectionDetails.context+B.libPath+"/DiffusionClient.xap?v=4.0_2_1";
var C='<object data="data:application/x-silverlight-2," id="DiffusionClientSilverlight" type="application/x-silverlight-2" width="1" height="1">';
C+='<param name="source" value="'+G+'" />';C+='<param name="onError" value="DiffusionClient.diffusionTransport.transport.onSilverlightError" />';
var F;if(B.topic!=null){F=B.topic.split(",").join("|")}else{F=""}var E="host="+B.silverlightHost+",port="+B.silverlightPort+",topic="+F+",onDataEvent=DiffusionClient.diffusionTransport.handleMessages,";
E+="callback=DiffusionClient.diffusionTransport.transport.onSilverlightConnect,transport="+B.silverlightTransport+",durl="+B.silverlightURL;
if(DiffusionClient.credentials!=null){E+=",username="+DiffusionClient.credentials.username+",password="+DiffusionClient.credentials.password
}if(DiffusionClient.isDebugging){E+=",debugging=true"}C+='<param name="initParams" value="'+E+'" />';
C+='<param name="minRuntimeVersion" value="4.0.50401.0" />';C+='<param name="autoUpgrade" value="false" />';
C+="</object>";var A=document.getElementById("DiffusionContainer");var D=document.createElement("div");
D.style.position="fixed";D.style.left="0px";D.style.top="0px";D.innerHTML=C;A.appendChild(D);this.timeoutVar=setTimeout(DiffusionClient.bind(this.onTimeout,this),B.cascadeTimeout)
};DiffusionSilverlightTransport.prototype.onTimeout=function(){DiffusionClient.trace("Silverlight Timeout Cascade");
this.clearPlugin();DiffusionClient.diffusionTransport.cascade()};DiffusionSilverlightTransport.prototype.clearPlugin=function(){try{var A=document.getElementById("DiffusionContainer");
var C=document.getElementById("DiffusionClientSilverlight");if(C!=null){var B=C.parentNode;B.removeChild(C);
A.removeChild(B)}}catch(D){}};DiffusionSilverlightTransport.prototype.onSilverlightConnect=function(B){clearTimeout(this.timeoutVar);
if(B==false){DiffusionClient.trace("Silverlight Connection not successful.");DiffusionClient.diffusionTransport.cascade()
}else{DiffusionClient.trace("Silverlight Connection successful.");var C=B.split("\u0002");DiffusionClient.serverProtocolVersion=C[0];
var A=null;A=document.DiffusionClientSilverlight;if(A==null){A=window.DiffusionClientSilverlight}this.silverlightConnection=A.content.DiffusionJavaScriptClient;
DiffusionClient.diffusionTransport.connected(C[1])}};DiffusionSilverlightTransport.prototype.onSilverlightError=function(C,A){DiffusionClient.trace("Silverlight Connection not successful. (Error)");
var B="";if(C!=null&&C!=0){B=C.getHost().Source}var F=A.ErrorType;var D=A.ErrorCode;if(F=="ImageError"||F=="MediaError"){return 
}var E="Unhandled Error in Silverlight Application "+B+"\n";E+="Code: "+D+" Category: "+F+" Message: "+A.ErrorMessage+"\n";
if(F=="ParserError"){E+="File: "+A.xamlFile+" Line: "+A.lineNumber+" Position: "+A.charPosition+"\n"}else{if(F=="RuntimeError"){if(A.lineNumber!=0){E+="Line: "+A.lineNumber+" Position: "+A.charPosition+"\n"
}E+="MethodName: "+A.methodName+"\n"}}DiffusionClient.trace(E)};DiffusionXHRTransport=function(){this.serverUrl=DiffusionClient.connectionDetails.XHRURL+DiffusionClient.connectionDetails.context+"/diffusion/";
this.requests=new Array();this.isSending=false;this.requestListener=null;this.retryCount=0;this.isNativeXmlHttp=false;
this.seq=0;this.aborted=false};DiffusionXHRTransport.prototype.sendTopicMessage=function(C){var B={m:"2",c:DiffusionClient.getClientID(),t:C.getTopic(),s:this.seq++};
if(C.getUserHeaders()!=null){B.u=C.getUserHeaders().join("\u0002")}if(C.getAckRequired()){B.a=C.getAckID()
}var A=this.createDiffusionRequest(B);A.data=C.getMessage();this.processRequest(A)};DiffusionXHRTransport.prototype.send=function(A,B){var C=this.createDiffusionRequest({m:"2",c:DiffusionClient.getClientID(),t:A,s:this.seq++});
C.data=B;this.processRequest(C)};DiffusionXHRTransport.prototype.XHRSubscription=function(A,B){this.processRequest(this.createDiffusionRequest({m:B,c:DiffusionClient.getClientID(),t:A,s:this.seq++}))
};DiffusionXHRTransport.prototype.subscribe=function(A){this.XHRSubscription(A,"22")};DiffusionXHRTransport.prototype.unsubscribe=function(A){this.XHRSubscription(A,"23")
};DiffusionXHRTransport.prototype.ping=function(A){this.processRequest(this.createDiffusionRequest({m:"24",c:DiffusionClient.getClientID(),u:A,s:this.seq++}))
};DiffusionXHRTransport.prototype.sendClientPingResponse=function(A){this.processRequest(this.createDiffusionRequest({m:"25",c:DiffusionClient.getClientID(),u:A,s:this.seq++}))
};DiffusionXHRTransport.prototype.sendAckResponse=function(A){this.processRequest(this.createDiffusionRequest({m:"32",c:DiffusionClient.getClientID(),u:A,s:this.seq++}))
};DiffusionXHRTransport.prototype.fetch=function(A,B){headers={m:"33",c:DiffusionClient.getClientID(),t:A,s:this.seq++};
if(B){headers.u=B}this.processRequest(this.createDiffusionRequest(headers))};DiffusionXHRTransport.prototype.sendCredentials=function(A){this.processRequest(this.createDiffusionRequest({m:"26",c:DiffusionClient.getClientID(),username:A.username,password:A.password,s:this.seq++}))
};DiffusionXHRTransport.prototype.close=function(){if(this.pollRequest){this.aborted=true;this.pollRequest.abort()
}var A=this.createXHRTransport();A.open("POST",this.serverUrl,false);A.setRequestHeader("m","29");A.setRequestHeader("c",DiffusionClient.getClientID());
try{A.send("")}catch(B){}};DiffusionXHRTransport.prototype.poll=function(){if(DiffusionClient.diffusionTransport.isClosing){return 
}var B=this;var A=this.createDiffusionRequest({m:"1",c:DiffusionClient.getClientID()}).request;A.onreadystatechange=function(){if(B.aborted){return 
}if(A.readyState==4){if(A.status==0||A.status==12029){if(DiffusionClient.diffusionTransport.isClosing!=true){DiffusionClient.diffusionTransport.isClosing=true;
this.requests=new Array();if(typeof DiffusionClient.connectionDetails.onLostConnectionFunction=="function"){DiffusionClient.connectionDetails.onLostConnectionFunction()
}}}else{if(A.status==200){DiffusionClient.diffusionTransport.handleMessages(A.responseText);B.retryCount=0;
B.poll()}}}};this.pollRequest=A;A.send("")};DiffusionXHRTransport.prototype.connect=function(){if(DiffusionClient.connectionDetails.disableXHR==true){DiffusionClient.diffusionTransport.cascade();
return }if(this.detectXmlHttp()==false){DiffusionClient.diffusionTransport.cascade();return }DiffusionClient.trace("XHR connect");
var D=this;var C={m:"0",ty:"B",t:DiffusionClient.connectionDetails.topic,tt:DiffusionClient.connectionDetails.transportTimeout,v:DiffusionClient.getClientProtocolVersion()};
var B=DiffusionClient.getCredentials();if(B!=null){C.username=B.username;C.password=B.password}var A=this.createDiffusionRequest(C).request;
A.onreadystatechange=function(){if(A.readyState==4){if(A.status==200){var F=A.responseText.split("\u0002");
DiffusionClient.serverProtocolVersion=F.shift();var E=F.shift();DiffusionClient.messageLengthSize=F.shift();
if(E=="100"){DiffusionClient.diffusionTransport.connected(F[0]);D.poll()}if(E=="111"){DiffusionClient.diffusionTransport.connectionRejected()
}}else{DiffusionClient.diffusionTransport.cascade()}}};A.send("")};DiffusionXHRTransport.prototype.createXHRTransport=function(){if(this.isNativeXmlHttp){return new XMLHttpRequest()
}else{return new ActiveXObject(this.activeXName)}};DiffusionXHRTransport.prototype.processRequest=function(B){if(B!=null){this.requests.push(B)
}if(this.isSending){return }if(this.requests.length==0){return }var C=this.requests.shift();var A=C.request;
var D=this;A.onreadystatechange=function(){try{if(A.readyState==4){if(A.status==0){DiffusionClient.trace("checkRequest - lost connection");
if(typeof DiffusionClient.connectionDetails.onLostConnectionFunction=="function"){DiffusionClient.connectionDetails.onLostConnectionFunction();
DiffusionClient.diffusionTransport.isClosing=true}}D.isSending=false;setTimeout(function(){D.processRequest(null)
},0)}}catch(E){DiffusionClient.trace("error: processRequest "+E)}};this.isSending=true;A.send(C.data)
};DiffusionXHRTransport.prototype.createDiffusionRequest=function(D){var A=this.createXHRTransport();
A.open("POST",this.serverUrl,true);for(var E in D){try{A.setRequestHeader(E,D[E])}catch(C){DiffusionClient.trace("Can't set header "+E+":"+D.join(":"))
}}var B={data:"",request:A};return B};DiffusionXHRTransport.prototype.detectXmlHttp=function(){var B=null;
try{B=new XMLHttpRequest();DiffusionClient.trace("detectXmlHttp: got native");if(B!=null){this.isNativeXmlHttp=true;
return true}}catch(D){}if(DiffusionClient.isIE){var C=new Array("MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP");
for(var A=0;A<C.length;++A){try{B=new ActiveXObject(C[A])}catch(D){}if(B!=null){this.activeXName=C[A];
DiffusionClient.trace("detectXmlHttp: "+this.activeXName);return true}}}return false};DiffusionIframeTransport=function(){this.container=document.getElementById("DiffusionContainer");
this.requests=new Array();this.pollFrame=null;this.connectFrame=null;this.baseURL=DiffusionClient.connectionDetails.context+"/diffusion/";
this.isSending=false;this.seq=0};DiffusionIframeTransport.prototype.send=function(A,B){this.post("?m=2&c="+DiffusionClient.getClientID()+"&t="+A+"&d="+B+"&s="+this.seq++)
};DiffusionIframeTransport.prototype.sendTopicMessage=function(B){var A="?m=2&c="+DiffusionClient.getClientID()+"&t="+B.getTopic()+"&d="+B.getMessage()+"&s="+this.seq++;
if(B.getUserHeaders()!=null){A+="&u="+B.getUserHeaders().join("\u0002")}if(B.getAckRequired()){A+="&a="+B.getAckID()
}this.post(A)};DiffusionIframeTransport.prototype.subscribe=function(A){this.post("?m=22&c="+DiffusionClient.getClientID()+"&t="+A+"&s="+this.seq++)
};DiffusionIframeTransport.prototype.unsubscribe=function(A){this.post("?m=23&c="+DiffusionClient.getClientID()+"&t="+A+"&s="+this.seq++)
};DiffusionIframeTransport.prototype.ping=function(A){this.post("?m=24&c="+DiffusionClient.getClientID()+"&u="+A+"&s="+this.seq++)
};DiffusionIframeTransport.prototype.sendAckResponse=function(A){this.post("?m=32&c="+DiffusionClient.getClientID()+"&u="+A+"&s="+this.seq++)
};DiffusionIframeTransport.prototype.sendCredentials=function(A){this.post("?m=26&c="+DiffusionClient.getClientID()+"&username="+A.username+"&password="+A.password+"&s="+this.seq++)
};DiffusionIframeTransport.prototype.fetch=function(A,B){if(B){this.post("?m=33&c="+DiffusionClient.getClientID()+"&t="+A+"&u"+B+"&s="+this.seq++)
}else{this.post("?m=33&c="+DiffusionClient.getClientID()+"&t="+A+"&s="+this.seq++)}};DiffusionIframeTransport.prototype.close=function(){var A=this.baseURL+"?m=29&c="+DiffusionClient.getClientID();
DiffusionClient.trace("close : "+A);if(this.connectFrame!=null){if(DiffusionClient.isIE){this.connectFrame.src=A
}else{this.connectFrame.contentDocument.location.replace(A)}}};DiffusionIframeTransport.prototype.sendClientPingResponse=function(A){this.post("?m=25&c="+DiffusionClient.getClientID()+"&u="+A+"&s="+this.seq++)
};DiffusionIframeTransport.prototype.connect=function(){var B=DiffusionClient.connectionDetails;if(B.disableIframe){DiffusionClient.diffusionTransport.cascade();
return }DiffusionClient.trace("Iframe connect");var A=this.baseURL+"?m=0&t="+B.topic+"&tt="+B.transportTimeout+"&v="+DiffusionClient.getClientProtocolVersion();
if(DiffusionClient.credentials!=null){A+="&username="+DiffusionClient.credentials.username+"&password="+DiffusionClient.credentials.password
}this.connectFrame=this.createFrame("DIT",A,false);setTimeout(function(){if(DiffusionClient.diffusionTransport.isConnected==false){DiffusionClient.diffusionTransport.cascade()
}},500)};DiffusionIframeTransport.prototype.poll=function(){if(DiffusionClient.diffusionTransport.isClosing){return 
}var A=this.baseURL+"?m=1&c="+DiffusionClient.getClientID()+"&nc="+new Date().valueOf();this.pollFrame=this.createFrame("DITP",A,true)
};DiffusionIframeTransport.prototype.createFrame=function(id,url,isPolling){var iframe;try{var node=document.getElementById(id);
if(node){this.container.removeChild(node)}}catch(e){}if(DiffusionClient.isIE&&!DiffusionClient.isIE9){if(isPolling){var ifs='<iframe name="'+id+'" src="'+url+'" onload="DiffusionClient.diffusionTransport.transport.process();" >';
iframe=document.createElement(ifs)}else{try{iframe=document.createElement('<iframe name="'+id+'" src="'+url+'">')
}catch(e){}}}else{iframe=document.createElement("iframe");iframe.setAttribute("id",id);iframe.src=url;
if(isPolling){iframe.onload=DiffusionClient.diffusionTransport.transport.process}}with(iframe){style.left="0px";
style.top="0px";style.height="0px";style.width="0px";style.border="0px"}this.container.appendChild(iframe);
return iframe};DiffusionIframeTransport.prototype.post=function(A){this.requests.push(A);if(this.isSending==false){this.isSending=true;
_this=this;setTimeout(function(){_this.processRequest()},80)}};DiffusionIframeTransport.prototype.processRequest=function(){if(this.requests.length>0){var A=this.baseURL+this.requests.shift();
if(this.connectFrame!=null){if(DiffusionClient.isIE){this.connectFrame.src=A}else{this.connectFrame.contentDocument.location.replace(A)
}}}if(this.requests.length>0){_this=this;setTimeout(function(){_this.processRequest()},80)}else{this.isSending=false
}};DiffusionIframeTransport.prototype.process=function(){try{var B=document.getElementById("DITP");DiffusionClient.diffusionTransport.transport.poll()
}catch(A){DiffusionClient.trace("Error: DiffusioniFrameTransport: process "+A)}};DiffusionClientConnectionDetails=function(){this.debug=false;
this.libPath="/lib/DIFFUSION";this.context="";this.cascadeTimeout=4000;this.flashHost=window.location.hostname;
this.flashPort=((window.location.port==0)?80:window.location.port);this.flashURL=location.protocol+"//"+location.host;
this.flashTransport="S";this.flashTimeout=3000;this.disableFlash=false;this.silverlightHost=window.location.hostname;
this.silverlightPort=4503;this.silverlightURL=location.protocol+"//"+location.host;this.silverlightTransport="S";
this.disableSilverlight=false;this.XHRURL=location.protocol+"//"+location.host;this.XHRretryCount=3;this.timeoutMS=4000;
this.transportTimeout=90;this.disableXHR=false;this.wsURL="ws://"+location.host;this.wsTimeout=2000;this.disableWS=false;
this.disableIframe=false;this.topic=null;this.autoAck=true;this.onDataFunction=null;this.onBeforeUnloadFunction=null;
this.onCallbackFunction=null;this.onInvalidClientFunction=null;this.onCascadeFunction=null;this.onPingFunction=null;
this.onAbortFunction=null;this.onLostConnectionFunction=null;this.onConnectionRejectFunction=null;this.onMessageNotAcknowledgedFunction=null;
this.onServerRejectedCredentialsFunction=null;this.onTopicStatusFunction=null};WebClientMessage=function(B,A){this.messageCount=A;
this.messageType=B.charCodeAt(0);this.timeStamp=new Date();this.rows=B.split("\u0001");this.headers=this.rows[0].split("\u0002");
var C=this.headers.shift();this.topic=C.substr(1,C.length);this.rowLength=this.rows.length-1;this.payload=B;
this.ackID=null;this.needsAcknowledge=false;if(this.messageType==30||this.messageType==31){this.ackID=this.headers.shift();
this.needsAcknowledge=true}};WebClientMessage.prototype.getHeader=function(){return this.rows[0]};WebClientMessage.prototype.getBody=function(){return this.payload.substr((this.getHeader().length+1))
};WebClientMessage.prototype.isInitialTopicLoad=function(){return(this.messageType==20||this.messageType==30)
};WebClientMessage.prototype.isFetchMessage=function(){return(this.messageType==34)};WebClientMessage.prototype.isDeltaMessage=function(){return(this.messageType==21||this.messageType==31)
};WebClientMessage.prototype.getTopic=function(){return this.topic};WebClientMessage.prototype.setTopic=function(A){this.topic=A
};WebClientMessage.prototype.getNumberOfRecords=function(){return this.rowLength};WebClientMessage.prototype.getFields=function(A){return this.rows[(A+1)].split("\u0002")
};WebClientMessage.prototype.getJSONObject=function(){return eval("("+this.rows[1]+")")};WebClientMessage.prototype.getTimestampAsDate=function(){return this.timeStamp
};WebClientMessage.prototype.localeTimeString=function(){return this.timeStamp.toLocaleTimeString()};
WebClientMessage.prototype.getMessageCount=function(){return this.messageCount};WebClientMessage.prototype.getUserHeaders=function(){return this.headers
};WebClientMessage.prototype.getUserHeader=function(A){return this.headers[A]};WebClientMessage.prototype.getBaseTopic=function(){return this.topic.substr((this.topic.lastIndexOf("/")+1),this.topic.length)
};WebClientMessage.prototype.isAckMessage=function(){return(this.messageType==30||this.messageType==31)
};WebClientMessage.prototype.getAckID=function(){return this.ackID};WebClientMessage.prototype.setAcknowledged=function(){this.needsAcknowledge=false
};WebClientMessage.prototype.needsAcknowledgement=function(){return this.needsAcknowledge};WebClientMessage.prototype.displayFormat=function(){var A="";
if(this.headers.length>0){A="["+this.headers.join("|")+"]"}A+=this.getBody().replace(new RegExp("\u0001","g"),"<RD>");
A=A.replace(new RegExp("\u0002","g"),"<FD>");return A};TopicMessage=function(A,B){this.topic=A;this.message=B;
this.isCrypted=false;this.userHeaders=null;this.isAckRequested=false;this.ackTimeout=0;this.RECORD_DELIMETER="\u0001";
this.FIELD_DELIMITER="\u0002"};TopicMessage.prototype.getMessage=function(){return this.message};TopicMessage.prototype.setMessage=function(A){this.message=A
};TopicMessage.prototype.getTopic=function(){return this.topic};TopicMessage.prototype.setUserHeaders=function(A){this.userHeaders=A
};TopicMessage.prototype.getUserHeaders=function(){return this.userHeaders};TopicMessage.prototype.addUserHeader=function(A){if(this.userHeaders==null){this.userHeaders=new Array()
}this.userHeaders.push(A)};TopicMessage.prototype.setCrypted=function(A){this.isCrypted=A};TopicMessage.prototype.getCrytped=function(){return this.isCrypted
};TopicMessage.prototype.getAckRequired=function(){return this.isAckRequested};TopicMessage.prototype.setAckRequired=function(A){this.isAckRequested=true;
this.ackTimeout=A;this.ackID=DiffusionClient.diffusionTransport.getNextAckID();return this.ackID};TopicMessage.prototype.getAckID=function(){return this.ackID
};TopicMessage.prototype.getAckTimeout=function(){return this.ackTimeout};TopicMessage.prototype.setAckTimeout=function(A){this.ackTimeout=A
};TopicMessage.prototype.toRecord=function(){var A=this.topic+"\u0003"+this.message+"\u0003"+this.isCrypted+"\u0003"+this.isAckRequested;
if(this.isAckRequested){A+="\u0003"+this.ackID}if(this.userHeaders!=null){A+="\u0003"+this.userHeaders.join("\u0003")
}return A};PingMessage=function(A){var B=A.split("\u0002");this.timestamp=B[0].substr(1,B[0].length);
this.queueSize=B[1].substr(0,(B[1].length-1))};PingMessage.prototype.getTimestamp=function(){return this.timestamp
};PingMessage.prototype.getQueueSize=function(){return this.queueSize};PingMessage.prototype.getTimeSinceCreation=function(){return(new Date().getTime()-new Number(this.timestamp))
};DiffusionClientCredentials=function(){this.username="";this.password="";this.toRecord=function(){return this.username+"\u0002"+this.password
}};DiffusionAckProcess=function(A){DiffusionClient.trace("DiffusionAckProcess "+A.getAckID());this.topicMessage=A;
var B=this;this.timeout=setTimeout(function(){B.onTimeout(B)},A.getAckTimeout())};DiffusionAckProcess.prototype.cancel=function(){DiffusionClient.trace("DiffusionAckProcess: cancel "+this.topicMessage.getAckID());
clearTimeout(this.timeout)};DiffusionAckProcess.prototype.onTimeout=function(A){DiffusionClient.trace("DiffusionAckProcess: onTimeout "+this.topicMessage.getAckID());
try{DiffusionClient.connectionDetails.onMessageNotAcknowledgedFunction(this.topicMessage)}catch(B){DiffusionClient.trace("DiffusionAckProcess: unable to call onMessageNotAcknowledged "+B)
}};TopicStatusMessage=function(B,C,A){this.topic=B;this.alias=C;this.status=A};TopicStatusMessage.prototype.getTopic=function(){return this.topic
};TopicStatusMessage.prototype.getAlias=function(){return this.alias};TopicStatusMessage.prototype.getStatus=function(){return this.status
};