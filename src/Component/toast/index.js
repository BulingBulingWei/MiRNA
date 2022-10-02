import React from "react";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";

const Container = styled.div`
  position: fixed;
  z-index: 999;
  left: 50%;
  top: 20%;
  color: #3b55ff;
  transform: translate(-50%, -50%);
  line-height: 1.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.6rem 1.2rem 0.6rem 1.2rem;
  border-radius: 0.625rem;
  font-weight: 400;
  transition: all 0.4s;
  box-shadow: 0.3125rem 0.25rem 0.3125rem 0rem rgba(0, 0, 0, 0.2);
`;
export default function Toast(props) {
  return (
    <CSSTransition
      in={props.config.show}
      classNames="Slide2"
      timeout={6000}
      unmountOnExit
    >
      <Container className="select-none cursor-not-allowed text-xs text-red-500 md:text-base">
        {props.config.mes}
      </Container>
    </CSSTransition>
  );
}
