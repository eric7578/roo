import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.span`
  font-size: 10px;
  margin-left: 10px;
  white-space: nowrap;
`;

const Additions = styled.span`
  color: #b21e1f;
`;

const Deletions = styled.span`
  color: #03b901;
  margin-left: 5px;
`;

const Diff = props => {
  return (
    <Wrapper className={props.className}>
      <Additions>{`+${props.additions}`}</Additions>
      <Deletions>{`+${props.deletions}`}</Deletions>
    </Wrapper>
  );
}

Diff.propTypes = {
  additions: PropTypes.number.isRequired,
  deletions: PropTypes.number.isRequired
};

export default Diff;
