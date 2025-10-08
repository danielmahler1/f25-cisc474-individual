import { createFileRoute, useNavigate, Outlet } from '@tanstack/react-router';
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
const courseData: Record<string, any> = {
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
        description: 'Learn the basics of React including components, state, and props',
        lessons: [
          'Components and JSX',
          'Props and State',
          'Event Handling',
          'Conditional Rendering',
          'Lists and Keys'
        ],
        assignments: [
          { name: 'Todo App', id: 'todo-app' },
          { name: 'Component Library', id: 'component-library' }
        ]
      },
      {
        id: 'module3',
        title: 'Advanced React Patterns',
        description: 'Hooks, Context API, and advanced React patterns',
        lessons: [
          'React Hooks (useState, useEffect)',
          'Custom Hooks',
          'Context API',
          'Performance Optimization',
          'Testing React Components'
        ],
        assignments: [
          { name: 'Shopping Cart with Context', id: 'shopping-cart' },
          { name: 'Custom Hook Implementation', id: 'custom-hook' }
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
    description: 'Capstone project course where students work on real-world software development projects.',
    modules: [
      {
        id: 'module1',
        title: 'Project Planning and Requirements',
        description: 'Learn to gather requirements and plan software projects',
        lessons: [
          'Requirements Gathering',
          'Project Scope Definition',
          'Stakeholder Analysis',
          'Project Timeline Creation'
        ],
        assignments: [
          { name: 'Project Proposal', id: 'project-proposal' },
          { name: 'Requirements Document', id: 'requirements-document' }
        ]
      },
      {
        id: 'module2',
        title: 'System Design and Architecture',
        description: 'Design scalable and maintainable software systems',
        lessons: [
          'System Architecture Patterns',
          'Database Design',
          'API Design',
          'Security Considerations'
        ],
        assignments: [
          { name: 'System Design Document', id: 'system-design' },
          { name: 'Architecture Review', id: 'architecture-review' }
        ]
      },
      {
        id: 'module3',
        title: 'Implementation and Testing',
        description: 'Build and test your senior design project',
        lessons: [
          'Agile Development Practices',
          'Code Review Process',
          'Testing Strategies',
          'Deployment and DevOps'
        ],
        assignments: [
          { name: 'Sprint Deliverables', id: 'sprint-deliverables' },
          { name: 'Testing Plan', id: 'testing-plan' },
          { name: 'Final Presentation', id: 'final-presentation' }
        ]
      }
    ]
  },
  'cpeg493': {
    id: 3,
    name: 'CPEG493 - Cloud Computing',
    instructor: 'Dr. Williams',
    time: 'MWF 1:00-1:50 PM',
    students: 18,
    status: 'active',
    color: 'orange',
    description: 'Introduction to cloud computing concepts, services, and deployment models.',
    modules: [
      {
        id: 'module1',
        title: 'Cloud Computing Fundamentals',
        description: 'Basic concepts and service models of cloud computing',
        lessons: [
          'Cloud Service Models (IaaS, PaaS, SaaS)',
          'Deployment Models',
          'Cloud Providers Overview',
          'Cost Models and Pricing'
        ],
        assignments: [
          { name: 'Cloud Comparison Report', id: 'cloud-comparison' },
          { name: 'Service Model Analysis', id: 'service-model-analysis' }
        ]
      },
      {
        id: 'module2',
        title: 'AWS Services and Architecture',
        description: 'Deep dive into Amazon Web Services',
        lessons: [
          'EC2 and Virtual Machines',
          'S3 Storage Services',
          'VPC and Networking',
          'Load Balancing and Auto Scaling'
        ],
        assignments: [
          { name: 'AWS Lab Exercises', id: 'aws-lab' },
          { name: 'Cloud Architecture Design', id: 'cloud-architecture' }
        ]
      }
    ]
  },
  'cpeg494': {
    id: 4,
    name: 'CPEG494 - System Hardening',
    instructor: 'Prof. Davis',
    time: 'TTh 11:00-12:15 PM',
    students: 28,
    status: 'completed',
    color: 'gray',
    description: 'Learn to secure computer systems against various threats and vulnerabilities.',
    modules: [
      {
        id: 'module1',
        title: 'Security Fundamentals',
        description: 'Basic principles of information security',
        lessons: [
          'CIA Triad (Confidentiality, Integrity, Availability)',
          'Threat Modeling',
          'Risk Assessment',
          'Security Policies and Procedures'
        ],
        assignments: [
          { name: 'Threat Analysis Report', id: 'threat-analysis' },
          { name: 'Security Policy Review', id: 'security-policy' }
        ]
      },
      {
        id: 'module2',
        title: 'System Hardening Techniques',
        description: 'Practical methods to secure operating systems and applications',
        lessons: [
          'Operating System Hardening',
          'Network Security Configuration',
          'Access Control Implementation',
          'Vulnerability Assessment'
        ],
        assignments: [
          { name: 'System Hardening Lab', id: 'hardening-lab' },
          { name: 'Vulnerability Scan Report', id: 'vulnerability-scan' }
        ]
      }
    ]
  }
};

export const Route = createFileRoute('/course/$slug')({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();

  const course = courseData[slug];

  if (!course) {
    return (
      <Container size="lg">
        <Paper p="xl" mt="md">
          <Stack align="center">
            <Title order={2}>Course Not Found</Title>
            <Text c="dimmed">The course you're looking for doesn't exist.</Text>
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

  const breadcrumbItems = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: course.name, href: '#' }
  ].map((item, index) => (
    <Anchor key={index} onClick={() => item.href !== '#' && navigate({ to: item.href as any })}>
      {item.title}
    </Anchor>
  ));

  return (
    <>
      <Outlet />
    </>
  );
}
