var api;
var STP ={};
STP.toDate = function(str_date) {
	if(!str_date) return null;
	str_date = str_date.toString();
	if(str_date.split("-").length>=2 || str_date.split("/").length>=2){
		return new Date(str_date);
	}else{
		return null;
	}
}
var accApp = angular.module("accApp",["ui.router",'ui.bootstrap','ngCookies']);
accApp.factory('$localStorage', ['$window','$cookies',function ($window,$cookies) {
	return {
		remove:function(key){
			if($window.localStorage){
				$window.localStorage[key] = "";
			}else{
				$cookies[key] ="";
			}
			
		},
		set:function(key,value){
			if($window.localStorage){
				$window.localStorage[key] = value;
			}else{
				$cookies[key]=value;
			}
			
		},
		get:function(key){
			if($window.localStorage){
				return $window.localStorage[key];
			}else{
				return $cookies[key];
			}
			
		},
		setObject:function(key,obj){
			if($window.localStorage){
				$window.localStorage[key] = JSON.stringify(obj);
			}else{
				$cookies[key]=JSON.stringify(obj);
			}
			
		},
		getObject:function(key,defaultvalue){
            if(!defaultvalue) defaultvalue =[];
            var obj;
			if($window.localStorage){
				obj = $window.localStorage[key];
			}else{
				obj = $cookies[key];
			}
			
            if(!obj) obj = defaultvalue;
			
            if(_.isObject(obj) || _.isArray(obj)){
				
                return obj;
            }else{
                try{
                    var _o =  JSON.parse(obj);
					
					for(var key in _o){
						if(STP.toDate(_o[key])){
							_o[key] = STP.toDate(_o[key]);
						}
					}
					
					return _o;
                }catch(e){
                    console.log("error parse data",obj,e);
					return defaultvalue;
                }
                
            }
            
			
		},
	}
}])
accApp.run(["$http","$rootScope",function($http,$rootScope){
	api = new API(configs.server,configs.database,$http);
}])
accApp.component("login",{
    templateUrl:"templates/login.html",
    controller:["$location","$scope","$rootScope",function($location,$scope,$rootScope){
        var $ctrl = this;
        this.login = function(){
            $ctrl.messageError = "";
            api.getToken($ctrl.data.username,$ctrl.data.password,function(e,token){
                if(e) return $ctrl.messageError = e;
				$location.url("/home");
            })
            
        }
    }]
})
accApp.component("home",{
    templateUrl:"templates/home.html",
    controller:["$scope","$location",function($scope,$location){
		if(!api.token){
			return $location.url("/login");
		}
		var $ctrl = this;
		$ctrl.username = api.username;
		$ctrl.rpts = rpts;
        $ctrl.logout = function(){
			api.username ="";
			api.token="";
			$ctrl.username = "";
            $location.url("/login");
        }
    }]
})
accApp.directive("report",function(){
    return {
        templateUrl:"templates/report.html",
        scope:{
            rpt:'<'
        },
        controllerAs:'$ctrl',
        controller:["$scope","$uibModal","$localStorage",function($scope,$uibModal,$localStorage){
			$scope.show = false;
            $scope.$watch("rpt",function(n,o){
                if(n && !$scope.show){
					$scope.template = "templates/rpts/" + $scope.rpt.id + "/browser.html";
					$scope.show = true;
					if(n.condition && n.condition.drilldown){
						$scope.getData();
					}else{
						var _condition = $localStorage.getObject(api.server + api.database + $scope.rpt.id,{});
						
						for(var key in _condition){
							$scope.rpt.condition[key] = _condition[key];
						}
						$scope.showCondition();
					}
					
				} 
				
            },true)
			$scope.getData = function(){
				$scope.data =[];
				$scope.condition = $scope.rpt.condition;
				api.report($scope.rpt.id,$scope.condition,function(error,data){
					if(error){
						alert(error);
					}else{
						$scope.data = data;
						//save condition
						$localStorage.setObject(api.server + api.database + $scope.rpt.id,$scope.condition);
					}
				})
			}
            $scope.showCondition = function(){
                var modalInstance = $uibModal.open({
                      animation: true,
                      ariaLabelledBy: 'modal-title',
                      ariaDescribedBy: 'modal-body',
                      templateUrl: "templates/rpts/" + $scope.rpt.id + "/condition.html",
                      controller: ["condition","$uibModalInstance",function(condition,$uibModalInstance){
                          this.condition = condition;
                          this.ok = function(){
                              $uibModalInstance.close(this.condition);
                          }
                          this.cancel = function(){
                              $uibModalInstance.dismiss();
                          }

                      }],
                      controllerAs: '$ctrl',
                      size: 'lg',
                      resolve: {
                        condition: function () {
                          return $scope.rpt.condition;
                        }
                      }
                });
                modalInstance.result.then(function (condition) {
					delete condition.drilldown;
					$scope.rpt.condition = condition;
					$scope.getData();
                }, function (error) {
                });
            }
            $scope.export2excel = function(){
                
            }

        }]
    }
})
accApp.config(["$stateProvider",function($stateProvider){
    $stateProvider.state({
        name:'login',
        url:'/login',
        component:'login'
    });
    $stateProvider.state({
        name:'home',
        url:'/home',
        component:"home"
    })
    $stateProvider.state({
        name:'home.report',
        url:'/{reportId}',
		params: { 
			reportId:null,
			query: null,
		  },
        component:"report",
        resolve:{
            rpt:function($stateParams){
				var key,_key,query,f;
				f = rpts.find(function(rpt){
					return rpt.id === $stateParams.reportId;
				})
				if(f){
					if(!f.condition){
						f.condition = {}
					}
					
					for( key in $stateParams){
						if(key!=='reportId' && key!=='#' && $stateParams[key]){
							if(key=="query"){
								query = $stateParams[key];
						
								for(_key in query){
									f.condition[_key] = query[_key];
								}
								
							}else{
								f.condition[key] = $stateParams[key];
							}
						}
					}
				}
				return f;
                
            }
        }
    })
    
    $stateProvider.state({
        name:'default',
        url:'',
        component:"login"
    })
}])