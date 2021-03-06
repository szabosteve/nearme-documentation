const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackRequireFrom = require('webpack-require-from');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const BUILD_DIR = path.join(__dirname, process.env.npm_package_config_build_dir);

const production = process.env.NODE_ENV === 'production';

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[name].css'
  }),
  new WebpackRequireFrom({
    variableName: 'window.__CONTEXT__.cdnUrl'
  })
];

const config = {
  entry: {
    app: './src/app',
    raven: './src/raven',
    critical: './src/critical',
    webfonts: './src/webfonts'
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash:3].js',
    publicPath: '',
    path: BUILD_DIR
  },
  bail: true,
  stats: {
    modules: false,
    hash: false,
    assetsSort: '!size',
    children: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?retainLines=true&cacheDirectory'
      },
      {
        test: /(\.css|\.scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader?url=false', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.gif$/,
        use: ['file-loader?name=[name].gif']
      },
      {
        test: /\.(eot|ttf|otf|svg|woff(2))?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          warnings: false,
          parse: {},
          compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
          },
          mangle: true,
          output: {
            comments: false
          },
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false
        }
      })
    ]
  },
  plugins: plugins,
  mode: production ? 'production' : 'development'
};

module.exports = config;
