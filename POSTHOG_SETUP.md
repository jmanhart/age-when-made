# PostHog Analytics Setup

This document explains how PostHog analytics is integrated into your movie app and how to use it.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env` file in your project root with your PostHog credentials:

```env
VITE_PUBLIC_POSTHOG_KEY=your_posthog_key_here
VITE_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 2. Get Your PostHog Key

1. Sign up at [PostHog](https://posthog.com)
2. Create a new project
3. Copy your project API key from the project settings
4. Replace `your_posthog_key_here` with your actual key

## 📊 What's Being Tracked

### Search Events

- **Event**: `search_performed`
- **Properties**:
  - `query`: Search term
  - `results_count`: Number of results found
  - `search_type`: "movie" or "actor"
  - `timestamp`: When the search occurred

### Navigation Events

- **Event**: `navigation`
- **Properties**:
  - `from_page`: Current page URL
  - `to_page`: Destination page URL
  - `timestamp`: When navigation occurred

### Actor Card Clicks

- **Event**: `actor_card_clicked`
- **Properties**:
  - `actor_id`: Actor's TMDB ID
  - `actor_name`: Actor's name
  - `actor_character`: Character they played
  - `is_deceased`: Whether the actor is deceased
  - `variant`: Card variant (default, detailed, etc.)
  - `orientation`: Card orientation (vertical, horizontal)
  - `timestamp`: When the click occurred

## 🛠️ Using PostHog in Your Components

### Basic Usage

```tsx
import { usePostHog } from "posthog-js/react";

const MyComponent = () => {
  const posthog = usePostHog();

  const handleClick = () => {
    posthog.capture("button_clicked", {
      button_name: "search",
      page: "home",
    });
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

### Using Utility Functions

```tsx
import {
  trackMovieEvent,
  trackActorEvent,
  trackSearchEvent,
} from "../utils/posthog";

// Track movie-related events
trackMovieEvent("movie_viewed", {
  movie_id: 123,
  movie_title: "The Matrix",
  release_year: 1999,
});

// Track actor-related events
trackActorEvent("actor_viewed", {
  actor_id: 456,
  actor_name: "Keanu Reeves",
  is_deceased: false,
});

// Track search events
trackSearchEvent("matrix", 5, "movie");
```

## 📁 File Structure

```
src/
├── main.tsx                 # PostHogProvider setup
├── utils/
│   └── posthog.ts          # PostHog utility functions
└── components/
    ├── MovieSearch/        # Search tracking
    └── ActorCard/          # Actor card tracking
```

## 🔧 Configuration

PostHog is configured in `src/main.tsx` with these options:

```tsx
const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
};
```

## 📈 Viewing Analytics

1. Go to your PostHog dashboard
2. Navigate to "Events" to see all tracked events
3. Use "Insights" to create charts and funnels
4. Set up "Feature Flags" for A/B testing

## 🎯 Common Use Cases

### Track Page Views

```tsx
import { usePostHog } from "posthog-js/react";

const MovieDetails = () => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("page_viewed", {
      page: "movie_details",
      movie_id: movieId,
    });
  }, [movieId]);

  // ... rest of component
};
```

### Track User Interactions

```tsx
const handleFilterChange = (filterType: string, value: string) => {
  posthog.capture("filter_applied", {
    filter_type: filterType,
    filter_value: value,
    page: "movie_list",
  });
};
```

### Track Errors

```tsx
const handleError = (error: Error) => {
  posthog.capture("error_occurred", {
    error_message: error.message,
    error_stack: error.stack,
    page: "movie_details",
  });
};
```

## 🔒 Privacy & Security

- PostHog respects user privacy and doesn't collect personal information by default
- All tracking is anonymous unless you explicitly identify users
- Environment variables are kept secure and not committed to version control

## 🚨 Troubleshooting

### Events Not Showing Up

1. Check your PostHog API key is correct
2. Verify the environment variables are loaded
3. Check the browser console for any errors
4. Ensure you're looking at the right project in PostHog

### Development vs Production

- PostHog automatically detects the environment
- Development events are marked differently in the dashboard
- Use feature flags to control tracking in different environments

## 📚 Additional Resources

- [PostHog Documentation](https://posthog.com/docs)
- [React Integration Guide](https://posthog.com/docs/libraries/react)
- [Event Tracking Best Practices](https://posthog.com/docs/data/events)
