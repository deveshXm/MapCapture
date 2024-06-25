import Queue from "better-queue";
import { incrementGeohashCount } from "./cache";

// Define the task interface
interface GeohashTask {
  geohash: string;
}

// Create the queue
const geohashQueue = new Queue<GeohashTask, void>(
  async (task, cb) => {
    try {
      await incrementGeohashCount(task.geohash);
      cb(null); // Signal successful completion
    } catch (error) {
      console.error("Error processing geohash:", error);
      cb(error); // Signal error
    }
  },
  {
    concurrent: 5, // Process 5 tasks concurrently
    maxRetries: 3, // Retry failed tasks up to 3 times
    retryDelay: 1000, // Wait 1 second between retries
  }
);

// Function to push geohash to the queue
export const pushGeohashToQueue = (geohash: string) => {
  geohashQueue.push({ geohash });
};

// Handle queue events
geohashQueue.on("task_finish", (taskId: string) => {
  console.log(`Task ${taskId} finished processing geohash`);
});

geohashQueue.on("task_failed", (taskId, error) => {
  console.error(`Task ${taskId} failed:`, error);
});

// Graceful shutdown function
export const shutdownQueue = () => {
  return new Promise<void>((resolve) => {
    geohashQueue.destroy(resolve);
  });
};
