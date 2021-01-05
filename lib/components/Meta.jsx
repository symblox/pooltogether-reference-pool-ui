import Head from 'next/head'

export const Meta = ({ title }) => {
  const defaultTitle = 'Pooled VLX'
  title = title ? `${title} - ${defaultTitle}` : defaultTitle

  const url = `https://symblox.io`
  const description = `Deposit and withdraw to V3 Pools`
  const keywords = 'velas'
  const twitterHandle = '@symbloxdefi'

  return (
    <>
      <Head>
        <title>{title}</title>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2W1PDE9N7M"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-2W1PDE9N7M');
        </script>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no,user-scalable=no"
        />
        <meta charSet="utf-8" />

        <link rel="icon" type="image/png" href="/favicon.png" />

        <link rel="stylesheet" href="/animate.css" />

        <meta name="theme-color" content="#1a083a" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta
          property="twitter:image:src"
          content={`${url}/pooltogether-facebook-share-image-1200-630@2x.png`}
        />
        <meta property="og:rich_attachment" content="true" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta property="twitter:title" content={title} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content={twitterHandle} />
        <meta
          property="twitter:image:src"
          content={`${url}/pooltogether-twitter-share-image-1200-675@2x.png`}
        />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:creator" content={twitterHandle} />
      </Head>
    </>
  )
}
