import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Title, Text, Stack, Paper } from '@mantine/core';
import { LoginButton } from '../components/LoginButton';
import { LogoutButton } from '../components/LogoutButton';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return (
      <Container size="xs" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper shadow="md" p="xl" radius="md" style={{ width: '100%' }}>
          <Stack gap="md" align="center">
            <Title order={2}>Loading...</Title>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xs" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper shadow="md" p="xl" radius="md" style={{ width: '100%' }}>
        <Stack gap="md" align="center">
          <Title order={2}>Welcome to Class Manager</Title>
          {isAuthenticated ? (
            <>
              <Text c="dimmed" ta="center">
                You are logged in as {user?.email || user?.name}
              </Text>
              <LogoutButton />
            </>
          ) : (
            <>
              <Text c="dimmed" ta="center">
                Please log in to continue
              </Text>
              <LoginButton />
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
