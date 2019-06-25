/* eslint-disable radix */
/* eslint-disable react/prop-types */
import React from 'react';

import { Card, Col, Row } from 'react-bootstrap';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatPrice(price) {
  return `$${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

function formatDate(date) {
  const dateObject = new Date(date);
  const dateTime = dateObject.getTime();
  const currentTime = new Date().getTime();
  const oneWeekInSeconds = 604800;
  const secondsPast = (currentTime - dateTime) / 1000;

  if (secondsPast < oneWeekInSeconds) {
    let relativeTimeLabel = '';
    let relativeTimeValue = '';
    if (secondsPast < 60) {
      relativeTimeValue = parseInt(secondsPast);
      relativeTimeLabel = 'second';
    } else if (secondsPast < 3600) {
      relativeTimeValue = parseInt(secondsPast / 60);
      relativeTimeLabel = 'minute';
    } else if (secondsPast <= 86400) {
      relativeTimeValue = parseInt(secondsPast / 3600);
      relativeTimeLabel = 'hour';
    } else {
      relativeTimeValue = parseInt(secondsPast / 86400);
      relativeTimeLabel = 'day';
    }

    const label = relativeTimeValue > 1 ? `${relativeTimeLabel}s` : relativeTimeLabel;
    return `${relativeTimeValue} ${label} ago`;
  }

  const dateMonthName = monthNames[dateObject.getMonth() + 1];
  const dateValue = dateObject.getDate();
  const dateYear = dateObject.getFullYear();
  const dateHours = dateObject.getHours();
  const dateMinutes = dateObject.getMinutes();
  const dateSeconds = dateObject.getSeconds();

  // Month day, Year HH:mm:ss
  return `${dateMonthName} ${dateValue}, ${dateYear} at ${dateHours}:${dateMinutes}:${dateSeconds}`;
}

export default function Product({ ascii }) {
  return (
    <Col md={3} className="product-single-container">
      <Card className="product-card">
        <Card.Body>
          <Row>
            <Col md={6} className="size-container">
              {ascii.size}
              {' '}
              pixels
            </Col>
            <Col md={6} className="price-container">
              {formatPrice(ascii.price)}
            </Col>
          </Row>
          <Card.Text className="face-container">
            <div style={{ fontSize: ascii.size }}>{ascii.face}</div>
          </Card.Text>
          <Row>
            <Col md={12} className="date-container">
              {formatDate(ascii.date)}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}
