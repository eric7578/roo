import { useRef, useEffect, useState, useCallback } from 'react';

export default function useStorage(dbname) {
  const refDb = useRef();
  const [values, setValues] = useState({
    ready: false,
    preferences: null,
    credentials: null
  });

  const getCredentials = useCallback(() => {
    const t = refDb.current.transaction('credentials', 'readonly');
    const credentialsStore = t.objectStore('credentials');
    const c = credentialsStore.openCursor();
    return asyncCursor(c);
  }, []);

  const saveCredential = useCallback((credential, hostname) => {
    const t = refDb.current.transaction('credentials', 'readwrite');
    const credentialsStore = t.objectStore('credentials');
    credentialsStore.add(credential, hostname);
    return asyncTransaction(t);
  }, []);

  const getPreferences = useCallback(() => {
    const t = refDb.current.transaction('preferences', 'readonly');
    const preferencesStore = t.objectStore('preferences');
    const c = preferencesStore.openCursor();
    return asyncCursor(c);
  }, []);

  const savePreferences = useCallback((field, value) => {
    const t = refDb.current.transaction('preferences', 'readwrite');
    const preferencesStore = t.objectStore('preferences');

    if (typeof field === 'object' && arguments.length === 1) {
      // replace entire preferences
      preferencesStore.clear();
      for (const key in field) {
        preferencesStore.add(field[key], key);
      }
    } else {
      preferencesStore.put(value, field);
    }
    return asyncTransaction(t);
  }, []);

  useEffect(() => {
    const loadInitialValues = async () => {
      const [preferences, credentials] = await Promise.all([
        getPreferences(),
        getCredentials()
      ]);
      setValues({
        ready: true,
        preferences,
        credentials
      });
    };

    const onUpgradeNeeded = e => {
      refDb.current = e.target.result;
      refDb.current.createObjectStore('preferences');
      refDb.current.createObjectStore('credentials');
      loadInitialValues();
    };

    const onSuccess = e => {
      refDb.current = e.target.result;
      loadInitialValues();
    };

    const onError = err => {
      console.error(err);
    };

    const req = window.indexedDB.open(dbname);
    req.addEventListener('success', onSuccess);
    req.addEventListener('upgradeneeded', onUpgradeNeeded);
    req.addEventListener('error', onError);

    return () => {
      req.removeEventListener('success', onSuccess);
      req.removeEventListener('upgradeneeded', onUpgradeNeeded);
      req.removeEventListener('error', onError);
    };
  }, [dbname]);

  return {
    ...values,
    async setPreferences(...args) {
      await savePreferences(...args);
      const preferences = await getPreferences();
      setValues(storage => ({
        ...storage,
        preferences
      }));
    },
    async setCredentials(...args) {
      await saveCredential(...args);
      const credentials = await getCredentials();
      setValues(storage => ({
        ...storage,
        credentials
      }));
    }
  };
}

function asyncTransaction(t) {
  return new Promise((resolve, reject) => {
    t.onerror = e => {
      t.onerror = t.oncomplete = null;
      reject(t.error);
    };
    t.oncomplete = e => {
      t.onerror = t.oncomplete = null;
      resolve();
    };
  });
}

function asyncCursor(cursorReq) {
  return new Promise((resolve, reject) => {
    const data = {};
    cursorReq.onerror = e => {
      cursorReq.onerror = cursorReq.onsuccess = null;
      reject(cursor.error);
    };
    cursorReq.onsuccess = e => {
      const cursor = e.target.result;
      if (cursor) {
        data[cursor.primaryKey] = cursor.value;
        cursor.continue();
      } else {
        cursorReq.onerror = cursorReq.onsuccess = null;
        resolve(data);
      }
    };
  });
}
