import createWebStorage from "redux-persist/lib/storage/createWebStorage";

interface CustomStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>; // Change the return type to Promise<void>
  removeItem(key: string): Promise<void>;
}

const createNoopStorage = (): CustomStorage => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(); // Return void since we are not using the stored value
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage: CustomStorage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export default storage;
