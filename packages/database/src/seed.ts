// AI Generated Seed Data

import { prisma } from "./client";

// --- helpers ---
const iso = (s: string) => new Date(s); // convenience

// Wipe in FK-safe order (with error handling for missing tables)
async function clearAll() {
  try {
    await prisma.calendarEvent.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.log("Some tables don't exist yet - this is normal for fresh database");
  }
}

async function main() {
  console.log("Clearing existing data…");
  await clearAll();

  // ---------- USERS ----------
  // Admin + 4 instructors + 12 students
  const admin = await prisma.user.create({ data: { name: "Daniel Mahler", email: "daniel@example.edu", role: "admin" } });

  const instructors = await prisma.user.createMany({
    data: [
      { name: "Prof. Ada Lovelace",  email: "ada@univ.edu",   role: "instructor" },
      { name: "Prof. Alan Turing",   email: "alan@univ.edu",  role: "instructor" },
      { name: "Prof. Grace Hopper",  email: "grace@univ.edu", role: "instructor" },
      { name: "Prof. Edsger Dijkstra", email: "edsger@univ.edu", role: "instructor" },
    ],
    skipDuplicates: true,
  });

  const instructorRecords = await prisma.user.findMany({
    where: { email: { in: ["ada@univ.edu", "alan@univ.edu", "grace@univ.edu", "edsger@univ.edu"] } },
    orderBy: { email: "asc" },
  });

  await prisma.user.createMany({
    data: [
      { name: "Student One",   email: "s1@univ.edu",  role: "student" },
      { name: "Student Two",   email: "s2@univ.edu",  role: "student" },
      { name: "Student Three", email: "s3@univ.edu",  role: "student" },
      { name: "Student Four",  email: "s4@univ.edu",  role: "student" },
      { name: "Student Five",  email: "s5@univ.edu",  role: "student" },
      { name: "Student Six",   email: "s6@univ.edu",  role: "student" },
      { name: "Student Seven", email: "s7@univ.edu",  role: "student" },
      { name: "Student Eight", email: "s8@univ.edu",  role: "student" },
      { name: "Student Nine",  email: "s9@univ.edu",  role: "student" },
      { name: "Student Ten",   email: "s10@univ.edu", role: "student" },
      { name: "Student Eleven",email: "s11@univ.edu", role: "student" },
      { name: "Student Twelve",email: "s12@univ.edu", role: "student" },
    ],
    skipDuplicates: true,
  });

  const students = await prisma.user.findMany({
    where: { email: { in: [
      "s1@univ.edu","s2@univ.edu","s3@univ.edu","s4@univ.edu","s5@univ.edu","s6@univ.edu",
      "s7@univ.edu","s8@univ.edu","s9@univ.edu","s10@univ.edu","s11@univ.edu","s12@univ.edu"
    ]}},
    orderBy: { email: "asc" },
  });

  // ---------- COURSES ----------
  // 4 courses; one will have zero assignments for edge case
  const ada   = instructorRecords.find(u => u.email === "ada@univ.edu")!;
  const alan  = instructorRecords.find(u => u.email === "alan@univ.edu")!;
  const grace = instructorRecords.find(u => u.email === "grace@univ.edu")!;
  const edsger= instructorRecords.find(u => u.email === "edsger@univ.edu")!;

  const cs305 = await prisma.course.create({ data: { code: "CS305", title: "Programming Problems I", term: "Fall 2025", userId: ada.id } });
  const cs450 = await prisma.course.create({ data: { code: "CS450", title: "Computer Networks",       term: "Fall 2025", userId: alan.id } });
  const cs367 = await prisma.course.create({ data: { code: "CS367", title: "Algorithms",              term: "Fall 2025", userId: grace.id } });
  const hum101= await prisma.course.create({ data: { code: "HUM101",title: "Intro to Humanities",     term: "Fall 2025", userId: edsger.id } }); // no assignments

  // ---------- ENROLLMENTS ----------
  // Instructors enrolled as instructors; students spread across courses
  await prisma.enrollment.createMany({
    data: [
      { userId: ada.id,   courseId: cs305.id, role: "instructor" },
      { userId: alan.id,  courseId: cs450.id, role: "instructor" },
      { userId: grace.id, courseId: cs367.id, role: "instructor" },
      { userId: edsger.id,courseId: hum101.id,role: "instructor" },
    ],
  });

  // Helper to enroll a list of students
  const enroll = async (courseId: string, userIds: string[]) => {
    await prisma.enrollment.createMany({
      data: userIds.map(id => ({ userId: id, courseId, role: "student" })),
      skipDuplicates: true,
    });
  };

  // Distribute students: cs305 (8), cs450 (7), cs367 (6), hum101 (5)
  await enroll(cs305.id, students.slice(0, 8).map(s => s.id));   // s1..s8
  await enroll(cs450.id, students.slice(3, 10).map(s => s.id));  // s4..s10
  await enroll(cs367.id, students.slice(6, 12).map(s => s.id));  // s7..s12
  await enroll(hum101.id,students.slice(0, 5).map(s => s.id));   // s1..s5 (no assignments edge-case)

  // ---------- ASSIGNMENTS ----------
  // Ten total assignments across 3 courses; due dates spaced across Sept–Oct 2025 (UTC)
  const assignmentsData = [
    // CS305 (4)
    { courseId: cs305.id, title: "Warmup: FizzBuzz Variants",           description: "Intro loops & conditionals.", dueDate: iso("2025-09-20T23:59:00Z"), maxAttempts: 3, latePenalty: 10 },
    { courseId: cs305.id, title: "Arrays & Strings Drills",             description: "Practice array/string ops.",  dueDate: iso("2025-09-24T23:59:00Z"), maxAttempts: 2, latePenalty: 10 },
    { courseId: cs305.id, title: "Recursion Mini-Set",                  description: "Classic recursion problems.", dueDate: iso("2025-09-30T23:59:00Z"), maxAttempts: 3, latePenalty: 15 },
    { courseId: cs305.id, title: "Project 1: Data Structures",          description: "Stacks/Queues/Maps.",        dueDate: iso("2025-10-05T23:59:00Z"), maxAttempts: 2, latePenalty: 15 },

    // CS450 (3)
    { courseId: cs450.id, title: "Wireshark Lab",                       description: "Capture & analyze packets.",  dueDate: iso("2025-09-25T23:59:00Z"), maxAttempts: 2, latePenalty: 5  },
    { courseId: cs450.id, title: "Socket Programming 101",              description: "TCP echo client/server.",     dueDate: iso("2025-10-01T23:59:00Z"), maxAttempts: 2, latePenalty: 10 },
    { courseId: cs450.id, title: "Routing & Subnetting Worksheet",      description: "CIDR practice.",              dueDate: iso("2025-10-07T23:59:00Z"), maxAttempts: 1, latePenalty: 0  },

    // CS367 (3)
    { courseId: cs367.id, title: "Asymptotic Analysis Set",             description: "Big-O, Ω, Θ proofs.",         dueDate: iso("2025-09-22T23:59:00Z"), maxAttempts: 2, latePenalty: 10 },
    { courseId: cs367.id, title: "Greedy vs DP Short Answers",          description: "Explain choices.",            dueDate: iso("2025-09-29T23:59:00Z"), maxAttempts: 2, latePenalty: 10 },
    { courseId: cs367.id, title: "Graph Algorithms Coding",             description: "BFS/DFS/Dijkstra.",           dueDate: iso("2025-10-06T23:59:00Z"), maxAttempts: 2, latePenalty: 15 },
  ];

  const createdAssignments = [];
  for (const a of assignmentsData) {
    const assignment = await prisma.assignment.create({ data: a });
    createdAssignments.push(assignment);
  }

  // Map course → enrolled student ids
  const enrollmentsByCourse: Record<string, string[]> = {};
  for (const c of [cs305, cs450, cs367]) {
    const rows = await prisma.enrollment.findMany({ where: { courseId: c.id, role: "student" } });
    enrollmentsByCourse[c.id] = rows.map(r => r.userId);
  }

  // ---------- CALENDAR EVENTS ----------
  // Create one calendar event per (student, assignment) for ALL enrolled students
  for (const asg of createdAssignments) {
    const studentIds = enrollmentsByCourse[asg.courseId] ?? [];
    const events = studentIds.map(uid => ({
      userId: uid,
      assignmentId: asg.id,
      dueAt: asg.dueDate,
      title: `Due: ${asg.title}`,
    }));
    if (events.length) await prisma.calendarEvent.createMany({ data: events });
  }

  // ---------- SUBMISSIONS ----------
  // For variety:
  // - Not all students submit everything
  // - Some have 2 attempts; some late; some graded; some left as draft
  // - submissionType rotates among "file" | "link" | "notebook"
  const types = ["file", "link", "notebook"] as const;

  const makeSubmissionRow = (
    assignmentId: string,
    userId: string,
    attemptNumber: number,
    submissionType: (typeof types)[number],
    submittedAt: Date | null,
    status: "draft" | "submitted" | "late" | "graded",
    autoScore: number | null,
    finalScore: number | null
  ) => ({
    assignmentId,
    userId,
    attemptNumber,
    submissionType,
    submittedAt: submittedAt ?? undefined,
    status,
    autoScore: autoScore ?? undefined,
    finalScore: finalScore ?? undefined,
  });

  // Handcraft some deterministic coverage
  const subs: any[] = [];

  // CS305 first assignment: many students submit
  const a305_1 = createdAssignments.find(a => a.title.startsWith("Warmup"))!;
  for (const [i, uid] of (enrollmentsByCourse[cs305.id] || []).entries()) {
    // 75% submit attempt 1
    if (i % 4 !== 0) {
      const onTime = iso("2025-09-20T20:00:00Z");
      subs.push(makeSubmissionRow(a305_1.id, uid, 1, types[i % 3]!, onTime, "submitted", 70 + (i % 20), 70 + (i % 20)));
      // 30% do a second attempt; some late with penalty
      if (i % 3 === 0) {
        const late = iso("2025-09-21T04:00:00Z");
        subs.push(makeSubmissionRow(a305_1.id, uid, 2, "file", late, "late", 85, 80));
      }
    } else {
      // 25% leave a draft with no submit time
      subs.push(makeSubmissionRow(a305_1.id, uid, 1, "notebook", null, "draft", null, null));
    }
  }

  // CS305 Project 1: fewer submissions, more late/graded
  const a305_proj = createdAssignments.find(a => a.title.startsWith("Project 1"))!;
  for (const [i, uid] of (enrollmentsByCourse[cs305.id] || []).entries()) {
    if (i % 2 === 0) {
      const late = iso("2025-10-06T02:00:00Z");
      subs.push(makeSubmissionRow(a305_proj.id, uid, 1, "file", late, "late", 88, 83));
    } else if (i % 5 === 0) {
      const onTime = iso("2025-10-05T21:00:00Z");
      subs.push(makeSubmissionRow(a305_proj.id, uid, 1, "link", onTime, "graded", 92, 92));
    }
  }

  // CS450 Wireshark + Socket + Worksheet: mix of statuses
  const a450_pcap = createdAssignments.find(a => a.title === "Wireshark Lab")!;
  const a450_sock = createdAssignments.find(a => a.title === "Socket Programming 101")!;
  const a450_rout = createdAssignments.find(a => a.title === "Routing & Subnetting Worksheet")!;
  for (const [i, uid] of (enrollmentsByCourse[cs450.id] || []).entries()) {
    if (i % 3 !== 0) {
      subs.push(makeSubmissionRow(a450_pcap.id, uid, 1, "file", iso("2025-09-25T18:00:00Z"), "submitted", 90 - (i % 7), 90 - (i % 7)));
    }
    if (i % 2 === 0) {
      subs.push(makeSubmissionRow(a450_sock.id, uid, 1, "link", iso("2025-10-01T22:30:00Z"), "submitted", 85, 85));
      // second attempt late
      if (i % 4 === 0) {
        subs.push(makeSubmissionRow(a450_sock.id, uid, 2, "file", iso("2025-10-02T03:00:00Z"), "late", 90, 88));
      }
    } else if (i % 5 === 0) {
      subs.push(makeSubmissionRow(a450_rout.id, uid, 1, "notebook", null, "draft", null, null));
    } else {
      subs.push(makeSubmissionRow(a450_rout.id, uid, 1, "file", iso("2025-10-07T20:10:00Z"), "graded", 93, 93));
    }
  }

  // CS367 assignments: solid mix, ensure some non-submissions
  const a367_asym = createdAssignments.find(a => a.title === "Asymptotic Analysis Set")!;
  const a367_gvdp = createdAssignments.find(a => a.title === "Greedy vs DP Short Answers")!;
  const a367_graph= createdAssignments.find(a => a.title === "Graph Algorithms Coding")!;
  for (const [i, uid] of (enrollmentsByCourse[cs367.id] || []).entries()) {
    if (i % 2 === 0) {
      subs.push(makeSubmissionRow(a367_asym.id, uid, 1, "link", iso("2025-09-22T21:00:00Z"), "submitted", 78 + (i % 10), 78 + (i % 10)));
    }
    if (i % 3 === 0) {
      subs.push(makeSubmissionRow(a367_gvdp.id, uid, 1, "file", iso("2025-09-29T21:30:00Z"), "submitted", 88, 88));
      subs.push(makeSubmissionRow(a367_gvdp.id, uid, 2, "file", iso("2025-09-30T01:10:00Z"), "late", 92, 90));
    }
    if (i % 4 === 0) {
      subs.push(makeSubmissionRow(a367_graph.id, uid, 1, "notebook", iso("2025-10-06T18:45:00Z"), "graded", 95, 95));
    }
  }

  if (subs.length) await prisma.submission.createMany({ data: subs });

  console.log(`Seed complete: users=${1 + instructorRecords.length + students.length}, courses=4, assignments=${createdAssignments.length}, submissions=${subs.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });