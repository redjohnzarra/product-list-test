import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import _ from 'lodash';

import * as sortValues from '../constants/SortValues';

import SortGroup from './SortGroup';
import Product from './Product';
import AdSection from './AdSection';

const NUMBER_RAND_LIMIT = 1000;

class ProductsGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      sortBy: sortValues.PRICE,
      limitPerPage: 40,
      asciiList: [],
    };
  }

  componentDidMount() {
    this.headerRandomNumber = this.getHeaderAdImgSrcRandomNumber();
    this.getProductsByPageWithSort();
  }

  getProductsByPageWithSort = (append = false) => {
    const {
      page, sortBy, limitPerPage, asciiList,
    } = this.state;
    if (page === 1) {
      this.adNumbers = [this.headerRandomNumber];
      console.log('this.adNumbers', this.adNumbers);
    }

    axios
      .get('/api/products', {
        params: {
          _page: page,
          _sort: sortBy,
          _limit: limitPerPage,
        },
      })
      .then((response) => {
        let data;
        const responseData = response.data;
        console.log('responseData', responseData);
        if (append) {
          data = responseData.push(_.clone(asciiList));
        } else {
          data = responseData;
        }

        this.setState({
          asciiList: data,
        });
      });
  };

  getHeaderAdImgSrcRandomNumber = () => {
    const adSrc = document.getElementsByClassName('ad')[0].src;
    // eslint-disable-next-line radix
    return parseInt(adSrc.split('?r=').pop());
  };

  onChangeSort = (sortBy) => {
    this.setState(
      {
        sortBy,
      },
      () => {
        this.getProductsByPageWithSort();
      },
    );
  };

  generateAdNumber = () => {
    if (this.adNumbers.length >= NUMBER_RAND_LIMIT) return;

    const randomNumber = Math.floor(Math.random() * NUMBER_RAND_LIMIT);
    if (this.adNumbers.indexOf(randomNumber) < 0) {
      this.adNumbers.push(randomNumber);

      // eslint-disable-next-line consistent-return
      return randomNumber;
    }

    this.generateAdNumber();
  };

  render() {
    const { sortBy, asciiList } = this.state;

    return (
      <Row className="products-grid">
        <Col md={12} className="sort-container">
          <span>Sorted By: </span>
          <SortGroup sortValues={sortValues} activeSort={sortBy} onChangeSort={this.onChangeSort} />
        </Col>
        <Col md={12}>
          <br />
          <Row>
            {_.map(asciiList, (ascii, idx) => {
              const count = idx + 1;
              if (count % 20 === 0) {
                // 21 because after 20
                const adNumber = this.generateAdNumber();

                return (
                  <React.Fragment>
                    <Product ascii={ascii} />
                    <AdSection adNumber={adNumber} />
                  </React.Fragment>
                );
              }
              return <Product ascii={ascii} />;
            })}
          </Row>
        </Col>
      </Row>
    );
  }
}

export default ProductsGrid;
