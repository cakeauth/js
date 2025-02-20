# CakeAuth Backend JS SDK

The CakeAuth Backend JavaScript SDK allows you to interact with CakeAuth [Backend APIs](https://docs.cakeauth.com/backend).

```ts
import { CakeAuth } from "@cakeauth/backend";

const cakeauth = new CakeAuth({
  privateKey: "sec_test_xxx",
});

const res = await cakeauth.users.getUsers();
```

## Installation

```bash
npm install @cakeauth/backend
# or
yarn add @cakeauth/backend
# or
pnpm add @cakeauth/backend
# or
bun add @cakeauth/backend
```

## Documentation

For more information about how to set up and use the CakeAuth Backend JavaScript SDK, read documentation on [https://docs.cakeauth.com/sdk/backend-js](https://docs.cakeauth.com/sdk/backend-js).

## License

[MIT](../../LICENSE)
