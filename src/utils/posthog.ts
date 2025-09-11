import posthog from "posthog-js";

/**
 * PostHog utility functions for analytics tracking
 *
 * This file provides helper functions for common PostHog operations
 * and ensures PostHog is properly initialized.
 */

/**
 * Initialize PostHog with custom configuration
 * This is called automatically by the PostHogProvider, but can be used
 * for additional setup if needed.
 */
export const initPostHog = () => {
  if (typeof window !== "undefined") {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      // Add any additional options here
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
};

/**
 * Track movie-related events
 */
export const trackMovieEvent = (
  eventName: string,
  properties: Record<string, any> = {}
) => {
  if (typeof window !== "undefined" && posthog) {
    posthog.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Track actor-related events
 */
export const trackActorEvent = (
  eventName: string,
  properties: Record<string, any> = {}
) => {
  if (typeof window !== "undefined" && posthog) {
    posthog.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Track search events
 */
export const trackSearchEvent = (
  query: string,
  resultsCount: number,
  searchType: "movie" | "actor"
) => {
  if (typeof window !== "undefined" && posthog) {
    posthog.capture("search_performed", {
      query,
      results_count: resultsCount,
      search_type: searchType,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Track navigation events
 */
export const trackNavigationEvent = (from: string, to: string) => {
  if (typeof window !== "undefined" && posthog) {
    posthog.capture("navigation", {
      from_page: from,
      to_page: to,
      timestamp: new Date().toISOString(),
    });
  }
};
