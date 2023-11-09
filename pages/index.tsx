// @ts-nocheck
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Text, Flex, Box, Button } from 'components/primitives'
import Layout from 'components/Layout'
import {
  ComponentPropsWithoutRef,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useMediaQuery } from 'react-responsive'
import { useMarketplaceChain, useMounted } from 'hooks'
import { useAccount, useFeeData, useSignTypedData } from 'wagmi'
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
import GradientSection from 'components/common/GradientSection'
import { IndexStyles } from './indexStyles'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const [sortByTime, setSortByTime] =
    useState<CollectionsSortingOption>('1DayVolume')
  const marketplaceChain = useMarketplaceChain()
  const { isDisconnected } = useAccount()
  const [arrayPages, setArrayPages] = useState([1, 2, 3])
  const [userClickedPage, setUserClickedPage] = useState(1)
  const [trimParameters, setTrimParameters] = useState([0, 10])

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    limit: 20,
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

  const isSmallDevice = useMediaQuery({ maxWidth: 900 }) && isMounted

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

  const numberPerPage = 5

  function buildPage(currPage: any) {
    const trimStart = (currPage - 1) * numberPerPage
    const trimEnd = trimStart + numberPerPage
    if (collections.length >= numberPerPage * currPage) {
      setTrimParameters([trimStart, trimEnd])
    }
  }

  function buildPagination(clickedPage: any) {
    let newArray = []
    if (clickedPage >= 3) {
      if (collections.length >= numberPerPage * clickedPage + 1) {
        for (let i = clickedPage - 1; i <= clickedPage + 1; i++) {
          newArray.push(i)
        }
        setArrayPages(newArray)
      }
    } else {
      setArrayPages([1, 2, 3])
    }
    setUserClickedPage(clickedPage)
  }

  useEffect(() => {
    buildPagination(1)
    buildPage(1)
  }, [])

  function clickPage(clickedPage: any) {
    buildPagination(clickedPage)
    buildPage(clickedPage)
  }

  return (
    <IndexStyles>
      <Layout>
        <Head />
        <div>
            <SimpleHeader textAlign="left">
              <Flex
                direction="column"
                align="start"
                css={{
                  maxWidth: 1200,
                  p: '90px 110px',
                  '@media(max-width: 960px)': {
                    p: '90px 34px',
                  },
                }}
              >
                <Text
                  style="h1"
                  css={{
                    mb: 24,
                    mt: 44,
                    width: '100%',
                    fontWeight: 700,
                    fontSize: isSmallDevice ? 44 : 64,
                    lineHeight: '70px',
                    color: 'white',
                  }}
                >
                  Trending Passes
                </Text>
                
              </Flex>
            </SimpleHeader>
            <GradientSection>
              <Filters />
            </GradientSection>
          </div>
        <Box
          css={{
            //p: 24,
            p: '24px 110px',
            zIndex: 12,
            position: 'relative',
            height: '100%',
            '@media(max-width: 960px)': {
              p: '64px 34px',
            },
          }}
        >

          <Flex css={{ gap: 65 }} direction="column">
            {isSSR || !isMounted ? null : (
              <CollectionRankingsTable
                collections={collections.slice(
                  trimParameters[0],
                  trimParameters[1]
                )}
                loading={isValidating}
                volumeKey={volumeKey}
              />
            )}
            {false && <Flex justify="center" css={{ flexDirection: 'row' }}>
              {arrayPages.map((page: any) => {
                return (
                  <div style={{ padding: '10px' }}>
                    <button
                      className={`btn btn-primary paginationButton ${
                        page === userClickedPage
                          ? 'clickedPage'
                          : 'paginationPage'
                      }`}
                      onClick={() => {
                        clickPage(page)
                      }}
                      value={page}
                    >
                      {page}
                    </button>
                  </div>
                )
              })}
            </Flex>}
          </Flex>
        </Box>
      </Layout>
    </IndexStyles>
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
      limit: 20,
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
