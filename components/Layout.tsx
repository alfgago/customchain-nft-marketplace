import { Box } from 'components/primitives'
import { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Box
        css={{
          background: '$neutralBg',
          height: '100%',
          minHeight: '100vh',
        }}
      >
        <Box css={{ mx: 'auto' }}>
          <main>{children}</main>
        </Box>
      </Box>
    </>
  )
}

export default Layout
