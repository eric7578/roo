import React, {useState, useEffect, useContext, useRef} from 'react';
import UrlPattern from 'url-pattern';
import {DataSource, Storage} from '../context';
import * as github from '../dataSource/github';

const parseParams = patterns => {
  const {href} = window.location;
  const hashIndex = window.location.href.lastIndexOf('#');
  const url = hashIndex < 0 ? href : href.slice(0, hashIndex);

  for (const pattern of patterns) {
    const urlPattern = new UrlPattern(pattern, {
      segmentValueCharset: 'a-zA-Z0-9-_~ %.'
    });
    const params = urlPattern.match(url);
    if (params) {
      return params;
    }
  }
  return {};
}

const WithDataSource = props => {
  const {selectedToken} = useContext(Storage);
  const [dataSource, setDataSource] = useState();
  const prevParams = useRef();

  // update params when location changed
  const onMessage = message => {
    if (message.type === 'roo/locationChanged') {
      setDataSource(dataSource => {
        const params = parseParams(github.patterns);
        for (const key in prevParams.current) {
          delete dataSource[key];
        }
        prevParams.current = params;
        return {
          ...dataSource,
          ...parseParams(github.patterns)
        };
      });
    }
  }

  useEffect(() => {
    // initialize
    const params = parseParams(github.patterns);
    const methods = github.create(params.owner, params.repo, selectedToken);
    methods.getRepo().then(repo => {
      prevParams.current = params;
      setDataSource({
        ...params,
        filepath: params._,
        ...repo,
        ...methods
      });
    });

    chrome.runtime.onMessage.addListener(onMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    }
  }, []);

  // update methods when token is changed
  useEffect(() => {
    if (dataSource) {
      const methods = github.create(dataSource.owner, dataSource.repo, selectedToken);
      setDataSource(dataSource => ({
        ...dataSource,
        ...methods
      }));
    }
  }, [selectedToken]);

  return (
    <DataSource.Provider value={dataSource}>
      {dataSource && props.children}
    </DataSource.Provider>
  );
}

export default WithDataSource;
