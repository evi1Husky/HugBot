type SecretsHider = {
  set: (secret: string) => Promise<Res>;
  get: () => Promise<string | null | Res>;
  destroy: () => void;
}

type Store = {
  retrieve: (key: string) => string | undefined;
}

enum Res {
  Success = "Success",
  Failure = "Failure",
}

export const SecretsHider = (): Readonly<SecretsHider> => {
  const Store = (secret: string, key: string): Readonly<Store> => {
    const store = ((secret: string, key: string) => {
      const rnd = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min) + min);
      const r = rnd(0, secret.length);
      const secretWithKey = [...secret.slice(0, r), key, ...secret.slice(r)].join("");
      const store = Array(rnd(2000, 3000)).fill(null)
        .map(_ => secretWithKey.split("")
          .map(_ => secretWithKey.charAt(rnd(1, secretWithKey.length))).join(""));
      const rIdx = rnd(0, store.length);
      return store.fill(secretWithKey, rIdx, rIdx + 1);
    })(secret, key);

    const retrieve = (key: string) =>
      store.find(x => x.includes(key))?.replace(key, "");

    Object.freeze(Object.seal((store)));

    return Object.freeze(Object.seal({ retrieve }));
  }

  const rndKey = (secret: string) => {
    const rnd = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min) + min);
    return Array(rnd(6, secret.length - 1)).fill(null)
      .map(_ => secret.charAt(rnd(1, secret.length))).join("");
  }

  let KEY: CryptoKey | null = null;
  let IV: Uint8Array | null = null;
  let STORE: Store | null = null;
  let STORE_KEY: string | null = null;

  const set = async (secret: string): Promise<Res> => {
    try {
      const generatedKey = await generateKey();
      const encryptedSecret = await encrypt(secret, generatedKey);
      const packedSecret = pack(encryptedSecret.cipher);
      KEY = generatedKey;
      IV = encryptedSecret.iv;
      STORE_KEY = rndKey(packedSecret)
      STORE = Store(packedSecret, STORE_KEY);
      return Res.Success;
    } catch (err) {
      destroy();
      console.error(err);
      return Res.Failure;
    }
  }

  const get = async (): Promise<string | null | Res> => {
    try {
      if (STORE && STORE_KEY && KEY && IV) {
        const secret = STORE.retrieve(STORE_KEY);
        const unpackedSecret = unpack(secret!);
        const decryptedSecret = await decrypt(unpackedSecret, KEY, IV);
        destroy();
        await set(decryptedSecret);
        return decryptedSecret;
      } else {
        destroy();
        return null;
      }
    } catch (err) {
      console.log(err);
      destroy();
      return Res.Failure;
    }
  }

  const destroy = (): void => {
    KEY = null;
    IV = null;
    STORE_KEY = null;
    STORE = null;
  }

  const encrypt = async (data: string, key: CryptoKey) => {
    const encoded = encode(data);
    const iv = generateIV();
    const cipher = await crypto.subtle
      .encrypt({ name: "AES-GCM", iv: iv, }, key, encoded);
    return { cipher, iv, }
  }

  const decrypt = async (cipher: ArrayBuffer, key: CryptoKey, IV: Uint8Array) => {
    const encoded = await crypto.subtle
      .decrypt({ name: "AES-GCM", iv: IV, }, key, cipher)
    return decode(encoded);
  }

  const generateKey = async () => crypto.subtle
    .generateKey({ name: "AES-GCM", length: 256, }, true, ["encrypt", "decrypt"]);

  const generateIV = () => {
    const rnd = (min: number, max: number) =>
      Math.floor(Math.random() * ((max + 1) - min) + min);
    return crypto.getRandomValues(new Uint8Array((rnd(12, 16))));
  }

  const encode = (data: string) => new TextEncoder().encode(data);

  const decode = (byteStream: ArrayBuffer) => new TextDecoder().decode(byteStream);

  const pack = (buffer: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(buffer)));

  const unpack = (packed: string): ArrayBuffer => {
    const string = atob(packed);
    const buffer = new ArrayBuffer(string.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < string.length; i++) {
      bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
  }

  return Object.freeze(Object.seal({ set, get, destroy }));
}

