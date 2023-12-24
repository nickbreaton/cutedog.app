export const assertEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Env var "${name}" is missing!`);
  }

  return value;
};
