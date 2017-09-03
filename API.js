'use strict';
var API = function(server,database,$http){
	
    this.server = server;
    this.database = database;
	
	if($http){
		this.request = $http;
	}else{
		if (!$) {
		  throw new Error('API requires jQuery')
		}
		this.request = {};
		this.request.get = function(url,headers){
			var result =function(resCallback,errorCallback){
				
				$.get(url,headers)
				  .done(function(data) {
					  
						resCallback({data:data});
				  })
				  .fail(function(error) {
					   
						errorCallback({data:error});
				  })
			}
			return {then:result};
		}
	}
    
    
}
API.prototype.getToken = function(username,password,callback){
    var self = this;
    var url =  this.server + this.database + "/gettoken/nodejs?username=" + username + "&password=" + password;
    this.request.get(url).then(function(res){
		 
        var body = res.data;
		
        if(body.indexOf("ERROR")>=0){
            return callback(body);
        }
		 
		 try{
			 body = eval("(" + body + ")");
		 }catch(e){
			 
		 }
		
        self.token = body;
		self.username = username;
		
        callback(null,body);
    },function(error){
        callback(error.data||"Không thể kết nối với máy chủ");
    });
}
API.prototype.logout = function(token,callback){
    if(!this.token) return alert("Bạn phải đăng nhập chương trình trước khi sử dụng API này");

    var url =  this.server + this.database + "/logout?token=" + this.token;
    this.request.get(url).then(function(res){
        var body = res.data;
        if(body.indexOf("ERROR")>=0){
            return callback(body);
        }
        callback(null,body);
    },function(error){
        callback(error.data||"Không thể kết nối với máy chủ");
    });
}
API.prototype.list = function(id_list,query,callback){
    if(!this.token) return alert("Bạn phải đăng nhập chương trình trước khi sử dụng API này");
    var url = this.server + this.database + "/list/" + id_list + "?token=" + this.token;
    var v_q;
    for(var q in query){
        if(q!=="access_token"){
            v_q = query[q];
            if(v_q==true || v_q=="true"){
                v_q ="1"
            }
            if(v_q==false || v_q=="false"){
                v_q=="0"
            }
			
            url = url + "&" + q + "=" + encodeURI(v_q);
        }

    }
    this.request.get(url).then(function(res){
        var body = res.data;
        if(body.indexOf("ERROR")>=0){
            return callback(body);
        }
        try{
            body = JSON.parse(body);
            callback(null,body);
        } catch(e){
           callback(e);
        }

    },function(error){
        callback(error.data||"Không kết nối được với máy chủ");
    });
}
API.prototype.report = function(id_rpt,query,callback,stt){
    if(!this.token) return alert("Bạn phải đăng nhập chương trình trước khi sử dụng API này");

    if(!stt && stt!==0) stt = '1';

    var url = this.server + this.database + "/report/" + id_rpt + "/" + stt +  "?token=" + this.token;
    var v_q;
    for(var q in query){
        if(q!=="access_token" && query[q]){
            v_q = query[q];
            if(v_q==true || v_q=="true"){
                v_q ="1"
            }
            if(v_q==false || v_q=="false"){
                v_q=="0"
            }
			if(typeof v_q.getFullYear==='function'){
				v_q = (v_q.getFullYear().toString() + "-" + (v_q.getMonth()+1).toString() + '-' + v_q.getDate().toString());
			}
            url = url + "&" + q + "=" + encodeURI(v_q);
        }

    }
	
    this.request.get(url).then(function(res){
        var body = res.data;
        if(body.indexOf("ERROR")>=0){
            return callback(body);
        }
        try{
            body = JSON.parse(body);
            callback(null,body);
        } catch(e){
            callback(e);
        }

    },function(error){
        callback(error.data||"Không thể kết nối với máy chủ");
    });
}
API.prototype.voucher = function(voucherid,query,callback){
    if(!this.token) return alert("Bạn phải đăng nhập chương trình trước khi sử dụng API này");

    var url = this.server + this.database + "/voucher/" + voucherid +"?token=" + this.token;
    var v_q;
    for(var q in query){
        if(q!=="access_token"){
            v_q = query[q];
            if(v_q==true || v_q=="true"){
                v_q ="1"
            }
            if(v_q==false || v_q=="false"){
                v_q=="0"
            }
            url = url + "&" + q + "=" + encodeURI(v_q);
        }

    }

    this.request.get(url).then(function(res){
        var body = res.data;
        if(body.indexOf("ERROR")>=0){
            return callback(body);
        }
        try{
            body = JSON.parse(body);
            callback(null,body);
        } catch(e){
            callback(e);
        }
    },function(error){
        callback(error.data||"Không thể kết nối với máy chủ");
    });
}
API.prototype.updateVoucher =  function(voucherid,stt_rec,query,callback){
    if(!this.token) return alert("Bạn phải đăng nhập chương trình trước khi sử dụng API này");
    var url = this.server + this.database + "/voucher/" + voucherid +"/update/" + stt_rec + "?token=" + this.token;
    var  v_q;
    for(var q in query){
        if(q!=="access_token"){
            v_q = query[q];
            url = url + "&" + q + "=" + encodeURI(v_q);
        }

    }
    this.request.get(url).then(function(res){
        var body = res.body;

        if(body.indexOf("ERROR")>=0){
            return callback(body);
        }
        try{
            body = JSON.parse(body);
            callback(null,body);
        } catch(e){
           callback(e||"Không thể kết nối với máy chủ")
        }
    },function(error){
        callback(error.data||"Không thể kết nối với máy chủ");
    });
}