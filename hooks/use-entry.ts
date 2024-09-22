import { EntryContext } from "@/contexts/entry-context";
import { useContext } from "react";

export const useEntry = () => {
	const context = useContext(EntryContext);
	if (context === undefined) {
		throw new Error("useEntry must be used within an EntryProvider");
	}
	return context;
};