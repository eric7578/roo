import {useState, useEffect} from 'react';
import window from 'global/window';

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

export default function useStorage() {
  const [storage, setStorage] = useState();

  useEffect(() => {
    const initializeStorage = async () => {
      const storage = await indexedDBStorage(db => {
        const preference = db.createObjectStore('preference', {keyPath: 'name'});
        preference.createIndex('name', 'name', {unique: true});

        const token = db.createObjectStore('token', {autoIncrement: true});
      });

      const preference = await storage.getAll('preference');
      const setPreference = (name, setup) => {
        return storage.set('preference', {name, setup});
      }

      const token = await storage.getAll('token');
      const setToken = token => {
        return storage.reset('token', ...token);
      }

      setStorage({
        preference,
        setPreference,
        token,
        setToken
      });
    }

    initializeStorage();
  }, []);

  return storage;
}

