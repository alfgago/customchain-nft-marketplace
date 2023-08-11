import styled from "styled-components"

import { DEVICE, COLORS } from "utils/variables"

export interface Props {
  textAlign: string
  backgroundColor: string
  textColor: string
}

export const SimpleHeaderStyles = styled.section<Props>`
  position: relative;
  width: 100%;
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
  text-align: ${(props) => props.textAlign};
  padding-bottom: 0;
  text-shadow: 0 0 15px rgb(0 0 0 / 30%);

  h1 {
    padding: ${60 / 16}rem 0 ${30 / 16}rem 0;
  }
  .vertical-logo {
    width: ${160 / 16}rem;
    height: ${160 / 16}rem;
    max-width: 100vw;
    position: absolute;
    max-height: 100vw;
    top: 290px;
    right: -18px;
  }
`
export default SimpleHeaderStyles