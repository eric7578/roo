import { useState, useEffect } from 'react';

export const FILE = Symbol();

export function mutatePathIn(obj, path, node) {
  path.split('/').reduce((o, path, i, paths) => {
    const isLast = paths.length === i + 1;
    if (isLast) {
      o[path] = {
        ...node,
        path,
        [FILE]: true
      };
    } else if (!o.hasOwnProperty(path)) {
      o[path] = {};
    }
    return o[path];
  }, obj);
  return obj;
}

export function collapseToTree(obj) {
  return Object.entries(obj).map(([path, node]) => {
    if (node[FILE]) {
      delete node[FILE];
      return {
        ...node,
        type: 'blob',
        path
      };
    }

    const paths = [path];
    let start = node;
    while (Object.keys(start).length === 1) {
      const key = Object.keys(start)[0];
      if (start[key][FILE]) {
        break;
      }

      paths.push(key);
      start = start[key];
    }

    return {
      type: 'tree',
      path: paths.join('/'),
      tree: collapseToTree(start)
    };
  });
}

export default function useFlattenTree(flattenTree) {
  const [tree, setTree] = useState();

  useEffect(() => {
    const obj = {};
    flattenTree.forEach(node => mutatePathIn(obj, node.path, node));
    setTree({
      sha: 'root',
      type: 'tree',
      tree: collapseToTree(obj)
    });
  }, [flattenTree]);

  return tree;
}
