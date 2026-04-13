// const { SiteFtp } = require('site-ftp');
// SiteFtp.connect({
//   "host": "192.168.0.11",
//   "port": 21,
//   "username": "anonymous",
//   "password": "anonymous@",
//   "type": "ftp",
//   "from": ["dist/**"],
//   "to": "/ip-front/",
//   "rm": true,
// });
var iconv=require('iconv-lite')
const fs = require('fs');
const FTPClient = require('ftp');

const dirPath = 'C:\\Users\\xuqianqian\\ip_service3\\dist\\downLoad'; // ??FTP??
const remoteFtpPath = 'ip-front1'; // ??FTP??
const localFiles = []; // ????
let localFileLength = 0; // ??????
let uploadTime = 0; // ????
let ftp = null;
// const buf1 = Buffer.from('buffer');
// const buf2 = Buffer.from(buf1);
//
// buf1[0] = 0x61;
console.log(iconv.decode(iconv.encode('鏂板缓鏂囨湰鏂囨。', 'GBK'), 'iso-8859-1'));

function textToArrayBuffer(s) {
  var i = s.length;
  var n = 0;
  var ba = new Array()
  for (var j = 0; j < i;) {
    var c = s.codePointAt(j);
    if (c < 128) {
      ba[n++] = c;
      j++;
    }
    else if ((c > 127) && (c < 2048)) {
      ba[n++] = (c >> 6) | 192;
      ba[n++] = (c & 63) | 128;
      j++;
    }
    else if ((c > 2047) && (c < 65536)) {
      ba[n++] = (c >> 12) | 224;
      ba[n++] = ((c >> 6) & 63) | 128;
      ba[n++] = (c & 63) | 128;
      j++;
    }
    else {
      ba[n++] = (c >> 18) | 240;
      ba[n++] = ((c >> 12) & 63) | 128;
      ba[n++] = ((c >> 6) & 63) | 128;
      ba[n++] = (c & 63) | 128;
      j+=2;
    }
  }
  return new Uint8Array(ba).buffer;
}
//[-24, -91,-65, -25, -109,-100]

// 打印: auffer
// console.log(buf2.toString());


// Convert from an encoded buffer to js string.
// str = iconv.decode(Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]), 'win1251');
//
// // Convert from js string to an encoded buffer.
// buf = iconv.encode("Sample input string", 'win1251');
//
// // Check if encoding is supported
// iconv.encodingExists("us-ascii")

//
// // Decode stream (from binary stream to js strings)
// http.createServer(function(req, res) {
//   var converterStream = iconv.decodeStream('win1251');
//   req.pipe(converterStream);
//
//   converterStream.on('data', function(str) {
//     console.log(str); // Do something with decoded strings, chunk-by-chunk.
//   });
// });
//
// // Convert encoding streaming example
// fs.createReadStream('file-in-win1251.txt')
//   .pipe(iconv.decodeStream('win1251'))
//   .pipe(iconv.encodeStream('ucs2'))
//   .pipe(fs.createWriteStream('file-in-ucs2.txt'));
//
// // Sugar: all encode/decode streams have .collect(cb) method to accumulate data.
// http.createServer(function(req, res) {
//   req.pipe(iconv.decodeStream('win1251')).collect(function(err, body) {
//     assert(typeof body == 'string');
//     console.log(body); // full request body string
//   });
// });
// ```
//
// ### [Deprecated] Extend Node.js own encodings
// > NOTE: This doesn't work on latest Node versions. See [details](https://github.com/ashtuchkin/iconv-lite/wiki/Node-v4-compatibility).
//
// ```javascript
// // After this call all Node basic primitives will understand iconv-lite encodings.
// iconv.extendNodeEncodings();
//
// // Examples:
// buf = new Buffer(str, 'win1251');
// buf.write(str, 'gbk');
// str = buf.toString('latin1');
// assert(Buffer.isEncoding('iso-8859-15'));
// Buffer.byteLength(str, 'us-ascii');


readingFile().then(()=>{
    // console.log(localFiles);
    if(localFileLength) {
        // ???? - ??
        console.log('192.168.0.11');
        ftp = new FTPClient();
        ftp.on('ready', () => {
            // ????
            console.log('??????????...');
            ftp.rmdir(remoteFtpPath,true,err=>{
                if(err) console.log('??????????');
                console.log('????...');
                uploadingFile().then(()=>{
                    console.log(`?????????${localFiles.length}???`);
                }).catch(err=>{
                    console.log(err);
                })
            });
        });
        // ?????
        ftp.connect({
            host:'192.168.0.11',
            port:21,
            user:'anonymous',
            password:'anonymous@',
            connTimeout: 1000*10, // ??????
            pasvTimeout: 1000*10, // PASV data ??????
            keepalive: 1000* 10, // ??????????????
        });
    } else {
        console.log('???????????');
    }
}).catch(err=>{
    console.log(err);
});

// ????????
function readingFile() {
    return new Promise((resolve,reject)=>{
        readFiles(dirPath).catch(err=>reject(err));
        // ?????????1s? localFiles???????
        console.log('????????????...');
        let timer = setInterval(() => {
            if(localFileLength == localFiles.length) {
                clearInterval(timer);
                resolve();
                return console.log('????');
            }
        }, 1000);
    })
}
// ??????
function readFiles(filepath) {
    return new Promise((resolve,reject)=>{
        fs.readdir(filepath,{withFileTypes:true},(err,files)=>{
            if(err) throw err;
            if(files.length>0) {
                files.map(file=>{
                    if(file.isFile()) { // ??
                      const child_filepath = filepath + '\\' + file.name;
                        fs.readFile(child_filepath,(err,data)=>{
                            if(err) throw err;
                            const dir = remoteFtpPath + filepath.replace(dirPath,'').replace('\\','/') ;
                            localFiles.push({
                                dir,
                                filepath: dir + '/' +file.name,
                                filedata: data
                            })
                            localFileLength = localFiles.length;
                        });
                    } else { // ??
                        const child_filepath = filepath + '\\' + file.name;
                        readFiles(child_filepath);
                    }
                });
            }
        });
    });
}

// ??????
function uploadingFile() {
    return new Promise((resolve,reject)=>{
        localFiles.map(file=>{
            uploadFiles(file.dir,file.filepath,file.filedata).catch(err=>reject(err));
        })
        console.log('????????...');
        let timer = setInterval(() => {
            if(localFileLength == 0) {
                clearInterval(timer);
                resolve();
                return console.log('????');
            }
            uploadTime++;
            console.log(`????${uploadTime}s`);
        }, 1000);
    })
}
// ??????
function uploadFiles(dir,filepath,filedata) {

   // filepath=iconv.decode(filepath, 'gbk');







  //Buffer.from(new String(filepath))
 // new Int8Array(textToArrayBuffer(filepath))


  filepath=iconv.decode(iconv.encode(filepath, 'UTF-8'), 'GBK')
  // filepath=iconv.decode(iconv.encode(filepath, 'iso-8859-1'), 'iso-8859-1')
   // filepath=iconv.decode(filepath, 'iso-8859-1');
    console.log(dir, filepath, filedata);
  // filepath = Buffer.from(filepath, 'binary').toString('utf8')
  return new Promise((resolve,reject)=>{

        ftp.mkdir(dir,true,err1=>{
            if(err1) reject(err1);
            ftp.put(filedata,filepath,err2 => {
                if (err2) reject(err2);
                localFileLength--;
                ftp.end();
              resolve();
            });
         })
    })
}
