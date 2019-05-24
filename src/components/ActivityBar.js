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
  background-color: ${props => props.selected ? '#484f63' : '#242730'};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  list-style-type: none;
  transition: .5s;
  width: 40px;

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  svg {
    fill: ${props => props.selected ? '#a7c6d6' : '#78909c'};
    transition: .2s;
  }

  &:last-child {
    margin-top: auto;
  }
`;

const ActivityBar = props => {
  return (
    <Wrapper>
      <IconList>
        <Icon
          selected={props.selected === 'search'}
          onClick={e => props.onChange('search')}
        >
          <Search />
        </Icon>
        <Icon
          selected={props.selected === 'auth'}
          onClick={e => props.onChange('auth')}
        >
          <Key />
        </Icon>
        <Icon
          selected={props.selected === 'settings'}
          onClick={e => props.onChange('settings')}
        >
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
