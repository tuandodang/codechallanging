"""
Task Scheduler - Dependency Resolution

TODO: Implement the topological sort algorithm to find a valid execution order
for tasks with dependencies, or detect circular dependencies.
"""

from typing import List, Tuple, Optional, Dict, Set
from collections import deque, defaultdict


class TaskScheduler:
    """
    Finds valid execution order for tasks with dependencies using topological sort.
    """

    def find_execution_order(
        self,
        tasks: List[str],
        dependencies: List[Tuple[str, str]]
    ) -> Optional[List[str]]:
        """
        Finds a valid execution order for tasks respecting their dependencies.

        Args:
            tasks: List of task identifiers
            dependencies: List of (dependent, dependency) tuples where
                         dependent task requires dependency task to run first

        Returns:
            List of tasks in valid execution order, or None if circular dependency exists

        Example:
            >>> scheduler = TaskScheduler()
            >>> scheduler.find_execution_order(
            ...     ["deploy", "build", "test"],
            ...     [("deploy", "build"), ("build", "test")]
            ... )
            ["test", "build", "deploy"]
        """
        # TODO: Implement your solution here

        # Suggested approach (you can use a different one):
        # 1. Validate input
        # 2. Build adjacency list and in-degree map
        # 3. Use Kahn's algorithm (BFS-based topological sort):
        #    - Start with tasks that have no dependencies (in-degree = 0)
        #    - Process each task and reduce in-degree of dependent tasks
        #    - If all tasks are processed, return the order
        #    - If not all tasks are processed, circular dependency exists

        # Alternative: DFS-based topological sort with cycle detection

        raise NotImplementedError("TODO: Implement this method")

    def _validate_input(
        self,
        tasks: List[str],
        dependencies: List[Tuple[str, str]]
    ) -> None:
        """
        Validates that all dependencies reference valid tasks.

        Args:
            tasks: List of task identifiers
            dependencies: List of dependency pairs

        Raises:
            ValueError: If dependency references non-existent task
        """
        # TODO: Implement input validation
        pass

    def _build_graph(
        self,
        tasks: List[str],
        dependencies: List[Tuple[str, str]]
    ) -> Dict[str, List[str]]:
        """
        Builds an adjacency list representation of the task dependency graph.

        Args:
            tasks: List of task identifiers
            dependencies: List of dependency pairs

        Returns:
            Adjacency list as a dictionary mapping task to its dependents
        """
        # TODO: Implement graph building
        raise NotImplementedError("TODO: Implement this method")

    def _calculate_in_degrees(
        self,
        tasks: List[str],
        dependencies: List[Tuple[str, str]]
    ) -> Dict[str, int]:
        """
        Calculates in-degree (number of dependencies) for each task.

        Args:
            tasks: List of task identifiers
            dependencies: List of dependency pairs

        Returns:
            Dictionary mapping task to its in-degree
        """
        # TODO: Implement in-degree calculation
        raise NotImplementedError("TODO: Implement this method")


# Example usage (you can delete this)
if __name__ == "__main__":
    scheduler = TaskScheduler()

    # Example 1: Simple linear chain
    result = scheduler.find_execution_order(
        ["deploy", "build", "test"],
        [("deploy", "build"), ("build", "test")]
    )
    print(f"Example 1: {result}")  # Should output: ["test", "build", "deploy"]

    # Example 2: Circular dependency
    result = scheduler.find_execution_order(
        ["A", "B", "C"],
        [("A", "B"), ("B", "C"), ("C", "A")]
    )
    print(f"Example 2: {result}")  # Should output: None
