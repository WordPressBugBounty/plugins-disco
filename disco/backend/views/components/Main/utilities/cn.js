import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Tailwind v4 prefixes are variant-style (`disco:flex`), so the prefix is
// declared WITHOUT a trailing separator. Passing "disco-" here silently disables
// merging entirely — every conflicting class is kept.
const twMerge = extendTailwindMerge({
	prefix: "disco",
});

const cn = (...inputs) => {
	return twMerge(clsx(inputs));
};

export default cn;
