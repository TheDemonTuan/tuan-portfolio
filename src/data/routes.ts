import { contributions } from "./contributions";

/** Shared by the English and Vietnamese `[slug]` routes so they cannot drift. */
export function workPaths() {
  return contributions.map((contribution) => ({
    params: { slug: contribution.slug },
    props: { slug: contribution.slug },
  }));
}
