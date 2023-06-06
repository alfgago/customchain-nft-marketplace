import styled from "styled-components"

import { DEVICE, COLORS } from "utils/variables"

export const FiltersStyles = styled.section`

  .filter-section {
    padding-right:${24/16}rem;
    padding-left:${24/16}rem;
    @media ${DEVICE.laptop} {
      padding-right:${110/16}rem;
      padding-left: ${110/16}rem;
    }
    .abs {
      position: relative;
      margin-top: -5.5rem;
      width: 100%;
    }

    .content {
      position: relative;
      @media ${DEVICE.laptop} {
        min-height: 6rem;
        display: flex;
        align-items: center;
      }
    }

    .title {
      display: inline-block;
      font-weight: bold;
      font-size: ${25 / 16}rem;
      margin-right: ${30 / 16}rem;
      margin-bottom: 1rem;
      @media ${DEVICE.laptop} {
        padding-left: 12rem;
        margin-left: auto;
        margin-bottom: 0;
      }
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    li {
      background: transparent;
      font-weight: 500;
    }
  }

  section {
    padding: 2rem 0;
  }
`
export const CommonPill = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  text-align: center;
  color: ${COLORS.black};
  border: 2px solid #454545;
  border-radius: 50px;
  transition: 0.5s ease all;
  cursor: pointer;
  font-size: 16px;
  line-height: 16px;
  padding: 10px 15px;
  font-weight: 500;
  white-space: nowrap;

  &.small {
    font-size: 13px;
    line-height: 16px;
    padding: 8px 12px;
  }

  @media ${DEVICE.laptop} {
    font-size: ${24 / 16}rem;
    line-height: 1.2;
    padding: ${10 / 16}rem ${30 / 16}rem;

    .icon {
      height: ${24 / 16}rem;
      svg {
        height: ${24 / 16}rem;
      }
    }

    &.small {
      font-size: ${18 / 16}rem;
      line-height: ${18 / 16}rem;
      padding: ${7 / 16}rem ${15 / 16}rem;

      .icon {
        height: ${18 / 16}rem;
        svg {
          height: ${18 / 16}rem;
        }
      }
    }
  }

  &.fill {
    background-color: #373737;
    border: 2px solid #373737;
    color: ${COLORS.white};
  }

  &.clickable:hover {
    background-color: ${COLORS.black};
    color: ${COLORS.white};
  }

  &.active {
    background-color: ${COLORS.black};
    color: ${COLORS.white};
  }

  &.purple {
    color: #fff;
    background: #910ae2;
    border: 2px solid #910ae2;
    &:hover {
      color: #910ae2;
      background: transparent;
      path {
        fill: #910ae2;
      }
    }
  }

  &.disabled {
    color: #666;
    border: 2px solid #666;
    &:hover {
      color: #666;
      border: 2px solid #666;
    }
    cursor: not-allowed;
  }

  &.white {
    color: ${COLORS.black};
    background: ${COLORS.white};
    border: 2px solid ${COLORS.white};
    &:hover {
      color: ${COLORS.white};
      background: transparent;
      path {
        fill: ${COLORS.white};
      }
    }
  }

  &.blue {
    color: #fff;
    background: #1415ff;
    border: 2px solid #1415ff;
    &:hover {
      color: #1415ff;
      background: transparent;
      path {
        fill: #1415ff;
      }
    }
  }

  &.lightblue {
    background: #00ecff;
    border: 2px solid #00ecff;
    &:hover {
      color: #00ecff;
      background: transparent;
      path {
        fill: #00ecff;
      }
    }
    &.fill:hover {
      background: #fff;
    }
  }

  &.yellow {
    color: #000;
    background: #e0f368;
    border: 2px solid #e0f368;
    &:hover {
      background: transparent;
    }
    &.fill:hover {
      background: #fff;
    }
  }

  &.pink {
    color: #fff;
    background: #fb00fb;
    border: 2px solid #fb00fb;
    &:hover {
      color: #fb00fb;
      background: transparent;
      path {
        fill: #fb00fb;
      }
    }
  }
  &.black {
    color: #fff;
    background: ${COLORS.black};
    border: 2px solid ${COLORS.black};
    &:hover {
      color: ${COLORS.black};
      background: transparent;
      path {
        fill: black;
      }
    }
  }
  &.light-grey {
    color: #fff;
    background: #c2c2c2;
    border: 2px solid #c2c2c2;
    &:hover {
      color: #858585;
      background: transparent;
      path {
        fill: #858585;
      }
    }
  }
`
