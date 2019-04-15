import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Toggleable = styled.div`
  display: ${props => props.isOpen ? 'inherit' : 'none'};
`;

Toggleable.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default Toggleable;