importScripts('serviceworker-cache-polyfill.js');
var CACHE_VERSION = 'v3.32';
var CACHE_FILES = [
    'images/favicon.ico',
    'images/avatar.jpg',
    
    'libs/font-awesome/css/font-awesome.min.css',
    'libs/bootstrap/dist/css/bootstrap.min.css',
    
    //'css/main.css',
    'libs/jquery/dist/jquery.min.js',
    'libs/bootstrap/dist/js/bootstrap.min.js',
    'libs/angular/angular.min.js',
    'libs/angular-locale_vi-vn.js',
    'libs/angular-cookies/angular-cookies.min.js',
    'libs/angular-route/angular-route.min.js',
   
  
    'libs/underscore/underscore-min.js',
    'libs/async/dist/async.min.js',

    'libs/moment/min/moment-with-locales.min.js',
    'libs/webshim/js-webshim/minified/polyfiller.js',

   
    
    //'configs.js'
    
];

function getEndpoint() {
  return self.registration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.endpoint;
    }

    throw new Error('User not subscribed');
  });
}
self.addEventListener('install', function(event) {
  event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(function (cache) {
                return cache.addAll(CACHE_FILES);
            })
  );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function(res){
            return res || fetch(event.request.clone());
        })
    )
});
self.addEventListener('activate', function(event) {
  
});
self.addEventListener('push', function(event) {
  
  getEndpoint().then(function(endpoint){
      return fetch('/public/payload?ep=' + endpoint);
  }).then(function(res){
      return res.text();
  }).then(function(payload){
      var _ids ={};
      var payloads = JSON.parse(payload);
      payloads.forEach(function(pl){
         var data = JSON.parse(pl.payload);
         if(data._id){
             if(_ids[data._id]) return;
             _ids[data._id] = true;
         }
         //url
         if(data.action){
             data.action = data.action.toLowerCase();
             if(data.action=='update' || data.action =='new'){
                 data.action ="edit";
             }
         }else{
             data.action ='edit';
         }
         
         if(data.code){
             //only show notification if status of pbl equal 0
             if(data.code.toLowerCase()==="pbl" && data.trang_thai!==0){
                 return;
             }
             //create url
             data.url ="/" + data.code.toLowerCase();
             if(data.code.toLowerCase()==="message" && data.sender){
                 data.url =data.url + "/chat/" + data.sender;
             }else{
                 if(data._id){
                     data.url =data.url +  "/" + data.action + "/" + data._id;
                 }else{
					 data.url =data.url +  "/" + data.action
				 }
             }
         }else{
             data.url ="/";
         }
         //title
         var title = data.title;  
         if(!title){
             title ="STP Enterprise";
         }
         //body
         var body =data.body;
         var notificationOptions = {
            body:body,
            icon: '/images/icon/256x256.png',
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            data:data
         };
         //show           
         self.registration.showNotification(title, notificationOptions)          
      })
  }) 
});
self.addEventListener('notificationclick', function(event) {
 if(!event.notification.data){
     event.notification.data ={};
 }
 var url =event.notification.data.url;
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (url &&  'focus' in client){
         client.focus();
         client.navigate('/#!' + url);
         return;
      }  
    }
    if(!url){
        url ="/";
    }else{
        url ="/#!" + url;
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});