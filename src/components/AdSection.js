/* eslint-disable react/prop-types */
import React from 'react';
import { Col } from 'react-bootstrap';

export default function AdSection({ adNumber }) {
  return (
    <Col md={3} className="product-single-container">
      <img className="single-ad" src={`/ads/?r=${adNumber}`} alt={adNumber} />
    </Col>
  );
}
