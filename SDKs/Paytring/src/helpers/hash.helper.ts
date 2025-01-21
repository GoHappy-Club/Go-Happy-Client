import CryptoJs from 'crypto-js';

/**
 * @name generateHash
 * @description Creates a hash of all the parameters for the order creation process in react native.
 * @param data Data that needs to be converted into a hash
 * @param salt Salt of the hash that will be used to verify the hash
 */
export function generateHash(data: any, salt: string): string | null {
  try {
    const sorted = Object.keys(data)
      .sort()
      .reduce((accumulator: any, key: any) => {
        accumulator[key] = data[key];
        return accumulator;
      }, {});
    delete sorted.hash;

    let sortedObjValue: any = Object.values(sorted).map((value) => {
      if (typeof value === 'object') {
        return 'PG_RP';
      }
      return value;
    });

    sortedObjValue = sortedObjValue.join('|');
    sortedObjValue = sortedObjValue + `|${salt}`;
    sortedObjValue = sortedObjValue.replaceAll('|PG_RP', '');

    return CryptoJs.SHA512(sortedObjValue).toString();
  } catch (e: any) {
    console.error('Failed to create hash');
    return null;
  }
}
