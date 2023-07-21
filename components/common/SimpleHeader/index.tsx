import GradientBackground from '../gradientBackground'
import { SimpleHeaderStyles } from './SimpleHeaderStyles'
import { useMediaQuery } from 'react-responsive'

const SimpleHeader = ({
  title,
  textAlign = 'center',
  backgroundColor = '#000',
  textColor = '#fff',
  gradient = true,
  children,
}: any) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 }) 
  return (
    <SimpleHeaderStyles
      textAlign={textAlign}
      backgroundColor={backgroundColor}
      textColor={textColor}
      className="simple-header"
    >
      <GradientBackground />
      <div className="content">
        {title && <h1>{title}</h1>}
        {children}
      </div>
      {!isSmallDevice && <img
        src="/LongVerticalLogo.svg"
        alt="plusOne-vertical"
        className="vertical-logo"
      />}
    </SimpleHeaderStyles>
  )
}

export default SimpleHeader
