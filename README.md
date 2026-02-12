# Co-Lab | AI Text Studio

A sleek, browser-based AI writing toolkit powered by [Cohere's](https://cohere.com) language models. Summarize articles, draft content, and refine text -- all from a single interface.

## Features

- **Summarizer** -- Condense long articles, emails, or reports into short/medium/long summaries (paragraph or bullet points).
- **Writer** -- Generate drafts on any topic with adjustable tone (professional, casual, enthusiastic, informative, witty).
- **Refiner** -- Rewrite existing text to be more concise, formal, casual, or exciting.
- **Local API Key Storage** -- Your Cohere API key is saved in the browser's `localStorage` and never sent to any server other than Cohere's API.

## Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Framework   | React 19 + TypeScript               |
| Build       | Vite 7                              |
| Styling     | Tailwind CSS 4                      |
| Icons       | Lucide React                        |
| AI Backend  | Cohere API (`/v1/summarize`, `/v1/chat`) |

## Prerequisites

- **Node.js** 20.19+ or 22.12+ (required by Vite 7)
- **npm** 10+
- A [Cohere API key](https://dashboard.cohere.com/api-keys) (free tier available)

## Getting Started

```bash
# Clone the repo and enter the project
cd colab

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

On first visit, click **Set API Key**, paste your Cohere key, and hit **Save**. The key persists across sessions via `localStorage`.

## Available Scripts

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Start the Vite dev server with HMR         |
| `npm run build`   | Type-check and build for production        |
| `npm run preview` | Preview the production build locally       |
| `npm run lint`    | Run ESLint across the project              |

## Project Structure

```
colab/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   └── coherestudio.tsx   # Main application component
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind CSS imports
├── index.html
├── vite.config.ts       # Vite + React + Tailwind config
├── tsconfig.json
└── package.json
```

## License

MIT
