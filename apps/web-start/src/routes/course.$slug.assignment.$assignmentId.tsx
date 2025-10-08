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
  Divider,
  Breadcrumbs,
  Anchor,
  Textarea,
  FileInput,
  List,
  Grid,
} from '@mantine/core';

// Assignment data types
type FileAssignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  instructions: string[];
  submissionType: 'file';
  maxFileSize: string;
  allowedTypes: string[];
};

type TextAssignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  instructions: string[];
  submissionType: 'text';
  maxLength: number;
};

type Assignment = FileAssignment | TextAssignment;

const assignmentData: Record<string, Assignment> = {
  'setup-environment': {
    id: 'setup-environment',
    title: 'Setup Development Environment',
    description: 'Set up your development environment with Node.js, npm, and a code editor.',
    dueDate: '2024-01-15',
    points: 50,
    instructions: [
      'Install Node.js (version 18 or higher)',
      'Install a code editor (VS Code recommended)',
      'Create a new project directory',
      'Initialize a new npm project',
      'Install required dependencies',
      'Create a simple "Hello World" application'
    ],
    submissionType: 'file',
    maxFileSize: '10MB',
    allowedTypes: ['.zip', '.tar.gz']
  },
  'javascript-quiz': {
    id: 'javascript-quiz',
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your understanding of JavaScript fundamentals.',
    dueDate: '2024-01-20',
    points: 25,
    instructions: [
      'Complete the online quiz',
      'Answer all questions to the best of your ability',
      'Submit your answers before the deadline'
    ],
    submissionType: 'text',
    maxLength: 2000
  },
  'first-component': {
    id: 'first-component',
    title: 'First React Component',
    description: 'Create your first React component with props and state.',
    dueDate: '2024-01-25',
    points: 75,
    instructions: [
      'Create a new React component called "WelcomeCard"',
      'The component should accept props for name and message',
      'Include state to track the number of times the component has been clicked',
      'Display the click count in the component',
      'Style the component using CSS or a styling library'
    ],
    submissionType: 'file',
    maxFileSize: '5MB',
    allowedTypes: ['.jsx', '.tsx', '.zip']
  }
};

export const Route = createFileRoute('/course/$slug/assignment/$assignmentId')({
  component: AssignmentPage,
});

function AssignmentPage() {
  const navigate = useNavigate();
  const { slug, assignmentId } = Route.useParams();
  
  const assignment = assignmentData[assignmentId as keyof typeof assignmentData];
  
  if (!assignment) {
    return (
      <Container size="lg" py="xl">
        <Title order={2}>Assignment not found</Title>
        <Text c="dimmed" mb="md">The assignment you're looking for doesn't exist.</Text>
        <Button onClick={() => navigate({ to: `/course/${slug}` })}>
          Back to Course
        </Button>
      </Container>
    );
  }

  const handleLogout = () => {
    navigate({ to: '/login' });
  };

  const breadcrumbItems = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Course', href: `/course/${slug}` },
    { title: assignment.title, href: '#' },
  ].map((item, index) => (
    <Anchor
      key={index}
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        if (item.href !== '#') {
          navigate({ to: item.href as any });
        }
      }}
    >
      {item.title}
    </Anchor>
  ));

  return (
    <Box>
      {/* Header */}
      <Paper shadow="sm" p="md" mb="lg">
        <Group justify="space-between">
          <div>
            <Breadcrumbs mb="sm">{breadcrumbItems}</Breadcrumbs>
            <Title order={2}>{assignment.title}</Title>
            <Text size="sm" c="dimmed">{assignment.description}</Text>
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
        <Grid>
          <Grid.Col span={8}>
            {/* Assignment Details */}
            <Paper shadow="sm" p="lg" mb="lg">
              <Title order={3} mb="md">Assignment Instructions</Title>
              
              <Stack gap="md">
                <div>
                  <Text fw={500} mb="sm">Instructions:</Text>
                  <List spacing="xs" size="sm">
                    {assignment.instructions.map((instruction, index) => (
                      <List.Item key={index}>
                        <Text size="sm">{instruction}</Text>
                      </List.Item>
                    ))}
                  </List>
                </div>

                <Divider />

                <Group gap="xl">
                  <div>
                    <Text size="sm" c="dimmed">Due Date</Text>
                    <Text fw={500}>{assignment.dueDate}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Points</Text>
                    <Text fw={500}>{assignment.points}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Submission Type</Text>
                    <Text fw={500} c="capitalize">{assignment.submissionType}</Text>
                  </div>
                </Group>
              </Stack>
            </Paper>

            {/* Submission Form */}
            <Paper shadow="sm" p="lg">
              <Title order={3} mb="md">Submit Assignment</Title>
              
              <Stack gap="md">
                {assignment.submissionType === 'text' ? (
                  <Textarea
                    label="Your Answer"
                    placeholder="Enter your response here..."
                    minRows={6}
                    maxLength={assignment.maxLength}
                    description={`Maximum ${assignment.maxLength} characters`}
                  />
                ) : (
                  <FileInput
                    label="Upload File"
                    placeholder="Choose file to upload"
                    accept={assignment.allowedTypes.join(',')}
                    description={`Maximum file size: ${assignment.maxFileSize}`}
                  />
                )}
                
                <Group justify="flex-end">
                  <Button variant="outline">
                    Save Draft
                  </Button>
                  <Button>
                    Submit Assignment
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={4}>
            {/* Assignment Info Sidebar */}
            <Paper shadow="sm" p="lg" mb="lg">
              <Title order={4} mb="md">Assignment Info</Title>
              
              <Stack gap="sm">
                <div>
                  <Text size="sm" c="dimmed">Status</Text>
                  <Badge color="yellow" variant="light">Not Submitted</Badge>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed">Due Date</Text>
                  <Text fw={500}>{assignment.dueDate}</Text>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed">Points</Text>
                  <Text fw={500}>{assignment.points}</Text>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed">Submission Type</Text>
                  <Text fw={500} c="capitalize">{assignment.submissionType}</Text>
                </div>
              </Stack>
            </Paper>

            {/* Quick Actions */}
            <Paper shadow="sm" p="lg">
              <Title order={4} mb="md">Quick Actions</Title>
              
              <Stack gap="sm">
                <Button variant="light" fullWidth>
                  📝 View Previous Submissions
                </Button>
                <Button variant="light" fullWidth>
                  💬 Ask Question
                </Button>
                <Button variant="light" fullWidth>
                  📚 View Resources
                </Button>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
