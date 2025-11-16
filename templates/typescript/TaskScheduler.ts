/**
 * Task Scheduler - Dependency Resolution
 *
 * TODO: Implement the topological sort algorithm to find a valid execution order
 * for tasks with dependencies, or detect circular dependencies.
 */

export class TaskScheduler {
  /**
   * Finds a valid execution order for tasks respecting their dependencies.
   *
   * @param tasks - Array of task identifiers
   * @param dependencies - Array of [dependent, dependency] pairs where
   *                       dependent task requires dependency task to run first
   * @returns Array of tasks in valid execution order, or null if circular dependency exists
   *
   * @example
   * findExecutionOrder(
   *   ["deploy", "build", "test"],
   *   [["deploy", "build"], ["build", "test"]]
   * )
   * // Returns: ["test", "build", "deploy"]
   */
  findExecutionOrder(
    tasks: string[],
    dependencies: [string, string][]
  ): string[] | null {
    // TODO: Implement your solution here

    // Suggested approach (you can use a different one):
    // 1. Build adjacency list and in-degree map
    // 2. Use Kahn's algorithm (BFS-based topological sort):
    //    - Start with tasks that have no dependencies (in-degree = 0)
    //    - Process each task and reduce in-degree of dependent tasks
    //    - If all tasks are processed, return the order
    //    - If not all tasks are processed, circular dependency exists

    // Alternative: DFS-based topological sort with cycle detection

    throw new Error("Not implemented");
  }

  /**
   * Validates that all dependencies reference valid tasks
   * @param tasks - Array of task identifiers
   * @param dependencies - Array of dependency pairs
   * @throws Error if dependency references non-existent task
   */
  private validateInput(
    tasks: string[],
    dependencies: [string, string][]
  ): void {
    // TODO: Implement input validation
  }

  /**
   * Builds an adjacency list representation of the task dependency graph
   * @param tasks - Array of task identifiers
   * @param dependencies - Array of dependency pairs
   * @returns Adjacency list as a Map
   */
  private buildGraph(
    tasks: string[],
    dependencies: [string, string][]
  ): Map<string, string[]> {
    // TODO: Implement graph building
    throw new Error("Not implemented");
  }

  /**
   * Calculates in-degree (number of dependencies) for each task
   * @param tasks - Array of task identifiers
   * @param dependencies - Array of dependency pairs
   * @returns Map of task to its in-degree
   */
  private calculateInDegrees(
    tasks: string[],
    dependencies: [string, string][]
  ): Map<string, number> {
    // TODO: Implement in-degree calculation
    throw new Error("Not implemented");
  }
}

// Example usage (you can delete this)
const scheduler = new TaskScheduler();
const result = scheduler.findExecutionOrder(
  ["deploy", "build", "test"],
  [["deploy", "build"], ["build", "test"]]
);
console.log(result); // Should output: ["test", "build", "deploy"]
