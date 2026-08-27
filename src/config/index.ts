type Environment = 'production' | 'staging' | 'development';

const environment: Environment = (process.env.NEXT_PUBLIC_ENV as Environment) ?? 'development';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export { BASE_URL, environment };
