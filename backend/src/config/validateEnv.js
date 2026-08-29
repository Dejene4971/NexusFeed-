const validateEnv = () => {
  const requiredVariables = ["PORT", "MONGODB_URI", "JWT_SECRET"];
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }
};

export default validateEnv;