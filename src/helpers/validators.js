/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { SHAPES, COLORS } from '../constants';
import {
  allPass,
  partialRight,
  propEq,
  complement,
  anyPass,
  prop,
  keys,
  equals,
  gte,
  lte,
  all,
  map,
  filter,
  length,
  max,
  values,
  reduce
} from 'ramda';

const shapeIsColor = (prop, color) => propEq(prop, color);

const shapeIsWhite = partialRight(shapeIsColor, [COLORS.WHITE]);
const shapeIsGreen = partialRight(shapeIsColor, [COLORS.GREEN]);
const shapeIsRed = partialRight(shapeIsColor, [COLORS.RED]);
const shapeIsBlue = partialRight(shapeIsColor, [COLORS.BLUE]);
const shapeIsOrange = partialRight(shapeIsColor, [COLORS.ORANGE]);

const propsAreEqual = (obj, prop1, prop2) => equals(prop(prop1, obj), prop(prop2, obj));

const getColors = (object) => {
  const objKeys = keys(object);
  return map(shape => prop(shape, object), objKeys);
}

const allIsColor = (color, object) => {
  const colors = getColors(object);
  const isColor = equals(color);
  return all(isColor)(colors);
}

const countColor = (color, object) => {
  const colors = getColors(object);
  const filteredColors = filter(col => col === color, colors);
  return length(filteredColors);
}

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    shapeIsRed(SHAPES.STAR),
    shapeIsGreen(SHAPES.SQUARE),
    shapeIsWhite(SHAPES.TRIANGLE),
    shapeIsWhite(SHAPES.CIRCLE)
  ]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (object) => gte(countColor(COLORS.GREEN, object), 2);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (object) => equals(
  countColor(COLORS.RED, object), countColor(COLORS.BLUE, object)
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  shapeIsRed(SHAPES.STAR),
  shapeIsOrange(SHAPES.SQUARE),
  shapeIsBlue(SHAPES.CIRCLE)
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).

// меня слегка душит жаба итерироваться по ключам входного объекта все 5 раз, но здесь объем данных такой маленький, что, наверно, можно
const countMaxColor = (object) => {
  return reduce(max, -Infinity, values(map(color => countColor(color, object), COLORS)));
}

export const validateFieldN5 = (object) => all(val => val === true, [
  lte(countColor(COLORS.WHITE, object), 1),
  gte(countMaxColor(object), 3)
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (object) => all(
  val => val === true,
  [
    shapeIsGreen(SHAPES.TRIANGLE)(object),
    equals(countColor(COLORS.GREEN, object), 2),
    equals(countColor(COLORS.RED, object), 1),
  ]
);


// 7. Все фигуры оранжевые.
export const validateFieldN7 = (object) => allIsColor(COLORS.ORANGE, object);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = complement(
  anyPass([shapeIsWhite(SHAPES.STAR), shapeIsRed(SHAPES.STAR)])
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = (object) => allIsColor(COLORS.GREEN, object);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
const triangleEqualsSquare = partialRight(propsAreEqual, [SHAPES.TRIANGLE, SHAPES.SQUARE]);

export const validateFieldN10 = allPass([
  triangleEqualsSquare,
  complement(anyPass([shapeIsWhite(SHAPES.TRIANGLE), shapeIsWhite(SHAPES.SQUARE)]))
]);
