import { ConnectButton } from '@rainbow-me/rainbowkit'
import Box from 'components/primitives/Box'
import Button from 'components/primitives/Button'
import { FC } from 'react'
import { ReactSVG } from "react-svg"
import { ConnectWalletStyles } from './ConnectWalletStyles'

type Props = {}

export const ConnectWalletButton: FC<Props> = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        return (
          <ConnectWalletStyles>
          <Box
            style={{
              flex: '1',
              display: 'flex',
              justifyContent: 'flex',
            }}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  /*<Button
                    css={{ flex: 1, justifyContent: 'center' }}
                    corners="rounded"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </Button>*/
                  <ReactSVG src="/icons/wallet.svg" style={{width:"27.08px",height:"30.08px"}} className="wallet-icon" onClick={openConnectModal}/>
                )
              }
            })()}
          </Box>
          </ConnectWalletStyles>
        )
      }}
    </ConnectButton.Custom>
  )
}
