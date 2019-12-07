let db;

export function idbTransaction(t) {
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

export function idbRequest(req) {
  return new Promise((resolve, reject) => {
    req.onerror = e => {
      req.onerror = req.onsuccess = null;
      reject(req.error);
    };
    req.onsuccess = e => {
      req.onerror = req.onsuccess = null;
      resolve(req.result);
    };
  });
}

export function idbCursor(cursorReq) {
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

export function initialize() {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open('roo');

    req.onupgradeneeded = e => {
      db = e.target.result;
      db.createObjectStore('preferences');
      db.createObjectStore('credentials');
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

export function retrievCredentials() {
  const t = db.transaction('credentials', 'readonly');
  const credentialsStore = t.objectStore('credentials');
  const c = credentialsStore.openCursor();
  return idbCursor(c);
}

export function retrievePreferences() {
  const t = db.transaction('preferences', 'readonly');
  const preferencesStore = t.objectStore('preferences');
  const c = preferencesStore.openCursor();
  return idbCursor(c);
}

export function saveCredentials(credentials) {
  const t = db.transaction('credentials', 'readwrite');
  const credentialsStore = t.objectStore('credentials');
  credentialsStore.clear();
  for (const hostname in credentials) {
    credentialsStore.add(credentials[hostname], hostname);
  }
  return idbTransaction(t);
}

export function savePreferences(field, value) {
  const t = db.transaction('preferences', 'readwrite');
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
  return idbTransaction(t);
}
