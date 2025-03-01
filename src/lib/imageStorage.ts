// window.indexedDB =
//   window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
const storeName = "images";

export const saveImage = async (image: File, hash: string) => {
  const openRequest = init();

  openRequest.onsuccess = () => {
    const tx = openRequest.result.transaction(storeName, "readwrite");

    tx.objectStore(storeName).put({ hash, image });
    tx.oncomplete = () => openRequest.result.close();
  };
};

export const getImage = async (hash: string): Promise<Blob | undefined> => {
  return new Promise((resolve, reject) => {
    const openRequest = init();

    openRequest.onsuccess = () => {
      const tx = openRequest.result.transaction(storeName, "readonly");
      const images = tx.objectStore(storeName);
      const request = images.get(hash);

      tx.oncomplete = () => openRequest.result.close();

      request.onsuccess = () => {
        const image = request.result?.image;

        if (!image) return reject();
        resolve(image);
      };
    };

    openRequest.onerror = () => reject();
  });
};

export const deleteImage = async (hash: string) => {
  const openRequest = init();

  openRequest.onsuccess = () => {
    const tx = openRequest.result.transaction(storeName, "readwrite");

    tx.objectStore(storeName).delete(hash);
    tx.oncomplete = () => openRequest.result.close();
  };
};

export const clearCache = () => indexedDB.deleteDatabase("image");

function init() {
  const openRequest = indexedDB.open("image", 1);

  openRequest.onupgradeneeded = () => {
    const db = openRequest.result;

    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: "hash" });
    }
  };

  return openRequest;
}
