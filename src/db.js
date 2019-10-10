let db;

function checkDbInitialize() {
  if (db) {
    return Promise.resolve(db);
  }

  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open('crx-roo');

    req.onupgradeneeded = e => {
      db = e.target.result;
      db.createObjectStore('preferences');
      db.createObjectStore('tokens');
    };

    req.onerror = err => {
      req.onupgradeneeded = req.onerror = req.onsuccess = null;
      reject(err);
    };

    req.onsuccess = e => {
      req.onupgradeneeded = req.onerror = req.onsuccess = null;
      db = e.target.result;
      resolve(db);
    };
  });
}

function promisifyIDBTransaction(transactionFn) {
  return checkDbInitialize().then(
    () =>
      new Promise((resolve, reject) => {
        const t = transactionFn();
        t.onerror = e => {
          t.onerror = t.oncomplete = null;
          reject(t.error);
        };
        t.oncomplete = e => {
          t.onerror = t.oncomplete = null;
          resolve();
        };
      })
  );
}

function promisifyIDBRequest(requestFn) {
  return checkDbInitialize().then(
    () =>
      new Promise((resolve, reject) => {
        const req = requestFn();
        req.onerror = e => {
          req.onerror = req.onsuccess = null;
          reject(req.error);
        };
        req.onsuccess = e => {
          req.onerror = req.onsuccess = null;
          resolve(req.result);
        };
      })
  );
}

function promisfyIDBCursor(requestFn) {
  return checkDbInitialize().then(
    () =>
      new Promise((resolve, reject) => {
        const req = requestFn();
        const data = {};
        req.onerror = e => {
          req.onerror = req.onsuccess = null;
          reject(req.error);
        };
        req.onsuccess = e => {
          const cursor = e.target.result;
          if (cursor) {
            data[cursor.primaryKey] = cursor.value;
            cursor.continue();
          } else {
            req.onerror = req.onsuccess = null;
            resolve(data);
          }
        };
      })
  );
}

export function saveTokens(tokens) {
  return promisifyIDBTransaction(() => {
    const t = db.transaction('tokens', 'readwrite');
    const tokensStore = t.objectStore('tokens');
    tokensStore.clear();
    tokens.forEach((token, index) => {
      tokensStore.add(token, index);
    });
    return t;
  });
}

export function retrieveTokens() {
  return promisifyIDBRequest(() => {
    const t = db.transaction('tokens', 'readonly');
    const tokensStore = t.objectStore('tokens');
    return tokensStore.getAll();
  });
}

export function savePreferences(preferences) {
  return promisifyIDBTransaction(() => {
    const t = db.transaction('preferences', 'readwrite');
    const preferencesStore = t.objectStore('preferences');
    preferencesStore.clear();
    for (const key in preferences) {
      preferencesStore.add(preferences[key], key);
    }
    return t;
  });
}

export function retrievePreferences() {
  return promisfyIDBCursor(() => {
    const t = db.transaction('preferences', 'readonly');
    const preferencesStore = t.objectStore('preferences');
    return preferencesStore.openCursor();
  });
}
