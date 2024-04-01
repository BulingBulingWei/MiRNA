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
