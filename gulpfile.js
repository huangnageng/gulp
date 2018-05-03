var gulp = require("gulp");
var fileinclude = require("gulp-file-include"); //- 拼接页面
var less = require("gulp-less");
var minifyCss = require("gulp-minify-css"); //- 压缩CSS为一行；
var rev = require("gulp-rev"); //- 对文件名加MD5后缀
var revCollector = require("gulp-rev-collector"); //- 路径替换
var babel = require("gulp-babel");

gulp.task("fileinclude", function() {
  gulp
    .src("src/**/*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    .pipe(gulp.dest("dist"));
});
//定义一个Less任务（自定义任务名称）
gulp.task("gulp-less", function() {
  gulp
    .src("src/less/index.less") //该任务针对的文件
    .pipe(less())
    // .pipe(minifyCss())
    // .pipe(rev())
    .pipe(gulp.dest("dist/css")); //将会在src/css下生成index.css
  // .pipe(rev.manifest()) //- 生成一个rev-manifest.json
  // .pipe(gulp.dest("./rev")); //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task("rev", ["gulp-less"], function() {
  gulp
    .src(["rev/rev-manifest.json", "src/less/page.less"]) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    .pipe(revCollector()) //- 执行文件内css名的替换
    .pipe(gulp.dest("./dist/")); //- 替换后的文件输出的目录
});
gulp.task("gulp-img", function() {
  gulp.src("src/**/*.{png,jpg,gif,ico,jpeg}").pipe(gulp.dest("dist"));
});
gulp.task("gulp-js", function() {
  gulp.src("src/js/*.js").pipe(gulp.dest("dist/js"));
});
gulp.task("gulp-font", function() {
  gulp.src("src/**/*.{otf,woff}").pipe(gulp.dest("dist"));
});

gulp.task("gulp-babel", function() {
  return gulp
    .src("src/es6/*.js") // ES6 源码存放的路径
    .pipe(
      babel({
        presets: ["es2015"]
      })
    )
    .pipe(gulp.dest("dist/js")); //转换成 ES5 存放的路径
});

// gulp.task("watch", function() {
//   gulp.watch("src/**/*.*", ["start"]);
// });
gulp.task("start", function() {
  gulp.run(
    "fileinclude",
    "gulp-less",
    "gulp-img",
    "gulp-js",
    "gulp-font",
    "gulp-babel"
    // "watch"
  );
  gulp.run("fileinclude", "gulp-less", "gulp-img");
});
