import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'
import { NAVBAR_HEIGHT } from 'components/navbar'
import CollectionsTableTimeToggle from 'components/portfolio/CollectionsTableTimeToggle'
import {
  Box,
  Flex,
  FormatCryptoCurrency,
  HeaderRow,
  TableCell,
  TableRow,
  Text,
} from 'components/primitives'
import Img from 'components/primitives/Img'
import { PercentChange } from 'components/primitives/PercentChange'
import { useMarketplaceChain } from 'hooks'
import Link from 'next/link'
import { ComponentPropsWithoutRef, FC, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

type Props = {
  collections: ReturnType<typeof useCollections>['data']
  loading?: boolean
  volumeKey: '1day' | '7day' | '30day' | 'allTime'
}

const desktopTemplateColumns = '2fr repeat(3, 1fr)';

export const CollectionRankingsTable: FC<Props> = ({
  collections,
  loading,
  volumeKey,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  return (
    <>
      {!loading && collections.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          css={{ py: '$6', gap: '$4', width: '100%' }}
        >
          <Text css={{ color: '#000' }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
          </Text>
          <Text css={{ color: '#000' }}>No collections found</Text>
        </Flex>
      ) : (
        <Flex direction="column" css={{ width: '100%', pb: '$2' }}>
          {isSmallDevice ? (
            <Flex
              justify="between"
              css={{ mb: '$4', '@md': { display: 'none' } }}
            >
              <Text style="subtitle3" color="subtle">
                Pass
              </Text>
              <Text style="subtitle3" color="subtle">
                Volume
              </Text>
            </Flex>
          ) : (
            <TableHeading />
          )}
          <Flex direction="column" css={{ position: 'relative' }}>
            {collections.map((collection, i) => {
              return (
                <RankingsTableRow
                  key={collection.id}
                  collection={collection}
                  rank={i + 1}
                  volumeKey={volumeKey}
                />
              )
            })}
          </Flex>
        </Flex>
      )}
    </>
  )
}

type RankingsTableRowProps = {
  collection: ReturnType<typeof useCollections>['data'][0]
  rank: number
  volumeKey: ComponentPropsWithoutRef<
    typeof CollectionRankingsTable
  >['volumeKey']
}

const RankingsTableRow: FC<RankingsTableRowProps> = ({
  collection,
  rank,
  volumeKey,
}) => {
  const { routePrefix } = useMarketplaceChain()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  console.log(collection )

  if (isSmallDevice) {
    return (
      <Link
        href={`/collection/${routePrefix}/${collection.id}`}
        style={{ display: 'inline-block', minWidth: 0, marginBottom: 24 }}
        key={collection.id}
      >
        <Flex align="center" css={{ cursor: 'pointer' }}>
          <Text css={{ mr: '$4', width: 15 }} style="subtitle3" 
          className="trending-rank">
            {rank}
          </Text>
          <Img
            src={collection.image as string}
            css={{ borderRadius: 8, width: 48, height: 48, objectFit: 'cover' }}
            alt="Collection Image"
            width={48}
            height={48}
            unoptimized
          />
          <Box css={{ ml: '$4', width: '100%', minWidth: 0 }}>
            <Flex align="center" css={{ gap: '$2', mb: 4, maxWidth: '80%' }}>
              <Text
                css={{
                  display: 'inline-block',
                }}
                style="subtitle1"
                ellipsify
              >
                {collection?.name}
              </Text>
              <OpenSeaVerified
                openseaVerificationStatus={
                  collection?.openseaVerificationStatus
                }
              />
            </Flex>
            <Flex align="center">
              <Text css={{ mr: '$1', color: '#000' }} style="body3">
                Floor
              </Text>
              <FormatCryptoCurrency
                amount={collection?.floorAsk?.price?.amount?.decimal}
                address={collection?.floorAsk?.price?.currency?.contract}
                decimals={collection?.floorAsk?.price?.currency?.decimals}
                logoHeight={16}
                maximumFractionDigits={2}
                textStyle="subtitle2"
              />
            </Flex>
          </Box>

          <Flex direction="column" align="end" css={{ gap: '$1' }}>
            <FormatCryptoCurrency
              amount={collection?.volume?.[volumeKey]}
              maximumFractionDigits={1}
              logoHeight={16}
              textStyle="subtitle1"
            />
            {volumeKey !== 'allTime' && (
              <PercentChange
                value={collection?.volumeChange?.[volumeKey]}
                decimals={1}
              />
            )}
          </Flex>
        </Flex>
      </Link>
    )
  } else {
    return (
      <TableRow
        key={collection.id}
        css={{
          gridTemplateColumns: desktopTemplateColumns,
          height: '230px' 
        }}
      >
        <TableCell css={{ minWidth: 0 }}>
          <Link
            href={`/collection/${routePrefix}/${collection.id}`}
            style={{ display: 'inline-block', width: '100%', minWidth: 0 }}
          >
            <Flex
              align="center"
              css={{
                gap: '$2',
                cursor: 'pointer',
                minWidth: 0,
                overflow: 'hidden',
                width: '100$',
              }}
            >
              <Text css={{ mr: '$2', width: 50 }} style="subtitle3" className={"trending-rank rank-"+ rank}>
                {rank}
              </Text>
              <Img
                src={collection.image as string}
                css={{
                  borderRadius: 8,
                  width: 146,
                  height: 146,
                  objectFit: 'cover',
                }}
                alt="Collection Image"
                width={146}
                height={146}
                unoptimized
              />

              <Text
                css={{
                  display: 'inline-block',
                  minWidth: 0,
                }}
                style="subtitle1"
                ellipsify
                className='collection-name'
              >
                {collection?.name}
              </Text>
              <OpenSeaVerified
                openseaVerificationStatus={
                  collection?.openseaVerificationStatus
                }
              />
            </Flex>
          </Link>
        </TableCell>
        <TableCell>
          <Flex
            direction="column"
            align="start"
            justify="start"
            css={{ height: '100%' }}
          >
            <FormatCryptoCurrency
              amount={collection?.volume?.[volumeKey]}
              textStyle="subtitle2"
              logoHeight={14}
            />
            {volumeKey != 'allTime' && collection?.volumeChange && (
              <PercentChange value={collection?.volumeChange[volumeKey]} />
            )}
          </Flex>
        </TableCell>
        <TableCell>
          <Flex
            direction="column"
            align="start"
            justify="start"
            css={{ height: '100%' }}
          >
            <FormatCryptoCurrency
              amount={collection?.floorAsk?.price?.amount?.decimal}
              address={collection?.floorAsk?.price?.currency?.contract}
              decimals={collection?.floorAsk?.price?.currency?.decimals}
              textStyle="subtitle2"
              logoHeight={14}
            />
            {volumeKey != 'allTime' && collection?.floorSaleChange && (
              <PercentChange value={collection?.floorSaleChange[volumeKey]} />
            )}
          </Flex>
        </TableCell>
        <TableCell>
          <FormatCryptoCurrency
            amount={collection?.topBid?.price?.amount?.decimal}
            textStyle="subtitle2"
            logoHeight={14}
            address={collection?.topBid?.price?.currency?.contract}
          />
        </TableCell>
      </TableRow>
    )
  }
}

const headings = ['Artist + Pass', 'Volume', 'Floor', 'Top Offer']

const TableHeading = () => (
  <HeaderRow
    css={{
      display: 'none',
      '@md': { display: 'grid' },
      gridTemplateColumns: desktopTemplateColumns,
      position: 'sticky',
      top: NAVBAR_HEIGHT,
      backgroundColor: '$neutralBg',
      zIndex: 1,
    }}
  >
    {headings.map((heading) => (
      <TableCell key={heading}>
        <Text style="headerColumn">
          {heading}
        </Text>
      </TableCell>
    ))}
  </HeaderRow>
)
