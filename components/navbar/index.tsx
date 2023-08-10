import { useRef, useState } from 'react'
import { Box, Flex } from '../primitives'
import GlobalSearch from './GlobalSearch'
import { useRouter } from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import Link from 'next/link'
import Image from 'next/image'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import NavItem from './NavItem'
import ThemeSwitcher from './ThemeSwitcher'
import HamburgerMenu from './HamburgerMenu'
import MobileSearch from './MobileSearch'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'
import { useMounted } from '../../hooks'
import { useAccount } from 'wagmi'
import { ProfileDropdown } from './ProfileDropdown'
import CartButton from './CartButton'

export const NAVBAR_HEIGHT = 81
export const NAVBAR_HEIGHT_MOBILE = 77

const Navbar = () => {
  const { theme } = useTheme()
  const { isConnected } = useAccount()
  const isMobile = useMediaQuery({ query: '(max-width: 960px)' })
  const isMounted = useMounted()
  const [color, setColor] = useState(false)

  let searchRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  useHotkeys('meta+k', () => {
    if (searchRef?.current) {
      searchRef?.current?.focus()
    }
  })

  if (!isMounted) {
    return null
  }

   // change nav color when scrolling
   const changeColor = () => {
     if (window.scrollY >= 60) {
       setColor(true)
     } else {
       setColor(false)
     }
   }
 
   if (typeof window !== "undefined") {
     window.addEventListener("scroll", changeColor)
   }
  return isMobile ? (
    <Flex
      css={{
        height: NAVBAR_HEIGHT_MOBILE,
        px: '34px',
        width: '100%',
        zIndex: 999,
        background: color ? 'rgb(0, 0, 0)' :'transparent',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="between"
    >
      <Box css={{ flex: 1 }}>
        <Flex align="center">
          <Link href="/">
            <Box css={{ width: 64, cursor: 'pointer' }}>
            <Image
                src="/plusoneLogo.svg"
                width={64}
                height={69}
                alt="Plusone"
              />
            </Box>
          </Link>
        </Flex>
      </Box>
      <Flex align="center" css={{ gap: '$3' }}>
        {/*<MobileSearch key={`${router.asPath}-search`} />*/}
        <CartButton />
        <HamburgerMenu key={`${router.asPath}-hamburger`} />
      </Flex>
    </Flex>
  ) : (
    <Flex
      css={{
        height: NAVBAR_HEIGHT,
       // px: '$5',
        width: '100%',
        //maxWidth: 1920,
        paddingLeft: '110px',
        paddingRight: '110px',
        zIndex: 999,
        background: color ? 'rgb(0, 0, 0)' :'transparent',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="between"
    >
      <Box css={{ flex: 1 }}>
        <Flex align="center">
          <Link href="/">
            <Box css={{ width: 112, cursor: 'pointer' }}>
              {theme == 'dark' ? (
                <Image
                  src="/plusoneLogo.svg"
                  width={82}
                  height={42}
                  alt="Reservoir"
                />
              ) : (
                <Image
                 src="/plusoneLogo.svg"
                  width={82}
                  height={42}
                  alt="Reservoir"
                />
              )}
            </Box>
          </Link>
          <Box css={{ flex: 1, px: '$5', maxWidth: 460 }}>
            <GlobalSearch
              ref={searchRef}
              placeholder="Search collections and addresses"
              containerCss={{ width: '100%' }}
              key={router.asPath}
            />
          </Box>
        </Flex>
      </Box>

      <Flex css={{ gap: '$3' }} justify="end" align="center">
      <Flex align="center" css={{ gap: '$5'}}>
            <Link href="/collection-rankings">
              <NavItem active={router.pathname == '/collection-rankings'}>
                Collections
              </NavItem>
            </Link>
            <Link href="/portfolio">
              <NavItem active={router.pathname == '/portfolio'}>Sell</NavItem>
            </Link>
            <CartButton />
        {isConnected ? (
          <ProfileDropdown />
        ) : (
          <Box css={{ maxWidth: '185px' }}>
            <ConnectWalletButton />
          </Box>
        )}
          </Flex>
       
      </Flex>
    </Flex>
  )
}

export default Navbar
