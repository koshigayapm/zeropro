$(function(){

	$("#convert_btn").click(function(){
		do_ajax();
	});

	move_to_next_input();

	function do_ajax(){
		var zipcode = $("#zipcode_input1").val() + "-" +$("#zipcode_input2").val();
		// console.log(zipcode);
		$.ajax({
			type: "GET",
			url: "http://www.google.com/transliterate?jsonp=?",
			dataType: "jsonp",
			data: {
				langpair: "ja-Hira|ja",
				text: zipcode
			},
			success: function(data){
				// console.log(data);
				$("#result_ul").remove();
				show_result(data);
			},
			error: function(){
				alert("失敗しました。");
			}
		});
	}

	function move_to_next_input(){
		$("#zipcode_input1").keyup(function(){
			var this_length = $(this).val().length;
			// console.log(this_length);
			if(this_length == "3"){
				$("#zipcode_input2").focus();
			}else{
				// 何もしない
			}
		});

		$("#zipcode_input2").keyup(function(){
			var this_length = $(this).val().length;
			// console.log(this_length);
			if(this_length == "4"){
				$("#convert_btn").click();
			}else{
				// 何もしない
			}
		});
	}

	function show_result(data){
		$("#form_area").after("<ul id='result_ul'>"
				+"<li>郵便番号"
					+"<ul><li>"+ data[0][0] +"</li></ul>"
				+"</li>"
				+"<li>住所"
					+"<ul><li>"+ data[0][1][0] +"</li></ul>"
				+"</li>"
			+"</ul>");
	}
});