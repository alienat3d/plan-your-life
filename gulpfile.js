const { src, dest, series, watch } = require("gulp");
const del = require("del"),
  sass = require("gulp-dart-sass"),
  squoosh = require("gulp-squoosh"),
  uglify = require("gulp-uglify-es").default,
  cleanCSS = require("gulp-clean-css"),
  include = require("gulp-file-include"),
  webpAvifHTML = require("gulp-avif-webp-html"),
  svgstore = require("gulp-svgstore"),
  svgmin = require("gulp-svgmin"),
  rename = require("gulp-rename"),
  cachebust = require("gulp-cache-bust"),
  sync = require("browser-sync").create(),
  webpackStream = require("webpack-stream"),
  gulpHtmlBemValidator = require("gulp-html-bem-validator"),
  sourcemaps = require("gulp-sourcemaps"),
  autoprefixer = require("gulp-autoprefixer"),
  fonter = require("gulp-fonter"),
  ttf2woff2 = require("gulp-ttf2woff2"),
  gulpIf = require("gulp-if");

const sourceFolder = "app"; //папка куда собираем все исходники проекта (html, scss, js, img и т.п.)
const buildFolder = "docs"; //папка куда собирается проект (указываем docs, если нужен gitHubPage, дополнительно нужно указать в настройках gitHub)

function html() {
  return (
    src(sourceFolder + "/html/**/*.html")
      .pipe(include())
      // .pipe(gulpHtmlBemValidator())
      .pipe(cachebust({ type: "timestamp" }))
      .pipe(dest(buildFolder))
  );
}

function productionHtml() {
  return src(sourceFolder + "/html/**/*.html")
    .pipe(include())
    .pipe(webpAvifHTML())
    .pipe(cachebust({ type: "timestamp" }))
    .pipe(dest(buildFolder));
}

function bem() {
  return src(sourceFolder + "/html/**/*.html")
    .pipe(gulpHtmlBemValidator())
    .pipe(dest(buildFolder));
}

function svg() {
  return src(sourceFolder + "/img/**/*.svg")
    .pipe(svgmin())
    .pipe(dest(buildFolder + "/img"));
}

function sprite() {
  return src(sourceFolder + "/img/icons/**/*.svg")
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(dest(buildFolder + "/img/icons"));
}

function scss() {
  return src(sourceFolder + "/scss/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS({ level: 2 }))
    .pipe(rename("main.min.css"))
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(buildFolder + "/css"));
}

function js() {
  return src(sourceFolder + "/js/main.js")
    .pipe(sourcemaps.init())
    .pipe(
      webpackStream({
        mode: "none",
        // mode: "production",
        output: {
          filename: "main.min.js",
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [["@babel/preset-env", { targets: "defaults" }]],
                },
              },
            },
            {
              test: /\.css$/,
              use: ["style-loader", "css-loader"],
            },
            {
              test: /\.(gif|png|jpe?g|svg|ico)$/i,
              type: "asset/resource",
              generator: {
                filename: "img/[name][ext]", // Put assets in an images folder
              },
            },
          ],
        },
      })
    )
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest(buildFolder + "/js"));
}

function img() {
  return src(sourceFolder + "/img/**/*.{png,jpg,webp,svg}")
    .pipe(
      gulpIf(
        (file) => file.extname !== ".svg", // If it's NOT an SVG...
        squoosh(() => ({
          // ...then run squoosh
          encodeOptions: {
            webp: {},
            avif: {},
          },
        }))
      )
    )
    .pipe(dest(buildFolder + "/img"));
}

function convertFonts() {
  return src(sourceFolder + "/fonts/src/*.*")
    .pipe(fonter({ formats: ["woff", "ttf"] }))
    .pipe(src(sourceFolder + "/fonts/*.ttf"))
    .pipe(ttf2woff2())
    .pipe(dest(sourceFolder + "/fonts"));
}

function fonts() {
  return src(sourceFolder + "/fonts/*.*").pipe(dest(buildFolder + "/fonts"));
}

function misc() {
  return src(sourceFolder + "/misc/**/*.*")
    .pipe(cachebust({ type: "timestamp" }))
    .pipe(dest(buildFolder));
}

function clear() {
  return del(buildFolder);
}

function clearBlocksDir() {
  return del(buildFolder + "/blocks");
}

function serve() {
  sync.init({
    port: 3010,
    reloadOnRestart: true,
    open: false,
    server: {
      baseDir: buildFolder,
      directory: false, // чтобы загружался сразу index.html поменять на "false"
    },
    notify: false, // чтобы всплывало сообщение об обновлении браузера поменять на "true"
  });

  watch(sourceFolder + "/html/**/*.html", series(html)).on(
    "change",
    sync.reload
  );
  watch(sourceFolder + "/scss/**/*.scss", series(scss, html)).on(
    "change",
    sync.reload
  );
  watch(sourceFolder + "/js/**/*.js", series(js)).on("change", sync.reload);
  watch(sourceFolder + "/img/**/*", series(img)).on("change", sync.reload);
  watch(sourceFolder + "/img/**/*", series(svg)).on("change", sync.reload);
  watch(sourceFolder + "/img/icons/**/*", series(sprite)).on(
    "change",
    sync.reload
  );
  watch(sourceFolder + "/fonts/**/*", series(fonts)).on("change", sync.reload);
  watch(sourceFolder + "/misc/**/*", series(misc)).on("change", sync.reload);
}

exports.build = series(
  clear,
  scss,
  js,
  img,
  svg,
  sprite,
  fonts,
  productionHtml,
  misc,
  clearBlocksDir
);
exports.default = series(
  clear,
  scss,
  js,
  img,
  svg,
  sprite,
  fonts,
  html,
  misc,
  serve
);
exports.fonts = convertFonts;
exports.bem = bem;
exports.clear = clear;

// npx update-browserslist-db@latest => если нужно обновить плагин caniuse-lite
