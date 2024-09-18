import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Function to format the number as a currency-style string
export const formatCurrency = (value: string) => {
	if (!value) return "";
	const formattedValue = value
		.replace(/\D/g, "") // Remove non-digit characters
		.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas as thousand separators
	return formattedValue;
};

export const parseCurrency = (formattedValue: string) => {
	return formattedValue.replace(/,/g, ""); // Remove commas to get the numeric value
};