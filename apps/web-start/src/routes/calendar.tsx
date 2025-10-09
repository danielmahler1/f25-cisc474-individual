import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, Suspense } from 'react';
import {
  Container,
  Paper,
  Button,
  Title,
  Text,
  Stack,
  Group,
  ActionIcon,
  Menu,
  Avatar,
  Box,
  Card,
  Badge,
  Grid,
  Loader,
  Center,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: string;
  course: string;
  color: string;
}

export const Route = createFileRoute('/calendar')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const env = (context as any).cloudflare?.env;
    const apiUrl = env?.VITE_API_URL || import.meta.env?.VITE_API_URL || 'http://localhost:3000';

    try {
      const response = await fetch(`${apiUrl}/calendar-events`);
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  },
});

function LoadingFallback() {
  return (
    <Center p="xl">
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text>Loading calendar events from backend...</Text>
      </Stack>
    </Center>
  );
}

function RouteComponent() {
  const navigate = useNavigate();
  const backendEvents = Route.useLoaderData();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleLogout = () => {
    navigate({ to: '/login' });
  };

  // Map backend events to match the format
  const events: CalendarEvent[] = backendEvents.map((event: any) => ({
    id: event.id,
    title: event.title,
    date: dayjs(event.dueAt).format('YYYY-MM-DD'),
    type: 'assignment',
    course: event.assignment?.course?.code || 'N/A',
    color: 'blue'
  }));

  // Get events for selected date
  const getEventsForDate = (date: Date | null): CalendarEvent[] => {
    if (!date) return [];
    const dateString = dayjs(date).format('YYYY-MM-DD');
    return events.filter((event) => event.date === dateString);
  };

  // Get events for current month
  const getEventsForMonth = (date: Date): CalendarEvent[] => {
    const monthStart = dayjs(date).startOf('month').format('YYYY-MM-DD');
    const monthEnd = dayjs(date).endOf('month').format('YYYY-MM-DD');
    return events.filter((event) =>
      event.date >= monthStart && event.date <= monthEnd
    );
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const currentMonthEvents = getEventsForMonth(selectedDate || new Date());

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return '📝';
      case 'exam': return '📊';
      case 'class': return '🏫';
      case 'presentation': return '🎤';
      default: return '📅';
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'assignment': return 'Assignment';
      case 'exam': return 'Exam';
      case 'class': return 'Class';
      case 'presentation': return 'Presentation';
      default: return 'Event';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper shadow="sm" p="md" mb="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Calendar</Title>
            <Text size="sm" c="dimmed">
              View your upcoming assignments and events
              <Badge ml="sm" size="sm" variant="light" color="green">
                Backend API Data
              </Badge>
            </Text>
          </div>

          <Group>
            <Button variant="outline" onClick={() => navigate({ to: '/dashboard' })}>
              ← Back to Dashboard
            </Button>

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
        </Group>
      </Paper>

      <Container size="xl">
        <Suspense fallback={<LoadingFallback />}>
        <Grid>
          {/* Calendar */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">📅 Calendar (Data from backend)</Title>

              <DatePicker
                value={selectedDate}
                onChange={(date) => {
                  console.log('Selected date:', date, typeof date); // Debug log
                  if (date) {
                    // Convert string to Date object
                    const newDate = new Date(date + 'T12:00:00'); // Add noon time to avoid timezone issues
                    setSelectedDate(newDate);
                  } else {
                    setSelectedDate(null);
                  }
                }}
                size="lg"
                style={{ width: '100%' }}
              />
            </Card>
          </Grid.Col>

          {/* Event Details */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              {/* Selected Date Events */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  Events for {selectedDate ? dayjs(selectedDate).format('MMMM D, YYYY') : 'Today'}
                </Title>

                {selectedDateEvents.length > 0 ? (
                  <Stack gap="sm">
                    {selectedDateEvents.map((event: CalendarEvent) => (
                      <Paper key={event.id} p="sm" withBorder>
                        <Group gap="sm">
                          <Text>{getEventTypeIcon(event.type)}</Text>
                          <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{event.title}</Text>
                            <Group gap="xs">
                              <Badge size="xs" color={event.color}>
                                {event.course}
                              </Badge>
                              <Badge size="xs" variant="outline">
                                {getEventTypeName(event.type)}
                              </Badge>
                            </Group>
                          </div>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Text c="dimmed" ta="center" py="md">
                    No events on this date
                  </Text>
                )}
              </Card>

              {/* Upcoming Events */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Upcoming This Month</Title>

                {currentMonthEvents.length > 0 ? (
                  <Stack gap="xs">
                    {currentMonthEvents
                      .sort((a: CalendarEvent, b: CalendarEvent) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 5)
                      .map((event: CalendarEvent) => (
                      <Paper key={event.id} p="xs" withBorder>
                        <Group gap="sm">
                          <Text size="sm">{getEventTypeIcon(event.type)}</Text>
                          <div style={{ flex: 1 }}>
                            <Text size="xs" fw={500}>{event.title}</Text>
                            <Group gap="xs">
                              <Text size="xs" c="dimmed">
                                {dayjs(event.date).format('MMM D')}
                              </Text>
                              <Badge size="xs" color={event.color}>
                                {event.course}
                              </Badge>
                            </Group>
                          </div>
                        </Group>
                      </Paper>
                    ))}

                    {currentMonthEvents.length > 5 && (
                      <Text size="xs" c="dimmed" ta="center">
                        +{currentMonthEvents.length - 5} more events this month
                      </Text>
                    )}
                  </Stack>
                ) : (
                  <Text c="dimmed" ta="center" py="md">
                    No upcoming events
                  </Text>
                )}
              </Card>

              {/* Legend */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Event Types</Title>
                <Stack gap="xs">
                  <Group gap="sm">
                    <Text>📝</Text>
                    <Text size="sm">Assignments</Text>
                  </Group>
                  <Group gap="sm">
                    <Text>📊</Text>
                    <Text size="sm">Exams</Text>
                  </Group>
                  <Group gap="sm">
                    <Text>🏫</Text>
                    <Text size="sm">Classes</Text>
                  </Group>
                  <Group gap="sm">
                    <Text>🎤</Text>
                    <Text size="sm">Presentations</Text>
                  </Group>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
        </Suspense>
      </Container>
    </Box>
  );
}
