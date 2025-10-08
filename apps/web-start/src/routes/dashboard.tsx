import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';
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
  Center,
  Stack,
  Alert,
} from '@mantine/core';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  loader: async ({ context }) => {
    // Access environment variable from Cloudflare Workers (production) or Vite (local dev)
    const env = (context as any).cloudflare?.env;
    const apiUrl = env?.VITE_API_URL || import.meta.env?.VITE_API_URL || 'http://localhost:3000';

    try {
      const response = await fetch(`${apiUrl}/courses`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      return { courses: data, debugInfo: { apiUrl, hasCloudflareEnv: !!env, hasViteEnv: !!import.meta.env?.VITE_API_URL } };
    } catch (error) {
      console.error('Error fetching courses:', error);
      return { courses: [], debugInfo: { apiUrl, error: String(error), hasCloudflareEnv: !!env, hasViteEnv: !!import.meta.env?.VITE_API_URL } };
    }
  },
});

function LoadingFallback() {
  return (
    <Center p="xl">
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text>Loading courses from backend...</Text>
      </Stack>
    </Center>
  );
}

function RouteComponent() {
  const navigate = useNavigate();
  const data = Route.useLoaderData();
  const courses = data.courses;
  const debugInfo = data.debugInfo;

  const handleLogout = () => {
    navigate({ to: '/login' });
  };

  return (
    <Box>
      {/* Header */}
      <Paper shadow="sm" p="md" mb="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Dashboard</Title>
            <Text size="sm" c="dimmed">
              Welcome back to your classes
              <Badge ml="sm" size="sm" variant="light">
                API: {debugInfo.apiUrl}
              </Badge>
              {debugInfo.error && (
                <Badge ml="sm" size="sm" variant="light" color="red">
                  Error: {debugInfo.error}
                </Badge>
              )}
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
          <Title order={3}>Quick Actions (This page and the calendar page are connected to the backend) </Title>
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
          <Badge color="green" variant="dot">
            Data from Backend API
          </Badge>
        </Group>

        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      </Container>
    </Box>
  );
}
