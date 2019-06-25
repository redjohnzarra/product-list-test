/* eslint-disable react/prop-types */
import React from 'react';

import map from 'lodash/map';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

export default function SortGroup({ sortValues = [], activeSort, onChangeSort }) {
  return (
    <ButtonGroup>
      {map(sortValues, sortValue => (
        <Button active={sortValue === activeSort} onClick={() => onChangeSort(sortValue)}>
          {sortValue}
        </Button>
      ))}
    </ButtonGroup>
  );
}
