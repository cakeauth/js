# CakeAuth Frontend JS SDK

The CakeAuth Frontend JavaScript SDK allows you to interact with CakeAuth [Frontend APIs](https://docs.cakeauth.com/frontend).

```ts
import { CakeAuth } from "@cakeauth/frontend";

const cakeauth = new CakeAuth({
  publicKey: "pub_test_xxx",
});

const res = await cakeauth.settings.list();
```

## Installation

```bash
npm install @cakeauth/frontend
```

## Documentation

For more information about how to set up and use the CakeAuth Frontend JavaScript SDK, read documentation on [https://docs.cakeauth.com/sdk/frontend-js](https://docs.cakeauth.com/sdk/frontend-js).

## License

[MIT](../../LICENSE)
