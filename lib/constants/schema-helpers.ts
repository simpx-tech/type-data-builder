import { faker } from "@faker-js/faker";

export const SchemaHelpers = {
  Generators: {
    Email: () => faker.internet.email(),
    Phone: () => faker.phone.number(),
  },
  Definitions: {
    MongoTimestamps: {
      type: Date,
      value: () => new Date(),
    },
  },
};
