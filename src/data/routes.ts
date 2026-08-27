import { articles } from "./articles";
import { contributions } from "./contributions";

/** Shared by the English and Vietnamese `[slug]` routes so they cannot drift. */
export function workPaths() {
  return [...contributions, ...articles].map(({ slug }) => ({
    params: { slug },
    props: { slug },
  }));
}
