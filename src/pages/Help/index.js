import React, { useState, useEffect, useRef, useContext } from "react";
import bgimg from "../../img/img17.jpg";
import { CSSTransition } from "react-transition-group";

export default function Help() {
  const [showAntimation, setShowAntimation] = useState(false);
  const nodeRef = useRef(null);
  useEffect(() => {
    setShowAntimation(true);
  }, []);
  return (
    <CSSTransition
      in={showAntimation}
      timeout={300}
      nodeRef={nodeRef}
      classNames="page"
      unmountOnExit
    >
      <div
        ref={nodeRef}
        className="h-full w-full transition-all duration-500"
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundRepeat: "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="h-full w-full flex flex-col justify-start items-center"
          style={{
            background: "rgba(39, 39, 39,0.35)",
          }}
        ></div>
      </div>
    </CSSTransition>
  );
}
