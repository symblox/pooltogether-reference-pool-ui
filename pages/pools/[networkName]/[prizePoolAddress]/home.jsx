import React from 'react'
import { DepositorUI } from 'lib/components/DepositorUI'

export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}

// This function gets called at build time
export async function getStaticPaths() {
  const paths = ['/pools/vlxtest/0x0AED0f913CA4A9F0Eed6Dbcb526d2DaD32ed7f03/home']

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export default function IndexPage () {
  return <DepositorUI />
}
