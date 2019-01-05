# open-hinata
ol5+vueで作成したオープン版の「ひなたGIS」です。「ひなたGIS」の作者が作っています。
# Demo
[・初期時](https://kenzkenz.xsrv.jp/aaa/)
[・２画面](http://bit.ly/2BPJGuQ)
[・３画面](http://bit.ly/2BNnb9I)
[・４画面](http://bit.ly/2QWvfiS)
[・５万分の１旧版地形図](http://bit.ly/2BNnSjk)
[・海面上昇シミュレーション](http://bit.ly/2BRjzDL)


# Dependencies
地図ライブラリはol5を使用。フレームワークにvue+vuexを使用しています。vue CLI 3で開発、ビルドしています。
# Usage
vue CLI 3を最初にインストールしてください。vue CLI 3がインストールされたらダウンロードしたファイル群を保存したディレクトリで下記のコマンドを実行して必要モジュールをインストールしてください。
```
npm i
```
必要モジュールがインストールされたら次のコマンドで開発サーバーが立ち上がります。立ち上がったらブラウザで[http://localhost:8080](http://localhost:8080)を表示してください。
```
npm run serve
```
次のコマンドでビルドします。なお、js/layers.jsに追記することによりレイヤーを追加することができます。
```
npm run build
```
# Authors
ken ochiai

# 説明
## 変数
vuexを使用しています。
複数のコンポーネントから参照する可能性のある変数はstore(vuex)に設置しています。
自コンポーネントだけで済む変数は極力コンポーネントに置いています。
## 起動時の処理
App.vueのmountedに一連の処理を置いています。
## レイヤー追加の処理
レイヤーリスト下段をクリックするとstoreにあるlayerListsにレイヤーの情報を追加します。追加されるとLayer.vueのmountedに仕掛けているwatchが動作してOLのレイヤーを操作します。

