/**
 * Checks whether a given string is a valid URL.
 *
 * This function uses a regular expression to validate whether the input string
 * matches the general pattern of a URL, including optional protocols (http/https),
 * domain names, and optional query parameters or paths.
 *
 * @param text - The string to validate as a URL.
 *
 * @returns Returns `true` if the string is a valid URL, otherwise `false`.
 */
export function isValidURL(text: string): boolean;
