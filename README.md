# AWM — Age When Made

Ever watched a movie and wondered "how old was that actor when they filmed this?" Now you know.

Search any movie. See every cast member's age when it was made, their current age, and who's still with us. Enter your own birthday to see where you'd land in the cast lineup.

**Try it:** [agewhenma.de](https://agewhenma.de) *(update with your actual URL)*

## What you can do

- Search any movie and instantly see the full cast with ages
- Toggle between grid and timeline views to see the age spread
- Filter by alive/deceased, sort by age or billing order
- Drop in your birthday to see a "You" card placed among the actors
- Works on mobile, supports dark mode

## Run it locally

```bash
npm install
```

Add your [TMDb API key](https://www.themoviedb.org/) to `.env`:

```
VITE_TMDB_API_KEY=your_key
```

```bash
npm run dev
```

## Built with

React, TypeScript, Vite, CSS Modules, TMDb API
