[![Early check](https://github.com/marcibaumel/evo-hike/actions/workflows/earlyCheck.yml/badge.svg)](https://github.com/marcibaumel/evo-hike/actions/workflows/earlyCheck.yml)

# evo-hike

## Frontend

Located in the `Frontend/` directory. Requires Node.js.

```bash
cd Frontend
npm install
```

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start dev server on port 5173         |
| `npm run build`         | Type-check and build for production   |
| `npm run lint`          | Run ESLint                            |
| `npm run lint:fix`      | Run ESLint with auto-fix              |
| `npm run format`        | Format source files with Prettier     |
| `npm run type-check`    | Run TypeScript type checking          |
| `npm run storybook`     | Start Storybook on port 6006          |
| `npm run test:headless` | Run Playwright tests in headless mode |
| `npm run test:ui`       | Run Playwright tests with UI          |

## Backend

Located in the `Backend/` directory. Requires .NET 8 SDK.

| Command                                        | Description        |
| ---------------------------------------------- | ------------------ |
| `dotnet run --project Backend/evoHike.Backend` | Start the API      |
| `dotnet build`                                 | Build the solution |
| `dotnet test`                                  | Run unit tests     |

### Database

Requires the EF Core CLI tools:

```bash
dotnet tool install --global dotnet-ef
```

| Command                                                       | Description                   |
| ------------------------------------------------------------- | ----------------------------- |
| `dotnet ef database update --project Backend/evoHike.Backend` | Create or update the database |
