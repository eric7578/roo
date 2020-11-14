export default class Idb {
  constructor(dbname) {
    this.dbname = dbname;
    this.db = null;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      const req = window.indexedDB.open(this.dbname);

      req.onupgradeneeded = e => {
        this.db = e.target.result;
        this.db.createObjectStore('preferences');
        this.db.createObjectStore('credentials');
      };

      req.onerror = err => {
        req.onupgradeneeded = req.onerror = req.onsuccess = null;
        reject(err);
      };

      req.onsuccess = e => {
        req.onupgradeneeded = req.onerror = req.onsuccess = null;
        this.db = e.target.result;
        resolve();
      };
    });
  }

  getCredential(hostname = window.hostname) {
    const t = this.db.transaction('credentials', 'readonly');
    const credentialsStore = t.objectStore('credentials');
    const c = credentialsStore.openCursor();
    return asyncCursor(c).then(creds => creds[hostname]);
  }

  saveCredential(credential, hostname = window.hostname) {
    const t = this.db.transaction('credentials', 'readwrite');
    const credentialsStore = t.objectStore('credentials');
    credentialsStore.add(credential, hostname);
    return asyncTransaction(t);
  }

  getPreferences() {
    const t = this.db.transaction('preferences', 'readonly');
    const preferencesStore = t.objectStore('preferences');
    const c = preferencesStore.openCursor();
    return asyncCursor(c);
  }

  savePreferences(field, value) {
    const t = this.db.transaction('preferences', 'readwrite');
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
  }
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
