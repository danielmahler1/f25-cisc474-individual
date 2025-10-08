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
  Breadcrumbs,
  Anchor,
  Textarea,
  FileInput,
  Divider,
  Alert,
  Tabs,
} from '@mantine/core';
import { useState } from 'react';

// Assignment data - in real app this would come from API - Mock data generated with AI
const assignmentData: Record<string, any> = {
  // CISC474 assignments
  'cisc474-setup-environment': {
    id: 'setup-environment',
    courseSlug: 'cisc474',
    courseName: 'CISC474 - Advanced Web Technologies',
    title: 'Setup Development Environment',
    description: 'Set up your local development environment with Node.js, npm, Git, and VS Code. Create a simple "Hello World" web application to verify everything is working correctly.',
    instructions: [
      'Install Node.js (version 18 or higher) from nodejs.org',
      'Install Git and configure with your name and email',
      'Install VS Code and recommended extensions',
      'Create a new project folder and initialize with npm',
      'Create an index.html file with basic HTML structure',
      'Test your setup by running a local development server'
    ],
    dueDate: 'September 20, 2024',
    points: 50,
    submissionType: 'both', // 'text', 'file', or 'both'
    status: 'open'
  },
  'cisc474-javascript-quiz': {
    id: 'javascript-quiz',
    courseSlug: 'cisc474',
    courseName: 'CISC474 - Advanced Web Technologies',
    title: 'JavaScript Fundamentals Quiz',
    description: 'Complete this quiz to demonstrate your understanding of modern JavaScript concepts including ES6+ features, async/await, and DOM manipulation.',
    instructions: [
      'Answer all questions thoroughly',
      'Provide code examples where requested',
      'Explain your reasoning for complex problems',
      'Submit before the deadline'
    ],
    dueDate: 'September 25, 2024',
    points: 100,
    submissionType: 'text',
    status: 'open'
  },
  'cisc474-todo-app': {
    id: 'todo-app',
    courseSlug: 'cisc474',
    courseName: 'CISC474 - Advanced Web Technologies',
    title: 'Todo App',
    description: 'Build a fully functional Todo application using React. The app should allow users to add, edit, delete, and mark tasks as complete.',
    instructions: [
      'Create a new React application using Vite or Create React App',
      'Implement components for TodoList, TodoItem, and AddTodo',
      'Use React hooks (useState, useEffect) for state management',
      'Add local storage persistence',
      'Style the application with CSS or a UI library',
      'Deploy the application and provide a live link'
    ],
    dueDate: 'October 5, 2024',
    points: 200,
    submissionType: 'both',
    status: 'open'
  },
  // CISC498 assignments
  'cisc498-project-proposal': {
    id: 'project-proposal',
    courseSlug: 'cisc498',
    courseName: 'CISC498 - Senior Design',
    title: 'Project Proposal',
    description: 'Submit a detailed proposal for your senior design project including problem statement, objectives, methodology, and timeline.',
    instructions: [
      'Write a 5-10 page project proposal',
      'Include problem statement and motivation',
      'Define clear project objectives and scope',
      'Describe your proposed methodology',
      'Create a detailed project timeline',
      'Include a bibliography with at least 10 sources'
    ],
    dueDate: 'October 1, 2024',
    points: 150,
    submissionType: 'file',
    status: 'open'
  },
  // CPEG493 assignments
  'cpeg493-cloud-comparison': {
    id: 'cloud-comparison',
    courseSlug: 'cpeg493',
    courseName: 'CPEG493 - Cloud Computing',
    title: 'Cloud Comparison Report',
    description: 'Compare three major cloud providers (AWS, Azure, Google Cloud) across various dimensions including pricing, services, and capabilities.',
    instructions: [
      'Research AWS, Microsoft Azure, and Google Cloud Platform',
      'Compare compute, storage, and networking services',
      'Analyze pricing models for each provider',
      'Evaluate security features and compliance',
      'Provide recommendations for different use cases'
    ],
    dueDate: 'September 30, 2024',
    points: 120,
    submissionType: 'both',
    status: 'open'
  },
  // CPEG494 assignments
  'cpeg494-threat-analysis': {
    id: 'threat-analysis',
    courseSlug: 'cpeg494',
    courseName: 'CPEG494 - System Hardening',
    title: 'Threat Analysis Report',
    description: 'Conduct a comprehensive threat analysis for a given system architecture and identify potential vulnerabilities and mitigation strategies.',
    instructions: [
      'Analyze the provided system architecture diagram',
      'Identify potential threats using STRIDE methodology',
      'Assess risk levels for each identified threat',
      'Propose specific mitigation strategies',
      'Create a threat model diagram'
    ],
    dueDate: 'October 10, 2024',
    points: 175,
    submissionType: 'file',
    status: 'completed'
  }
};

export const Route = createFileRoute('/course/$slug/assignment/$assignmentId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug, assignmentId } = Route.useParams();
  const navigate = useNavigate();

  const [textSubmission, setTextSubmission] = useState('');
  const [fileSubmission, setFileSubmission] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create assignment key from slug and assignmentId
  const assignmentKey = `${slug}-${assignmentId}`;
  const assignment = assignmentData[assignmentKey];

  if (!assignment) {
    return (
      <Container size="lg">
        <Paper p="xl" mt="md">
          <Stack align="center">
            <Title order={2}>Assignment Not Found</Title>
            <Text c="dimmed">The assignment you're looking for doesn't exist.</Text>
            <Button onClick={() => navigate({ to: '/dashboard' })}>
              Back to Dashboard
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const handleLogout = () => {
    navigate({ to: '/login' });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      // In real app, this would make an API call
      alert('Assignment submitted successfully! (This is just a demo)');
    }, 2000);
  };

  const breadcrumbItems = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: assignment.courseName.split(' - ')[0], href: `/course/${assignment.courseSlug}` },
    { title: assignment.title, href: '#' }
  ].map((item, index) => (
    <Anchor key={index} onClick={() => item.href !== '#' && navigate({ to: item.href as any })}>
      {item.title}
    </Anchor>
  ));

  return (
    <Box>
      {/* Header */}
      <Paper shadow="sm" p="md" mb="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Assignment Submission</Title>
            <Text size="sm" c="dimmed">Submit your work for grading</Text>
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
        {/* Breadcrumbs */}
        <Breadcrumbs mb="md">{breadcrumbItems}</Breadcrumbs>

        {/* Assignment Header */}
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
          <Group justify="space-between" mb="md">
            <Badge
              color={assignment.status === 'open' ? 'green' : 'gray'}
              variant="light"
              size="lg"
            >
              {assignment.status === 'open' ? 'Open' : 'Completed'}
            </Badge>
            <Button variant="outline" onClick={() => navigate({ to: '/course/$slug', params: { slug: assignment.courseSlug } })}>
              ← Back to Course
            </Button>
          </Group>

          <Title order={1} mb="sm">{assignment.title}</Title>
          <Text size="lg" c="dimmed" mb="md">{assignment.description}</Text>

          <Group gap="xl" mb="md">
            <div>
              <Text size="sm" fw={500}>Due Date</Text>
              <Text size="sm">{assignment.dueDate}</Text>
            </div>
            <div>
              <Text size="sm" fw={500}>Points</Text>
              <Text size="sm">{assignment.points} pts</Text>
            </div>
            <div>
              <Text size="sm" fw={500}>Course</Text>
              <Text size="sm">{assignment.courseName}</Text>
            </div>
          </Group>

          {assignment.status === 'completed' && (
            <Alert color="green" title="Assignment Completed" mt="md">
              You have already submitted this assignment. Your submission is being graded.
            </Alert>
          )}
        </Card>

        <Tabs defaultValue="instructions" mb="xl">
          <Tabs.List>
            <Tabs.Tab value="instructions">📋 Instructions</Tabs.Tab>
            <Tabs.Tab value="submission">📝 Submission</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="instructions" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">Assignment Instructions</Title>
              <Stack gap="sm">
                {assignment.instructions.map((instruction: string, index: number) => (
                  <Group key={index} align="flex-start" gap="sm">
                    <Badge variant="light" size="sm">{index + 1}</Badge>
                    <Text size="sm">{instruction}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="submission" pt="md">
            {assignment.status === 'open' ? (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Submit Your Work</Title>

                <Stack gap="md">
                  {(assignment.submissionType === 'text' || assignment.submissionType === 'both') && (
                    <div>
                      <Text fw={500} mb="xs">Text Submission</Text>
                      <Textarea
                        placeholder="Enter your response here..."
                        minRows={8}
                        value={textSubmission}
                        onChange={(event) => setTextSubmission(event.currentTarget.value)}
                      />
                    </div>
                  )}

                  {assignment.submissionType === 'both' && (
                    <Divider label="OR" labelPosition="center" />
                  )}

                  {(assignment.submissionType === 'file' || assignment.submissionType === 'both') && (
                    <div>
                      <Text fw={500} mb="xs">File Upload</Text>
                      <FileInput
                        placeholder="Select file to upload"
                        value={fileSubmission}
                        onChange={setFileSubmission}
                        accept=".pdf,.doc,.docx,.txt,.zip,.js,.html,.css,.py,.java"
                      />
                      <Text size="xs" c="dimmed" mt="xs">
                        Accepted formats: PDF, DOC, DOCX, TXT, ZIP, code files
                      </Text>
                    </div>
                  )}

                  <Group justify="flex-end" mt="xl">
                    <Button
                      variant="outline"
                      onClick={() => navigate({ to: '/course/$slug', params: { slug: assignment.courseSlug } })}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      loading={isSubmitting}
                      disabled={!textSubmission && !fileSubmission}
                    >
                      Submit Assignment
                    </Button>
                  </Group>
                </Stack>
              </Card>
            ) : (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack align="center" gap="md">
                  <Text size="lg" fw={500}>Assignment Already Submitted</Text>
                  <Text c="dimmed" ta="center">
                    You have already submitted this assignment. Check back later for your grade.
                  </Text>
                  <Button onClick={() => navigate({ to: '/course/$slug', params: { slug: assignment.courseSlug } })}>
                    Return to Course
                  </Button>
                </Stack>
              </Card>
            )}
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  );
}
