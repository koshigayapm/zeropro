$(function(){

	$("#convert_btn").click(function(){
		do_ajax();
	});

	function do_ajax(){
		var keyword = $("#keyword_input").val();
		$.ajax({
			type: "GET",
			url: "http://www.google.com/transliterate?jsonp=?",
			dataType: "jsonp",
			data: {
				langpair: "ja-Hira|ja",
				text: keyword
			},
			success: function(data){
				console.log(data);
				$("#result_ul").remove();
				show_result(data);
			},
			error: function(){
				alert("失敗しました。");
			}
		});
	}

	function show_result(data){
		$("#form_area").after("<ul id='result_ul'>"
				+"<li>元の文字列"
					+"<ul><li id='original_sentence'></li></ul>"
				+"</li>"
				+"<li>変換候補"
					+"<ul><li id='supposed_sentence'></li></ul>"
				+"</li>"
			+"</ul>");
		for(var i=0; i<data.length; i++){
			$("#original_sentence").append(data[i][0]);
			$("#supposed_sentence").append("<select id='select_"+ (i + 1) +"'></select>");
			for(var c=0; c<data[i][1].length; c++){
				$("#select_"+ (i + 1) +"").append("<option id='option_"+ (i + 1) +"'>"+ data[i][1][c] +"</option>");
				// console.log(data[i][1]);
			}
		}
	}

});