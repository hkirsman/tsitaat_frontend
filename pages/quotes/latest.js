import fetch from 'isomorphic-unfetch'
import Quotes from '../../components/Quotes';
import React from "react";
import Head from 'next/head';
import headTitle from "../../lib/headTitle";

const Latest = props => (
  <div>
    <Head>
      <title>{headTitle('Viimati lisatud tsitaadid')}</title>
      <meta name="robots" content="noindex" />
    </Head>
    <h1>Viimati lisatud tsitaadid</h1>
    <Quotes quotes={props.quotes} />
  </div>
);

Latest.getInitialProps = async ({ req }) => {
  const res = await fetch('http://tsitaat.com.lndo.site/tsitaatcom_json/latest-quotes');
  const data = await res.json();
  return { quotes: data }
};

export default Latest