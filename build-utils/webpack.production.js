/**
 * For production bundle analysis, additionally consider these tools:
 * - https://github.com/samccone/bundle-buddy
 * - https://github.com/danvk/source-map-explorer
 * Also see: https://survivejs.com/webpack/optimizing/build-analysis/
 */

/* eslint-disable import/no-extraneous-dependencies */
const { exec } = require('child_process');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ModuleNomodulePlugin = require('webpack-module-nomodule-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// `webpack-manifest-plugin` is currently abandoned, use `webpack-assets-manifest` instead
// const ManifestPlugin = require('webpack-manifest-plugin');
const AssetsManifest = require('webpack-assets-manifest');
const settings = require('./settings');

const jsSrc = path.normalize(settings.paths.src.js);
const jsDist = path.normalize(settings.paths.dist.js);
const cssSrc = path.normalize(settings.paths.src.css);
const cssDist = path.normalize(settings.paths.dist.css);
const assetsSrc = path.normalize(settings.paths.src.assets);
const imgSrc = path.normalize(settings.paths.src.img);
const imgDist = path.normalize(settings.paths.dist.img);

// eslint-disable-next-line no-unused-vars
module.exports = (env, options) => ({
  output: {
    filename: `${jsDist}/[name].[chunkhash:8].${options.buildType}.bundle.js`,
    chunkFilename: `${jsDist}/[name].[chunkhash:8].${options.buildType}.chunk.js`,
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path
                .normalize(settings.paths.dist.css)
                .split(path.sep)
                .reduce((accumulator, val) => {
                  return /\w+/.test(val) ? `${accumulator}../` : accumulator;
                }, ''),
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'expanded',
              },
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  optimization: {
    minimizer:
      options.buildType === 'legacy'
        ? undefined
        : [
            new TerserPlugin({
              cache: true,
              parallel: true,
              sourceMap: true,
              terserOptions: {
                ecma: 8,
                safari10: true,
              },
            }),
          ],
  },
  plugins: [
    new ModuleNomodulePlugin(options.buildType, 'minimal'),
    // note that MiniCssExtractPlugin emits empty js chunk into the build
    // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/151
    // https://github.com/webpack/webpack/issues/7300
    // also see #2 in the README.md
    new FixStyleOnlyEntriesPlugin({
      extensions: ['less', 'scss', 'css', 'css.js'],
    }),
    new MiniCssExtractPlugin({
      filename: `${cssDist}/[name].[contenthash:8].css`,
    }),
    new CopyWebpackPlugin([
      {
        from: '.',
        ignore: [
          `${jsSrc}/**/*`,
          `${cssSrc}/**/*`,
          `${assetsSrc}/**/*`,
          'partials/**/*',
          `${settings.paths.src.ajax}/**/*`,
          '**/*.html',
        ],
      },
      {
        from: `${imgSrc}/icons`,
        to: `${imgDist}/icons`,
      },
    ]),
    new CssoWebpackPlugin({
      pluginOutputPostfix: 'min',
      restructure: false, // restructuring breaks IE-hack (_:-ms-fullscreen)
    }),
    // To allow higher values for `hashDigestLength` — setup HashedModuleIdsPlugin directly
    // instead of `optimization.moduleIds`
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'md4',
      hashDigest: 'base64',
      hashDigestLength: 8,
    }),
    // https://github.com/Klathmon/imagemin-webpack-plugin
    new ImageminPlugin({
      gifsicle: {},
      svgo: {
        plugins: [
          {
            removeViewBox: false,
          },
        ],
      },
      pngquant: {},
      plugins: [
        imageminMozjpeg({
          quality: 80,
          progressive: true,
        }),
      ],
    }),
    new StyleLintPlugin({
      syntax: 'scss',
      files: [
        `${cssSrc}/*.css`,
        `${cssSrc}/*.scss`,
        `!${cssSrc}/vendor`,
        `!${cssSrc}/vendor/**`,
        `!./node_modules`,
        `!./node_modules/**`,
      ],
    }),
    new AssetsManifest(),
  ],
});
