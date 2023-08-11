import styled from 'styled-components'

import { DEVICE, COLORS } from 'utils/variables'

const IndexStyles = styled.section`
  .paginationButton {
    width: 53px;
    height: 53px;
    font-size: 24px;
  }

  .paginationPage {
    background-color: #d9d9d9;
  }

  .clickedPage {
    background-color: #4c4c4c;
    color: #ffff;
  }
`

export default IndexStyles
