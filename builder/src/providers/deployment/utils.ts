export const convertToRouteNames = (
  input: string
): {
  viewCamelCase: string;
  manageCamelCase: string;
  viewPascalCase: string;
  managePascalCase: string;
} => {
  // Remove any non-alphanumeric characters and split into words
  const words = input.replace(/[^a-zA-Z0-9]/g, ' ').split(' ');

  // Capitalize each word
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  // Join the words
  const pascalCase = capitalizedWords.join('');

  // Create the four variations
  const viewCamelCase = `view${pascalCase}`;
  const manageCamelCase = `manage${pascalCase}`;
  const viewPascalCase = `View${pascalCase}`;
  const managePascalCase = `Manage${pascalCase}`;

  return {
    viewCamelCase,
    manageCamelCase,
    viewPascalCase,
    managePascalCase,
  };
};

export function extractRegionFromUrl(url: string): string | null {
  const regex = /\/\/mc-api\.([\w-]+\.[\w]+)\.commercetools\.com/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}
