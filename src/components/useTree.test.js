import { renderHook, act } from '@testing-library/react-hooks';
import useTree, { compressNode } from './useTree';

test('buildTree', () => {
  const { result } = renderHook(() => useTree());

  act(() => {
    result.current.buildTree([
      { path: 'src/components/App.js' },
      { path: 'src/components/Explorer.js' },
      { path: 'src/backends/Github.js' }
    ]);
  });

  expect(result.current.tree).toMatchObject({
    tree: {
      src: {
        tree: {
          components: {
            tree: {
              'App.js': {},
              'Explorer.js': {}
            }
          },
          backends: {
            tree: {
              'Github.js': {}
            }
          }
        }
      }
    }
  });
});

test('updateTree', () => {
  const { result } = renderHook(() => useTree());
  const updater = jest.fn();
  updater.mockReturnValue({
    close: true
  });

  act(() => {
    result.current.buildTree([
      { path: 'src/components/App.js' },
      { path: 'src/components/Explorer.js' },
      { path: 'src/backends/Github.js' }
    ]);
  });

  act(() => {
    result.current.updateTree(['src', 'components'], updater);
  });

  expect(updater).toHaveBeenCalled();
  expect(result.current.tree).toMatchObject({
    tree: {
      src: {
        tree: {
          components: {
            close: true
          }
        }
      }
    }
  });
});

test('compressNode', () => {
  const [path, compressed] = compressNode({
    tree: {
      src: {
        tree: {
          components: {
            tree: {
              'App.js': {},
              'Explorer.js': {}
            }
          }
        }
      }
    }
  });

  expect(path).toBe('src/components');
  expect(compressed).toMatchObject({
    'App.js': {},
    'Explorer.js': {}
  });
});
