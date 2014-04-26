1. Apacheをインストールする
2. Apacheを起動する
		
		$sudo appachectrl start
		
		(OSによって違う)
3. Webアプリを作るディレクトリを決める
4. CGIを使えるようにする
	
	
		AddHandler cgi-script .cgi
		O
	








CGIの設定をして、test.cgiをSiteディレクトリに作成し、アクセスして実行できるか確認。

	#test.cgi
	-----
	
	#!/usr/bin/perl
	
	use CGI qw/:standard/;
	
	print header();
	print h1("hello world");

