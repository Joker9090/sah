var watch = require('node-watch');
var fuse = require('fuse');
var fs = require('fs');
var glob = require('glob');
var sass = require('node-sass');

var autoprefixer = require('autoprefixer');
var postcss = require('postcss');
var isWin = process.platform === "win32";

function cleanWinPath(string){
  return string.replace(/\\/g,"/")
}

var AUTOPREFIXER = true;

function checkIfReRunFuse(outputFile){
  fs.readFile(outputFile, 'utf8', function(err, contents) {
    if(typeof contents != "undefined" ){
      if( ( contents.indexOf("@import")  >= 0) || (contents.indexOf("@depends")  >= 0) || (contents.indexOf("@include")  >= 0) ) {
        console.log("[RE FUSE] import in import >"+outputFile);
        runFuse(outputFile,outputFile)
      }else{
          console.log("[MODIFIED] HTML FILE > "+ outputFile);
        return true
      }
    }
  });
}

function runFuse(inputFile,outputFile){
  fuse.fuseFile(inputFile, outputFile, function (err, results) {
    checkIfReRunFuse(outputFile)
  });
}

function start(){
  getDirectories('app/src', function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      for (var i = 0; i < res.length; i++) {
        if(res[i].indexOf('-tocompile') > 0) checkFile(__dirname+'/'+res[i]);
        if(res[i].indexOf('.scss') > 0) checkFileCss(__dirname+'/'+res[i]);
      }
    }
  });

  watch(__dirname+'/app/src', { recursive: true }, function(evt, name) {
    switch (true) {
      case (name.indexOf('-tocompile') > 0 ):
        checkFile(name);
        break;
      case (name.indexOf('.scss') > 0 ):
        checkFileCss(name);
        break;
      default:
        getDirectories('app/src', function (err, res) {
          if (err) {
            console.log('Error', err);
          } else {
            for (var i = 0; i < res.length; i++) {
              if(res[i].indexOf('-tocompile') > 0) checkFile(__dirname+'/'+res[i]);
            }
          }
        });
    }
  });
}

function checkFile(name){
  var filepath = name;
  var filename = cleanWinPath(filepath).split('/').reverse()[0].replace('-tocompile','');
  console.log('[CAHNGED] FILE > %s ', name);
  runFuse(name,__dirname+'/app/output/'+filename);
}

function checkAllSassFiles(){
  getDirectories('app/src', function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      for (var i = 0; i < res.length; i++) {
        if(res[i].indexOf('.scss') > 0 && res[i].indexOf('-nocompile') == -1 ) checkFileCss(__dirname+'/'+res[i]);
      }
    }
  })
}

function checkFileCss(name){
  var filepath = name;
  var filename = cleanWinPath(filepath).split('/').reverse()[0].replace('scss','css');
  if(filename.indexOf("-nocompile") != -1) {
    checkAllSassFiles()
    return false;
  }
  sass.render({
    file: filepath,
    outFile: __dirname+'/app/output/assets/css/'+filename
  }, function(err, result) {
    if(err){
      console.log(err)
    }else{
      if(AUTOPREFIXER){
        postcss([ autoprefixer ]).process(result.css,{from: undefined}).then(function (result) {
          result.warnings().forEach(function (warn) {
            console.warn(warn.toString());
          });
          fs.writeFile(__dirname+'/app/output/assets/css/'+filename, result.css.toString(), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("[MODIFIED] SASS FILE > "+ __dirname+'/app/output/assets/css/'+filename);
          });
        });
      }else{
        console.log("aca 2")
        fs.writeFile(__dirname+'/app/output/assets/css/'+filename, result.css.toString(), function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("[MODIFIED] SASS FILE > "+ __dirname+'/app/output/assets/css/'+filename);
        });

      }
    }
  });
}

var getDirectories = function (src, callback) {
  glob(src + '/**/*', callback);
};

checkTreeFolder = function(){

  function createFile(objs,end) {
    next = function(){
      if(objs.length > 1){
        console.log("Check Next",objs.length)
        objs.shift();
        createFile(objs,end);
      }else end()
    }
    var obj = objs[0];
    var filepath = obj.path;
    var filename = cleanWinPath(filepath).split('/').reverse()[0];
    fs.open(filepath,'r',function(err, fd){
      if (err) {
        switch (true) {
          case obj.type == "folder":
            fs.mkdir(filepath,function(){
              console.log("[CREATE] FILE >", filepath)
              next();
            });

          break;
          default:
            fs.writeFile(filepath, '', function(err) {
              if(err) { console.log(err); }
              console.log("[CREATE] FILE >", filepath);
              next();
            });
        }
      } else {
        console.log("[FOUND] BASE FILE >", filepath);
        next();
      }
    });
  }
  archivos = [
    { path: __dirname+"/app", type: "folder" },
    { path: __dirname+"/app/output", type: "folder" },
    { path: __dirname+"/app/output/assets", type: "folder" },
    { path: __dirname+"/app/output/assets/css", type: "folder" },
    { path: __dirname+"/app/src", type: "folder" },
    { path: __dirname+"/app/src/index-tocompile.html", type: "file" },
    { path: __dirname+"/app/src/aca_van_los_archivos_html", type: "file" },
    { path: __dirname+"/app/src/sass", type: "folder" },
    { path: __dirname+"/app/src/sass/aca_van_los_archivos_scss", type: "file" },
    { path: __dirname+"/app/src/sass/index.scss", type: "file" },
  ];
  createFile(archivos, function(){
    start();
  })
}();
