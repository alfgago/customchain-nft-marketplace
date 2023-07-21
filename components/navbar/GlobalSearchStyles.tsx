import styled from "styled-components"

import { DEVICE, COLORS } from "utils/variables"

export const  GlobalSearchStyles = styled.div`
input {
    background: transparent;
    border: 2px solid rgb(255, 255, 255);
    border-radius: 50px;
    font-weight: 400;
    width: 100%;
    line-height: 2.375rem;
    padding: 0px 2.5rem 0px 1.25rem;
    color: rgb(255, 255, 255);
    font-size: inherit;
    ::placeholder {
        color: #ffff;
      }
}

.icon {
    color: #ffff;
}
`
