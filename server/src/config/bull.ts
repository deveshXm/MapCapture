import Bull from "bull";

export const topRegionsQueue = new Bull("topRegions", {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
    password: process.env.REDIS_PASSWORD,
  },
});
