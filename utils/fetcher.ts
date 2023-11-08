// @ts-nocheck
import { setParams } from '@reservoir0x/reservoir-sdk'
import NodeCache from "node-cache"
const cache = new NodeCache({ stdTTL: 5 }) // cache for 2 seconds

const fetcher = async (
  url: string,
  params: Record<string, any> = {},
  data: RequestInit = {}
) => {
  const headers = new Headers()

  if (process.env.NEXT_PUBLIC_RESERVOIR_API_KEY) {
    headers.set('x-api-key', process.env.NEXT_PUBLIC_RESERVOIR_API_KEY)
  }

  const path = new URL(url)
  setParams(path, params)
  const cached = cache.get(path.href)
  if(cached) {
    return cached
  }
  
  const collectionSetIdRes = await fetch(
    'https://staging.plusonemusic.io/api/contracts/get-collection-set'
  )
  const collectionSetIdResData = await collectionSetIdRes.json()
  const collectionsSetId = collectionSetIdResData.collectionsSetId

  const response = await fetch(path.href + "&collectionsSetId=" + collectionsSetId, {
    headers,
    ...data,
  })
  const json = await response.json()

  const ret = { data: json, response }
  cache.set(path.href, ret)

  return ret
}

export const basicFetcher = async (href: string, options?: RequestInit) => {
  const response = await fetch(href, options)
  const json = await response.json()

  return { data: json, response }
}

export const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController()
  const signal = controller.signal
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { ...options, signal })
    clearTimeout(timeoutId)
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out')
      }
    }
    throw error
  }
}

export default fetcher
