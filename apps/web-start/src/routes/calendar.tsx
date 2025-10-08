import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Container,
  Paper,
  Button,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  ActionIcon,
  Menu,
  Avatar,
  Box,
  Card,
  Grid,
} from '@mantine/core';

// Sample calendar events
const calendarEvents = [
  {
    id: 1,
    title: 'CISC474 - Advanced Web Technologies',
    date: '2024-01-15',
    time: '10:00 AM - 10:50 AM',
    type: 'class',
    color: 'blue',
    location: 'Room 101'
  },
  {
    id: 2,
    title: 'Assignment Due: Setup Development Environment',
    date: '2024-01-15',
    time: '11:59 PM',
    type: 'assignment',
    color: 'red',
    course: 'CISC474'
  },
  {
    id: 3,
    title: 'CISC498 - Senior Design',
    date: '2024-01-16',
    time: '2:00 PM - 3:15 PM',
    type: 'class',
    color: 'green',
    location: 'Room 205'
  },
  {
    id: 4,
    title: 'JavaScript Fundamentals Quiz',
    date: '2024-01-20',
    time: '11:59 PM',
    type: 'assignment',
    color: 'red',
    course: 'CISC474'
  },
  {
    id: 5,
    title: 'CPEG493 - Cloud Computing',
    date: '2024-01-17',
    time: '1:00 PM - 1:50 PM',
    type: 'class',
    color: 'orange',
    location: 'Room 150'
  }
];

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
});

function CalendarPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate({ to: '/login' });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'class':
        return '📚';
      case 'assignment':
        return '📝';
      case 'exam':
        return '📊';
      default:
        return '📅';
    }
  };

  const getEventColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'blue';
      case 'red':
        return 'red';
      case 'green':
        return 'green';
      case 'orange':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper shadow="sm" p="md" mb="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Calendar</Title>
            <Text size="sm" c="dimmed">Your upcoming classes and assignments</Text>
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

      <Container size="lg">
        {/* Quick Stats */}
        <Grid mb="xl">
          <Grid.Col span={4}>
            <Card shadow="sm" p="md" withBorder>
              <Group>
                <Text size="xl">📚</Text>
                <div>
                  <Text size="sm" c="dimmed">Classes This Week</Text>
                  <Text fw={500} size="lg">3</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="sm" p="md" withBorder>
              <Group>
                <Text size="xl">📝</Text>
                <div>
                  <Text size="sm" c="dimmed">Assignments Due</Text>
                  <Text fw={500} size="lg">2</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="sm" p="md" withBorder>
              <Group>
                <Text size="xl">📊</Text>
                <div>
                  <Text size="sm" c="dimmed">Exams This Month</Text>
                  <Text fw={500} size="lg">1</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Upcoming Events */}
        <Title order={3} mb="md">Upcoming Events</Title>
        
        <Stack gap="md">
          {calendarEvents.map((event) => (
            <Card key={event.id} shadow="sm" p="lg" withBorder>
              <Group justify="space-between">
                <Group>
                  <Text size="xl">{getEventIcon(event.type)}</Text>
                  <div>
                    <Text fw={500} size="lg">{event.title}</Text>
                    <Text size="sm" c="dimmed">
                      {event.date} at {event.time}
                    </Text>
                    {event.location && (
                      <Text size="sm" c="dimmed">📍 {event.location}</Text>
                    )}
                    {event.course && (
                      <Text size="sm" c="dimmed">📚 {event.course}</Text>
                    )}
                  </div>
                </Group>
                
                <Badge color={getEventColor(event.color)} variant="light">
                  {event.type}
                </Badge>
              </Group>
            </Card>
          ))}
        </Stack>

        {/* Quick Actions */}
        <Paper shadow="sm" p="lg" mt="xl">
          <Title order={4} mb="md">Quick Actions</Title>
          
          <Group gap="md">
            <Button 
              variant="light" 
              leftSection="📅"
              onClick={() => navigate({ to: '/dashboard' })}
            >
              Back to Dashboard
            </Button>
            <Button 
              variant="light" 
              leftSection="📝"
            >
              Add Event
            </Button>
            <Button 
              variant="light" 
              leftSection="📊"
            >
              View Grades
            </Button>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
}
