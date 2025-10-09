import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Paper,
  Button,
  Title,
  Text,
  Group,
  Grid,
  Card,
  Badge,
  ActionIcon,
  Menu,
  Avatar,
  Box,
  Flex,
  Loader,
  Stack,
  Alert,
} from '@mantine/core';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

async function fetchCourses() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const response = await fetch(`${apiUrl}/courses`, {
    signal: AbortSignal.timeout(300000), // 5 minute timeout for Render cold starts
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.status}`);
  }

  return response.json();
}

function RouteComponent() {
  const navigate = useNavigate();

  const { data: courses, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    retry: 3, // Retry 3 times on failure
    retryDelay: 2000, // Wait 2 seconds between retries
  });

  const handleLogout = () => {
    navigate({ to: '/login' });
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
            {error?.message || 'Failed to load courses from backend'}
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
        </Group>

        {courses && courses.length > 0 ? (
          <Grid>
            {courses.map((course: any) => (
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

                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    onClick={() => navigate({ to: '/course/$slug', params: { slug: course.id } })}
                  >
                    📚 View Class
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Alert color="blue" title="No Courses Found">
            No courses available. The backend API returned an empty list.
          </Alert>
        )}
      </Container>
    </Box>
  );
}

