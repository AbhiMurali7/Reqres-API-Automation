import { test as base, APIRequestContext } from '@playwright/test';
import { UserApi } from '../api/UserApi';

type ApiFixtures = {
  userApi: UserApi;
};

export const test = base.extend<ApiFixtures>({
  userApi: async ({ request }, use) => {
    await use(new UserApi(request));
  },
});

export { expect } from '@playwright/test';