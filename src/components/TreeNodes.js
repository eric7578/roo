import React, { useMemo } from 'react';
import PropTypes, { node } from 'prop-types';
import styled from 'styled-components';
import { getClassWithColor } from 'file-icons-js';
import {
  FileAddition,
  FileDeletion,
  FileUpdate,
  Folder,
  FolderOpen,
  UnknownFile
} from './icons';

import 'file-icons-js/css/style.css';
import { FileDiffStatus } from '../enum';

const NodePath = styled.div`
  align-items: center;
  display: flex;
  color: #fafafa;
  cursor: pointer;
  white-space: nowrap;

  svg {
    fill: #fff;
    margin-right: 5px;
    min-width: 16px;
    width: 16px;
  }
`;

const KnownFile = styled.i`
  font-style: normal;
  margin-right: 5px;
`;

const ModifyCount = styled.span`
  font-size: 12px;
`;

export function TreeNode({ node, children, onNavigate, onExpand }) {
  return (
    <NodePath
      onClick={e => {
        node.isFile ? onNavigate(node) : onExpand(node);
      }}
    >
      <Node node={node} />
    </NodePath>
  );
}

export function DiffNode({ node, onNavigate, onExpand }) {
  const status = Symbol.for(node.status);
  let FileDiffIcon = FileUpdate;
  if (status === FileDiffStatus.ADDED) {
    FileDiffIcon = FileAddition;
  } else if (status === FileDiffStatus.REMOVED) {
    FileDiffIcon = FileDeletion;
  }

  return (
    <NodePath
      onClick={e => {
        node.isFile ? onNavigate(node) : onExpand(node);
      }}
    >
      {node.isFile && <FileDiffIcon />}
      <Node node={node} />
      {status === FileDiffStatus.MODIFIED && (
        <ModifyCount>{`+${node.additions}/-${node.deletions}`}</ModifyCount>
      )}
    </NodePath>
  );
}

function Node({ node }) {
  let iconNode;
  if (node.isFile) {
    const icon = getClassWithColor(node.name);
    iconNode = icon ? (
      <KnownFile className={icon} />
    ) : (
      <UnknownFile style={{ width: 18, marginLeft: -3 }} />
    );
  } else {
    iconNode = node.open ? <FolderOpen /> : <Folder />;
  }

  return (
    <>
      {iconNode}
      {node.name}
    </>
  );
}
