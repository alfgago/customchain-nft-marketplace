import { FC } from 'react'
import { Text, Box, Flex, Anchor, Button } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import Link from "next/link"

import { FooterStyles } from "./FooterStyles"

type SectionTitleProps = {
  title: string
}

const SectionTitle: FC<SectionTitleProps> = ({ title }) => (
  <Text style="subtitle1" css={{ color: '$gray12', mb: 8 }}>
    {title}
  </Text>
)

type SectionLinkProps = {
  name: string
  href: string
}

const SectionLink: FC<SectionLinkProps> = ({ name, href }) => (
  <Anchor
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    weight="medium"
    css={{ fontSize: 14, mt: 16 }}
  >
    {name}
  </Anchor>
)

const developerSectionLinks = [
  {
    name: 'Docs',
    href: 'https://docs.reservoir.tools/docs',
  },
  {
    name: 'API Reference',
    href: 'https://docs.reservoir.tools/reference/overview',
  },
  {
    name: 'Github',
    href: 'https://github.com/reservoirprotocol',
  },
]

const companySectionLinks = [
  {
    name: 'Jobs',
    href: 'https://jobs.ashbyhq.com/reservoir',
  },
  {
    name: 'Terms of Use',
    href: 'https://reservoir.tools/terms',
  },
  {
    name: 'Privacy Policy',
    href: 'https://reservoir.tools/privacy',
  },
]

export const Footer = () => {
  return (
    <FooterStyles>
    <section className="footer">
      <div className="content">
        <Link href="/">
          <img
            src="https://staging.plusonemusic.io/assets/img/long-logo.svg"
            alt="plusOne-horizontal"
            className="watermark-logo"
          />
        </Link>
         <div className='links'>
          <ul>
            <li>
              <Link href="/resources/artists">Explore Artists</Link>
            </li>
            <li>
              <Link href="/resources/passes">Explore Passes</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
          </ul>
          <span className="preload-font tickerbit">Tickerbit</span>
       </div>
      </div>
    </section>
  </FooterStyles>
  )
}
