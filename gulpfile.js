const { src, dest, watch, series, parallel } = require('gulp');
const connect = require('gulp-connect');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat')
const fs = require("fs");
const path = require("path");
const c = require('child_process');

function miniCss(){
  deleteFile('./magic.min.css');
  deleteFile('./demo/magic.min.css');

  return src('./src/*.css')
    .pipe(cleanCSS())
    .pipe(concat('magic.min.css'))
    .pipe(dest('./'))
    .pipe(dest('./demo/'))
    .pipe(connect.reload())
}
function miniHtml(){
  deleteFile('./demo/index.html');
  return src('./src/index.html')
    .pipe(dest('./demo/'))
    .pipe(connect.reload())
}
function dev(){
  connect.server({
    name: 'dev App',      
    root: 'demo/',
    port: '8080',
    livereload: true,
    host: '::',
  });
  setTimeout(open, 1000);
}
function watchAll() {
  watch(['src/index.html'], miniHtml)
  watch(['src/*.css'] ,miniCss)
}

function open(){
  let IPAdd = getIPAddress();
  let url =`http://${IPAdd}:8080`;
  // 拿到当前系统的参数
  console.log(process.platform, url)
  switch (process.platform) {
    //mac系统使用 一下命令打开url在浏览器
    case "darwin":
      c.exec(`open ${url}`);
    //win系统使用 一下命令打开url在浏览器
    case "win32":
      c.exec(`start ${url}`);
    // 默认mac系统
    default:
      c.exec(`open ${url}`);
  }

}
//获取主机地址
function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

function deleteFile(delPath, direct) {
  delPath = direct ? delPath : path.join(__dirname, delPath)
  try {
    /**
     * @des 判断文件或文件夹是否存在
     */
    if (fs.existsSync(delPath)) {
      fs.unlinkSync(delPath);
    } else {
      console.log('inexistence path：', delPath);
    }
  } catch (error) {
    console.log('del error', error);
  }
}
exports.dev = parallel(dev, watchAll);
exports.default = miniCss;