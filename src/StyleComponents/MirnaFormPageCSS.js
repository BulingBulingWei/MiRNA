import styled from "styled-components";

const media = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  zxl: "1536px",
};

export const Label = styled.div`
  font-size: 1.125rem;
  line-height: 2rem;
  font-weight: 400;
  color: rgb(31 41 55);
`;

export const InfoValue = styled(Label)`
  height: fit-content;
  overflow-wrap: break-word;
  width: 60%;
  padding-left: 0.2rem;
`;

export const InfoLabel = styled(InfoValue)`
  width: 40%;
`;

export const InfoListframe = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  padding: 0.2rem 0.1rem;
  @media (min-width: ${media.md}) {
    width: 47%;
    padding: 0.2rem 0.25rem;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  height: fit-content;
  min-height: 2rem;
  width: 100%;
  justify-content: space-between;
  border-bottom-width: 2px;
  boder-color: rgb(243 244 246);
  padding: 0 0.2rem;
  &:nth-child(odd) {
    background: #f5f5f5;
  }

  &:hover {
    background: #eaedf5;
  }

  @media (min-width: ${media.md}) {
    padding: 0 1rem;
  }
`;

export const Gframe = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: fit-content;
  width: 100%;
  margin-top: 2.5rem;
  @media (min-width: ${media.md}) {
    width: 50%;
    margin-left: 2.5rem;
    margin-top: 0rem;
  }
`;

export const GItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: fit-content;
  width: 100%;
  border-radius: 0.12rem;
  border-width: 0.1rem;
  border-color: #dedede;
  border-radius: 0.28rem;
  margin-bottom: 0.8rem;
`;

export const GLabel = styled.div`
  width: 100%;
  height: fit-content;
  background-color: #d4daed;
  font-size: 1rem;
  line-height: 1.75rem;
  font-weight: 400;
  color: rgb(31 41 55);
  padding: 0.15rem 1.2rem;
  border-radius: 0.2rem 0.2rem 0 0;
`;

export const CompareInfoframe = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  padding: 0.2rem 0.25rem;
  @media (min-width: ${media.md}) {
    padding: 0.2rem 0.25rem;
  }
`;

export const CompareInfoItem = styled(InfoItem)``;
export const CompareInfoLabel = styled(InfoValue)`
  width: 20%;
`;

export const CompareInfoValue = styled(InfoValue)`
  width: 40%;
  height: auto;
  border-left-width: 0.1rem;
  border-color: #dedede;
  padding-bottom: 0;
  @media (min-width: ${media.md}) {
    padding: 0.2rem 0.3rem;
  }
`;
