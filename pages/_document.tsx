import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"
import { ServerStyleSheet } from "styled-components"
import { getCssText } from "../stitches.config"

class MyDocument extends Document {

  render() {
    return (
      <Html>
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          {/* Meta tags */}
          <meta name="keywords" content="nft, ethereum, protocol" />
          <meta name="keywords" content="NFT, API, Protocol" />
          {/* Favicon */}
          <link rel="shortcut icon" href="/favicon.ico" />
          {/* Reservoir meta tags */}
          <meta property="reservoir:title" content="Reservoir Market" />
          <meta property="reservoir:icon" content="/reservoir-source-icon.png" />
          <meta
            property="reservoir:token-url-mainnet"
            content="/collection/ethereum/${contract}/${tokenId}"
          />
          <meta
            property="reservoir:token-url-goerli"
            content="/collection/goerli/${contract}/${tokenId}"
          />
          <meta
            property="reservoir:token-url-polygon"
            content="/collection/polygon/${contract}/${tokenId}"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }

  static getInitialProps = async (ctx: DocumentContext) => {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>,
        ],
      }
    } finally {
      sheet.seal()
    }
  }
}
export default MyDocument