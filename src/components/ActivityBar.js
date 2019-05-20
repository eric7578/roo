import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Key, Search, Settings} from './icons';

const Wrapper = styled.div`
  align-items: center;
  background-color: #16181d;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 18px 0;
  min-width: 70px;
`;

const IconList = styled.ul`
  display: flex;
  flex: 1;
  flex-direction: column;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Icon = styled.li`
  align-items: center;
  background-color: #242730;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  list-style-type: none;
  width: 40px;

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  svg {
    fill: #78909c;
  }

  &:last-child {
    margin-top: auto;
  }
`;

const ActivityBar = props => {
  return (
    <Wrapper>
      <IconList>
        <Icon onClick={e => props.onChange('search')}>
          <Search />
        </Icon>
        <Icon onClick={e => props.onChange('auth')}>
          <Key />
        </Icon>
        <Icon onClick={e => props.onChange('settings')}>
          <Settings />
        </Icon>
      </IconList>
    </Wrapper>
  );
}

ActivityBar.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default ActivityBar;
