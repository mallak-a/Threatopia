import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // Hash passwords
  const hash = (password: string) => bcrypt.hashSync(password, 10)

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user_1',
        name: 'Alex Chen',
        email: 'alex@example.com',
        phoneNumber: '+1234567890',
        country: 'United States',
        password: hash('demo123'),
        role: 'student',
        ageGroup: 'professional',
        createdAt: '2024-01-01T10:00:00.000Z',
        profile: {
          create: {
            points: 2750,
            level: 8,
            badges: ['Phishing Hunter', 'SQL Master', 'First Login', '7-Day Streak', 'Quick Learner'],
            completedChallenges: ['ch_1', 'ch_2', 'ch_3', 'ch_5', 'ch_7'],
            sqliScore: 85,
            phishingScore: 92,
            passwordScore: 78,
            socialEngScore: 70,
            streakDays: 12,
            totalChallenges: 45,
            rank: 23,
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        id: 'user_2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phoneNumber: '+44123456789',
        country: 'United Kingdom',
        password: hash('demo123'),
        role: 'student',
        ageGroup: 'student',
        createdAt: '2024-01-02T10:00:00.000Z',
        profile: {
          create: {
            points: 5200,
            level: 12,
            badges: ['Security Whisperer', 'Leaderboard Bonus', 'Community Helper'],
            completedChallenges: ['ch_1', 'ch_2', 'ch_3', 'ch_4', 'ch_5', 'ch_6'],
            sqliScore: 91,
            phishingScore: 88,
            passwordScore: 82,
            socialEngScore: 80,
            streakDays: 18,
            totalChallenges: 62,
            rank: 12,
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        id: 'admin_1',
        name: 'Admin User',
        email: 'admin@threatopia.com',
        phoneNumber: '+1987654321',
        country: 'Canada',
        password: hash('admin123'),
        role: 'admin',
        ageGroup: 'professional',
        createdAt: '2024-01-03T10:00:00.000Z',
      }
    }),
  ])

  // Create challenges
  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        id: 'ch_1',
        title: 'Spot the Phishing Email',
        description: 'Analyze this email and identify the phishing indicators. Look for suspicious links, urgent language, and sender inconsistencies.',
        category: 'phishing',
        difficulty: 'beginner',
        points: 100,
        timeLimit: 10,
        hints: ['Check the sender address carefully', 'Hover over links before clicking'],
        completedBy: 1247,
        explanation: 'This email contains several red flags: mismatched sender domain, urgent language pressuring immediate action, and a suspicious link that doesn\'t match the claimed destination.',
      }
    }),
    prisma.challenge.create({
      data: {
        id: 'ch_2',
        title: 'SQL Injection Basics',
        description: 'Identify the vulnerability in this login form code and explain how an attacker could exploit it.',
        category: 'sql_injection',
        difficulty: 'beginner',
        points: 150,
        timeLimit: 15,
        codeSnippet: `const query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";`,
        hints: ['Think about what happens if the input contains special characters', 'What if the input includes SQL syntax?'],
        completedBy: 892,
        explanation: 'This code is vulnerable because user input is directly concatenated into the SQL query without sanitization, allowing attackers to inject malicious SQL code.',
      }
    }),
    prisma.challenge.create({
      data: {
        id: 'ch_3',
        title: 'Password Strength Analysis',
        description: 'Evaluate the security of these passwords and rank them from weakest to strongest.',
        category: 'password_security',
        difficulty: 'beginner',
        points: 100,
        timeLimit: 8,
        completedBy: 2103,
        explanation: 'Strong passwords combine length, complexity (uppercase, lowercase, numbers, symbols), and avoid dictionary words or personal information.',
      }
    }),
    prisma.challenge.create({
      data: {
        id: 'ch_4',
        title: 'Social Engineering Red Flags',
        description: 'Watch this simulated phone call and identify the social engineering techniques being used.',
        category: 'social_engineering',
        difficulty: 'intermediate',
        points: 200,
        timeLimit: 20,
        completedBy: 456,
        explanation: 'The caller used authority impersonation, urgency creation, and information gathering techniques typical of pretexting attacks.',
      }
    }),
    prisma.challenge.create({
      data: {
        id: 'ch_5',
        title: 'Advanced SQL Injection',
        description: 'Craft a payload that bypasses this web application\'s authentication using blind SQL injection.',
        category: 'sql_injection',
        difficulty: 'advanced',
        points: 350,
        timeLimit: 30,
        codeSnippet: 'if (mysqli_num_rows($result) > 0) { login_success(); }',
        completedBy: 234,
        hints: ['Consider time-based techniques', 'The application doesn\'t show error messages'],
      }
    }),
  ])

  // Create leaderboard entries
  await prisma.leaderboardEntry.createMany({
    data: [
      { userId: 'user_1', rank: 23, points: 2750, level: 8 },
      { userId: 'user_2', rank: 12, points: 5200, level: 12 },
    ]
  })

  // Create simulations
  await prisma.simulation.createMany({
    data: [
      {
        id: 'sim_1',
        title: 'Phishing Attack Simulation',
        description: 'Experience a realistic phishing attack scenario',
        difficulty: 'beginner',
        duration: 15,
        category: 'phishing',
        status: 'available',
      },
      {
        id: 'sim_2',
        title: 'SQL Injection Lab',
        description: 'Practice SQL injection techniques in a safe environment',
        difficulty: 'intermediate',
        duration: 25,
        category: 'sql_injection',
        status: 'available',
      },
    ]
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${users.length} users, ${challenges.length} challenges, and sample data`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })