import { FC, ReactNode } from 'react'
import { GradientSectionStyles } from "./GradientSectionStyles"
import { useMediaQuery } from 'react-responsive'

type Props = {
    children: ReactNode
  }

const GradientSection: FC<Props> = ({ children }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
return (
   <GradientSectionStyles>
  <div className='wrapper'>
     <section className="top-triangle">
        <div className="content-triangle">
         <div className="triangle-container">
         {!isSmallDevice && <span className="img-span">
              <img src="/top-triangle-solo.png" alt="border-top" />
            </span>}
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