/* eslint-disable react/prop-types */
import React from 'react';
import { Col } from 'react-bootstrap';
import isUndefined from 'lodash/isUndefined';

export default function AdSection({ adNumber }) {
  const imgUrl = isUndefined(adNumber)
    ? 'http://www.broadwaybalancesamerica.com/images/ajax-loader.gif'
    : `/ads/?r=${adNumber}`;
  return (
    <Col md={3} className="product-single-container">
      <img className="single-ad" src={imgUrl} alt={adNumber} />
    </Col>
  );
}
