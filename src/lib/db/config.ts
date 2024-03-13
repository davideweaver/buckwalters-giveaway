const config = {
  name: "buckwalter-giveaway-db",
  version: 1,
  objectStoresMeta: [
    {
      store: "registrations",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "date", keypath: "date", options: { unique: false } },
        { name: "firstName", keypath: "firstName", options: { unique: false } },
        { name: "lastName", keypath: "lastName", options: { unique: false } },
        { name: "email", keypath: "email", options: { unique: true } },
        { name: "phone", keypath: "phone", options: { unique: true } },
      ],
    },
  ],
};

export default config;
