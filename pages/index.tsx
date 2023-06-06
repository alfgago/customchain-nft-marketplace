import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Text, Flex, Box, Button } from 'components/primitives'
import Layout from 'components/Layout'
import { ComponentPropsWithoutRef, useContext, useState } from 'react'
import { Footer } from 'components/home/Footer'
import { useMediaQuery } from 'react-responsive'
import { useMarketplaceChain, useMounted } from 'hooks'
import { useAccount } from 'wagmi'
import { paths } from '@reservoir0x/reservoir-sdk'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import fetcher from 'utils/fetcher'
import { NORMALIZE_ROYALTIES } from './_app'
import supportedChains from 'utils/chains'
import Link from 'next/link'
import ChainToggle from 'components/common/ChainToggle'
import CollectionsTimeDropdown, {
  CollectionsSortingOption,
} from 'components/common/CollectionsTimeDropdown'
import { Head } from 'components/Head'
import { CollectionRankingsTable } from 'components/rankings/CollectionRankingsTable'
import { ChainContext } from 'context/ChainContextProvider'
import { Filters } from 'components/filters/Filters'
import SimpleHeader from 'components/common/SimpleHeader'
import { IndexStyles } from './indexStyles'
import Navbar from 'components/navbar'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const [sortByTime, setSortByTime] =
    useState<CollectionsSortingOption>('1DayVolume')
  const marketplaceChain = useMarketplaceChain()
  const { isDisconnected } = useAccount()

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    limit: 10,
    sortBy: sortByTime,
    includeTopBid: true,
  }

  const { chain } = useContext(ChainContext)

  if (chain.collectionSetId) {
    collectionQuery.collectionsSetId = chain.collectionSetId
  } else if (chain.community) {
    collectionQuery.community = chain.community
  }

  const { data, isValidating } = useCollections(collectionQuery, {
    fallbackData: [ssr.collections[marketplaceChain.id]],
  })

  let collections = data || []

  let volumeKey: ComponentPropsWithoutRef<
    typeof CollectionRankingsTable
  >['volumeKey'] = 'allTime'

  switch (sortByTime) {
    case '1DayVolume':
      volumeKey = '1day'
      break
    case '7DayVolume':
      volumeKey = '7day'
      break
    case '30DayVolume':
      volumeKey = '30day'
      break
  }

  return (
    <Layout>
      <Navbar />
      <Head />
      {isDisconnected && (
        <div>
        <SimpleHeader textAlign="left">
          <Flex
            direction="column"
            align="start"
            css={{ maxWidth: 728, p: '90px 110px', "@media (max-width: 1080px)": {
              p: '90px 24px'
            }, }}
          >
            <Text
              style="h3"
              css={{
                mb: 24,
                width: '100%',
                fontFamily: 'Trap',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '64px',
                lineHeight: '70px',
                color: 'white',
              }}
            >
              Marketplace
            </Text>
            <Text
              style="body1"
              css={{
                mb: 48,
                width: '50%',
                fontFamily: 'Trap',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '32px',
                lineHeight: '35px',
                color: 'white',
              }}
            >
              Buy, sell, and win guest list access from your favorite artists
            </Text>
          </Flex>
        </SimpleHeader></div>
      )}
       <IndexStyles>
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
        <Filters />
      </div>
      </IndexStyles>
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '64px 110px',
          },
        }}
      >
        {/*isDisconnected && (
          /*<Flex
            direction="column"
            align="start"
            css={{ maxWidth: 728, pt: '$5' }}
          >
            <Text style="h3" css={{ mb: 24, width:'100%', fontFamily: 'Trap', fontStyle: 'normal',fontWeight: 700, fontSize: '64px',lineHeight: '70px' }}>Marketplace
            </Text>
            <Text style="body1" css={{ mb: 48, width:'50%',  fontFamily: 'Trap', fontStyle: 'normal',fontWeight: 600, fontSize: '32px',lineHeight: '35px' }}>
            Buy, sell, and win guest  list access from your favorite artists
            </Text>
          </Flex>
        )*/}

        <Flex css={{ gap: 65 }} direction="column">
          {/* <Flex
            justify="between"
            align="start"
            css={{
              flexDirection: 'column',
              gap: 24,
              '@bp800': {
                alignItems: 'center',
                flexDirection: 'row',
              },
            }}
          >
            <Text style="h4" as="h4">
              Popular Collections
            </Text>
            
            <Flex align="center" css={{ gap: '$4' }}>
              <CollectionsTimeDropdown
                compact={compactToggleNames && isMounted}
                option={sortByTime}
                onOptionSelected={(option) => {
                  setSortByTime(option)
                }}
              />
              <ChainToggle />
            </Flex>
              </Flex>*/}
          {isSSR || !isMounted ? null : (
            <CollectionRankingsTable
              collections={collections}
              loading={isValidating}
              volumeKey={volumeKey}
            />
          )}

          <Box css={{ alignSelf: 'center' }}>
            <Link href="/collection-rankings">
              <Button
                css={{
                  minWidth: 224,
                  justifyContent: 'center',
                }}
                size="large"
              >
                View All
              </Button>
            </Link>
          </Box>
        </Flex>
      </Box>
      
      <Footer />
    </Layout>
  )
}

type CollectionSchema =
  paths['/collections/v5']['get']['responses']['200']['schema']
type ChainCollections = Record<string, CollectionSchema>

export const getStaticProps: GetStaticProps<{
  ssr: {
    collections: ChainCollections
  }
}> = async () => {
  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      sortBy: '1DayVolume',
      normalizeRoyalties: NORMALIZE_ROYALTIES,
      includeTopBid: true,
      limit: 10,
    }

  const promises: ReturnType<typeof fetcher>[] = []
  supportedChains.forEach((chain) => {
    const query = { ...collectionQuery }
    if (chain.collectionSetId) {
      query.collectionsSetId = chain.collectionSetId
    } else if (chain.community) {
      query.community = chain.community
    }
    promises.push(
      fetcher(`${chain.reservoirBaseUrl}/collections/v5`, query, {
        headers: {
          'x-api-key': chain.apiKey || '',
        },
      })
    )
  })
  const responses = await Promise.allSettled(promises)
  const collections: ChainCollections = {}
  responses.forEach((response, i) => {
    if (response.status === 'fulfilled') {
      collections[supportedChains[i].id] = response.value.data
    }
  })

  return {
    props: { ssr: { collections } },
    revalidate: 5,
  }
}

export default IndexPage
