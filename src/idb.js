class Idb {
  constructor(db) {
    this._db = db;
  }

  getObject(objectKey) {
    const t = this._db.transaction([objectKey], 'readonly');
    const c = t.objectStore(objectKey).openCursor();
    return asyncCursor(c);
  }

  putObject(objectKey, ...args) {
    const t = this._db.transaction([objectKey], 'readwrite');
    const store = t.objectStore(objectKey);
    if (args.length === 1) {
      const vars = args[0];
      store.clear();
      for (const key in vars) {
        store.add(vars[key], key);
      }
    } else {
      const [field, value] = args;
      store.put(value, field);
    }
    return asyncTransaction(t);
  }

  close() {
    this._db.close();
  }
}

function asyncTransaction(t) {
  return new Promise((resolve, reject) => {
    t.onerror = e => reject(t.error);
    t.oncomplete = resolve;
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

export function open(dbname, storeNames) {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open(dbname);
    req.onerror = reject;
    req.onupgradeneeded = e => {
      const db = e.target.result;
      for (const storeName of storeNames) {
        db.createObjectStore(storeName);
      }
      resolve(new Idb(db));
    };
    req.onsuccess = e => resolve(new Idb(e.target.result));
  });
}
