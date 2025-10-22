import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Loader,
  Menu,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import type { Course, CreateCourse, UpdateCourse } from '@repo/api';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fetch all courses
async function fetchCourses(): Promise<Array<Course>> {
  const response = await fetch(`${API_URL}/courses`, {
    signal: AbortSignal.timeout(300000), // 5 minute timeout for Render cold starts
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.status}`);
  }

  return response.json();
}

// Create a new course
async function createCourse(data: CreateCourse): Promise<Course> {
  const response = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create course: ${response.status}`);
  }

  return response.json();
}

// Update a course
async function updateCourse(id: string, data: UpdateCourse): Promise<Course> {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update course: ${response.status}`);
  }

  return response.json();
}

// Delete a course
async function deleteCourse(id: string): Promise<Course> {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete course: ${response.status}`);
  }

  return response.json();
}

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modal state
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    term: '',
    userId: '', // Will be populated from existing courses or entered manually
  });

  // Query for fetching courses
  const { data: courses, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    retry: 3,
    retryDelay: 2000,
  });

  // Auto-populate userId when courses load
  useEffect(() => {
    const firstUserId = courses?.[0]?.userId;
    if (firstUserId && !formData.userId) {
      setFormData(prev => ({ ...prev, userId: firstUserId }));
    }
  }, [courses]);

  // Mutation for creating a course
  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setCreateModalOpened(false);
      resetForm();
    },
    onError: (err) => {
      console.error('Create course error:', err);
      alert(`Failed to create course: ${err.message}`);
    },
  });

  // Mutation for updating a course
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourse }) =>
      updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setEditModalOpened(false);
      setSelectedCourse(null);
      resetForm();
    },
  });

  // Mutation for deleting a course
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setDeleteModalOpened(false);
      setSelectedCourse(null);
    },
  });

  const handleLogout = () => {
    navigate({ to: '/login' });
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      term: '',
      // Use an existing user ID from courses if available
      userId: courses?.[0]?.userId || '',
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse) {
      updateMutation.mutate({
        id: selectedCourse.id,
        data: {
          code: formData.code,
          title: formData.title,
          term: formData.term,
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedCourse) {
      deleteMutation.mutate(selectedCourse.id);
    }
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      code: course.code,
      title: course.title,
      term: course.term,
      userId: course.userId,
    });
    setEditModalOpened(true);
  };

  const openDeleteModal = (course: Course) => {
    setSelectedCourse(course);
    setDeleteModalOpened(true);
  };

  // Loading state - show during cold start
  if (isLoading) {
    return (
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Title order={3}>Loading Dashboard...</Title>
          <Text c="dimmed" size="sm">Render is waking up (this may take 30-60 seconds on first load)</Text>
        </Stack>
      </Box>
    );
  }

  // Error state - show with retry button
  if (isError) {
    return (
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack align="center" gap="md">
          <Alert color="red" title="Error Loading Dashboard" style={{ maxWidth: 500 }}>
            {error.message || 'Failed to load courses from backend'}
          </Alert>
          <Button onClick={() => refetch()}>Retry</Button>
          <Button variant="outline" onClick={() => navigate({ to: '/login' })}>Back to Login</Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper shadow="sm" p="md" mb="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Dashboard</Title>
            <Text size="sm" c="dimmed">
              Welcome back to your classes
            </Text>
          </div>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="lg">
                <Avatar size="sm" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>
                👤 Profile
              </Menu.Item>
              <Menu.Item>
                ⚙️ Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={handleLogout}
                color="red"
              >
                🚪 Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Paper>

      {/* Quick Actions */}
      <Container size="lg" mb="xl">
        <Group justify="space-between" mb="md">
          <Title order={3}>Quick Actions</Title>
        </Group>
        <Group gap="md">
          <Button
            leftSection="📅"
            variant="light"
            onClick={() => navigate({ to: '/calendar' })}
          >
            View Calendar
          </Button>
          <Button
            leftSection="📊"
            variant="light"
            color="gray"
          >
            View Grades
          </Button>
        </Group>
      </Container>

      {/* Classes Grid */}
      <Container size="lg">
        <Group justify="space-between" mb="md">
          <Title order={3}>My Classes</Title>
          <Button onClick={() => setCreateModalOpened(true)} color="green">
            + Add Course
          </Button>
        </Group>

        {courses && courses.length > 0 ? (
          <Grid>
            {courses.map((course) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={course.id}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Badge color="blue" variant="light">
                      {course.term}
                    </Badge>
                  </Group>

                  <Text fw={500} size="lg" mb="xs">
                    {course.code} - {course.title}
                  </Text>

                  <Text size="sm" c="dimmed" mb="sm">
                    Instructor: {course.owner?.name || 'N/A'}
                  </Text>

                  <Flex gap="xs" mb="md" align="center">
                    <Text size="sm">📅</Text>
                    <Text size="sm">{new Date(course.createdAt).toLocaleDateString()}</Text>
                  </Flex>

                  <Stack gap="xs">
                    <Button
                      variant="light"
                      color="blue"
                      fullWidth
                      onClick={() => navigate({ to: '/course/$slug', params: { slug: course.id } })}
                    >
                      View Class
                    </Button>
                    <Group gap="xs" grow>
                      <Button
                        variant="outline"
                        color="orange"
                        onClick={() => openEditModal(course)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        color="red"
                        onClick={() => openDeleteModal(course)}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Alert color="blue" title="No Courses Found">
            No courses available. Click "Add Course" to create your first course!
          </Alert>
        )}
      </Container>

      {/* Create Course Modal */}
      <Modal
        opened={createModalOpened}
        onClose={() => {
          setCreateModalOpened(false);
          resetForm();
        }}
        title="Create New Course"
      >
        <form onSubmit={handleCreateSubmit}>
          <Stack gap="md">
            <TextInput
              label="Course Code"
              placeholder="e.g., CISC474"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <TextInput
              label="Course Title"
              placeholder="e.g., Advanced Web Development"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextInput
              label="Term"
              placeholder="e.g., Fall 2025"
              required
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value })}
            />
            <TextInput
              label="User ID (Instructor)"
              placeholder="Copy from an existing course owner"
              required
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              description={courses?.[0]?.userId ? `Example: ${courses[0].userId}` : 'UUID of the course instructor'}
            />
            <Button type="submit" loading={createMutation.isPending}>
              Create Course
            </Button>
          </Stack>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        opened={editModalOpened}
        onClose={() => {
          setEditModalOpened(false);
          setSelectedCourse(null);
          resetForm();
        }}
        title="Edit Course"
      >
        <form onSubmit={handleEditSubmit}>
          <Stack gap="md">
            <TextInput
              label="Course Code"
              placeholder="e.g., CISC474"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <TextInput
              label="Course Title"
              placeholder="e.g., Advanced Web Development"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextInput
              label="Term"
              placeholder="e.g., Fall 2025"
              required
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value })}
            />
            <Button type="submit" loading={updateMutation.isPending}>
              Save Changes
            </Button>
          </Stack>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
          setSelectedCourse(null);
        }}
        title="Delete Course"
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete <strong>{selectedCourse?.code} - {selectedCourse?.title}</strong>?
            This action cannot be undone.
          </Text>
          <Group justify="flex-end" gap="xs">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpened(false);
                setSelectedCourse(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDeleteConfirm}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

