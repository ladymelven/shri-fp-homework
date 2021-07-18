/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
  compose,
  allPass,
  all,
  gt,
  gte,
  lte,
  length,
  partialRight,
  prop,
  composeWith
} from 'ramda';

const api = new Api();

const lengthBetween = (string, lower, higher) => {
  const strLength = length(string);
  return all(val => val, [gte(strLength, lower), lte(strLength, higher)]);
}
const lengthBetweenTwoTen = partialRight(lengthBetween, [2, 10]);

const getNumber = (val) => Number.parseFloat(val);
const getInteger = compose(Math.round, getNumber);

const square = num => num * num;

const getResidue = (num, divider) => num % divider;
const getResidueThree = partialRight(getResidue, [3]);

const isPositive = (val) => {
  const number = getNumber(val);
  if (number) {
    return gt(number, 0);
  }
  return false;
}

const isValidNumber = (val) => {
  return /^\d+\.?\d*$/.test(val);
}

const validate = allPass([lengthBetweenTwoTen, isPositive, isValidNumber]);

const binaryApi = api.get('https://api.tech/numbers/base');
const convertToBinary = async (number) => await binaryApi({from: 10, to: 2, number});
const getAnimal = api.get('https://animals.tech/');

const processSequence = async ({value, writeLog, handleSuccess, handleError}) => {
  const writeAndPassOn = (val) => {
    if (val || val === 0) {
      writeLog(val);
      return val;
    }
  }

  const validateAndPassOn = val => {
    const isValid = validate(val);

    if (isValid) {
      return val;
    } else {
      handleError('Validation Error');
    }
  };

  const composeWithPromise = composeWith(async (fn, prevResult) => {
    try {
      const resolved = await prevResult;
      return fn(resolved);
    } catch (err) {
      handleError(err);
    }
  });

  composeWithPromise([
    handleSuccess,
    prop('result'),
    getAnimal,
    writeAndPassOn,
    getResidueThree,
    writeAndPassOn,
    square,
    writeAndPassOn,
    length,
    writeAndPassOn,
    prop('result'),
    convertToBinary,
    writeAndPassOn,
    getInteger,
    validateAndPassOn,
    writeAndPassOn
  ])(value);
}

 export default processSequence;
