##■ApacheとPerlとCGIでつくるWebアプリ 
###手順

1. Apacheをインストールする
2. Apacheを起動する
		
		$sudo appachectrl start
		
		(OSによって違う)
3. Webアプリを作るディレクトリを決める
4. CGIを使えるようにする
	
	
		AddHandler cgi-script .cgi
		Options ExecCGI
		
		＊Apacheの再起動必要
5. ファイルに実行権限を与える
	
		chmod 755 test.cgi
		chmod o+x test.cgi
	

###実行
test.cgiをSiteディレクトリに作成し、アクセスして実行できるか確認。

	#test.cgi
	-----
	
	#!/usr/bin/perl
	
	use CGI qw/:standard/;
	
	print header();
	print h1("hello world");
	

ターミナルでtext.cgiを実行すると以下の結果が返ってくる。

	$ perl text.cgi

	#結果
	Content-Type: text/html; charset=ISO-8859-1
	
また、otherに実行権限が無い状態で、以下の方法で実行するとpermission deniedになる。実行権限があれば同じ結果が出る。
	
	$ ./test.cgi 
	
	
CGIのモジュールを使わずに書くことも出来る。
	
	#!/usr/bin/perl

	print "Content-Type: text/html;\n\n";
	print "<h1>".rand()."</h1>";


##■MojoliciousでつくるWebアプリ
* Mojoliciousをインストール

plenvかperlbrewでcpanmを入れている場合は

	$ cpanm Mojolicious

sample.pl作成

	use Mojolicious::Lite;
	# use strict; use warnings;自動
	# get関数、app関数が使える
	
	get '/' => sub {
		# コントローラーオブジェクト
		my $self = shift;
		
		#描画
		$self->render(text => 'hello');
	};
	＃アプリケーション開始
	app->start;

これを書き終わったら、文法が間違ってないかチェック
	
	$ perl -c sample.pl
	
	#結果
	sample.pl syntax OK

次に以下を実行
	
	$ morbo sample.pl 
これをやると、サーバーの起動(3000番ポート)ができ、「http://localhost:3000」でアクセスできる。

getの後ろのシングルクオートにfooを足してみる。

	use Mojolicious::Lite;
	
	get '/foo' => sub {
		my $self = shift;
	
		$self->render(text => 'hello');
	};
	
	app->start;

そうすると、「http://localhost:3000/foo」でアクセスできる。


今はtextで書いてるが、普通のwebページはhtmlで書かれてるのでhtmlで書きたい。

* テンプレートを使う

		use Mojolicious::Lite;
		
		get '/' => sub {
			my $self = shift;
		
			$self->render('index'); #indexはテンプレート名
		};
		
		app->start;
		
		__DATA__
		
		@@ index.html.ep
		Hello template　#ここにテンプレートを書く
	
---

	use Mojolicious::Lite;
	
	get '/:name' => sub {
		my $self = shift;
		# パラメーターの受け取り
		my $name = $self ->param('name');
	
		$self->render('index', name=> $name);
	};
	
	app->start;
	
	__DATA__
	
	@@ index.html.ep
	<%
		my $name = stash('name');
	%>
	
	
	Name: <%= $name %>

こう書くと、「http://localhost:3000/username」でアクセスできる。

---

	use Mojolicious::Lite;
	
	get '/:name' => sub {
		my $self = shift;
		# パラメーターの受け取り
		my $name = $self ->param('name');
		my $animal = $self->param('animal');
	
		$self->render('index', name=> $name, animal=>$animal);
	};
	
	app->start;
	
	__DATA__
	
	@@ index.html.ep
	<%
		my $name = stash('name');
		my $animal = stash('animal');
	
	%>
	
	
	Name: <%= $name %><br>
	Animal: <%= $animal %>

これを書いて、「http://localhost:3000/username?animal=dog」(例えば：http://localhost:3000/WataruSekiguchi?animal=dogとか)でアクセスすると
	
	Name: WataruSekiguchi
	Animal: dog

と表示される。
URLを「http://localhost:3000/username?animal=cat」に変えれば

	Name: WataruSekiguchi
	Animal: cat
と表示される。


---
	
	use Mojolicious::Lite;
	
	get '/:name' => sub {
		my $self = shift;
		# パラメーターの受け取り
		my $name = $self ->param('name');
		my $animal = $self->param('animal');
	
		$self->render('index', name=> $name, animal=>$animal);
	};
	
	app->start;
	
	__DATA__
	
	@@layouts/common.html.ep
	<html>
		<head>
			<title>越谷 ゼロプロ #7 </title>
		</head>
		<body>
			<%= content %>
		</body>
	</html>
	
	@@ index.html.ep
	<%
		my $name = stash('name');
		my $animal = stash('animal');
	%>
	<% layout 'common' ; %>
	<%= include 'include/header' %>
	
	Name: <%= $name %><br>
	Animal: <%= $animal %>
	
	@@ include/header.html.ep
	<h1 style="border-bottom:1px solid gray">越谷 ゼロプロ #7</h1>
	
「http://localhost:3000/username?animal=cat」にアクセス
