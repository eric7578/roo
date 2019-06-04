import React, {useState, useEffect, useRef} from 'react';
import {Storage} from '../context';
import useDerivedState from '../hooks/useDerivedState'

const request = fn => new Promise((resolve, reject) => {
  const req = fn();
  req.onerror = e => {
    req.onerror = req.onsuccess = null;
    reject(e.target.error);
  }
  req.onsuccess = e => {
    req.onerror = req.onsuccess = null;
    resolve(e.target.result);
  }
});

const transaction = fn => new Promise((resolve, reject) => {
  const t = fn();
  t.onerror = e => {
    t.onerror = t.oncomplete = null;
    reject(e);
  }
  t.oncomplete = e => {
    t.onerror = t.oncomplete = null;
    resolve(e);
  }
});

const indexedDBStorage = init => {
  return new Promise((resolve, reject) => {
    let db;

    const getAll = objStore => {
      return request(() => db
        .transaction(objStore)
        .objectStore(objStore)
        .getAll()
      );
    }

    const set = (objStore, data) => {
      return request(() => db
        .transaction(objStore, 'readwrite')
        .objectStore(objStore)
        .put(data)
      );
    }

    const reset = (objStore, ...data) => {
      return transaction(() => {
        const t = db.transaction(objStore, 'readwrite')
        const o = t.objectStore(objStore);
        o.clear();
        data.forEach(data => o.add(data));
        return t;
      });
    }

    const req = window.indexedDB.open('crx-roo');

    req.onerror = reject;

    req.onupgradeneeded = e => {
      db = event.target.result;
      init(db);
    }

    req.onsuccess = e => {
      db = event.target.result;
      resolve({
        getAll,
        set,
        reset
      });
    }
  });
}

const WithStorage = props => {
  const db = useRef();
  const [isReady, setIsReady] = useState(false);
  const [storage, setStorage] = useState({
    setPreference(name, setup) {
      return db.current.set('preference', {name, setup});
    },
    setToken(token) {
      setStorage({...storage, token});
      return db.current.reset('token', ...token);
    }
  });

  useDerivedState(() => {
    const selectedToken = storage.token.find(t => t.selected);
    setStorage({
      ...storage,
      selectedToken: selectedToken ? selectedToken.token : null
    });
  }, storage.token);

  useEffect(() => {
    const initializeStorage = async () => {
      db.current = await indexedDBStorage(db => {
        const preferenceObjectStore = db.createObjectStore('preference', {keyPath: 'name'});
        preferenceObjectStore.createIndex('name', 'name', {unique: true});

        const tokenObjectStore = db.createObjectStore('token', {autoIncrement: true});
      });

      const preferences = await db.current.getAll('preference');
      const preference = preferences.reduce((preference, {name, setup}) => {
        preference[name] = setup;
        return preference;
      }, {});

      const token = await db.current.getAll('token');

      setStorage({
        ...storage,
        preference,
        token
      });
      setIsReady(true);
    }

    initializeStorage();
  }, []);

  return (
    <Storage.Provider value={storage}>
      {isReady && props.children}
    </Storage.Provider>
  );
}

export default WithStorage;
