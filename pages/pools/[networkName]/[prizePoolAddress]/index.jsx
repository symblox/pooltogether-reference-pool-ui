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
    '/pools/vlxtest/0x52b1729d6A81C43D7a464A40eCEBd31337921d3f',
    '/pools/vlxmain/0xD55AD67b44cfDd6C6443A6f0305187194F491325',
  ]

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export default function IndexPage() {
  return <LandingUI />
}
