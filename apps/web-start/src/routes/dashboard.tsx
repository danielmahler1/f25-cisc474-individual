import { createFileRoute, useNavigate } from '@tanstack/react-router';
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
} from '@mantine/core';

// Dummy class data - made with AI and some of my classes
const classes = [
  {
    id: 1,
    name: 'CISC474 - Advanced Web Technologies',
    instructor: 'Dr. Smith',
    time: 'MWF 10:00-10:50 AM',
    students: 24,
    status: 'active',
    color: 'blue',
    slug: 'cisc474'
  },
  {
    id: 2,
    name: 'CISC498 - Senior Design',
    instructor: 'Prof. Johnson',
    time: 'TTh 2:00-3:15 PM',
    students: 35,
    status: 'active',
    color: 'green',
    slug: 'cisc498'
  },
  {
    id: 3,
    name: 'CPEG493 - Cloud Computing',
    instructor: 'Dr. Williams',
    time: 'MWF 1:00-1:50 PM',
    students: 18,
    status: 'active',
    color: 'orange',
    slug: 'cpeg493'
  },
  {
    id: 4,
    name: 'CPEG494 - System Hardening',
    instructor: 'Prof. Davis',
    time: 'TTh 11:00-12:15 PM',
    students: 28,
    status: 'completed',
    color: 'gray',
    slug: 'cpeg494'
  }
];

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

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
            <Text size="sm" c="dimmed">Welcome back to your classes</Text>
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
        <Title order={3} mb="md">My Classes</Title>

        <Grid>
          {classes.map((classItem) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={classItem.id}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Badge color={classItem.color} variant="light">
                    {classItem.status}
                  </Badge>
                </Group>

                <Text fw={500} size="lg" mb="xs">
                  {classItem.name}
                </Text>

                <Text size="sm" c="dimmed" mb="sm">
                  Instructor: {classItem.instructor}
                </Text>

                <Flex gap="xs" mb="md" align="center">
                  <Text size="sm">📅</Text>
                  <Text size="sm">{classItem.time}</Text>
                </Flex>

                <Flex gap="xs" mb="md" align="center">
                  <Text size="sm">👥</Text>
                  <Text size="sm">{classItem.students} students</Text>
                </Flex>

                <Button
                  variant="light"
                  color={classItem.color}
                  fullWidth
                  onClick={() => navigate({ to: '/course/$slug', params: { slug: classItem.slug } })}
                >
                  📚 View Class
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
