
$(function(){
	
	var utils = garen_require("utils");
	var mainBody = $("body");
	
	function test1(){
		$.getJSON("http://192.168.1.102:8080/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=?", function(data){
		  $.each(data.items, function(i,item){
		    $("<img/>").attr("src", item.media.m).appendTo("#images");
		    if ( i == 3 ) return false;
		  });
		});
	}
	
	function test2(){
		$.getJSON("http://192.168.1.102:8080/consumeweb/test2.jsp?tags=cat&tagmode=any&format=json&jsoncallback=?",
		  function(data){
			$.print(data);
		  }
	    );
	}
	
	var ui = {
		eName:"div",
		cssStyle:"border:1px solid red;" +
				"height:200px;padding:10px;width:60%;margin:auto;" ,
		elements:{
			eName:"linkbutton",
			text:"测试",
			onClick:function(){
				$.print($.jsonp);
				//test2();
			}
		}
	}
	
	mainBody.createUI(ui);
});