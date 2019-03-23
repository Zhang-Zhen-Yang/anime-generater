const util = {
	getUUID: function () {
    // When asked what this Object is, lie and return it's value
    util.getUUID.prototype.valueOf = function () { return this.id; };
    util.getUUID.prototype.toString = function () { return this.id; };
    // Replaced from the original function to leverage the built in methods in
    // JavaScript. Thanks to Robert Kieffer for pointing this one out
    util.getUUID.prototype.returnBase = function (number, base) {
      return (number).toString(base).toUpperCase();
    };
    // Pull out only certain bits from a very large integer, used to get the time
    // code information for the first part of a UUID. Will return zero's if there
    // aren't enough bits to shift where it needs to.
    util.getUUID.prototype.getIntegerBits = function (val, start, end) {
      var base16 = this.returnBase(val, 16);
      var quadArray = new Array();
      var quadString = '';
      var i = 0;
      for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1));
      }
      for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] == '') quadString += '0';
        else quadString += quadArray[i];
      }
      return quadString;
    };
    // pick a random number within a range of numbers
    // int b rand(int a); where 0 <= b <= a
    util.getUUID.prototype.rand = function (max) {
      return Math.floor(Math.random() * (max + 1));
    };
    util.getUUID.prototype.createUUID = function () {
      // Loose interpretation of the specification DCE 1.1: Remote Procedure Call
      // since JavaScript doesn't allow access to internal systems, the last 48 bits
      // of the node section is made up using a series of random numbers (6 octets long).
      //
      var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
      var dc = new Date();
      var t = dc.getTime() - dg.getTime();
      var tl = this.getIntegerBits(t, 0, 31);
      var tm = this.getIntegerBits(t, 32, 47);
      var thv = this.getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2
      var csar = this.getIntegerBits(this.rand(4095), 0, 7);
      var csl = this.getIntegerBits(this.rand(4095), 0, 7);

      // since detection of anything about the machine/browser is far to buggy,
      // include some more random numbers here
      // if NIC or an IP can be obtained reliably, that should be put in
      // here instead.
      var n = this.getIntegerBits(this.rand(8191), 0, 7) +
          this.getIntegerBits(this.rand(8191), 8, 15) +
          this.getIntegerBits(this.rand(8191), 0, 7) +
          this.getIntegerBits(this.rand(8191), 8, 15) +
          this.getIntegerBits(this.rand(8191), 0, 15); // this last number is two octets long
      this.id = tl + tm + thv + csar + csl + n;
      return tl + tm + thv + csar + csl + n;
    };
    this.id = this.createUUID();
  },
	getQueryString: function() {
        let result = {};
        let href = window.location.toString();
        let queryString = href.split('?')[1];
        if(queryString) {
            let queryStringList = queryString.split('&');
            if(queryStringList) {
                queryStringList.forEach((item) => {
                    let queryPairing = item.split('=');
                    result[queryPairing[0]] = queryPairing[1];
                });
            }
        }
        return result;
    },
	// 下载文件
	funDownload: function(content, blob, filename) {
		var eleLink = document.createElement('a');
		eleLink.download = filename;
		eleLink.style.display = 'none';
		// 字符内容转变成blob地址
		// var blob = new Blob([content]);
		eleLink.href = URL.createObjectURL(blob);
		// 触发点击
		document.body.appendChild(eleLink);
		eleLink.click();
		// 然后移除
		document.body.removeChild(eleLink);
	},
	NImage: function(pic_url) {
		let isBase64 = pic_url.indexOf('data:image') > -1;
		let image = new Image();
		if(isBase64) {
			image.src=pic_url;
		} else {
			image.crossOrigin = "anonymous";
			image.src=pic_url; //+ '?type=layerImg';
		}
		return image;
	},
	blobToUint8Array: function(blob){
        let fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onloadend = () => {
                resolve(new Uint8Array(fileReader.result));
            };
            fileReader.readAsArrayBuffer(blob);
        });
	},
	base64ToArrayBuffer: function(base64) {
		var binary_string =  window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array( len );
		for (var i = 0; i < len; i++)        {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	},
	convertBase64ToBlob: function(base64, type){
		var base64Arr = base64.split(',');
		var imgtype = '';
		var base64String = '';
		if(base64Arr.length > 1){
			//如果是图片base64，去掉头信息
			base64String = base64Arr[1];
			imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':')+1,base64Arr[0].indexOf(';'));
		}
		// 将base64解码
		var bytes = atob(base64String);
		//var bytes = base64;
		var bytesCode = new ArrayBuffer(bytes.length);
		 // 转换为类型化数组
		var byteArray = new Uint8Array(bytesCode);
		
		// 将base64转换为ascii码
		for (var i = 0; i < bytes.length; i++) {
			byteArray[i] = bytes.charCodeAt(i);
		}
		if(type == 'byteArray') {
			return byteArray;
		}
		// 生成Blob对象（文件对象）
		return new Blob( [bytesCode] , {type : imgtype});
	},
	base64toUnit8: function(s) {
		return new Uint8Array(atob(s).split('').map(charCodeAt))
	},
	blobtoUnit8: function(b) {
		console.log(b);
		return new Uint8Array(b.split('').map(charCodeAt))
	},
	getImageScale: function({img, cw, ch,type}) {
		let scale = 1;
		let iw = img.width;
		let ih = img.height;
		if(type == 'contain') {
			if(cw / ch > iw / ih) {
				scale = ch / ih;
			} else {
				scale = cw / iw;
			}
		} else if(type == 'cover'){
			if(cw / ch > iw / ih) {
				scale = cw / iw;
			} else {
				scale = ch / ih;
			}
		}
		
		return scale;
	},
	parseArguments: function(text) {
		text = text.replace(/\s+/g, ' ');
		var args = [];
		// Allow double quotes to not split args.
		text.split('"').forEach(function(t, i) {
		  t = t.trim();
		  if ((i % 2) === 1) {
			args.push(t);
		  } else {
			args = args.concat(t.split(" "));
		  }
		});
		return args;
	},
	formatMinutes: function(d) {
		 // convert milliseconds to seconds
		 let seconds = d / 1000;
		 let hours = Math.floor(seconds / 3600);
		 let minutes = Math.floor((seconds - hours * 3600) / 60);
		 seconds = seconds - minutes * 60;
		 let output = seconds + 's';
		 if (minutes) {
			 output = minutes + 'm ' + output;
		 }
		 if (hours) {
			 output = hours + 'h ' + output;
		 }
		 return output;
	}

}
export default util;