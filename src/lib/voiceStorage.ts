// window.indexedDB =
//   window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
const storeName = "voices";

export const saveVoice = async (voice: Blob, hash: number) => {
  const openRequest = init();

  openRequest.onsuccess = () => {
    const tx = openRequest.result.transaction(storeName, "readwrite");

    tx.objectStore(storeName).put({ hash, voice });
    tx.oncomplete = () => openRequest.result.close();
  };
};

export const getVoice = async (hash: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const openRequest = init();

    openRequest.onsuccess = () => {
      const tx = openRequest.result.transaction(storeName, "readonly");
      const voices = tx.objectStore(storeName);
      const request = voices.get(hash);

      tx.oncomplete = () => openRequest.result.close();

      request.onsuccess = () => {
        const voice = request.result?.voice;

        if (!voice) return reject();
        resolve(voice);
      };
    };

    openRequest.onerror = () => reject();
  });
};

export const deleteVoice = async (hash: number) => {
  const openRequest = init();

  openRequest.onsuccess = () => {
    const tx = openRequest.result.transaction(storeName, "readwrite");

    tx.objectStore(storeName).delete(hash);
    tx.oncomplete = () => openRequest.result.close();
  };
};

export const clearCache = () => indexedDB.deleteDatabase("voice");

function init() {
  const openRequest = indexedDB.open("voice", 1);

  openRequest.onupgradeneeded = () => {
    const db = openRequest.result;

    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: "hash" }); // создаём хранилище
    }
  };

  return openRequest;
}
