using System;
using System.Collections.Generic;
using System.Linq;

namespace TaskSchedulerChallenge
{
    /// <summary>
    /// Task Scheduler - Dependency Resolution
    ///
    /// TODO: Implement the topological sort algorithm to find a valid execution order
    /// for tasks with dependencies, or detect circular dependencies.
    /// </summary>
    public class TaskScheduler
    {
        /// <summary>
        /// Finds a valid execution order for tasks respecting their dependencies.
        /// </summary>
        /// <param name="tasks">Array of task identifiers</param>
        /// <param name="dependencies">
        /// Array of dependency tuples where (dependent, dependency) means
        /// dependent task requires dependency task to run first
        /// </param>
        /// <returns>
        /// List of tasks in valid execution order, or null if circular dependency exists
        /// </returns>
        /// <example>
        /// <code>
        /// var scheduler = new TaskScheduler();
        /// var result = scheduler.FindExecutionOrder(
        ///     new[] { "deploy", "build", "test" },
        ///     new[] { ("deploy", "build"), ("build", "test") }
        /// );
        /// // Returns: ["test", "build", "deploy"]
        /// </code>
        /// </example>
        public List<string>? FindExecutionOrder(
            string[] tasks,
            (string Dependent, string Dependency)[] dependencies)
        {
            // TODO: Implement your solution here

            // Suggested approach (you can use a different one):
            // 1. Validate input
            // 2. Build adjacency list and in-degree dictionary
            // 3. Use Kahn's algorithm (BFS-based topological sort):
            //    - Start with tasks that have no dependencies (in-degree = 0)
            //    - Process each task and reduce in-degree of dependent tasks
            //    - If all tasks are processed, return the order
            //    - If not all tasks are processed, circular dependency exists

            // Alternative: DFS-based topological sort with cycle detection

            throw new NotImplementedException("TODO: Implement this method");
        }

        /// <summary>
        /// Validates that all dependencies reference valid tasks
        /// </summary>
        /// <param name="tasks">Array of task identifiers</param>
        /// <param name="dependencies">Array of dependency tuples</param>
        /// <exception cref="ArgumentException">
        /// Thrown when dependency references non-existent task
        /// </exception>
        private void ValidateInput(
            string[] tasks,
            (string Dependent, string Dependency)[] dependencies)
        {
            // TODO: Implement input validation
        }

        /// <summary>
        /// Builds an adjacency list representation of the task dependency graph
        /// </summary>
        /// <param name="tasks">Array of task identifiers</param>
        /// <param name="dependencies">Array of dependency tuples</param>
        /// <returns>Adjacency list as a dictionary</returns>
        private Dictionary<string, List<string>> BuildGraph(
            string[] tasks,
            (string Dependent, string Dependency)[] dependencies)
        {
            // TODO: Implement graph building
            throw new NotImplementedException("TODO: Implement this method");
        }

        /// <summary>
        /// Calculates in-degree (number of dependencies) for each task
        /// </summary>
        /// <param name="tasks">Array of task identifiers</param>
        /// <param name="dependencies">Array of dependency tuples</param>
        /// <returns>Dictionary mapping task to its in-degree</returns>
        private Dictionary<string, int> CalculateInDegrees(
            string[] tasks,
            (string Dependent, string Dependency)[] dependencies)
        {
            // TODO: Implement in-degree calculation
            throw new NotImplementedException("TODO: Implement this method");
        }
    }

    /// <summary>
    /// Example usage and entry point
    /// </summary>
    public class Program
    {
        public static void Main(string[] args)
        {
            var scheduler = new TaskScheduler();

            // Example 1: Simple linear chain
            var result1 = scheduler.FindExecutionOrder(
                new[] { "deploy", "build", "test" },
                new[] { ("deploy", "build"), ("build", "test") }
            );
            Console.WriteLine($"Example 1: {string.Join(", ", result1 ?? new List<string>())}");
            // Should output: test, build, deploy

            // Example 2: Circular dependency
            var result2 = scheduler.FindExecutionOrder(
                new[] { "A", "B", "C" },
                new[] { ("A", "B"), ("B", "C"), ("C", "A") }
            );
            Console.WriteLine($"Example 2: {(result2 == null ? "null (circular)" : string.Join(", ", result2))}");
            // Should output: null (circular)
        }
    }
}
