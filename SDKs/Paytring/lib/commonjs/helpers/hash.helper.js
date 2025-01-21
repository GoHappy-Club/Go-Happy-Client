"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateHash = generateHash;
var _cryptoJs = _interopRequireDefault(require("crypto-js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * @name generateHash
 * @description Creates a hash of all the parameters for the order creation process in react native.
 * @param data Data that needs to be converted into a hash
 * @param salt Salt of the hash that will be used to verify the hash
 */
function generateHash(data, salt) {
  try {
    const sorted = Object.keys(data).sort().reduce((accumulator, key) => {
      accumulator[key] = data[key];
      return accumulator;
    }, {});
    delete sorted.hash;
    let sortedObjValue = Object.values(sorted).map(value => {
      if (typeof value === 'object') {
        return 'PG_RP';
      }
      return value;
    });
    sortedObjValue = sortedObjValue.join('|');
    sortedObjValue = sortedObjValue + `|${salt}`;
    sortedObjValue = sortedObjValue.replaceAll('|PG_RP', '');
    return _cryptoJs.default.SHA512(sortedObjValue).toString();
  } catch (e) {
    console.error('Failed to create hash');
    return null;
  }
}
//# sourceMappingURL=hash.helper.js.map