import React from 'react'
import { ManageUI } from 'lib/components/ManageUI'

export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}

// This function gets called at build time
export async function getStaticPaths() {
  const paths = [
    '/pools/vlxtest/0x52b1729d6A81C43D7a464A40eCEBd31337921d3f/manage',
  ]

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export default function IndexPage() {
  return <ManageUI />
}
