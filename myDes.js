const message = 'textTest',
 // key = 'aaaaaaaa' // DESkey56
  key = 'DESkey56' // DESkey56

function text2Binary(string, bits = 8) {
  return string
    .split('')
    .map((char) => {
      return ('0'.repeat(bits) + char.charCodeAt(0).toString(2)).substr(-bits);
    })
    .join('');
}

const initialPermutationTable = [
  58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22,
  14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27,
  19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7,
];

const keyPermutation = [
  57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11,
  3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53,
  45, 37, 29, 21, 13, 5, 28, 20, 12, 4,
];

const biases = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

const endOfKeyProses = [
  14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36,
  29, 32,
];

const extendRight32_48_E = [
  32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16,
  17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32,
  1,
];

const Ss = [
  [
    // 0
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
  ],
  [
    // 1
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
  ],
  [
    // 2
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
  ],
  [
    // 3
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
  ],
  [
    // 4
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
  ],
  [
    // 5
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
  ],
  [
    // 6
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
  ],
  [
    // 7
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
  ],
];

const final_permutation = [
  16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9,
  19, 13, 30, 6, 22, 11, 4, 25,
];

const ip_reverted = [
  40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62,
  30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19,
  59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25,
];

function performInitialPermutation(binaryText) {
  return binaryText
    .split('')
    .map((bit, i) => binaryText[initialPermutationTable[i] - 1]) // -1 патмуша таблица для даунов!
    .join('');
}

function performKeyPermutation(binaryKey) {
  return binaryKey
    .split('')
    .map((bit, i) => binaryKey[keyPermutation[i] - 1]) // -1 патмуша таблица для даунов!
    .join('');
}

function binaryShift(Key, iteration) {
  if (biases[iteration] === 1) {
    let KeyEnd = Key[Key.length - 1];
    return KeyEnd + Key.slice(1, Key.length - 1) + Key[0];
  }
  if (biases[iteration] === 2) {
    let KeyEnd = Key[Key.length - 2] + Key[Key.length - 1];
    return KeyEnd + Key.slice(2, Key.length - 2) + Key[0] + Key[1];
  }
}

function binaryShiftRight(Key, iteration) {
  if (biases[iteration] === 1) {
    let KeyEnd = Key[Key.length - 1];
    return KeyEnd + Key.slice(1, Key.length - 1) + Key[0];
  }
}

function performKeyEndOfProcess(binaryShiftedKey) {
  return binaryShiftedKey
    .split('')
    .map((bit, i) => binaryShiftedKey[endOfKeyProses[i] - 1]) // -1 патмуша таблица для даунов!
    .join('');
}

function performR32_48(r) {
  return extendRight32_48_E.map((bit) => r[bit - 1]).join('');
}

function XOR_mod_2(up, down) {
  return up
    .split('')
    .map((bit, i) => (down[i] === bit ? 0 : 1))
    .join('');
}

function getSingleS(bit_6, sIndex) {
  const row = parseInt(bit_6[0] + bit_6[bit_6.length - 1], 2);
  const column = parseInt(bit_6.slice(1, 5), 2);
  return Ss[sIndex][row][column];
}

function num_to_4_bit(num) {
  return ('0'.repeat(4) + num.toString(2)).substr(-4);
}

function get_S(res) {
  return [
    num_to_4_bit(getSingleS(res.slice(0, 6), 0)),
    num_to_4_bit(getSingleS(res.slice(6, 12), 1)),
    num_to_4_bit(getSingleS(res.slice(12, 18), 2)),
    num_to_4_bit(getSingleS(res.slice(18, 24), 3)),
    num_to_4_bit(getSingleS(res.slice(24, 30), 4)),
    num_to_4_bit(getSingleS(res.slice(30, 36), 5)),
    num_to_4_bit(getSingleS(res.slice(36, 42), 6)),
    num_to_4_bit(getSingleS(res.slice(42, 48), 7)),
  ].join('');
}

function performSpermutation(Sss) {
  return Sss.split('')
    .map((bit, i) => Sss[final_permutation[i] - 1]) // -1 патмуша таблица для даунов!
    .join('');
}

function performIPReverted(bits) {
  return ip_reverted.map((bit) => bits[bit - 1]).join('');
}

function binaryAgent(str) {
  // binaryAgent('01110100 01110100');

  let newBin = str.split(' ');
  let binCode = [];

  for (i = 0; i < newBin.length; i++) {
    binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
  }
  return binCode.join('');
}

function prepareKeys(key) {
  const binaryKey = text2Binary(key);
  const binaryKeyIP = performKeyPermutation(binaryKey);
  const L0Key = binaryKeyIP.slice(0, 28); // 56/2
  const R0Key = binaryKeyIP.slice(28);
  const shiftedKey0 = binaryShift(L0Key, 0) + binaryShift(R0Key, 0);
  const KeyEndOfProcess = performKeyEndOfProcess(shiftedKey0);
  const result = [shiftedKey0];

  for (let index = 1; index < 16; index++) {
    result[index] =
      binaryShift(result[index - 1].slice(0, 28), index) +
      binaryShift(result[index - 1].slice(28), index);
  }

  return result.map((key) => performKeyEndOfProcess(key));
}

const binaryMessage = text2Binary(message), // 64 bits
  binaryKey = text2Binary(key), // 64 bits
  binaryMessageIP = performInitialPermutation(binaryMessage),
  binaryKeyIP = performKeyPermutation(binaryKey),
  L0 = binaryMessageIP.slice(0, 32),
  R0 = binaryMessageIP.slice(32),
  L0Key = binaryKeyIP.slice(0, 28), // 56/2
  R0Key = binaryKeyIP.slice(28),
  shiftedKey0 = binaryShift(L0Key, 0) + binaryShift(R0Key, 0),
  KeyEndOfProcess = performKeyEndOfProcess(shiftedKey0); // first round key, k1

const r032_48 = performR32_48(R0);
const r032_48_XOR_K1 = XOR_mod_2(r032_48, KeyEndOfProcess);
const S = get_S(r032_48_XOR_K1);
const SFinal = performSpermutation(S);
const L0_XOR_SFinal = XOR_mod_2(L0, SFinal);
const finalReverted = performIPReverted(R0 + L0_XOR_SFinal);

// console.log(binaryMessage, ' - binaryMessage');
// console.log(binaryMessageIP, ' - binaryMessageIP');
// console.log(L0, ' - L0');
// console.log(R0, ' - R0');
// console.log(binaryKey, ' - binaryKey');
// console.log(binaryKeyIP, ' - binaryKeyIP');
// console.log(L0Key, ' - L0Key');
// console.log(R0Key, ' - R0Key');
// console.log(shiftedKey0, ' - shiftedKey0');
// console.log(KeyEndOfProcess, ' - KeyEndOfProcess');
// console.log(r032_48, ' - r032_48');
// console.log(r032_48_XOR_K1, ' - r032_48_XOR_K1');
// console.log(S, ' - S');
// console.log(SFinal, ' - SFinal');
// console.log(L0_XOR_SFinal, ' - L0_XOR_SFinal');
// console.log(R0 + L0_XOR_SFinal, ' - Final');
// console.log(finalReverted, ' - Final reverted');
// console.log('0011000010010000001111000011001010100000001100000001000100111010 - res');

// bias -> table = k1 -> R0 - 32 to 48  -> R048 xor(2) k1 -> S po 6 - 8 group -> res xor L0

const keys = prepareKeys(key);
console.log(new Set(keys));
if(new Set(keys).size <= 3) throw new Error('Weak key detected, please provide better one')

let encryptionResult = '',
  decryptionResult = '';
let entropy = [];

function round(messageInBiteCode, keyInBiteCode) {
  const binaryMessageIP = performInitialPermutation(messageInBiteCode),
    L0 = binaryMessageIP.slice(0, 32),
    R0 = binaryMessageIP.slice(32),
    KeyEndOfProcess = keyInBiteCode; // first round key, k1

  const r032_48 = performR32_48(R0);
  const r032_48_XOR_K1 = XOR_mod_2(r032_48, KeyEndOfProcess);
  const S = get_S(r032_48_XOR_K1);
  const SFinal = performSpermutation(S);
  const L0_XOR_SFinal = XOR_mod_2(L0, SFinal);
  const finalReverted = performIPReverted(R0 + L0_XOR_SFinal);
  return finalReverted;
}

function roundDecode(messageInBiteCode, keyInBiteCode) {
  const binaryMessageIP = performInitialPermutation(messageInBiteCode),
    L0 = binaryMessageIP.slice(0, 32),
    R0 = binaryMessageIP.slice(32),
    KeyEndOfProcess = keyInBiteCode; // first round key, k1 shiftedKey0

  const r032_48 = performR32_48(L0); // R0
  const r032_48_XOR_K1 = XOR_mod_2(r032_48, KeyEndOfProcess);
  const S = get_S(r032_48_XOR_K1);
  const SFinal = performSpermutation(S);
  const L0_XOR_SFinal = XOR_mod_2(R0, SFinal); // L0
  const finalReverted = performIPReverted(L0_XOR_SFinal + L0); // R0
  return finalReverted;
}

function amazingDes(messageInBiteCode, mode = 'E') {
  const ROUNDS = 16;
  switch (mode) {
    case 'E':
      for (let index = 0; index < ROUNDS; index++) {
        encryptionResult = round(messageInBiteCode, keys[index]);
        entropy[index] = encryptionResult.split('').reduce((prev, curr) => {
          return (+prev + +curr)
        }, 0)
      }

      break;

    case 'D':
      for (let index = 0; index < ROUNDS; index++) {
        decryptionResult = roundDecode(messageInBiteCode, keys[index]);
      }
      break;

    default:
      break;
  }
}

console.log('0011000010010000001111000011001010100000001100000001000100111010 - res');
amazingDes(binaryMessage, 'E');
console.log(encryptionResult, ' - E');
amazingDes(encryptionResult, 'D');
console.log(decryptionResult, ' - D');
console.log(binaryMessage, ' - binaryMessage');
console.log(entropy.map((el) => el/64), ' - entropy');

console.log(
  binaryAgent(
    [
      decryptionResult.slice(0, 8),
      decryptionResult.slice(8, 16),
      decryptionResult.slice(16, 24),
      decryptionResult.slice(24, 32),
      decryptionResult.slice(32, 40),
      decryptionResult.slice(40, 48),
      decryptionResult.slice(48, 56),
      decryptionResult.slice(56, 64),
    ].join(' ')
  ),
  ' - D'
);