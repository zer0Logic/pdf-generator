export const DEFAULT_ERRORS: Record<string, string> = {
  required: 'Field wajib diisi!',
  minlength: 'Minimal {{requiredLength}} karakter!',
  maxlength: 'Maksimal {{requiredLength}} karakter!',
  email: 'Format email tidak valid!',
  pattern: 'Format tidak valid!',
  nominal: 'Nominal tidak valid!',
};

/**
 * Resolves the first error message for a given set of errors
 */
export function getErrorMessage(
  errors: Record<string, any> | null | undefined,
  customMsgs: Record<string, string> = {},
): string | null {
  if (!errors) return null;

  const firstErrorKey = Object.keys(errors)[0];
  const errorData = errors[firstErrorKey];

  let message = customMsgs[firstErrorKey] || DEFAULT_ERRORS[firstErrorKey];

  if (!message) return null;

  // Handle placeholders like {{requiredLength}}
  if (typeof errorData === 'object' && errorData !== null) {
    Object.keys(errorData).forEach((key) => {
      message = message.replace(`{{${key}}}`, String(errorData[key]));
    });

    // Fallback for simple values if {{}} is used
    if (message.includes('{{}}')) {
      const firstValue = Object.values(errorData)[0];
      message = message.replace('{{}}', String(firstValue));
    }
  }

  return message;
}
