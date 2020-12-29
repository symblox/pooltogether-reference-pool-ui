import React from 'react'
import { LandingUI } from 'lib/components/LandingUI'

export async function getStaticProps({params: {networkName, prizePoolAddress}}) {
  return {
    props: {networkName, prizePoolAddress}, // will be passed to the page component as props
  }
}

// This function gets called at build time
export async function getStaticPaths() {
  const paths = [{
    params: {
      networkName: 'vlxtest',
      prizePoolAddress: '0x0AED0f913CA4A9F0Eed6Dbcb526d2DaD32ed7f03'
    }
  }]

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export default function IndexPage () {
  return <LandingUI />
}
