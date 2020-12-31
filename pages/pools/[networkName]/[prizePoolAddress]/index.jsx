import React from 'react'
import { LandingUI } from 'lib/components/LandingUI'

export async function getStaticProps({
  params: { networkName, prizePoolAddress },
}) {
  return {
    props: { networkName, prizePoolAddress }, // will be passed to the page component as props
  }
}

// This function gets called at build time
export async function getStaticPaths() {
  const paths = [
    {
      params: {
        networkName: 'vlxtest',
        prizePoolAddress: '0x52b1729d6A81C43D7a464A40eCEBd31337921d3f',
      },
    },
  ]

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export default function IndexPage() {
  return <LandingUI />
}
