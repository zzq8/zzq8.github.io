var sidebarTxt = '- [**README**](/README.md)\n';
var path = require('path');
var curPath = process.cwd(); // 获取当前工作目录
var baseDirArr = [];

function walkSync(currentDirPath, callback) {
  var fs = require('fs'),
    path = require('path');
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isFile()) { // 是文件
      callback(filePath, stat);
    } else if (stat.isDirectory() && !filePath.includes(".git")) { // 是目录但不是.git
      walkSync(filePath, callback);
    }
  });
}

walkSync(curPath, function (filePath, stat) {
  if (".md" == path.extname(filePath).toLowerCase() &&
    "_" != path.basename(filePath).substr(0, 1) &&
    path.basename(filePath).includes(`.md`)) {

    var relativeFilePath = filePath.substr(curPath.length + 1);
    if (relativeFilePath == path.basename(filePath)) {
      return;
    }
    var relativeFilePathArr = relativeFilePath.split('/');

    for (var i = 0; i < relativeFilePathArr.length; i++) {
      if (baseDirArr[i] == relativeFilePathArr[i]) {
        continue;
      }
      baseDirArr[i] = relativeFilePathArr[i];
      for (var j = 0; j < i; j++) {
        sidebarTxt += '  ';
      }
      if (i != relativeFilePathArr.length - 1) {
        sidebarTxt += '- **' + relativeFilePathArr[i] + '**\n';
      }
      if (i == relativeFilePathArr.length - 1) {
        sidebarTxt += '- [' + path.basename(relativeFilePathArr[i], ".md") + '](/' + relativeFilePath + ')\n';
      }
    }
  }
});

var fs = require('fs');

console.log(sidebarTxt);
fs.writeFile(path.resolve(curPath, '_sidebar.md'), sidebarTxt, function (err) {
  if (err) {
    console.error(err);
  }
});