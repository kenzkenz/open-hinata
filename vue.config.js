const webpack = require('webpack');

module.exports = {
  //  ビルドしたときのパス 空文字にして相対パスにする。
  publicPath: process.env.NODE_ENV === 'production' ? '' : '',
}
