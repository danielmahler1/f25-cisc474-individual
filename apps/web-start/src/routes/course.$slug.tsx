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
  Accordion,
  Card,
  Divider,
  Breadcrumbs,
  Anchor,
} from '@mantine/core';

// Course data with modules - Generated with AI
const courseData = {
  'cisc474': {
    id: 1,
    name: 'CISC474 - Advanced Web Technologies',
    instructor: 'Dr. Smith',
    time: 'MWF 10:00-10:50 AM',
    students: 24,
    status: 'active',
    color: 'blue',
    description: 'Learn modern web development technologies including React, Node.js, and cloud deployment.',
    modules: [
      {
        id: 'module1',
        title: 'Introduction to Modern Web Development',
        description: 'Overview of current web technologies and development practices',
        lessons: [
          'History of Web Development',
          'Client-Server Architecture',
          'Modern JavaScript (ES6+)',
          'Package Managers and Build Tools'
        ],
        assignments: [
          { name: 'Setup Development Environment', id: 'setup-environment' },
          { name: 'JavaScript Fundamentals Quiz', id: 'javascript-quiz' }
        ]
      },
      {
        id: 'module2',
        title: 'React Fundamentals',
        description: 'Building user interfaces with React',
        lessons: [
          'Components and JSX',
          'State and Props',
          'Event Handling',
          'Lifecycle Methods'
        ],
        assignments: [
          { name: 'First React Component', id: 'first-component' },
          { name: 'Todo App Project', id: 'todo-app' }
        ]
      },
      {
        id: 'module3',
        title: 'Backend Development with Node.js',
        description: 'Server-side development and APIs',
        lessons: [
          'Node.js Basics',
          'Express.js Framework',
          'Database Integration',
          'Authentication & Security'
        ],
        assignments: [
          { name: 'REST API Project', id: 'rest-api' },
          { name: 'Database Design Assignment', id: 'database-design' }
        ]
      }
    ]
  },
  'cisc498': {
    id: 2,
    name: 'CISC498 - Senior Design',
    instructor: 'Prof. Johnson',
    time: 'TTh 2:00-3:15 PM',
    students: 35,
    status: 'active',
    color: 'green',
    description: 'Capstone project course focusing on real-world software development.',
    modules: [
      {
        id: 'module1',
        title: 'Project Planning and Requirements',
        description: 'Understanding project scope and requirements gathering',
        lessons: [
          'Requirements Analysis',
          'Project Planning',
          'Team Formation',
          'Timeline Development'
        ],
        assignments: [
          { name: 'Project Proposal', id: 'project-proposal' },
          { name: 'Requirements Document', id: 'requirements-doc' }
        ]
      }
    ]
  }
};

export const Route = createFileRoute('/course/$slug')({
  component: CoursePage,
});

function CoursePage() {
  const navigate = useNavigate();
  const { slug } = Route.useParams();
  
  const course = courseData[slug as keyof typeof courseData];
  
  if (!course) {
    return (
      <Container size="lg" py="xl">
        <Title order={2}>Course not found</Title>
        <Text c="dimmed" mb="md">The course you're looking for doesn't exist.</Text>
        <Button onClick={() => navigate({ to: '/dashboard' })}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const handleLogout = () => {
    navigate({ to: '/login' });
  };

  const breadcrumbItems = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: course.name, href: '#' },
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
            <Title order={2}>{course.name}</Title>
            <Text size="sm" c="dimmed">{course.description}</Text>
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

      {/* Course Info */}
      <Container size="lg" mb="xl">
        <Group gap="xl" mb="lg">
          <Box>
            <Text size="sm" c="dimmed">Instructor</Text>
            <Text fw={500}>{course.instructor}</Text>
          </Box>
          <Box>
            <Text size="sm" c="dimmed">Schedule</Text>
            <Text fw={500}>{course.time}</Text>
          </Box>
          <Box>
            <Text size="sm" c="dimmed">Students</Text>
            <Text fw={500}>{course.students}</Text>
          </Box>
          <Badge color={course.color} variant="light">
            {course.status}
          </Badge>
        </Group>

        <Divider mb="xl" />

        {/* Course Modules */}
        <Title order={3} mb="md">Course Modules</Title>
        
        <Accordion variant="separated" radius="md">
          {course.modules.map((module) => (
            <Accordion.Item key={module.id} value={module.id}>
              <Accordion.Control>
                <Text fw={500}>{module.title}</Text>
                <Text size="sm" c="dimmed">{module.description}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="md">
                  <div>
                    <Text fw={500} mb="sm">Lessons:</Text>
                    <Stack gap="xs">
                      {module.lessons.map((lesson, index) => (
                        <Text key={index} size="sm">• {lesson}</Text>
                      ))}
                    </Stack>
                  </div>
                  
                  <div>
                    <Text fw={500} mb="sm">Assignments:</Text>
                    <Stack gap="xs">
                      {module.assignments.map((assignment) => (
                        <Card key={assignment.id} padding="sm" withBorder>
                          <Group justify="space-between">
                            <Text size="sm">{assignment.name}</Text>
                            <Button 
                              size="xs" 
                              variant="light"
                              onClick={() => navigate({ to: `/course/${slug}/assignment/${assignment.id}` })}
                            >
                              View Assignment
                            </Button>
                          </Group>
                        </Card>
                      ))}
                    </Stack>
                  </div>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </Box>
  );
}
