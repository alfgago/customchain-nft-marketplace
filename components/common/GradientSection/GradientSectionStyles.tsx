import styled from "styled-components"

import { DEVICE, COLORS } from "utils/variables"

export const GradientSectionStyles = styled.div`
.wrapper {
    position:relative;
    margin-top: -4.5rem;
    overflow: hidden;
}
  .top-triangle {
    padding: 0;

    .triangle-container {
      position: relative;
      display: inline-block;
      height: 6rem;
      &:before {
        content: "";
        position: absolute;
        top: 0;
        right: 100%;
        width: 800px;
        height: 100%;
        background: #fff;
      }
      &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 100%;
        height: 100vh;
        width: 100vw;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(216, 245, 254, 1) 60%
        );
        @media ${DEVICE.laptop} {
          height: 100%;
          background: linear-gradient(
            149deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(216, 245, 254, 1) 60%
          );
        }
      }
      .img-span {
        position: relative;
        &:before {
          content: "";
          position: absolute;
          top: 100%;
          right: 0;
          width: 100vw;
          height: 1.5rem;
          background: #fff;
        }
      }
      img {
        display: block;
        position: relative;
        height: 4.5rem;
        object-fit: cover;
        max-width: none;
      }
    }
  }
  .content-triangle {
    padding: 0 15rem;
    position: relative;
    @media ${DEVICE.laptop} {
      min-height: 6rem;
      display: flex;
      align-items: center;
    }
  }
  .text-wrapper {
    max-width: 728px;
    padding: 90px 64px;
  }

  .children-wrapper {
    padding-left: 34px;
    padding-right: 34px;
    @media ${DEVICE.laptop} {
        padding-left: 110px;
        padding-right: 110px;
      }
  }

`
export default GradientSectionStyles