import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";

export default function throttle(fn, timeout) {
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
