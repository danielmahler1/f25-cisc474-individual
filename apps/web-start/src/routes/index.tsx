import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Container, Title, Text, Button, Stack, Paper } from '@mantine/core';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to login page
    navigate({ to: '/login' });
  }, [navigate]);

  return (
    <Container size="xs" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper shadow="md" p="xl" radius="md" style={{ width: '100%' }}>
        <Stack gap="md" align="center">
          <Title order={2}>Welcome to Class Manager</Title>
          <Text c="dimmed" ta="center">
            Redirecting you to login...
          </Text>
          <Button onClick={() => navigate({ to: '/login' })}>
            Go to Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
