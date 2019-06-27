import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import _ from 'lodash';

import * as sortValues from '../constants/SortValues';

import SortGroup from './SortGroup';
import Product from './Product';
import AdSection from './AdSection';
import Loading from './Loading';
import EndOfCatalogue from './EndOfCatalogue';

const NUMBER_RAND_LIMIT = 1000;

class ProductsGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      sortBy: sortValues.PRICE,
      limitPerPage: 15,
      asciiList: [],
      // eslint-disable-next-line react/no-unused-state
      asciiListNext: [],
      loading: false,
      endOfCatalogue: false,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
    this.headerRandomNumber = this.getHeaderAdImgSrcRandomNumber();
    this.currentlyFetching = false;
    this.getProductsByPageWithSort();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  getProductsByPageWithSort = (reserve = false) => {
    const { page, sortBy, limitPerPage } = this.state;
    if (page === 1) {
      this.adNumbers = [this.headerRandomNumber];
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
        const responseData = response.data;
        const listStateName = reserve ? 'asciiListNext' : 'asciiList';
        const nextPage = page + 1;
        const endOfCatalogue = _.isEmpty(responseData);
        this.setState(
          {
            [listStateName]: responseData,
            page: nextPage,
            endOfCatalogue,
          },
          () => {
            this.currentlyFetching = false;
            if (!reserve) {
              this.getProductsByPageWithSort(true);
            }
          },
        );
      });
  };

  getHeaderAdImgSrcRandomNumber = () => {
    const adSrc = document.getElementsByClassName('ad')[0].src;
    // eslint-disable-next-line radix
    return parseInt(adSrc.split('?r=').pop());
  };

  handleScroll = () => {
    if (
      window.scrollY + window.innerHeight >= document.body.scrollHeight
      && !this.currentlyFetching
      // eslint-disable-next-line react/destructuring-assignment
      && this.state.endOfCatalogue === false
    ) {
      // this if statement also behave like the first trial
      this.fetchMoreData();
    }
  };

  fetchMoreData = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        const self = this;
        setTimeout(() => {
          const { asciiList, asciiListNext } = self.state;
          const currentList = _.clone(asciiList);
          const nextList = _.clone(asciiListNext);
          const newList = _.concat(currentList, nextList);
          const numberOfAdNumbers = Math.floor(newList.length / 19);
          while (self.adNumbers.length < numberOfAdNumbers) {
            this.generateAdNumber();
          }

          self.setState(
            {
              asciiList: newList,
              loading: false,
            },
            () => {
              this.currentlyFetching = true;
              self.getProductsByPageWithSort(true);
            },
          );
        }, 3000);
      },
    );
  };

  onChangeSort = (sortBy) => {
    this.setState(
      {
        sortBy,
        page: 1,
        asciiList: [],
        // eslint-disable-next-line react/no-unused-state
        asciiListNext: [],
        loading: true,
      },
      () => {
        this.getProductsByPageWithSort();
      },
    );
  };

  generateAdNumber = () => {
    // if (this.adNumbers.length >= NUMBER_RAND_LIMIT) return;

    const randomNumber = Math.floor(Math.random() * NUMBER_RAND_LIMIT);
    if (this.adNumbers.indexOf(randomNumber) < 0) {
      this.adNumbers.push(randomNumber);

      this.setState({
        // eslint-disable-next-line react/no-unused-state
        randomNumber, // to reload the state
      });
    }

    this.generateAdNumber();
  };

  render() {
    const {
      sortBy, asciiList, loading, endOfCatalogue,
    } = this.state;
    let displayAdNumber = 0; // for starting index 0, exclude the header ad number
    return (
      // eslint-disable-next-line no-return-assign
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
                // eslint-disable-next-line no-plusplus
                displayAdNumber++;

                const adNumber = this.adNumbers[displayAdNumber];
                console.log('this.adNumbers', this.adNumbers);

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
          {loading ? <Loading /> : null}
          {endOfCatalogue ? <EndOfCatalogue /> : null}
        </Col>
      </Row>
    );
  }
}

export default ProductsGrid;
