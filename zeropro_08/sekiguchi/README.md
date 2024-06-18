#Google日本語入力のapiを使う

##ひらがなを変換する

###APIドキュメント
* Google CGI API for Japanese Input
<http://www.google.co.jp/ime/cgiapi.html>

###サンプルレスポンス

	[
	  ["ここでは",
	    ["ここでは", "個々では", "此処では"],
	  ],
	  ["きものを",
	    ["着物を", "きものを", "キモノを"],
	  ],
	  ["ぬぐ",
	    ["脱ぐ", "ぬぐ", "ヌグ"],
	  ],
	]

###html作成
	#hiragana.html
	
	<!DOCTYPE html>
		<html lang="ja">
		<head>
			<meta charset="utf8">
			<title>jQueryのajaxを使ったデモ1</title>
			
			<script type="text/javascript" src="hiragana.js"></script>
			<style type="text/css">
				#container{margin: 10px;}
			</style>
		</head>
		<body>
			<div id="container">
				<h3>Google日本語入力のapiを使って、ひらがなを変換する</h3>
				<h4>ひらがなを入力して下さい。</h4>
				<form id="form_area">
					<input type="text" id="keyword_input">
					<input type="button" id="convert_btn" value="変換">
				</form>
			</div>
		</body>
	</html>

###js作成

1. ajaxを書く	
		
		#hiragana.js
		
		$(function(){
			$.ajax({
				type: "GET",
				url: "http://www.google.com/transliterate?jsonp=?",
				dataType: "jsonp",
				data: {
					langpair: "ja-Hira|ja",
					text: "ろくがつなのか"
				},
				success: function(data){
					console.log(data);
				},
				error: function(){
					alert("失敗しました。");
				}
			});
		});
 

2. ボタンクリック時のイベントにする
	
		$("#convert_btn").click(function(){
			$.ajax({
				type: "GET",
				url: "http://www.google.com/transliterate?jsonp=?",
				dataType: "jsonp",
				data: {
					langpair: "ja-Hira|ja",
					text: "ろくがつなのか"
				},
				success: function(data){
					console.log(data);
				},
				error: function(){
					alert("失敗しました。");
				}
			});
		});
		
3. inputに入力した言葉を変換
	
		$("#convert_btn").click(function(){
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
				},
				error: function(){
					alert("失敗しました。");
				}
			});
		});

4. 結果をlistで表示
	
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
		
	この関数をsuccess内で実行
	
5. 2回目以降のための処理
	
	2回以上実行すると、以前の結果が残っているので、removeを使って前回の結果を消す。
	
		success: function(data){
					$("#result_ul").remove();
					show_result(data);
				},
	
6. ajaxを関数化

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
			

#####最終的なコード
	#hiragana.js

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

#####参考
上記のコードだと、一番最初の文節しか変換出来ないので、文章が変換できない。

以下の様に変更

	#hiragana.html
	#cssを追加
	
	#keyword_input{width: 400px;}
	

jsは変換候補をselectタグで表示するようにする。
	
	#hiragana_senetence.js

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

	

##郵便番号から住所を検索する

###html作成
	#zipcode.html
	
	<!DOCTYPE html>
		<html lang="ja">
		<head>
			<meta charset="utf8">
			<title>jQueryのajaxを使ったデモ2</title>
			
			<script type="text/javascript" src="zipcode.js"></script>
			<style type="text/css">
				#container{margin: 10px;}
				.input{width: 50px;}
			</style>
		</head>
		<body>
			<div id="container">
				<h3>Google日本語入力のapiを使って、郵便番号から住所を検索</h3>
				<h4>郵便番号を入力して下さい。（※半角）</h4>
				<form id="form_area">
					<input type="text" id="zipcode_input1" class="input">
					<span>-</span>
					<input type="text" id="zipcode_input2" class="input">
					<input type="button" id="convert_btn" value="検索">
				</form>
			</div>
		</body>
	</html>

###js作成
ひらがなの変換の時とajaxの基礎の部分は同じ。

今回はinputを2つにしたので、2つのinputに入力された値を繋げる必要がある。

また、郵便番号の前半と後半をハイフン「-」で繋ぐ必要あり。
	
	#zipcode.js
	
	$(function(){	
		$("#convert_btn").click(function(){
			do_ajax();
		});
	
		function do_ajax(){
			var zipcode = $("#zipcode_input1").val() + "-" +$("#zipcode_input2").val();
			console.log(zipcode);
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

いちいちtabとかでinputを移動するのが面倒なので、1つ目のinputに数字が3つ入ったら、2つ目のinputに移動するようにする。

同様にinputの2つ目に数字が4つ埋まったら、実行するようにする。

	function count_length(){
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
この関数を、clickイベントの外で実行すると、以下の様な結果が返ってくる。（343-0046と打った場合）

	埼玉県越谷市弥栄町,343-0046　埼玉県越谷市弥栄町,343-0046

今回必要な結果は、住所だけなので、結果の部分を変更

	data[0][1]　から　data[0][1][0]　に変更

###最終的なコード

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
