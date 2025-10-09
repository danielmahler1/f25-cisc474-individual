import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length > 0 ? null : 'Password is required'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log('Login attempt:', values);
    // Simulate successful login and redirect to dashboard
    navigate({ to: '/dashboard' });
  };

  return (
    <Container size="xs" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
      <Paper shadow="md" p="xl" radius="md" style={{ width: '100%' }}>
        Links to pages connected to the backend API:
        <ul>
          <li>
            <Anchor href="/dashboard" c="blue">
              Dashboard
            </Anchor>
          </li>
          <li>
            <Anchor href="/calendar" c="blue">
              Calendar
            </Anchor>
          </li>
        </ul>
        </Paper>
      <Paper shadow="md" p="xl" radius="md" style={{ width: '100%' }}>
        <Stack gap="md">
          <div>
            <Title order={2} mb="xs">
              Login to your account
            </Title>
            <Text c="dimmed" size="sm">
              Enter your email below to login to your account.
              For now any email/password will work.
            </Text>
          </div>

          <Group justify="flex-end">
            <Anchor component="button" type="button" c="blue" size="sm">
              Sign Up
            </Anchor>
          </Group>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="m@example.com"
                required
                {...form.getInputProps('email')}
              />

              <div>
                <Group justify="space-between" mb="xs">
                  <Text component="label" size="sm" fw={500}>
                    Password
                  </Text>
                  <Anchor component="button" type="button" c="blue" size="sm">
                    Forgot your password?
                  </Anchor>
                </Group>
                <PasswordInput
                  placeholder="Your password"
                  required
                  {...form.getInputProps('password')}
                />
              </div>

              <Stack gap="sm">
                <Button type="submit" fullWidth>
                  Login
                </Button>
                <Button variant="outline" fullWidth>
                  Login with Google
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
