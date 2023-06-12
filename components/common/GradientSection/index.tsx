import { Box, Flex } from "components/primitives"
import SimpleHeader from "../SimpleHeader"
import { FC, ReactNode } from 'react'
import { GradientSectionStyles } from "./GradientSectionStyles"
import { Filters } from "components/filters/Filters"

type Props = {
    children: ReactNode
  }

const GradientSection: FC<Props> = ({ children }) => {

return (
   <GradientSectionStyles>
  <div className='wrapper'>
      <section className="top-triangle">
        <div className="content-triangle">
          <div className="triangle-container">
            <span className="img-span">
              <img src="/top-triangle-solo.png" alt="border-top" />
            </span>
          </div>
        </div>
      </section>
      <div className="children-wrapper">
     {children}
     </div>
  </div>
  </GradientSectionStyles>
)
          }
export default GradientSection