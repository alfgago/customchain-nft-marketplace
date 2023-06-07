import { Box, Flex } from "components/primitives"
import SimpleHeader from "../SimpleHeader"
import { FC, ReactNode } from 'react'
import { GradientSectionStyles } from "./GradientSectionStyles"

type Props = {
    children: ReactNode
  }

const GradientSection: FC<Props> = ({ children }) => {

return (
    <div>
    <div>
    <SimpleHeader textAlign="left">
    {children}
    </SimpleHeader></div>
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
  </div>
  </GradientSectionStyles>
  </div>
)
          }
export default GradientSection