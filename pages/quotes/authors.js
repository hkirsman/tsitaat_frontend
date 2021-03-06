import array_chunk_to_3_groups from '../../lib/array_chunk_to_3_groups';
import Error from 'next/error';
import fetch from 'isomorphic-unfetch'
import Head from 'next/head';
import headTitle from "../../lib/headTitle";
import isAuthorListingPage from '../../lib/isAuthorListingPage';
import isAuthorPage from '../../lib/isAuthorPage';
import Quotes from '../../components/Quotes';
import React from "react";
import { endpoint } from '../../config';
import {Link} from '../../routes';

class Authors extends React.Component {

  static async getInitialProps({ query }) {
    if (isAuthorListingPage(query)) {
      const res = await fetch(endpoint + '/tsitaatcom_json/authors/' + Object.values(query).map(x => encodeURI(x)).join('/'));
      let data = await res.json();
      data.items = array_chunk_to_3_groups(Array.from(data.items));
      return { data: data.items, query: query }
    }
    else if (isAuthorPage(query)) {
      const res = await fetch(endpoint + '/tsitaatcom_json/author-quotes/' + encodeURI(query.author_name) + (typeof query.page != 'undefined' ? '?page=' + query.page : ''));
      const data = await res.json();
      return { data: data.items, pager: data.pager, query: query }
    }
  }

  render() {
    if (isAuthorListingPage(this.props.query) && this.props.data.length > 0) {
      return (
        <div>
          <Head>
            <title>{headTitle('Autori kategooria: ' + this.props.query.author_name)}</title>
            <meta name="robots" content="noindex" />
          </Head>

          <h1>Autori kategooria: {this.props.query.author_name}</h1>
          <div className="author-tag-listing">
            <div className="author-tag-listing-inner">
              {this.props.data.map((group, index) => {
                return (
                  <ul className={'column column-' + index} key={index}>
                    {group.map(item => (
                      <li key={item.quote_author_nid}>
                        <Link route={'/tsitaadid/autorid/' + item.quote_author_urlfriendly_name}>
                          <a dangerouslySetInnerHTML={{__html: item.author_name_formated}}></a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                );
              })}
            </div>
          </div>
        </div>
      )
    }
    else if (isAuthorPage(this.props.query) && this.props.data.length > 0) {
      return (
        <div>
          <Head>
            <title>{headTitle(this.props.data[0].quote_author_name_without_bracket_content)}</title>
            <meta name="description"
              content={this.props.data[0].quote_author_name_without_bracket_content +
              ' tsitaadid ja ütlemised. ' +
              this.props.data[0].quote_author_name_without_bracket_content + ' '+
              this.props.data[0].quote_author_profession_rendered + '.'} />
          </Head>
          <div className="normal-content">
            <h1>
              {this.props.data[0].quote_author_name_without_bracket_content}
            </h1>
            <p className="author_profession">{this.props.data[0].quote_author_profession_rendered}</p>
          </div>
          <Quotes
            quotes={this.props.data}
            hide_author_name={true}
            hide_author_profession={true}
            cookies={this.props.cookies}
            pager={this.props.pager} />
        </div>
      );
    }
    else {
      return (
        <Error statusCode={404} />
      );
    }

  }
}

export default Authors
