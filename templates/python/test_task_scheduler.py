"""
Test Suite for TaskScheduler

TODO: Implement comprehensive tests covering:
- Normal cases
- Edge cases
- Error cases
"""

import unittest
from typing import List, Tuple
from task_scheduler import TaskScheduler


class TestTaskScheduler(unittest.TestCase):
    """Test suite for TaskScheduler class"""

    def setUp(self):
        """Initialize scheduler before each test"""
        self.scheduler = TaskScheduler()

    def test_simple_linear_dependency_chain(self):
        """Test simple linear dependency: test -> build -> deploy"""
        tasks = ["deploy", "build", "test"]
        dependencies = [("deploy", "build"), ("build", "test")]

        result = self.scheduler.find_execution_order(tasks, dependencies)

        # TODO: Implement assertions
        self.assertIsNotNone(result, "Result should not be None for valid input")
        # Add more assertions to validate the order

    def test_multiple_independent_chains(self):
        """Test multiple independent dependency chains"""
        tasks = ["task1", "task2", "task3", "task4"]
        dependencies = [("task2", "task1"), ("task4", "task3")]

        result = self.scheduler.find_execution_order(tasks, dependencies)

        # TODO: Implement assertions
        self.assertIsNotNone(result)
        # Verify task1 comes before task2 and task3 comes before task4

    def test_diamond_dependency_graph(self):
        """Test diamond-shaped dependency graph"""
        # TODO: Implement test
        #     A
        #    / \
        #   B   C
        #    \ /
        #     D
        pass

    def test_complex_valid_dependency_graph(self):
        """Test complex DevOps pipeline scenario"""
        tasks = ["compile", "test", "package", "deploy", "notify", "cleanup"]
        dependencies = [
            ("test", "compile"),
            ("package", "compile"),
            ("package", "test"),
            ("deploy", "package"),
            ("notify", "deploy"),
            ("cleanup", "deploy")
        ]

        result = self.scheduler.find_execution_order(tasks, dependencies)

        # TODO: Implement assertions
        # Verify compile is first, package comes after test, etc.
        pass

    def test_empty_task_list(self):
        """Test empty input"""
        result = self.scheduler.find_execution_order([], [])
        # TODO: Implement assertions
        # Should return empty list, not None

    def test_single_task_no_dependencies(self):
        """Test single task with no dependencies"""
        # TODO: Implement test
        pass

    def test_no_dependencies(self):
        """Test tasks with no dependencies - any order is valid"""
        tasks = ["task1", "task2", "task3"]
        dependencies = []

        result = self.scheduler.find_execution_order(tasks, dependencies)

        # TODO: Verify all tasks are present
        self.assertIsNotNone(result)
        self.assertEqual(len(result), 3)
        self.assertEqual(set(result), set(tasks))

    def test_disconnected_components(self):
        """Test multiple disconnected dependency graphs"""
        # TODO: Implement test for separate chains that don't interact
        pass

    def test_simple_circular_dependency(self):
        """Test simple circular dependency: A -> B -> C -> A"""
        tasks = ["A", "B", "C"]
        dependencies = [("A", "B"), ("B", "C"), ("C", "A")]

        result = self.scheduler.find_execution_order(tasks, dependencies)

        # TODO: Assert that result is None (circular dependency detected)
        self.assertIsNone(result, "Should return None for circular dependencies")

    def test_self_dependency(self):
        """Test task that depends on itself"""
        tasks = ["A", "B"]
        dependencies = [("A", "A")]

        result = self.scheduler.find_execution_order(tasks, dependencies)

        # TODO: Implement assertion
        self.assertIsNone(result)

    def test_complex_circular_dependency(self):
        """Test complex circular dependency in longer chain"""
        tasks = ["A", "B", "C", "D", "E"]
        dependencies = [
            ("B", "A"),
            ("C", "B"),
            ("D", "C"),
            ("E", "D"),
            ("A", "E")  # Creates cycle
        ]

        result = self.scheduler.find_execution_order(tasks, dependencies)

        # TODO: Implement assertion
        self.assertIsNone(result)

    def test_invalid_task_reference(self):
        """Test dependency referencing non-existent task"""
        tasks = ["A", "B"]
        dependencies = [("A", "C")]  # C doesn't exist

        # TODO: Decide whether to return None or raise ValueError
        # Then implement appropriate assertion
        with self.assertRaises(ValueError):
            self.scheduler.find_execution_order(tasks, dependencies)

    def test_long_dependency_chain(self):
        """Test long linear dependency chain"""
        # TODO: Implement test with 10+ tasks in sequence
        pass


def is_valid_order(
    order: List[str],
    dependencies: List[Tuple[str, str]]
) -> bool:
    """
    Helper function to validate if a task order respects all dependencies.

    Args:
        order: Proposed execution order
        dependencies: Dependency constraints

    Returns:
        True if order is valid
    """
    # TODO: Implement validation logic
    # For each dependency (A, B), ensure B appears before A in the order
    position = {task: idx for idx, task in enumerate(order)}

    for dependent, dependency in dependencies:
        if dependency not in position or dependent not in position:
            return False
        if position[dependency] >= position[dependent]:
            return False

    return True


if __name__ == '__main__':
    unittest.main()
