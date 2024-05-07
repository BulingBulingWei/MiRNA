import React, { useState, useEffect, useRef, useContext } from "react";

export function useDebounce(fn, delay) {
  const current = useRef({ timer: null });
  return function f(e) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      fn(e);
    }, delay);
  };
}

//节流函数
export function throttle(fn, timeout) {
  var can = true;
  return function (...args) {
    if (can === true) {
      can = false;
      setTimeout(() => {
        fn(...args);
        can = true;
      }, timeout);
    }
  };
}

//判断一个输入是否只含有数字
export function isNumber(str) {
  let patrn = /^[0-9]{1,20}$/;
  let bool = true;
  if (!patrn.exec(str)) {
    bool = false;
  }
  return bool;
}

//深拷贝
export function deepClone(obj) {
  let weakMap = new WeakMap();

  //   weakMap中的键值只能是对象类型，不可以是基础数据类型
  //   判断obj是否是对象或者函数
  function isObject(obj) {
    if ((obj !== null && typeof obj === "object") || typeof obj === "function")
      return true;
    else return false;
  }

  function clone(obj) {
    if (!isObject(obj)) return obj;
    // obj 属于正则表达式或者日期
    if ([RegExp, Date].includes(obj.constructor))
      return new obj.constructor(obj);

    // 避免循环引用重复创建新对象做的处理
    if (weakMap.has(obj)) {
      return weakMap.get(obj);
    }

    //  obj是个 array
    if (Array.isArray(obj)) {
      let result = [];
      weakMap.set(obj, result);
      for (let e of obj) {
        if (isObject(e)) result.push(clone(e));
        else result.push(e);
      }
      return result;
    }

    // obj是个map
    if (obj.constructor === Map) {
      let result = new Map();
      weakMap.set(obj, result);
      //   添加键值对
      for (let e of obj) {
        // 如果键值对的“值”是个对象（递归深拷贝）
        if (isObject(e[1])) result.set(e[0], clone(e[1]));
        // 如果键值对的“值”是个基础类型
        result.set(e[0], e[1]);
      }
      return result;
    }
    // obj是个 set
    if (obj.constructor === Set) {
      let result = new Set();
      weakMap.set(obj, result);
      for (let e of obj) {
        if (isObject(e)) result.add(clone(e));
        result.add(e);
      }
      return result;
    }

    // obj是个 function
    if (typeof obj === "function")
      return new Function("return " + obj.toString())();

    // obj是个普通对象
    // 静态方法Reflect.ownKeys返回一个由目标对象自身的属性键组成的数组
    const keys = Reflect.ownKeys(obj);
    // 会返回某个对象属性的描述对象
    const desc = Object.getOwnPropertyDescriptors(obj);
    const result = Object.create(Object.getPrototypeOf(obj), desc);

    weakMap.set(obj, result);
    keys.forEach((e) => {
      if (isObject(obj[e])) result[e] = clone(obj[e]);
      else result[e] = obj[e];
    });
    return result;
  }

  return clone(obj);
}
