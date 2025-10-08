import { createFileRoute, redirect } from '@tanstack/react-router';
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Paper,
} from '@mantine/core';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Server-side redirect to login page
    throw redirect({ to: '/login' });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container size="xs" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper shadow="md" p="xl" radius="md" style={{ width: '100%' }}>
        <Stack gap="md" align="center">
          <Title order={2}>Welcome to Class Manager</Title>
          <Text c="dimmed" ta="center">
            Redirecting you to login...
          </Text>
          <Button component="a" href="/login">
            Go to Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
