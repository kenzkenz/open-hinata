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
## URLにパラメータがないとき、初期起動時の動き
store.jsのlayerListsに従ってレイヤーを作成します。
store.jsのlayerListsはlayers.jsのlayersを参照しています。
## URLにパラメータがあるときの動き
pemalink.jsのpermalinkEventSetが作動して初期設定のレイヤーを削除します。その後にパラメータに従ってレイヤーを作成していきます。
## 起動時にレイヤーリスト下段を作成
起動時にレイヤーリスト下段（背景ダイアログの下段）を作成します。layerListsはlayers.jsのlayersに従ってリストを作っていきます。
## レイヤーリスト下段をクリックしたとき
クリックするとstoreにあるlayerListsにレイヤーの情報を追加します。追加されるとLayer.vueに仕掛けているwatchが動作してOLのレイヤーを操作します。

