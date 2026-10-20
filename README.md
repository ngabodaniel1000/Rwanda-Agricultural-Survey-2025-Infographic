# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## NISR SAS 2025 infographic — updating data
All figures live in `src/data/survey.ts`. Edit values there; charts, tables, stories and CSV exports update automatically. Use `null` for missing values (never 0). Run `bunx vitest run` to re-check calculated comparisons.

### Pre-submission checklist
- [ ] Every value in `src/data/survey.ts` matches the original NISR report
- [ ] Calculated changes (+57.0%, −34.0%, −8.8%) still match the tests
- [ ] Missing Season C values show "Not available" / NA in CSV
- [ ] NISR logo used only with authorisation (slot in Navbar/Footer)
