using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace TaskSchedulerChallenge.Tests
{
    /// <summary>
    /// Test Suite for TaskScheduler
    ///
    /// TODO: Implement comprehensive tests covering:
    /// - Normal cases
    /// - Edge cases
    /// - Error cases
    /// </summary>
    public class TaskSchedulerTests
    {
        private readonly TaskScheduler _scheduler;

        public TaskSchedulerTests()
        {
            _scheduler = new TaskScheduler();
        }

        [Fact]
        public void FindExecutionOrder_SimpleLinearChain_ReturnsValidOrder()
        {
            // Arrange
            var tasks = new[] { "deploy", "build", "test" };
            var dependencies = new[] { ("deploy", "build"), ("build", "test") };

            // Act
            var result = _scheduler.FindExecutionOrder(tasks, dependencies);

            // Assert
            // TODO: Implement assertions
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            // Verify correct ordering
        }

        [Fact]
        public void FindExecutionOrder_MultipleIndependentChains_ReturnsValidOrder()
        {
            // Arrange
            var tasks = new[] { "task1", "task2", "task3", "task4" };
            var dependencies = new[] { ("task2", "task1"), ("task4", "task3") };

            // Act
            var result = _scheduler.FindExecutionOrder(tasks, dependencies);

            // Assert
            // TODO: Implement assertions
            Assert.NotNull(result);
            // Verify task1 before task2 and task3 before task4
        }

        [Fact]
        public void FindExecutionOrder_DiamondDependencyGraph_ReturnsValidOrder()
        {
            // TODO: Implement test for diamond-shaped graph
            //     A
            //    / \
            //   B   C
            //    \ /
            //     D
        }

        [Fact]
        public void FindExecutionOrder_ComplexValidGraph_ReturnsValidOrder()
        {
            // Arrange
            var tasks = new[] { "compile", "test", "package", "deploy", "notify", "cleanup" };
            var dependencies = new[]
            {
                ("test", "compile"),
                ("package", "compile"),
                ("package", "test"),
                ("deploy", "package"),
                ("notify", "deploy"),
                ("cleanup", "deploy")
            };

            // Act
            var result = _scheduler.FindExecutionOrder(tasks, dependencies);

            // Assert
            // TODO: Implement assertions
            // Verify compile is first, etc.
        }

        [Fact]
        public void FindExecutionOrder_EmptyInput_ReturnsEmptyList()
        {
            // Arrange
            var tasks = Array.Empty<string>();
            var dependencies = Array.Empty<(string, string)>();

            // Act
            var result = _scheduler.FindExecutionOrder(tasks, dependencies);

            // Assert
            // TODO: Decide if should return empty list or null
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public void FindExecutionOrder_SingleTask_ReturnsSingletonList()
        {
            // TODO: Implement test
        }

        [Fact]
        public void FindExecutionOrder_NoDependencies_ReturnsAllTasks()
        {
            // Arrange
            var tasks = new[] { "task1", "task2", "task3" };
            var dependencies = Array.Empty<(string, string)>();

            // Act
            var result = _scheduler.FindExecutionOrder(tasks, dependencies);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.Equal(tasks.OrderBy(t => t), result.OrderBy(t => t));
        }

        [Fact]
        public void FindExecutionOrder_DisconnectedComponents_ReturnsValidOrder()
        {
            // TODO: Implement test for multiple separate chains
        }

        [Fact]
        public void FindExecutionOrder_SimpleCircularDependency_ReturnsNull()
        {
            // Arrange
            var tasks = new[] { "A", "B", "C" };
            var dependencies = new[] { ("A", "B"), ("B", "C"), ("C", "A") };

            // Act
            var result = _scheduler.FindExecutionOrder(tasks, dependencies);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void FindExecutionOrder_SelfDependency_ReturnsNull()
        {
            // Arrange
            var tasks = new[] { "A", "B" };
            var dependencies = new[] { ("A", "A") };

            // Act
            var result = _scheduler.FindExecutionOrder(tasks, dependencies);

            // Assert
            // TODO: Implement assertion
            Assert.Null(result);
        }

        [Fact]
        public void FindExecutionOrder_ComplexCircularDependency_ReturnsNull()
        {
            // Arrange
            var tasks = new[] { "A", "B", "C", "D", "E" };
            var dependencies = new[]
            {
                ("B", "A"),
                ("C", "B"),
                ("D", "C"),
                ("E", "D"),
                ("A", "E") // Creates cycle
            };

            // Act
            var result = _scheduler.FindExecutionOrder(tasks, dependencies);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void FindExecutionOrder_InvalidTaskReference_ThrowsException()
        {
            // Arrange
            var tasks = new[] { "A", "B" };
            var dependencies = new[] { ("A", "C") }; // C doesn't exist

            // Act & Assert
            // TODO: Decide whether to throw exception or return null
            Assert.Throws<ArgumentException>(() =>
                _scheduler.FindExecutionOrder(tasks, dependencies));
        }

        [Fact]
        public void FindExecutionOrder_LongDependencyChain_ReturnsValidOrder()
        {
            // TODO: Implement test with 10+ tasks in sequence
        }

        /// <summary>
        /// Helper method to validate if a task order respects all dependencies
        /// </summary>
        private bool IsValidOrder(
            List<string> order,
            (string Dependent, string Dependency)[] dependencies)
        {
            // TODO: Implement validation logic
            // For each dependency (A, B), ensure B appears before A in the order
            var position = order
                .Select((task, index) => new { task, index })
                .ToDictionary(x => x.task, x => x.index);

            foreach (var (dependent, dependency) in dependencies)
            {
                if (!position.ContainsKey(dependent) || !position.ContainsKey(dependency))
                    return false;

                if (position[dependency] >= position[dependent])
                    return false;
            }

            return true;
        }
    }
}
