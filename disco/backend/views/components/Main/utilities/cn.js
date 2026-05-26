import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
	prefix: "disco-",
});

const cn = (...inputs) => {
	return twMerge(clsx(inputs));
};

export default cn;
