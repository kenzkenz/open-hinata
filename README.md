# open-hinata
ol5+vueで作成したオープン版の「ひなたGIS」です。「ひなたGIS」の作者が作っています
# Demo
[・初期時](https://kenzkenz.xsrv.jp/open-hinata/)
[・２画面](https://kenzkenz.xsrv.jp/open-hinata/#6/139.02448/37.77939%3FS%3D2%26L%3D%5B%5B%7B%22id%22%3A1%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A4%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%5D%5D)
[・４画面](https://kenzkenz.xsrv.jp/open-hinata/?fbclid=IwAR0io3P1uDwh0w_qLnJ5ad5RkQaXfsecJ5l0Ks7pYeaejuDyMexiFFqxeD4#5/139.40309/38.13596%3FS%3D3%26L%3D%5B%5B%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A%22zenkokusaisin%22%2C%22ck%22%3Atrue%2C%22o%22%3A1%7D%2C%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A%22kotizu00%22%2C%22ck%22%3Atrue%2C%22o%22%3A1%7D%2C%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A4%2C%22m%22%3Atrue%2C%22ck%22%3Atrue%2C%22o%22%3A1%7D%2C%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%5D)
[・５万分の１旧版地形図](https://kenzkenz.xsrv.jp/open-hinata/#9/131.11275/32.72855%3FS%3D1%26L%3D%5B%5B%7B%22id%22%3A%22mw5%22%2C%22o%22%3A1%7D%2C%7B%22id%22%3A1%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A4%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%5D%5D)
[・海面上昇シミュレーション](https://kenzkenz.xsrv.jp/open-hinata/#12/131.46822/32.09212%3FS%3D1%26L%3D%5B%5B%7B%22id%22%3A%22flood10m%22%2C%22o%22%3A1%2C%22c%22%3A%7B%22name%22%3A%22flood10m%22%2C%22values%22%3A%5B5.5%2C100%5D%7D%7D%2C%7B%22id%22%3A1%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A4%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%5D%5D)


# Dependencies
地図ライブラリはol5を使用。フレームワークにvue+vuexを使用しています。vue CLI 3で開発、ビルドしています。

# Usage
ダウンロードしたファイル群を保存したディレクトリで下記のコマンドを実行して必要モジュールをインストールしてください。
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

