# 🔌 ReqRes API Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-FF6B6B?style=for-the-badge&logo=qameta&logoColor=white)

API test automation framework for [ReqRes](https://reqres.in) built with **Playwright + TypeScript** using **API Object Model** and **Fixtures** pattern.

---

## 📁 Project Structure

```
ReqRes-API-Automation/
├── .github/
│   └── workflows/
│       └── api-tests.yml         # CI/CD pipeline
├── api/
│   └── UserApi.ts                # API layer (GET, POST, PUT, PATCH, DELETE)
├── tests/
│   ├── fixtures.ts               # Custom Playwright fixtures
│   ├── users.spec.ts             # Users endpoint tests
│   └── auth.spec.ts              # Auth endpoint tests (Login, Register)
├── utils/
│   └── testData.ts               # Test data (users, credentials)
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json
└── package.json
```

---

## 🧪 Test Coverage

| Module | Endpoint | Method | Tests |
|---|---|---|---|
| Users | `/api/users` | GET | List page 1, List page 2 |
| Users | `/api/users/{id}` | GET | Single user, User not found (404) |
| Users | `/api/users` | POST | Create user, Verify fields |
| Users | `/api/users/{id}` | PUT | Full update |
| Users | `/api/users/{id}` | PATCH | Partial update |
| Users | `/api/users/{id}` | DELETE | Delete returns 204 |
| Auth | `/api/login` | POST | Valid login, Missing password, Invalid email |
| Auth | `/api/register` | POST | Valid register, Missing password, Undefined user |
| **Total** | | | **14 tests** |

---

## ⚙️ Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | API request context + assertions |
| [TypeScript](https://www.typescriptlang.org) | Type-safe test code |
| [ReqRes](https://reqres.in) | Real REST API for testing |
| [Allure](https://allurereport.org) | Test reporting |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 24+
- npm
- ReqRes API key — [get free key at app.reqres.in](https://app.reqres.in)

### Installation

```bash
# Clone the repo
git clone https://github.com/AbhiMurali7/Reqres-API-Automation.git
cd Reqres-API-Automation

# Install dependencies
npm install

# Install Playwright
npx playwright install --with-deps chromium
```

### Environment Setup

Create `.env` file in project root:

```bash
REQRES_API_KEY=your_api_key_here
```

> ⚠️ Never commit `.env` to git — it's in `.gitignore`

---

## ▶️ Running Tests

```bash
# Run all tests
npm test

# Run specific module
npm run test:users
npm run test:auth

# Debug mode
npm run test:debug

# View HTML report
npm run test:report

# Generate Allure report
npm run allure:generate
npm run allure:open
```

---

## 📊 Reports

### Playwright HTML Report
```bash
npx playwright show-report
```

### Allure Report
```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

---

## 🏗️ Architecture

### API Object Model

Each API resource has its own class — similar to Page Object Model for UI:

```typescript
export class UserApi {
  constructor(private request: APIRequestContext) {}

  async getUsers(page = 1) {
    return this.request.get(`/api/users?page=${page}`);
  }

  async createUser(name: string, job: string) {
    return this.request.post('/api/users', {
      data: { name, job },
    });
  }

  async deleteUser(id: number) {
    return this.request.delete(`/api/users/${id}`);
  }
}
```

### Fixtures

`UserApi` injected via Playwright fixtures — no manual instantiation in tests:

```typescript
export const test = base.extend<ApiFixtures>({
  userApi: async ({ request }, use) => {
    await use(new UserApi(request));
  },
});
```

### Test Example

```typescript
test('POST /users — Create user', async ({ userApi }) => {
  const res  = await userApi.createUser('Abinaya', 'QA Engineer');
  const body = await res.json();

  expect(res.status()).toBe(201);
  expect(body).toMatchObject({
    name:      'Abinaya',
    job:       'QA Engineer',
    id:        expect.any(String),
    createdAt: expect.any(String),
  });
});
```

---

## 🔄 CI/CD Pipeline

Runs automatically on:
- Push to `main` / `master`
- Pull requests to `main` / `master`
- Daily schedule at **9AM UTC**

```
Install Node 24
     ↓
Install dependencies
     ↓
Install Playwright (Chromium only — API tests don't need browser UI)
     ↓
Run API tests
     ↓
Upload HTML report + Allure results (always, even on failure)
```

### GitHub Secret Setup

Add API key as GitHub secret:

1. Repo → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name: `REQRES_API_KEY` | Value: `your_api_key`

---

## 🌐 API Under Test

**ReqRes** — [https://reqres.in](https://reqres.in)

| Detail | Value |
|---|---|
| Base URL | `https://reqres.in/api` |
| Auth header | `x-api-key: your_key` |
| Valid login | `eve.holt@reqres.in` / `cityslicka` |
| Valid register | `eve.holt@reqres.in` / `pistol` |

---

## 📝 Key Design Decisions

- **`extraHTTPHeaders`** in `playwright.config.ts` — API key and Content-Type globally set, no repetition in each test
- **API key via environment variable** — `process.env['REQRES_API_KEY']` with hardcoded fallback for local dev
- **`toMatchObject()`** used over `toEqual()` — allows `_meta` fields in response without breaking assertions
- **Chromium only** installed in CI — API tests don't need a browser UI, saves ~2 minutes on CI run time

---

## 👤 Author

**Abinaya Murali**
[GitHub](https://github.com/AbhiMurali7)
