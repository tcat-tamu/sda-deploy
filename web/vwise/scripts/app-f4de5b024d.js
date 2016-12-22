!function(){"use strict";function e(e){function n(e,t,n){return new o(e,i.url,t,n)}n.$inject=["panelContentMediatorRegistry","$http","$q"];var o=t(e),i={url:"/api/vwise",$get:n};return i}function t(e){function t(t,n,o,i){e.WorkspaceRepository.call(this,t),this.$http=o,this.$q=i,this.url=n,this.workspaces=new e.Cache,this.panels=new e.Cache}return t.prototype=Object.create(e.WorkspaceRepository.prototype),t.prototype.createWorkspace=function(t){var n=e.UUID.uuid4(),o=new e.Workspace(n,this);t&&(o.title=t),this.workspaces[o.id]=o;var i=this.url+"/workspaces",r=this.marshallWorkspace(o),a=this.$http.post(i,r).then(function(){return o});return this.workspaces.fetch(o.id,a),a},t.prototype.saveWorkspace=function(t){if(!(t instanceof e.Workspace))throw new TypeError("expected instance of Workspace");var n=this.url+"/workspaces/"+t.id,o=this.marshallWorkspace(t),i=this.$http.put(n,o).then(function(){return t});return i},t.prototype.getWorkspace=function(e){var t=this;return this.workspaces.fetch(e,function(){var n=t.url+"/workspaces/"+e,o=t.$http.get(n).then(function(e){return t.unmarshallWorkspace(e.data)});return o.catch(function(){t.workspaces.clear(e)}),o})},t.prototype.createPanel=function(t,n){var o=e.UUID.uuid4(),i=this,r=new e.Panel(o,t,n,function(e){i.savePanel(e)});this.panels[n.id+":"+r.id]=r;var a=this.url+"/workspaces/"+n.id+"/panels",s=this.marshallPanel(r),l=this.$http.post(a,s).then(function(){return r});return this.panels.fetch(r.id,l),l},t.prototype.savePanel=function(t){if(!(t instanceof e.Panel))throw new TypeError("expected instance of Panel");var n=this.url+"/workspaces/"+t.workspace.id+"/panels/"+t.id,o=this.marshallPanel(t);return this.$http.put(n,o).then(function(){return t})},t.prototype.getPanel=function(e,t){var n=e+":"+t,o=this;return this.panels.fetch(n,function(){var i=o.url+"/workspaces/"+e+"/panels/"+t,r=o.$http.get(i).then(function(e){return o.unmarshallPanel(e.data)});return r.catch(function(){o.panels.clear(n)}),r})},t}e.$inject=["vwise"]}(),function(){"use strict";angular.module("sdaVwise",["ngAnimate","ngCookies","ngSanitize","ngMessages","ngAria","ngResource","ui.router","ngMaterial","trcBiblio","trcBio","trcReln","ngDragDrop","pouchdb","cfp.hotkeys","sda"])}(),function(){"use strict";function e(e){function n(e,t,n,r){var a=r(i.db);return new o(e,a,n)}n.$inject=["panelContentMediatorRegistry","$http","$q","pouchDB"];var o=t(e),i={db:{name:"vwise"},$get:n};return i}function t(e){function t(t,n,o){e.WorkspaceRepository.call(this,t),this.$q=o,this.db=n,this.workspaces=new e.Cache,this.panels=new e.Cache}return t.prototype=Object.create(e.WorkspaceRepository.prototype),t.prototype.listWorkspaceIds=function(){return this.db.allDocs({include_docs:!0}).then(function(e){return e.rows.filter(function(e){return e.doc&&"workspace"===e.doc.type}).map(function(e){return e.id})})},t.prototype.createWorkspace=function(t){var n=e.UUID.uuid4(),o=new e.Workspace(n,this);return t&&(o.title=t),this.saveWorkspace(o)},t.prototype.saveWorkspace=function(t){if(!(t instanceof e.Workspace))throw new TypeError("expected instance of Workspace");var n={_id:t._id||t.id,_rev:t._rev,type:"workspace",workspace:this.marshallWorkspace(t)};return this.db.put(n).then(function(e){if(!e.ok)throw new Error("unable to save workspace");return t._id=e.id,t._rev=e.rev,t})},t.prototype.getWorkspace=function(e){if(!e)return this.$q.reject(new Error("no id provided"));var t=this;return this.workspaces.fetch(e,function(){return t.db.get(e).then(function(e){return t.unmarshallWorkspace(e.workspace).then(function(t){return t._id=e._id,t._rev=e._rev,t})})})},t.prototype.removeWorkspace=function(e){return this.db.remove(e)},t.prototype.createPanel=function(t,n,o,i){var r=e.UUID.uuid4(),a=this,s=new e.Panel(r,t,n,o,i,function(e){a.savePanel(e)});return this.savePanel(s)},t.prototype.savePanel=function(t){if(!(t instanceof e.Panel))throw new TypeError("expected instance of Panel");var n={_id:t._id||t.id,_rev:t._rev,type:"panel",panel:this.marshallPanel(t)};return this.db.put(n).then(function(e){if(!e.ok)throw new Error("unable to save panel");return t._id=e.id,t._rev=e.rev,t})},t.prototype.getPanel=function(e,t){if(!e)return this.$q.reject(new Error("no id provided"));var n=this;return this.panels.fetch(e,function(){return n.db.get(e).then(function(e){return n.unmarshallPanel(e.panel,t).then(function(t){return t._id=e._id,t._rev=e._rev,t})})})},t.prototype.removePanel=function(e,t){return t&&t.removePanel(e),this.db.remove(e)},t}e.$inject=["vwise"],angular.module("sdaVwise").provider("workspaceRepository",e)}(),function(){"use strict";function e(){var e={restrict:"E",templateUrl:"app/vwise/components/workspace/workspace.html",scope:{workspace:"="},controller:t,controllerAs:"vm"};return e}function t(e,t){function n(n,o){var i=o.draggable.scope(),r=i.item;if(r){var a=angular.element(n.target).offset(),s={xPosition:o.position.left-a.left,yPosition:o.position.top-a.top,width:600,height:400,background:"#ffffff"},l=t.findContentMediators(r,s),p=l.length>0?l[0]:null;if(p){var c=p.initPanelData(r,s);c.then(function(t){return e.workspace.createPanel(p,t,s)})}}}function o(n,o){var i={note:""},r={xPosition:n,yPosition:o},a=t.findContentMediators(i,r),s=a.length>0?a[0]:null;e.workspace.createPanel(s,i,r)}function i(e){if(e.ctrlKey){var t=angular.element(e.target).offset();o(e.clientX-t.left,e.clientY-t.top)}}var r=this;r.thingDropped=n,r.workspaceClicked=i}t.$inject=["$scope","panelContentMediatorRegistry"],angular.module("sdaVwise").directive("vwiseWorkspace",e)}(),function(){"use strict";function e(e){function t(t,n,o,i){function r(){function e(){"expand_less"===r.icon?(o.width=t.vprops.width,o.height=t.vprops.height,t.vprops.width=i.outerWidth()+1,t.vprops.height=i.outerHeight(),r.label="expand",r.icon="expand_more"):(t.vprops.width=o.width,t.vprops.height=o.height,r.label="collapse",r.icon="expand_less")}var o={width:t.vprops.width,height:t.vprops.height},i=n.find(".panel-label"),r={label:"collapse",icon:"expand_less",handler:e};return r}i.addActionButton(r()),t.title=e.getTitle(t.work.titles),t.work.editions.forEach(function(e){e.type="edition",e.workId=t.work.id})}var n={restrict:"E",require:"^^vwisePanel",templateUrl:"app/vwise/components/work-panel/work-panel.html",scope:{work:"=",relationships:"=",vprops:"="},link:t};return n}e.$inject=["worksRepo"],angular.module("sdaVwise").directive("workPanel",e)}(),function(){"use strict";function e(e){function t(t){t.title=e.getTitle(t.volume.titles),t.edition=e.getEdition(t.workId,t.editionId)}var n={restrict:"E",templateUrl:"app/vwise/components/work-panel/volume-panel.html",scope:{volume:"=",workId:"@",editionId:"@"},link:t};return n}e.$inject=["worksRepo"],angular.module("sdaVwise").directive("volumePanel",e)}(),function(){"use strict";function e(e){function t(t){t.title=e.getTitle(t.edition.titles),t.edition.volumes.forEach(function(e){e.type="volume",e.workId=t.workId,e.editionId=t.edition.id})}var n={restrict:"E",templateUrl:"app/vwise/components/work-panel/edition-panel.html",scope:{edition:"=",workId:"@"},link:t};return n}e.$inject=["worksRepo"],angular.module("sdaVwise").directive("editionPanel",e)}(),function(){"use strict";function e(e){function n(n,o,i,r){function a(){function e(){"expand_less"===r.icon?(t.width=n.vprops.width,t.height=n.vprops.height,n.vprops.width=i.outerWidth()+10,n.vprops.height=i.outerHeight(),r.label="expand",r.icon="expand_more"):(n.vprops.width=t.width,n.vprops.height=t.height,r.label="collapse",r.icon="expand_less")}var t={width:n.vprops.width,height:n.vprops.height},i=o.find(".panel-label"),r={label:"collapse",icon:"expand_less",handler:e};return r}r.addActionButton(a());var s=n.person.name;n.name=s.label||e.at(s,t).map(function(e){return e.trim()}).filter(e.identity).join(" ")}function o(t,n,o,i,r){function a(){var e=t.person.id,n=s(e);n.then(function(e){c.works=e});var o=n.then(function(e){return l(e)});o.then(function(e){c.relatedPeople=e})}function s(e){var t=o.searchByAuthor(e);return t.$promise.then(function(){return t.items.forEach(function(e){e.type="work"}),t.items})}function l(t){var o=t.map(function(e){return p(e.id)}),r=n.all(o).then(function(t){return e.chain(t).flatten().groupBy(function(e){return e.type.identifier+"-"+(e.reverse?"rev":"fwd")}).map(function(t){var n=e.clone(t[0]);return n.relationships=e.flatMap(t,"relationships"),n}).value()}),a=r.then(function(t){var o=t.map(function(t){var o=e.chain(t.relationships).flatMap("entities").map("entity").map(function(t){return t.$promise.then(function(t){var n=e.map(t.authors,"authorId");return n})}).value(),r=n.all(o).then(function(t){return e.chain(t).flatten().filter().uniq().value()});return t.relationships=r.then(function(e){var t=e.map(function(e){var t=i.get(e);return t.$promise.then(function(){t.type="person"}),t.$promise});return n.all(t)}),n.all(t)});return n.all(o)});return a}function p(e){var t="works/"+e,n=r.search(t),i=n.$promise.then(function(e){var n=r.normalizeRelationships(e,t,o);return n.$promise});return i}var c=this;c.works=[],a()}o.$inject=["$scope","$q","worksRepo","peopleRepo","relnRepo"];var i={restrict:"E",require:"^^vwisePanel",templateUrl:"app/vwise/components/person-panel/person-panel.html",scope:{person:"=",vprops:"="},link:n,controller:o,controllerAs:"panel"};return i}e.$inject=["_"],angular.module("sdaVwise").directive("personPanel",e);var t=["title","givenName","middleName","familyName","suffix"]}(),function(){"use strict";function e(e,t,n,o){function i(){t.PanelContentMediator.call(this,"works","Works Content Mediator")}function r(e){var t=n.getWork(e);return t.$promise}function a(e){var t=o.search(e);return t.$promise.then(function(){var n=o.normalizeRelationships(t,e);return n.$promise.then(function(){return n.forEach(function(e){e.relationships.forEach(function(e){e.anchors.forEach(function(e){e.properties.hasOwnProperty("editionId")&&e.properties.hasOwnProperty("volumeId")?(e.type="volume",e.workId=e.ref.id,e.editionId=e.properties.editionId,e.id=e.properties.volumeId):e.properties.hasOwnProperty("editionId")?(e.type="edition",e.workId=e.ref.id,e.id=e.properties.editionId):(e.type="work",e.id=e.ref.id)})})}),n})})}return i.prototype=Object.create(t.PanelContentMediator.prototype),i.prototype.matches=function(e){return e.type&&"work"===e.type&&e.id},i.prototype.initPanelData=function(t){var n=r(t.id);return e.all({id:t.id,work:n,relationships:n.then(function(e){return a(e.ref.token)})})},i.prototype.unmarshall=function(t){var n=r(t.id);return e.all({id:t.id,work:n,relationships:n.then(function(e){return a(e.ref.token)})})},i.prototype.marshall=function(e){var t={type:"work",id:e.id};return t},i.prototype.getTemplate=function(){return'<work-panel work="content.work" relationships="content.relationships" vprops="vprops" flex layout="column"></work-panel>'},new i}e.$inject=["$q","vwise","worksRepo","relnRepo"],angular.module("sdaVwise").factory("worksContentMediator",e)}(),function(){"use strict";function e(e,t){function n(){e.PanelContentMediator.call(this,"volumes","Volumes Content Mediator")}function o(e,n,o){var i=t.getVolume(e,n,o);return i.$promise.then(function(){return i.workId=e,i.editionId=n,i})}return n.prototype=Object.create(e.PanelContentMediator.prototype),n.prototype.matches=function(e){return e.type&&"volume"===e.type&&e.id&&e.workId&&e.editionId},n.prototype.initPanelData=function(e){return o(e.workId,e.editionId,e.id)},n.prototype.unmarshall=function(e){return o(e.workId,e.editionId,e.id)},n.prototype.marshall=function(e){var t={type:"volume",id:e.id,workId:e.workId,editionId:e.editionId};return t},n.prototype.getTemplate=function(){return'<volume-panel volume="content" edition-id="{{content.editionId}}" work-id="{{content.workId}}" flex layout="column"></volume-panel>'},new n}e.$inject=["vwise","worksRepo"],angular.module("sdaVwise").factory("volumesContentMediator",e)}(),function(){"use strict";function e(e,t){function n(){e.PanelContentMediator.call(this,"people","People Content Mediator")}function o(e){var n=t.get(e);return n.$promise}return n.prototype=Object.create(e.PanelContentMediator.prototype),n.prototype.matches=function(e){return e.type&&"person"===e.type&&e.id},n.prototype.initPanelData=function(e){return o(e.id)},n.prototype.unmarshall=function(e){return o(e.id)},n.prototype.marshall=function(e){var t={type:"person",id:e.id};return t},n.prototype.getTemplate=function(){return'<person-panel person="content" vprops="vprops" flex layout="column"></person-panel>'},new n}e.$inject=["vwise","peopleRepo"],angular.module("sdaVwise").factory("peopleContentMediator",e)}(),function(){"use strict";function e(e){function t(){e.PanelContentMediator.call(this,"passthru","Pass-Through Debug Mediator")}return t.prototype=Object.create(e.PanelContentMediator.prototype),t.prototype.matches=function(){return!0},new t}e.$inject=["vwise"],angular.module("sdaVwise").factory("passthruContentMediator",e)}(),function(){"use strict";function e(e){return new e.PanelContentMediatorRegistry}e.$inject=["vwise"],angular.module("sdaVwise").factory("panelContentMediatorRegistry",e)}(),function(){"use strict";function e(e){function t(){e.PanelContentMediator.call(this,"notes","Note Content Mediator")}return t.prototype=Object.create(e.PanelContentMediator.prototype),t.prototype.matches=function(e){return e.hasOwnProperty("note")},t.prototype.getTemplate=function(){return'<div ng-model="content.note" contenteditable flex></div>'},new t}e.$inject=["vwise"],angular.module("sdaVwise").factory("noteContentMediator",e)}(),function(){"use strict";function e(e,t){function n(){e.PanelContentMediator.call(this,"editions","Editions Content Mediator")}function o(e,n){var o=t.getEdition(e,n);return o.$promise.then(function(){return o.workId=e,o})}return n.prototype=Object.create(e.PanelContentMediator.prototype),n.prototype.matches=function(e){return e.type&&"edition"===e.type&&e.id&&e.workId},n.prototype.initPanelData=function(e){return o(e.workId,e.id)},n.prototype.unmarshall=function(e){return o(e.workId,e.id)},n.prototype.marshall=function(e){var t={type:"edition",id:e.id,workId:e.workId};return t},n.prototype.getTemplate=function(){return'<edition-panel edition="content" work-id="{{content.workId}}" flex layout="column"></edition-panel>'},new n}e.$inject=["vwise","worksRepo"],angular.module("sdaVwise").factory("editionsContentMediator",e)}(),function(){"use strict";function e(e){function t(){e.PanelContentMediator.call(this,"ia-reader","Internet Archive Digital Copy mediator")}return t.prototype=Object.create(e.PanelContentMediator.prototype),t.prototype.matches=function(e){return e.type&&"internetarchive"===e.type},t.prototype.getTemplate=function(){return'<ia-reader book-id="content.properties.id" page="content.properties.seq" flex></ia-reader>'},new t}e.$inject=["vwise"],angular.module("sdaVwise").factory("internetArchiveContentMediator",e)}(),function(){"use strict";function e(e){function t(){e.PanelContentMediator.call(this,"ht-reader","HathiTrust Digital Copy mediator")}return t.prototype=Object.create(e.PanelContentMediator.prototype),t.prototype.matches=function(e){return e.type&&"hathitrust"===e.type},t.prototype.getTemplate=function(){return'<hathitrust-reader book-id="content.properties.htid" page="content.properties.seq" flex></hathitrust-reader>'},new t}e.$inject=["vwise"],angular.module("sdaVwise").factory("hathitrustContentMediator",e)}(),function(){"use strict";function e(e){function t(){e.PanelContentMediator.call(this,"gb-reader","Google Books Digital Copy mediator")}return t.prototype=Object.create(e.PanelContentMediator.prototype),t.prototype.matches=function(e){return e.type&&"googlebooks"===e.type},t.prototype.getTemplate=function(){return'<google-book-reader book-id="content.properties.id" page="content.properties.page" flex></google-book-reader>'},new t}e.$inject=["vwise"],angular.module("sdaVwise").factory("googleBooksContentMediator",e)}(),function(){"use strict";function e(e){function i(t,i,r,a){var s=a[1];s.getInfoArea=function(){return i.find(".panel-area-left")},s.getStatusArea=function(){return i.find(".panel-area-bottom")};var l=s.panel;t.vp=l.vprops;var p=t.$new(!0);p.content=l.content,p.vprops=l.vprops,p.$watch("vprops.background",function(e){var t=n(e);l.vprops.foreground=o(t)}),p.$watch("content",function(){l.save()},!0);var c=l.contentMediator.getTemplate(),d=i.find(".content");d.html(c),e(d.contents())(p)}var r={restrict:"E",require:["^^vwiseWorkspace","vwisePanel"],templateUrl:"app/vwise/components/panel/panel.html",replace:!0,scope:{panel:"="},link:i,controller:t,controllerAs:"vm"};return r}function t(e){function t(e){return c.actionButtons.push(e),function(){var t=c.actionButtons.indexOf(e);t>=0&&c.actionButtons.splice(t,1)}}function n(e){return c.propertyButtons.push(e),function(){var t=c.propertyButtons.indexOf(e);t>=0&&c.propertyButtons.splice(t,1)}}function o(){c.panel.remove()}function i(e,t){c.panel.vprops.xPosition=t.position.left,c.panel.vprops.yPosition=Math.max(0,t.position.top)}function r(e,t){var n=Math.max(0,t.position.top);c.panel.setPosition(t.position.left,n),p()}function a(){c.resizing=!0}function s(t,n){var o=n.position.left,i=n.position.top;e.$apply(function(){c.panel.vprops.width=Math.max(0,o),c.panel.vprops.height=Math.max(0,i)})}function l(t,n){c.resizing=!1;var o=n.position.left,i=n.position.top;e.$apply(function(){c.panel.setSize(Math.max(0,o),Math.max(0,i))})}function p(e){c.panel.activate(),e&&e.stopPropagation&&e.stopPropagation()}var c=this;c.resizing=!1,c.actionButtons=[],c.propertyButtons=[],c.panel=e.panel,c.addActionButton=t,c.addPropertyButton=n,c.closePanel=o,c.startResize=a,c.resizePanel=s,c.stopResize=l,c.movePanel=i,c.stopMove=r,c.activatePanel=p}function n(e){var t=e.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);if(t)return{r:parseInt(t[1],16)/255,g:parseInt(t[2],16)/255,b:parseInt(t[3],16)/255}}function o(e){var t=e.r<=.03928?e.r/12.92:Math.pow((e.r+.055)/1.055,2.4),n=e.g<=.03928?e.g/12.92:Math.pow((e.g+.055)/1.055,2.4),o=e.b<=.03928?e.b/12.92:Math.pow((e.b+.055)/1.055,2.4),i=.2126*t+.7152*n+.0722*o;return i>.215?"rgba(0,0,0,0.87)":"rgba(255,255,255,0.87)"}e.$inject=["$compile"],t.$inject=["$scope"],angular.module("sdaVwise").directive("vwisePanel",e)}(),function(){"use strict";function e(e){function t(t,n,o,i){i&&(i.$render=function(){n.html(e.getTrustedHtml(i.$viewValue||""))},n.on("blur keyup change",function(){t.$apply(function(){i.$setViewValue(n.html())})}))}var n={restrict:"A",require:"?ngModel",link:t};return n}e.$inject=["$sce"],angular.module("sdaVwise").directive("contenteditable",e)}(),function(){"use strict";function e(e,t){function n(t){t.$watchGroup(["bookId","page"],function(n){var r=n[0],a=n[1],s=o({scheme:"https",host:"archive.org",path:["stream",r],query:{ui:"embed"},fragment:i(a?"page/"+a:"","mode/2up")});t.src=e.trustAsResourceUrl(s)})}function o(e){var n=t.defaults(t.clone(e)||{},{scheme:"http",query:{}});if(!n.host)throw new Error("host option must be provided");return t.isArray(n.path)&&(n.path=i.apply(null,n.path)),t.isObject(n.query)&&(n.query=r(n.query,n.querySep)),n.scheme+"://"+i(n.host,n.path)+(n.query?"?"+n.query:"")+(n.fragment?"#"+n.fragment:"")}function i(){return t.chain(arguments).map(function(e){return t.trim(e,"\r\n\t /")}).filter().join("/")}function r(e,n){return n=n||"&",t.chain(e).map(function(e,n){return n?(t.isArray(e)||(e=[e]),t.map(e,function(e){return n+(e?"="+e:"")})):[]}).flatten().filter().join(n)}var a={restrict:"E",template:'<iframe ng-src="{{src}}">',replace:!0,link:n,scope:{bookId:"=",page:"="}};return a}e.$inject=["$sce","_"],angular.module("sdaVwise").directive("iaReader",e)}(),function(){"use strict";function e(e,n){function o(o){o.$watchGroup(["bookId","page"],function(i){var r=i[0],a=i[1],s={id:r,ui:"embed"};a&&(s.seq=a);var l=n.map(s,function(e,t){return t+"="+e}).join(";"),p=t+"?"+l;o.src=e.trustAsResourceUrl(p)})}var i={restrict:"E",template:'<iframe ng-src="{{src}}">',replace:!0,link:o,scope:{bookId:"=",page:"="}};return i}e.$inject=["$sce","_"];var t="https://babel.hathitrust.org/cgi/pt";angular.module("sdaVwise").directive("hathitrustReader",e)}(),function(){"use strict";function e(){function e(e){angular.extend(n.options,e)}function t(e){return e.load(n.options)}t.$inject=["googleBooksScriptLoader"];var n={};return n.options={transport:"https",v:0,language:"en",preventLoad:!1},n.configure=e,n.$get=t,n}angular.module("sdaVwise").provider("googleBooksApi",e)}(),function(){"use strict";function e(e,t,n,o){function i(e){return"auto"===e.transport?"//www.google.com/books/api.js?":e.transport+"://www.google.com/books/api.js?"}function r(e){var n=["transport","preventLoad","randomizedFunctionName"],r=o.map(o.omit(e,n),function(e,t){return t+"="+e});if(p){var a=t.getElementById(p);a.parentNode.removeChild(a)}else p="gbooks_load_"+Math.round(1e3*Math.random());r=r.join("&"),angular.element("<script>",{id:p,type:"text/javascript",src:i(e)+r}).appendTo(angular.element("body"))}function a(){return angular.isDefined(e.google)&&angular.isDefined(e.google.books)}function s(t){var o=n.defer();if(a())return o.resolve(e.google.books),o.promise;var i="onGoogleBooksReady"+Math.round(1e3*Math.random());return t.callback=i,e[i]=function(){e[i]=null,o.resolve(e.google.books)},t.preventLoad||r(t),c=t,c.randomizedFunctionName=i,o.promise}function l(){var t=c;a()?e[t.randomizedFunctionName]&&e[t.randomizedFunctionName]():r(t)}var p=void 0,c=void 0;return{load:s,manualLoad:l}}e.$inject=["$window","$document","$q","_"],angular.module("sdaVwise").factory("googleBooksScriptLoader",e)}(),function(){"use strict";function e(e,t){function n(n,o){t.load(),e.then(function(e){var t=new e.DefaultViewer(o.get(0));n.$watch("bookId",function(e){t.load(e)}),n.$on("resize",function(){t.resize()})})}var o={restrict:"E",link:n,scope:{bookId:"=",page:"="}};return o}e.$inject=["googleBooksApi","googleBooksApiManualLoader"],angular.module("sdaVwise").directive("googleBookReader",e)}(),function(){"use strict";function e(e){function t(){e.manualLoad()}var n={};return n.load=t,n}e.$inject=["googleBooksScriptLoader"],angular.module("sdaVwise").service("googleBooksApiManualLoader",e)}(),function(){"use strict";function e(e,t,n,o,i,r,a,s,l,p,c,d,u){function m(){var e=n.workspaceId?c.when(n.workspaceId):t.listWorkspaceIds().then(function(e){return e.length>0?e[0]:null}),o=e.then(function(e){return t.getWorkspace(e)}).catch(function(){return t.createWorkspace()});o.then(function(e){v.workspace=e}),l.bindTo(i).add({combo:"ctrl+\\",description:"Toggle Sidebar",callback:function(){v.sidebarFocused=!v.sidebarFocused}}).add({combo:"/",description:"Search",callback:function(){v.searchQuery="",v.sidebarFocused?r(function(){angular.element("#searchQuery").focus()}):a("left").toggle()}}).add({combo:"n",description:"Create a new note panel",callback:function(){h(100,100)}})}function f(e){function t(e,t){return function(n){return n.forEach(function(n){n[e]=t}),n}}v.loading=!0,v.peopleResults=d.search(e),v.worksResults=u.search(e),c.all([v.peopleResults.$promise.then(p.property("items")).then(t("type","person")),v.worksResults.$promise.then(p.property("items")).then(t("type","work"))]).then(function(){v.loading=!1},function(){s.showSimple("Unable to load search results")})}function h(t,n){var o={note:""},i={xPosition:t,yPosition:n},r=e.findContentMediators(o,i),a=r.length>0?r[0]:null;v.workspace.createPanel(a,o,i)}var v=this;v.workspace=null,v.activeItems=[],v.searchQuery="",v.sidebarFocused=!0,v.search=p.debounce(f,300),m()}e.$inject=["panelContentMediatorRegistry","workspaceRepository","$stateParams","$log","$scope","$timeout","$mdSidenav","$mdToast","hotkeys","_","$q","peopleRepo","worksRepo"],angular.module("sdaVwise").controller("WorkspaceController",e)}(),function(){"use strict";function e(e,t,n,o,i,r,a,s,l,p,c,d,u,m){e.debug("runBlock end"),t.$on("$stateChangeSuccess",function(){o("send","pageview",{page:n.url()})}),i.register(r),i.register(a),i.register(s),i.register(l),i.register(p),i.register(c),i.register(d),i.register(u),i.register(m)}e.$inject=["$log","$rootScope","$location","analytics","panelContentMediatorRegistry","peopleContentMediator","worksContentMediator","editionsContentMediator","volumesContentMediator","googleBooksContentMediator","hathitrustContentMediator","internetArchiveContentMediator","noteContentMediator","passthruContentMediator"],angular.module("sdaVwise").run(e)}(),function(){"use strict";function e(e,t){e.state("vwise",{url:"/",templateUrl:"app/vwise/workspace.html",controller:"WorkspaceController",controllerAs:"vm"}),t.otherwise("/")}e.$inject=["$stateProvider","$urlRouterProvider"],angular.module("sdaVwise").config(e)}(),function(){"use strict";angular.module("sdaVwise").constant("_",_).constant("vwise",vwise).constant("ga",ga)}(),function(){"use strict";function e(e,t,n,o,i,r,a,s){e.debugEnabled(!0),n.url="/api/catalog/works",o.url="/api/catalog/people",i.url="/api/catalog/relationships",a.url="/assets/data/navigation.json",r.configure({preventLoad:!0}),s.id="UA-87254463-1",t.definePalette("darkBrown",{50:"#595c59",100:"#4c4f4c",200:"#404240",300:"#333533",400:"#272827",500:"#1a1b1a",600:"#0d0e0d",700:"#010101",800:"#000000",900:"#000000",A100:"#e0f0e0",A200:"#565956",A400:"#7e837e",A700:"#000000",contrastDefaultColor:"light",contrastDarkColors:["A100"]}),t.definePalette("copper",{50:"#d4b190",100:"#cca47e",200:"#c5976b",300:"#be8a59",400:"#b67e47",500:"#a47140",600:"#926439",700:"#7f5832",800:"#6d4b2b",900:"#5b3e23",A100:"#dcc3ab",A200:"#a47140",A400:"#48321c",A700:"#272927",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","A100"]}),t.theme("default").primaryPalette("darkBrown").accentPalette("copper")}e.$inject=["$logProvider","$mdThemingProvider","worksRepoProvider","peopleRepoProvider","relnRepoProvider","googleBooksApiProvider","sdaSitenavProvider","analyticsProvider"],angular.module("sdaVwise").config(e)}(),angular.module("sdaVwise").run(["$templateCache",function(e){e.put("app/vwise/workspace.html",'<sda-header md-sidenav-id=left active-url=/research></sda-header> <main layout=row flex> <md-sidenav md-component-id=left class=md-sidenav-left layout=column md-is-locked-open=vm.sidebarFocused> <form layout=row flex=none> <md-input-container flex> <label for=searchQuery>Search</label> <md-icon>search</md-icon> <input type=search name=searchQuery id=searchQuery ng-model=vm.searchQuery ng-change=vm.search(vm.searchQuery) required md-sidenav-focus> </md-input-container> </form> <md-content flex> <div ng-if=vm.loading layout=row layout-align=center> <md-progress-circular md-mode=indeterminate></md-progress-circular> </div> <div ng-if="!vm.loading && vm.peopleResults && vm.peopleResults.items.length == 0 && vm.worksResults && vm.worksResults.items.length == 0" layout=row layout-padding> <p>No results for "{{vm.searchQuery}}".</p> </div> <div ng-if="!vm.loading && vm.peopleResults && vm.peopleResults.items.length > 0"> <md-subheader>People</md-subheader> <md-list> <md-list-item ng-repeat="item in vm.peopleResults.items" jqyoui-draggable={animate:false} data-jqyoui-options="{revert:\'invalid\',helper:\'clone\',appendTo:\'body\'}" data-drag=true> <div class=md-list-item-text ng-bind-html=item.label></div> </md-list-item> </md-list> </div> <div ng-if="!vm.loading && vm.worksResults && vm.worksResults.items.length > 0"> <md-subheader>Works</md-subheader> <md-list> <md-list-item ng-repeat="item in vm.worksResults.items" jqyoui-draggable={animate:false} data-jqyoui-options="{revert:\'invalid\',helper:\'clone\',appendTo:\'body\'}" data-drag=true> <div class=md-list-item-text ng-bind-html=item.label></div> </md-list-item> </md-list> </div> </md-content> </md-sidenav> <vwise-workspace workspace=vm.workspace flex layout=column></vwise-workspace> </main> '),e.put("app/vwise/components/panel/panel.html",'<div class=panel ng-class="{ resizing: vm.resizing }" ng-style="{ left: vp.xPosition, top: vp.yPosition, zIndex: vp.zPosition, width: vp.width, height: vp.height }" jqyoui-draggable="{ onDrag: \'vm.movePanel()\', onStop: \'vm.stopMove()\' }" ng-click=vm.activatePanel($event) data-jqyoui-options="{ handle: \'.drag-handle\' }" data-drag=true layout=column> <div class="panel-control drag-handle" layout=column layout-align="center center"> <md-icon>open_with</md-icon> </div> <button class="panel-control close" ng-click=vm.closePanel($event) layout=column layout-align="center center"> <md-icon>close</md-icon> </button> <div class="panel-control resize-handle" ng-style="{ left: vp.width, top: vp.height }" jqyoui-draggable="{ onStart: \'vm.startResize()\', onDrag: \'vm.resizePanel()\', onStop:\'vm.stopResize()\'}" data-drag=true layout=column layout-align="center center"> <md-icon>crop</md-icon> </div> <div class="panel-control panel-area panel-area-top" layout=row layout-align="end center"> <button ng-repeat="button in vm.actionButtons" ng-click=button.handler($event) title={{button.label}} layout=column layout-align="center center"> <md-icon ng-if=button.icon>{{button.icon}}</md-icon> <span ng-if=!button.icon>{{button.label}}</span> </button> </div> <div class="panel-control panel-area panel-area-right" layout=column layout-align="start center"> <button ng-repeat="button in vm.propertyButtons" ng-click=button.handler($event) title={{button.label}} layout=column layout-align="center center"> <md-icon ng-if=button.icon>{{button.icon}}</md-icon> <span ng-if=!button.icon>{{button.label}}</span> </button> </div> <div class="panel-control panel-area panel-area-bottom"></div> <div class="panel-control panel-area panel-area-left"></div> <div class=content flex layout=column></div> </div> '),e.put("app/vwise/components/person-panel/person-panel.html",'<div class=panel-person flex layout=column> <h1> <span class="panel-label name">{{name}}</span> </h1> <md-tabs flex> <md-tab ng-if=person.summary> <md-tab-label> <md-icon>subject</md-icon> </md-tab-label> <md-tab-body> <div class=summary ng-bind-html=person.summary></div> </md-tab-body> </md-tab> <md-tab ng-if="panel.works && panel.works.length > 0"> <md-tab-label> <md-icon>content_copy</md-icon> </md-tab-label> <md-tab-body> <md-list> <md-list-item ng-repeat="item in panel.works" jqyoui-draggable={animate:false} data-jqyoui-options="{revert:\'invalid\',helper:\'clone\',appendTo:\'body\'}" data-drag=true> <div class=md-list-item-text ng-bind-html=item.label></div> </md-list-item> </md-list> </md-tab-body> </md-tab> <md-tab ng-if="panel.relatedPeople && panel.relatedPeople.length > 0"> <md-tab-label> <md-icon>link</md-icon> </md-tab-label> <md-tab-body> <div ng-repeat="group in panel.relatedPeople"> <h3>{{group.label}}</h3> <md-list> <md-list-item ng-repeat="item in group.relationships" jqyoui-draggable={animate:false} data-jqyoui-options="{revert:\'invalid\',helper:\'clone\',appendTo:\'body\'}" data-drag=true> <div class=md-list-item-text> {{item.name.label}} </div> </md-list-item> </md-list></div>  </md-tab-body></md-tab></md-tabs></div> '),e.put("app/vwise/components/work-panel/edition-panel.html",'<div class=panel-edition flex layout=column> <h1> <span class=panel-label> <span class=authors> <span class=author ng-repeat="author in edition.authors"> {{author.lastName}}. </span> </span> <span class=title>{{title.title}}<span ng-if=title.subtitle>: {{title.subtitle}}</span>.</span> <span class=edition-name>{{edition.editionName}}.</span> </span> </h1> <md-tabs flex> <md-tab ng-if=edition.summary> <md-tab-label> <md-icon>subject</md-icon> </md-tab-label> <md-tab-body> <div class=summary ng-bind-html=edition.summary></div> </md-tab-body> </md-tab> <md-tab ng-if="edition.volumes.length > 0"> <md-tab-label> <md-icon>content_copy</md-icon> </md-tab-label> <md-tab-body> <md-list> <md-list-item ng-repeat="item in edition.volumes" jqyoui-draggable={animate:false} data-jqyoui-options="{revert:\'invalid\',helper:\'clone\',appendTo:\'body\'}" data-drag=true> <div class=md-list-item-text> Volume {{item.volumeNumber}} ({{item.publicationInfo.date.description}}) </div> </md-list-item> </md-list> </md-tab-body> </md-tab> <md-tab ng-if="edition.copies.length > 0"> <md-tab-label> <md-icon>book</md-icon> </md-tab-label> <md-tab-body> <md-list> <md-list-item ng-repeat="item in edition.copies" jqyoui-draggable={animate:false} data-jqyoui-options="{revert:\'invalid\',helper:\'clone\',appendTo:\'body\'}" data-drag=true> <div class=md-list-item-text> {{item.title}} </div> </md-list-item> </md-list> </md-tab-body> </md-tab> </md-tabs> </div> '),
e.put("app/vwise/components/work-panel/volume-panel.html",'<div class=panel-volume flex layout=column> <h1> <span class=authors> <span class=author ng-repeat="author in volume.authors"> {{author.lastName}}. </span> </span> <span class=title>{{title.title}}<span ng-if=title.subtitle>: {{title.subtitle}}</span>.</span> <span class=edition-name>{{edition.editionName}}.</span> <span class=volume-name>Volume {{volume.volumeNumber}}.</span> </h1> <md-tabs flex> <md-tab ng-if=volume.summary> <md-tab-label> <md-icon>subject</md-icon> </md-tab-label> <md-tab-body> <div class=summary ng-bind-html=volume.summary></div> </md-tab-body> </md-tab> <md-tab ng-if="volume.copies.length > 0"> <md-tab-label> <md-icon>book</md-icon> </md-tab-label> <md-tab-body> <md-list> <md-list-item ng-repeat="item in volume.copies" jqyoui-draggable={animate:false} data-jqyoui-options="{revert:\'invalid\',helper:\'clone\',appendTo:\'body\'}" data-drag=true> <div class=md-list-item-text> {{item.title}} </div> </md-list-item> </md-list> </md-tab-body> </md-tab> </md-tabs> </div> '),e.put("app/vwise/components/work-panel/work-panel.html",'<div class=panel-work flex layout=column> <h1> <span class=panel-label> <span class=authors> <span class=author ng-repeat="author in work.authors"> {{author.lastName}}. </span> </span> <span class=title>{{title.title}}<span ng-if=title.subtitle>: {{title.subtitle}}</span>.</span> </span> </h1> <md-tabs flex> <md-tab ng-if=work.summary> <md-tab-label> <md-icon>subject</md-icon> </md-tab-label> <md-tab-body> <div class=summary ng-bind-html=work.summary></div> </md-tab-body> </md-tab> <md-tab> <md-tab-label> <md-icon>link</md-icon> </md-tab-label> <md-tab-body> <div ng-repeat="group in relationships"> <h3 style="margin-bottom: 0">{{group.label}}</h3> <md-list> <div ng-repeat="relationship in group.relationships"> <md-list-item ng-repeat="item in relationship.anchors" jqyoui-draggable={animate:false} data-jqyoui-options="{revert:\'invalid\',helper:\'clone\',appendTo:\'body\'}" data-drag=true> <div class=md-list-item-text ng-bind-html=item.label></div> </md-list-item> </div> </md-list> </div> </md-tab-body> </md-tab> <md-tab ng-if="work.editions.length > 0"> <md-tab-label> <md-icon>content_copy</md-icon> </md-tab-label> <md-tab-body> <md-list> <md-list-item ng-repeat="item in work.editions | orderBy:\'publicationInfo.date.calendar\'" jqyoui-draggable={animate:false} data-jqyoui-options="{revert:\'invalid\',helper:\'clone\',appendTo:\'body\'}" data-drag=true> <div class=md-list-item-text> {{item.editionName}} ({{item.publicationInfo.date.description}}) </div> </md-list-item> </md-list> </md-tab-body> </md-tab> <md-tab ng-if="work.copies.length > 0"> <md-tab-label> <md-icon>book</md-icon> </md-tab-label> <md-tab-body> <md-list> <md-list-item ng-repeat="item in work.copies" jqyoui-draggable={animate:false} data-jqyoui-options="{revert:\'invalid\',helper:\'clone\',appendTo:\'body\'}" data-drag=true> <div class=md-list-item-text> {{item.title}} </div> </md-list-item> </md-list> </md-tab-body> </md-tab> </md-tabs> </div> '),e.put("app/vwise/components/workspace/workspace.html",'<div flex jqyoui-droppable="{stack: true, onDrop:\'vm.thingDropped()\'}" data-drop=true class=workspace ng-click=vm.workspaceClicked($event)> <vwise-panel ng-repeat="panel in workspace.panels track by panel.id" panel=panel></vwise-panel> </div> ')}]);