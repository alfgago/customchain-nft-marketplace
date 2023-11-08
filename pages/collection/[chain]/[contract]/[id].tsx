// @ts-nocheck
import {
  faArrowLeft,
  faChevronDown,
  faCircleExclamation,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Tabs from '@radix-ui/react-tabs'
import {
  TokenMedia,
  useAttributes,
  useBids,
  useCollections,
  useDynamicTokens,
  useListings,
  useTokenActivity,
  useTokenOpenseaBanned,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import { ActivityFilters } from 'components/token/ActivityFilters'
import { spin } from 'components/common/LoadingSpinner'
import { MobileActivityFilters } from 'components/common/MobileActivityFilters'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'
import Layout from 'components/Layout'
import {
  Anchor,
  Box,
  Button,
  Flex,
  Grid,
  Text,
  Tooltip,
} from 'components/primitives'
import { Dropdown } from 'components/primitives/Dropdown'
import { TabsContent, TabsList, TabsListContract, TabsTrigger } from 'components/primitives/Tab'
import AttributeCard from 'components/token/AttributeCard'
import FullscreenMedia from 'components/token/FullscreenMedia'
import { PriceData } from 'components/token/PriceData'
import RarityRank from 'components/token/RarityRank'
import { TokenActions } from 'components/token/TokenActions'
import { TokenActivityTable } from 'components/token/ActivityTable'
import { TokenInfo } from 'components/token/TokenInfo'
import { ToastContext } from 'context/ToastContextProvider'
import { useENSResolver, useMarketplaceChain, useMounted } from 'hooks'
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import { useContext, useEffect, useState } from 'react'
import { jsNumberForAddress } from 'react-jazzicon'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { useMediaQuery } from 'react-responsive'
import supportedChains, { DefaultChain } from 'utils/chains'
import fetcher from 'utils/fetcher'
import { DATE_REGEX, timeTill } from 'utils/till'
import titleCase from 'utils/titleCase'
import { useAccount } from 'wagmi'
import { Head } from 'components/Head'
import { OffersTable } from 'components/token/OffersTable'
import { ListingsTable } from 'components/token/ListingsTable'
import Navbar from 'components/navbar'
import SimpleHeader from 'components/common/SimpleHeader'
import GradientSection from 'components/common/GradientSection'

type Props = InferGetStaticPropsType<typeof getStaticProps>

type ActivityTypes = Exclude<
  NonNullable<
    NonNullable<
      Exclude<Parameters<typeof useTokenActivity>['1'], boolean>
    >['types']
  >,
  string
>

const IndexPage: NextPage<Props> = ({ id, collectionId, ssr }) => {
  const router = useRouter()
  const { addToast } = useContext(ToastContext)
  const account = useAccount()
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 }) && isMounted
  const [tabValue, setTabValue] = useState('info')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [activityFiltersOpen, setActivityFiltersOpen] = useState(true)
  const [activityTypes, setActivityTypes] = useState<ActivityTypes>([])

  const { proxyApi } = useMarketplaceChain()
  const contract = collectionId ? collectionId?.split(':')[0] : undefined
  const { data: collections } = useCollections(
    {
      contract: contract,
    },
    {
      fallbackData: [ssr.collection],
    }
  )
  const collection = collections && collections[0] ? collections[0] : null

  const { data: tokens, mutate } = useDynamicTokens(
    {
      tokens: [`${contract}:${id}`],
      includeAttributes: true,
      includeTopBid: true,
      includeQuantity: true,
    },
    {
      fallbackData: [ssr.tokens],
    }
  )

  const flagged = useTokenOpenseaBanned(collectionId, id)
  const token = tokens && tokens[0] ? tokens[0] : undefined
  const is1155 = token?.token?.kind === 'erc1155'

  const { data: userTokens } = useUserTokens(
    is1155 ? account.address : undefined,
    {
      tokens: [`${contract}:${id}`],
    }
  )

  const { data: offers } = useBids({
    token: `${token?.token?.collection?.id}:${token?.token?.tokenId}`,
    includeRawData: true,
    sortBy: 'price',
    limit: 1,
  })

  const { data: listings } = useListings({
    token: `${token?.token?.collection?.id}:${token?.token?.tokenId}`,
    includeRawData: true,
    sortBy: 'price',
    limit: 1,
  })

  const offer = offers && offers[0] ? offers[0] : undefined
  const listing = listings && listings[0] ? listings[0] : undefined

  const attributesData = useAttributes(collectionId)

  let countOwned = 0
  if (is1155) {
    countOwned = Number(userTokens?.[0]?.ownership?.tokenCount || 0)
  } else {
    countOwned =
      token?.token?.owner?.toLowerCase() === account?.address?.toLowerCase()
        ? 1
        : 0
  }

  const isOwner = countOwned > 0
  const owner = isOwner ? account?.address : token?.token?.owner
  const { displayName: ownerFormatted } = useENSResolver(token?.token?.owner)

  const tokenName = `${token?.token?.name || `#${token?.token?.tokenId}`}`

  const hasAttributes =
    token?.token?.attributes && token?.token?.attributes.length > 0

  const trigger = (
    <Button
      color="gray3"
      size="small"
      css={{
        justifyContent: 'space-between',
        width: '336px',
        px: '$2',
        py: '$2',
      }}
    >
      {isSmallDevice ? null : (
        <Text style="body1">
          {activityTypes.map(titleCase).join(', ') || 'All Events'}
        </Text>
      )}
      <Text css={{ color: '$slate10' }}>
        <FontAwesomeIcon icon={faChevronDown} width={16} height={16} />
      </Text>
    </Button>
  )

  useEffect(() => {
    let tab = tabValue
    const hasAttributesTab = isMounted && isSmallDevice && hasAttributes
    if (hasAttributesTab) {
      tab = 'attributes'
    } else {
      tab = 'info'
    }

    let deeplinkTab: string | null = null
    if (typeof window !== 'undefined') {
      const params = new URL(window.location.href).searchParams
      deeplinkTab = params.get('tab')
    }

    if (deeplinkTab) {
      switch (deeplinkTab) {
        case 'attributes':
          if (hasAttributesTab) {
            tab = 'attributes'
          }
          break
        case 'info':
          tab = 'info'
          break
        case 'activity':
          tab = 'activity'
          break
        case 'listings':
          tab = 'listings'
          break
        case 'offers':
          tab = 'offers'
          break
      }
    }
    setTabValue(tab)
  }, [isSmallDevice])

  useEffect(() => {
    router.query.tab = tabValue
    router.push(router, undefined, { shallow: true })
  }, [tabValue])

  const pageTitle = token?.token?.name
    ? token.token.name
    : `${token?.token?.tokenId} - ${token?.token?.collection?.name}`

  return (
    <Layout>
      <Head
        ogImage={token?.token?.image || collection?.banner}
        title={pageTitle}
        description={collection?.description as string}
      />
      <div>
        <SimpleHeader textAlign="left">
          <Flex
            css={{
              //maxWidth: 1175,
              pt: 140,
              pb: 100,
              marginLeft: 110,
              marginRight: 110,
              gap: 20,
              flexDirection: 'column',
              // alignItems: 'center',
              '@md': {
                px: '$3',
                flexDirection: 'row',
                gap: 40,
                alignItems: 'flex-start',
              },
              '@media(max-width: 960px)': {
                margin: '0px 34px',
              },
              '@lg': {
                gap: 80,
              },
            }}
          >
            <Flex
              direction="column"
              css={{
                maxWidth: '100%',
                //flex: 1,
                width: 390,
                height: isSmallDevice ? 320 : 410,
                //width: '100%',
               //'@md': { maxHeight: 320 },
                position: 'relative',
                '@sm': {
                  '>button': {
                    height: 0,
                    opacity: 0,
                    transition: 'opacity .3s',
                  },
                },
                ':hover >button': {
                  opacity: 1,
                  transition: 'opacity .3s',
                },
              }}
            >
              <Box
                css={{
                  borderRadius: 8,
                  width: '100%',
                  height: '100%',
                  '@sm': {
                    button: {
                      height: 0,
                      opacity: 0,
                      transition: 'opacity .3s',
                    },
                  },
                  ':hover button': {
                    opacity: 1,
                    transition: 'opacity .3s',
                  },
                }}
              >
                <TokenMedia
                  token={token?.token}
                  videoOptions={{ autoPlay: true, muted: true }}
                  style={{
                    width: '100%',
                    height: '100%',
                   // minHeight: isMounted && isSmallDevice ? 300 : 445,
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                  onRefreshToken={() => {
                    mutate?.()
                    addToast?.({
                      title: 'Refresh token',
                      description:
                        'Request to refresh this token was accepted.',
                    })
                  }}
                />
                <FullscreenMedia token={token} />
              </Box>
            </Flex>

            <Flex
              direction="column"
              css={{
                flex: 1,
                px: '$3',
                width: '100%',
                position: 'relative',
                '@md': {
                  px: 0,
                  maxWidth: '60%',
                  overflow: 'hidden',
                },
              }}
            >
              <Flex justify="between" align="center" css={{ mb: 20 }}>
                <Flex align="center" css={{ mr: '$2', gap: '$2' }}>
                  <Link
                    href={`/collection/${router.query.chain}/${token?.token?.collection?.id}`}
                    legacyBehavior={true}
                  >
                    <Anchor
                      //color="primary"
                      css={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '$2',
                        color: '#ffff',
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} height={16} />
                      <Text
                        css={{ color: 'inherit' }}
                        style="subtitle1"
                        ellipsify
                      >
                        {token?.token?.collection?.name}
                      </Text>
                    </Anchor>
                  </Link>
                  <OpenSeaVerified
                    openseaVerificationStatus={
                      collection?.openseaVerificationStatus
                    }
                  />
                </Flex>
              </Flex>
              <Flex align="center" css={{ gap: '$2' }}>
                <Text
                  style="h4"
                  css={{ wordBreak: 'break-all', color: '#ffff' }}
                >
                  {tokenName}
                </Text>
                {flagged && (
                  <Tooltip
                    content={
                      <Text style="body3" as="p">
                        Not tradeable on OpenSea
                      </Text>
                    }
                  >
                    <Text css={{ color: '#ffff' }}>
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        width={16}
                        height={16}
                      />
                    </Text>
                  </Tooltip>
                )}
              </Flex>
              {token && (
                <>
                  {is1155 && countOwned > 0 && (
                    <Flex align="center" css={{ mt: '$2' }}>
                      <Text style="subtitle3" color="subtle" css={{ mr: '$2' }}>
                        You own {countOwned}
                      </Text>
                      <Link href={`/portfolio`} legacyBehavior={true}>
                        <Anchor
                          //color="primary"
                          weight="normal"
                          css={{ ml: '$1', fontSize: 12, color: '#ffff' }}
                        >
                          Sell
                        </Anchor>
                      </Link>
                    </Flex>
                  )}
                  {!is1155 && (
                    <Flex align="center" css={{ mt: '$2' }}>
                      <Text
                        style="subtitle3"
                        css={{ mr: '$2', color: '#ffff' }}
                      >
                        Owner
                      </Text>
                      <Jazzicon
                        diameter={16}
                        seed={jsNumberForAddress(owner || '')}
                      />
                      <Link href={`/profile/${owner}`} legacyBehavior={true}>
                        <Anchor
                          weight="normal"
                          css={{ ml: '$1', color: '#ffff' }}
                        >
                          {isMounted ? ownerFormatted : ''}
                        </Anchor>
                      </Link>
                    </Flex>
                  )}
                  <RarityRank
                    token={token}
                    collection={collection}
                    collectionAttributes={attributesData?.data}
                  />
                  <PriceData token={token} />
                </>
              )}
            </Flex>
          </Flex>
        </SimpleHeader>
        <GradientSection>
          <>
            {/*token && (
            <div style={{
              marginTop: '-70px',
              zIndex: 9,
              position: 'relative',
              width: '100%'}}>
              {isMounted && (
                <TokenActions
                  token={token}
                  offer={offer}
                  listing={listing}
                  isOwner={isOwner}
                  mutate={mutate}
                  account={account}
                />
              )}
              </div>
              )
              */}
          </>
        </GradientSection>
      </div>
      <Flex
        css={{
          maxWidth: 1175,
          pb: 100,
          marginLeft: "auto",
          marginRight:"auto",
          gap: 20,
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 12,
          position: 'relative',
          '@md': {
            mt: 48,
            px: '$3',
            flexDirection: 'row',
            gap: 40,
            alignItems: 'flex-start',
          },
          '@media(max-width: 960px)': {
            margin: '0px 34px',
          },
          '@lg': {
            gap: 80,
          },
        }}
      >
        <Flex
          direction="column"
          css={{
            flex: 1,
            px: '$3',
            width: '100%',
            '@md': {
              px: 0,
              maxWidth: '100%',
              overflow: 'hidden',
            },
          }}
        >
          {token && (
            <>
              {isMounted && (
                <TokenActions
                  token={token}
                  offer={offer}
                  listing={listing}
                  isOwner={isOwner}
                  mutate={mutate}
                  account={account}
                />
              )}
              <div style={{ maxWidth: isSmallDevice ? '100%' : '80%' }}>
                <Tabs.Root
                  defaultValue=""
                  value={tabValue}
                  onValueChange={(value) => setTabValue(value)}
                  style={{
                    paddingRight: isSmallDevice ? 0 : 15,
                  }}
                >
                  <TabsListContract
                    css={{
                      overflowX: isSmallDevice ? 'scroll' : 'unset',
                    }}
                  >
                    {isMounted && isSmallDevice && hasAttributes && (
                      <TabsTrigger value="attributes">Attributes</TabsTrigger>
                    )}
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="listings">Listings</TabsTrigger>
                    <TabsTrigger value="offers">Offers</TabsTrigger>
                  </TabsListContract>
                  <TabsContent value="attributes" css={{ padding: "30px", background: "#f5f5f5" }}>
                    {token?.token?.attributes && (
                      <Grid
                        css={{
                          gap: '$3',
                          mt: 24,
                          gridTemplateColumns: '1fr',
                          '@sm': {
                            gridTemplateColumns: '1fr 1fr',
                          },
                        }}
                      >
                        {token?.token?.attributes?.map((attribute) => (
                          <AttributeCard
                            key={`${attribute.key}-${attribute.value}`}
                            attribute={attribute}
                            collectionTokenCount={collection?.tokenCount || 0}
                            collectionId={collection?.id}
                          />
                        ))}
                      </Grid>
                    )}
                  </TabsContent>
                  <TabsContent value="info" css={{ padding: "30px", background: "#f5f5f5" }}>
                    {collection && (
                      <TokenInfo token={token} collection={collection} />
                    )}
                  </TabsContent>
                  <TabsContent value="activity" css={{ mr: -15, padding: "30px", background: "#f5f5f5" }}>
                    {isSmallDevice ? (
                      <MobileActivityFilters
                        activityTypes={activityTypes}
                        setActivityTypes={setActivityTypes}
                      />
                    ) : (
                      <Dropdown
                        trigger={trigger}
                        contentProps={{
                          sideOffset: 8,
                        }}
                      >
                        <ActivityFilters
                          open={activityFiltersOpen}
                          setOpen={setActivityFiltersOpen}
                          activityTypes={activityTypes}
                          setActivityTypes={setActivityTypes}
                        />
                      </Dropdown>
                    )}
                    <TokenActivityTable
                      id={`${contract}:${token?.token?.tokenId}`}
                      activityTypes={activityTypes}
                    />
                  </TabsContent>
                  <TabsContent value="listings" css={{ padding: "30px", background: "#f5f5f5" }}>
                    <ListingsTable
                      token={`${contract}:${token?.token?.tokenId}`}
                      address={account.address}
                      is1155={is1155}
                      isOwner={isOwner}
                    />
                  </TabsContent>
                  <TabsContent value="offers" css={{ mr: -15, width: '100%', padding: "30px", background: "#f5f5f5" }}>
                    <OffersTable
                      token={`${contract}:${token?.token?.tokenId}`}
                      address={account.address}
                      is1155={is1155}
                      isOwner={isOwner}
                    />
                  </TabsContent>
                </Tabs.Root>
              </div>
            </>
          )}
        </Flex>
      </Flex>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{
  id?: string
  collectionId?: string
  ssr: {
    collection: paths['/collections/v5']['get']['responses']['200']['schema']
    tokens: paths['/tokens/v6']['get']['responses']['200']['schema']
  }
}> = async ({ params }) => {
  let collectionId = params?.contract?.toString()
  const id = params?.id?.toString()
  const { reservoirBaseUrl, apiKey } =
    supportedChains.find((chain) => params?.chain === chain.routePrefix) ||
    DefaultChain

  const contract = collectionId ? collectionId?.split(':')[0] : undefined

  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      contract: contract,
      includeTopBid: true,
      normalizeRoyalties: NORMALIZE_ROYALTIES,
    }

  const headers = {
    headers: {
      'x-api-key': apiKey || '',
    },
  }

  const collectionsPromise = fetcher(
    `${reservoirBaseUrl}/collections/v5`,
    collectionQuery,
    headers
  )

  let tokensQuery: paths['/tokens/v6']['get']['parameters']['query'] = {
    tokens: [`${contract}:${id}`],
    includeAttributes: true,
    includeTopBid: true,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    includeDynamicPricing: true,
  }

  const tokensPromise = fetcher(
    `${reservoirBaseUrl}/tokens/v6`,
    tokensQuery,
    headers
  )
  const promises = await Promise.allSettled([
    collectionsPromise,
    tokensPromise,
  ]).catch(() => {})
  const collection: Props['ssr']['collection'] =
    promises?.[0].status === 'fulfilled' && promises[0].value.data
      ? (promises[0].value.data as Props['ssr']['collection'])
      : {}
  const tokens: Props['ssr']['tokens'] =
    promises?.[1].status === 'fulfilled' && promises[1].value.data
      ? (promises[1].value.data as Props['ssr']['tokens'])
      : {}

  return {
    props: { collectionId, id, ssr: { collection, tokens } },
    revalidate: 20,
  }
}

export default IndexPage
