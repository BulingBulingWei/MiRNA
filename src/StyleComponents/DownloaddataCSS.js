import styled from "styled-components";
import {
  CompareInfoframe,
  CompareInfoItem,
  CompareInfoValue,
} from "./MirnaStructPageCSS";

//   FuzzySearchList,
//   FuzzySearchItem,
//   MirnaSelectBox,
//   DisSelectBox,
//   InputBox,
//   SelectedLabelBox,
//   MirnaSelectedLabel,
//   DisSelectedLabel,
//   CancelLabelBox,
//   Filter,
//   Label,
//   DataFrame,
//   DataRow,
//   DataSpace,
//   ResourceBtn,
//   DownloadBtn,
//   DownloadWin,
//   Footer,
//   FileTypeBtn

const media = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  zxl: "1536px",
};

export const Label = styled.div`
  font-size: 1.2rem;
  line-height: 2rem;
  font-weight: 700;
  color: rgb(31 41 55);
  padding: 0.4rem 0 0.2rem 0;
`;

export const MirnaSelectBox = styled.div`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0.2rem 0;
  align-items: start;
  padding: 0;

  @media (min-width: ${media.md}) {
    flex-direction: row;
    justify-content: start;
    margin: 0.2rem 0;
  }
`;

export const DisSelectBox = styled(MirnaSelectBox)``;

export const OtherSelectBox = styled(MirnaSelectBox)`
  flex-direction: row;
  justify-content: start;
`;

export const InputBox = styled.div`
  height: fit-content;
  width: 90%;

  @media (min-width: ${media.md}) {
    width: 16rem;
    padding-left: 1rem;
  }
`;

export const CountInputBox = styled(InputBox)`
  width: 16rem;
  margin: 0;
`;

export const Btn = styled.div`
  display: flex;
  height: 100%;
  width: fit-content;
  align-items: center;
  border-radius: 3px;
  padding: 0 0.2rem;
  margin-left: 0.5rem;
  margin-top: 1px;
  background-color: #f5f5f5;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid #0d9488;

  @media (min-width: ${media.md}) {
    margin-left: 1rem;
    padding: 0 0.8rem;
  }
`;

export const SelectedLabelBox = styled.div`
  height: fit-content;
  flex-grow: 1;
  padding: 0.1rem 0.5rem;

  @media (min-width: ${media.sm}) {
    padding: 0.1rem 2rem 0.1rem 6.5rem;
  }

  @media (min-width: ${media.md}) {
    width: 80%;
    padding: 0 0.8rem;
  }
`;

export const MirnaSelectedLabel = styled.div`
  display: inline-block;
  height: fit-content;
  width: fit-content;
  padding: 0.05rem 0.3rem;
  margin-right: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: rgb(31 41 55);
  border-radius: 0.25rem;
  background-color: #dbf5f5;
  cursor: pointer;

  // &:hover {
  //   background-color: #d3eee6;
  // }

  & > div {
    height: fit-content;
    width: fit-content;
    margin: 0.25rem 0 0 0.2rem;
    border-radius: 100px;
    display: inline-block;
    background-color: #d5d5d5;
    &:hover {
      background-color: #eeb9b9;
    }
  }
`;

export const DisSelectedLabel = styled(MirnaSelectedLabel)`
  background-color: #d5ebf6;

  &:hover {
    background-color: #addaf0;
  }
`;

//取消的叉叉
export const CancelLabelBox = styled.div`
  height: 1rem;
  width: 1rem;
  position: absolute;
  display: flex;
  top: -0.5rem;
  right: -0.5rem;
  justify-content: center;
  align-items: center;
  background-color: #db716a;
`;

//左边悬浮的过滤器
export const Filter = styled.div`
  height: fit-content;
  max-height: 80%;
  position: relative;
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  top: 1rem;
  border-width: 2px;
  border-color: #cce5df;
  border-radius: 0.5rem;
  background-color: #f1f8f7;
  padding: 1rem 1rem;
  margin: 0.5rem 2rem;

  @media (min-width: ${media.sm}) {
    width: 60%;
  }

  @media (min-width: ${media.md}) {
    width: 30%;
  }

  @media (min-width: ${media.lg}) {
    width: 25%;
    overflow-y: scroll;
  }

  @media (min-width: ${media.xl}) {
    width: 22%;
    overflow-y: scroll;
    margin: 1rem 2rem;
  }
`;

export const DataFrame = styled(CompareInfoframe)`
  position: relative;
  width: 100%;
  min-width: 800px;
  padding: 0;
  overflow-y: scroll;
  flex-grow: 1;

  &::-webkit-scrollbar {
    width: 5px;
    background-color: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #9dcdc1;
  }
`;

export const DataRow = styled(CompareInfoItem)`
  min-height: 1.8rem;
  padding: 0;

  &:hover {
    background-color: #e7f3f0;
  }
`;

//一共5列，每列占1/5
export const DataSpace = styled(CompareInfoValue)`
  width: 20%;
  line-height: 1.5rem;
  font-size: 1rem;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (min-width: ${media.md}) {
    padding: 0 0.4rem;
  }
`;

//
export const FuzzySearchList = styled.div`
  position: absolute;
  height: fit-content;
  width: 100%;
  max-height: 18rem;
  top: 1.5rem;
  border-radius: 0.25rem;
  border-width: 2px;
  border-color: #16a34a;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: rgb(249 250 251);
`;

export const FuzzySearchItem = styled.li`
  height: fit-content;
  width: 100%;
  z-index: 50;
  display: flex;
  align-items: center;
  border-bottom-width: 2px;
  border-color: rgb(209 213 219);
  cursor: pointer;

  &:hover {
    background-color: rgb(243 244 246);
  }
`;

export const ResourceBtn = styled.div`
  height: fit-content;
  width: 65%;
  padding: 0.1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.2rem auto;
  color: rgb(31 41 55);
  background-color: ${(props) => (props.selected ? "#b9dfd4" : "white")};
  border-width: 2px;
  border-color: #0d9488;
  border-radius: 0.25rem;
  font-weight: 400;
  cursor: pointer;

  &:hover {
    outline-style: solid;
    outline-offset: 1px;
  }
`;

export const PredictBtn = styled(ResourceBtn)`
  color: rgb(31 41 55);
  background-color: ${(props) => (props.selected ? "#fbe2d6" : "white")};
  border-color: #eb8989;

  &:hover {
    outline-style: solid;
    outline-offset: 1px;
  }
`;

export const DownloadBtn = styled(ResourceBtn)`
  height: 2.5rem;
  background-color: #0d9488;
  margin: 0.6rem auto;

  &:hover {
    outline-style: solid;
    outline-offset: 1px;
  }
`;

export const DownloadWin = styled.div`
  height: fit-content;
  width: 80%;
  margin: 5rem auto;
  background-color: #e4f4fd;
  font-weight: 700;
  color: rgb(31 41 55);
  border-radius: 0.25rem;
  padding: 1.5rem 1.8rem;

  @media (min-width: ${media.lg}) {
    position: relative;
    height: 20rem;
    width: 25rem;
  }
`;

export const FileTypeBtn = styled.div`
  height: fit-content;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem 0.5rem;
  background-color: #6cc6bf;
  border-radius: 0.25rem;
  margin: 0.6rem auto;
  cursor: pointer;

  &:hover {
    background-color: #0d9488;
  }
`;

export const Footer = styled.div`
  height: 2.3rem;
  width: 100%;
  min-width: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #cfe9ed;
  flex-shrink: 0;
`;

export const GraphBox = styled.div`
  height: 80vh;
  width: 100%;
  margin: 2rem 0 0 0;
  padding-bottom: 1rem;
`;
