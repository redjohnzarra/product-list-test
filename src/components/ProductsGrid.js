import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';

import * as sortValues from '../constants/SortValues';

class ProductsGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      sortBy: sortValues.PRICE,
      limitPerPage: 30,
    };
  }

  componentDidMount() {
    this.getProductsByPageWithSort();
  }

  getProductsByPageWithSort = () => {
    const { page, sortBy, limitPerPage } = this.state;
    axios
      .get('/api/products', {
        params: {
          _page: page,
          _sort: sortBy,
          _limit: limitPerPage,
        },
      })
      .then((response) => {
        console.log('Response here', response);
      });
  };

  render() {
    return (
      <Row>
        <Col md={12} />
      </Row>
    );
  }
}

export default ProductsGrid;
