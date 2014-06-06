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
					+"<ul><li>"+ data[0][0] +"</li></ul>"
				+"</li>"
				+"<li>変換候補"
					+"<ul><li>"+ data[0][1] +"</li></ul>"
				+"</li>"
			+"</ul>");
	}
});