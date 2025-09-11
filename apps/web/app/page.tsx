'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Stack, Paper } from '@mantine/core';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to login page
    router.push('/login');
  }, [router]);

  return (
    <Container size="xs" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper shadow="md" p="xl" radius="md" style={{ width: '100%' }}>
        <Stack gap="md" align="center">
          <Title order={2}>Welcome to Class Manager</Title>
          <Text c="dimmed" ta="center">
            Redirecting you to login...
          </Text>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
