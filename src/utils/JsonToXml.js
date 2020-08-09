function JsonToXml() {

  this.result = []

}

const spacialChars = ['&', '<', '>', '"', '\'']

const validChars = ['&', '<', '>', '"', '\'']

JsonToXml.prototype.toString = function(){

  return this.result.join('')

}

JsonToXml.prototype.toUpperCase = function(str) {

  return str.charAt(0).toUpperCase() + str.slice(1)

}

JsonToXml.prototype.replaceSpecialChar = function(s){

  for(var i=0;i<spacialChars.length;i++){

    s=s.replace(new RegExp(spacialChars[i],'g'),validChars[i]);

  }

  return s

};

JsonToXml.prototype.appendText = function(s){

  s = this.replaceSpecialChar(s)

  this.result.push(s)

};

JsonToXml.prototype.appendAttr = function(key, value){

  this.result.push(' ' + key + '="' + value + '')

};

JsonToXml.prototype.appendFlagBeginS = function(s){

  s = this.toUpperCase(s)

  this.result.push('<'+s)

};

JsonToXml.prototype.appendFlagBeginE = function(){

  this.result.push('>')

};

JsonToXml.prototype.appendFlagEnd = function(s){

  s = this.toUpperCase(s)

  this.result.push("</"+s+">")

};

JsonToXml.prototype.parse = function(json){

  this.result = []

  this.convert(json)

  return this.toString()

};

JsonToXml.prototype.convert = function(obj) {
  if (typeof obj === 'object') {
    for (let k in obj) {
      // if (typeof obj[k] === 'object') {
      //   this.appendFlagBeginS(k)
      //   this.appendFlagBeginE()
      //   this.convert(obj[k])
      //   this.appendFlagEnd(k)
      // } else {
      //   this.appendFlagBeginS(k)
      //   this.appendFlagBeginE()
      //   this.appendText(obj[k] + '')
      //   this.appendFlagEnd(k)
      // }
      this.appendFlagBeginS(k)
      this.appendFlagBeginE()
      typeof obj[k] === 'object' ? this.convert(obj[k]) : this.appendText(obj[k] + '')
      this.appendFlagEnd(k)
    }
  }
}

// JsonToXml.prototype.convert = function(obj) {
//
//   var nodeName = obj.xtype || "item";
//
//   this.appendFlagBeginS(nodeName);
//
//   var arrayMap = {};
//
//   for(var key in obj) {
//
//     var item = obj[key];
//
//     if(key == "xtype") {
//
//       continue;
//
//     }
//
//     if(item.constructor == String) {
//
//       this.appendAttr(key, item);
//
//     }
//
//     if(item.constructor == Array) {
//
//       arrayMap[key] = item;
//
//     }
//
//   }
//
//   this.appendFlagBeginE();
//
//   for(var key in arrayMap) {
//
//     var items = arrayMap[key];
//
//     for(var i=0;i<items.length;i++) {
//
//       this.convert(items[i]);
//
//     }
//
//   }
//
//   this.appendFlagEnd(nodeName);
//
// };

const jsonToXml = new JsonToXml()

export default jsonToXml
