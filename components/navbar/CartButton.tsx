import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CartPopover, useCart } from '@reservoir0x/reservoir-kit-ui'
import { Flex, Button, Text } from 'components/primitives'

const CartButton = () => {
  const { data: cartItems } = useCart((cart) => cart.items)
  const { openConnectModal } = useConnectModal()

  return (
    <CartPopover
      onConnectWallet={() => {
        openConnectModal?.()
      }}
      trigger={
        <div>
          <FontAwesomeIcon icon={faShoppingCart} style={{width:"27.08px",height:"30.08px", color:'#FFFFFF' }}  />
          {cartItems.length > 0 && (
            <Flex
              align="center"
              justify="center"
              css={{
                borderRadius: '99999px',
                width: 20,
                height: 20,
                backgroundColor: '$primary9',
                position: 'absolute',
                top: -8,
                right: -6,
              }}
            >
              <Text style="subtitle3" css={{ color: 'white' }}>
                {cartItems.length}
              </Text>
            </Flex>
          )}
          </div>
       // </Button>
      }
    />
  )
}

export default CartButton
