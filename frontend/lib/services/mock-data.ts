// Threatopia Mock Data - Mirrors exact API response structures

import type {
  User,
  UserProfile,
  Challenge,
  LeaderboardEntry,
  Simulation,
  AdminAnalytics,
  AdminUser,
  Notification,
  ChallengeCategory,
} from '@/lib/types'

// Mock Users
export const mockUsers: User[] = [
  { id: 'user_1', name: 'Alex Chen', email: 'alex@example.com', role: 'student', ageGroup: 'professional' },
  { id: 'user_2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'student', ageGroup: 'student' },
  { id: 'user_3', name: 'Mike Torres', email: 'mike@example.com', role: 'instructor', ageGroup: 'professional' },
  { id: 'admin_1', name: 'Admin User', email: 'admin@threatopia.com', role: 'admin', ageGroup: 'professional' },
]

// Mock User Profile
export const mockUserProfile: UserProfile = {
  id: 'user_1',
  name: 'Alex Chen',
  email: 'alex@example.com',
  points: 2750,
  level: 8,
  badges: ['Phishing Hunter', 'SQL Master', 'First Login', '7-Day Streak', 'Quick Learner'],
  completedChallenges: ['ch_1', 'ch_2', 'ch_3', 'ch_5', 'ch_7'],
  stats: {
    sqliScore: 85,
    phishingScore: 92,
    passwordScore: 78,
    socialEngScore: 70,
  },
  streakDays: 12,
  totalChallenges: 45,
  rank: 23,
}

// Mock Challenges
export const mockChallenges: Challenge[] = [
  {
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
  },
  {
    id: 'ch_2',
    title: 'SQL Injection Basics',
    description: 'Identify the vulnerability in this login form code and explain how an attacker could exploit it.',
    category: 'sql-injection',
    difficulty: 'beginner',
    points: 150,
    timeLimit: 15,
    codeSnippet: `const query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";`,
    hints: ['Think about what happens if the input contains special characters', 'What if the input includes SQL syntax?'],
    completedBy: 892,
    explanation: 'This code is vulnerable because user input is directly concatenated into the SQL query without sanitization, allowing attackers to inject malicious SQL code.',
  },
  {
    id: 'ch_3',
    title: 'Password Strength Analysis',
    description: 'Evaluate the security of these passwords and rank them from weakest to strongest.',
    category: 'password-security',
    difficulty: 'beginner',
    points: 100,
    timeLimit: 8,
    completedBy: 2103,
    explanation: 'Strong passwords combine length, complexity (uppercase, lowercase, numbers, symbols), and avoid dictionary words or personal information.',
  },
  {
    id: 'ch_4',
    title: 'Social Engineering Red Flags',
    description: 'Watch this simulated phone call and identify the social engineering techniques being used.',
    category: 'social-engineering',
    difficulty: 'intermediate',
    points: 200,
    timeLimit: 20,
    completedBy: 456,
    explanation: 'The caller used authority impersonation, urgency creation, and information gathering techniques typical of pretexting attacks.',
  },
  {
    id: 'ch_5',
    title: 'Advanced SQL Injection',
    description: 'Craft a payload that bypasses this web application\'s authentication using blind SQL injection.',
    category: 'sql-injection',
    difficulty: 'advanced',
    points: 350,
    timeLimit: 30,
    codeSnippet: `if (mysqli_num_rows($result) > 0) { login_success(); }`,
    completedBy: 234,
    hints: ['Consider time-based techniques', 'The application doesn\'t show error messages'],
  },
  {
    id: 'ch_6',
    title: 'Malware Analysis Introduction',
    description: 'Examine this suspicious file\'s behavior and classify the type of malware based on its indicators.',
    category: 'malware',
    difficulty: 'intermediate',
    points: 250,
    timeLimit: 25,
    completedBy: 378,
  },
  {
    id: 'ch_7',
    title: 'Network Traffic Analysis',
    description: 'Analyze this packet capture and identify any signs of malicious activity or data exfiltration.',
    category: 'network-security',
    difficulty: 'advanced',
    points: 300,
    timeLimit: 35,
    completedBy: 189,
  },
  {
    id: 'ch_8',
    title: 'Spear Phishing Campaign',
    description: 'This targeted phishing attack uses personal information. Identify how the attacker gathered intel and crafted the message.',
    category: 'phishing',
    difficulty: 'expert',
    points: 500,
    timeLimit: 45,
    completedBy: 67,
  },
]

// Mock Leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'user_10', name: 'CyberNinja', avatar: '/avatars/ninja.png', points: 15420, level: 25 },
  { rank: 2, userId: 'user_11', name: 'HackerPro', avatar: '/avatars/hacker.png', points: 14890, level: 24 },
  { rank: 3, userId: 'user_12', name: 'SecureBot', avatar: '/avatars/bot.png', points: 13200, level: 22 },
  { rank: 4, userId: 'user_13', name: 'PhishFinder', avatar: '/avatars/fish.png', points: 12750, level: 21 },
  { rank: 5, userId: 'user_14', name: 'SQLGuard', avatar: '/avatars/guard.png', points: 11980, level: 20 },
  { rank: 6, userId: 'user_15', name: 'NetDefender', points: 11450, level: 19 },
  { rank: 7, userId: 'user_16', name: 'CryptoKing', points: 10890, level: 18 },
  { rank: 8, userId: 'user_17', name: 'FirewallPro', points: 10200, level: 17 },
  { rank: 9, userId: 'user_18', name: 'MalwareHunter', points: 9870, level: 17 },
  { rank: 10, userId: 'user_19', name: 'SecurityFirst', points: 9450, level: 16 },
]

export const mockFriendsLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'user_2', name: 'Sarah Johnson', points: 5200, level: 12 },
  { rank: 2, userId: 'user_1', name: 'Alex Chen', points: 2750, level: 8 },
  { rank: 3, userId: 'user_20', name: 'Jordan Lee', points: 2100, level: 6 },
]

// Mock Simulations
export const mockSimulations: Simulation[] = [
  {
    id: 'sim_1',
    title: 'Corporate Network Breach',
    description: 'Investigate a simulated corporate network breach and trace the attacker\'s path.',
    difficulty: 'advanced',
    duration: 60,
    category: 'network-security',
    status: 'available',
  },
  {
    id: 'sim_2',
    title: 'Phishing Campaign Defense',
    description: 'Respond to an active phishing campaign targeting your organization.',
    difficulty: 'intermediate',
    duration: 45,
    category: 'phishing',
    status: 'available',
  },
  {
    id: 'sim_3',
    title: 'Ransomware Response',
    description: 'Handle a ransomware incident and recover critical systems.',
    difficulty: 'expert',
    duration: 90,
    category: 'malware',
    status: 'coming_soon',
  },
]

// Mock Admin Analytics
export const mockAdminAnalytics: AdminAnalytics = {
  totalUsers: 12547,
  activeUsers: 3892,
  totalChallenges: 156,
  completedChallenges: 89432,
  averageScore: 72.5,
  userGrowth: [
    { date: '2024-01', count: 8500 },
    { date: '2024-02', count: 9200 },
    { date: '2024-03', count: 10100 },
    { date: '2024-04', count: 11200 },
    { date: '2024-05', count: 12547 },
  ],
  categoryBreakdown: [
    { category: 'phishing' as ChallengeCategory, count: 45, avgScore: 78 },
    { category: 'sql-injection' as ChallengeCategory, count: 32, avgScore: 65 },
    { category: 'password-security' as ChallengeCategory, count: 28, avgScore: 82 },
    { category: 'social-engineering' as ChallengeCategory, count: 25, avgScore: 71 },
    { category: 'malware' as ChallengeCategory, count: 18, avgScore: 68 },
    { category: 'network-security' as ChallengeCategory, count: 8, avgScore: 58 },
  ],
}

// Mock Admin Users
export const mockAdminUsers: AdminUser[] = [
  {
    id: 'user_1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    role: 'student',
    ageGroup: 'professional',
    status: 'active',
    lastActive: '2024-05-15T10:30:00Z',
    challengesCompleted: 45,
    totalPoints: 2750,
  },
  {
    id: 'user_2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'student',
    ageGroup: 'student',
    status: 'active',
    lastActive: '2024-05-14T16:45:00Z',
    challengesCompleted: 62,
    totalPoints: 5200,
  },
  {
    id: 'user_3',
    name: 'Mike Torres',
    email: 'mike@example.com',
    role: 'instructor',
    ageGroup: 'professional',
    status: 'active',
    lastActive: '2024-05-15T09:00:00Z',
    challengesCompleted: 120,
    totalPoints: 15800,
  },
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'achievement',
    title: 'New Badge Earned!',
    message: 'You\'ve earned the "SQL Master" badge for completing all SQL injection challenges.',
    read: false,
    createdAt: '2024-05-15T10:00:00Z',
  },
  {
    id: 'notif_2',
    type: 'leaderboard',
    title: 'Rank Up!',
    message: 'You\'ve moved up to rank #23 on the global leaderboard!',
    read: false,
    createdAt: '2024-05-14T18:30:00Z',
  },
  {
    id: 'notif_3',
    type: 'challenge',
    title: 'New Challenge Available',
    message: 'A new expert-level phishing challenge has been added. Test your skills!',
    read: true,
    createdAt: '2024-05-13T12:00:00Z',
  },
]

// AI Assistant mock responses
export const mockAssistantResponses: Record<string, { reply: string; relatedChallenges: string[] }> = {
  'sql injection': {
    reply: 'SQL Injection is a code injection technique that exploits security vulnerabilities in an application\'s database layer. To prevent SQL injection:\n\n1. **Use Prepared Statements**: Always use parameterized queries instead of string concatenation.\n2. **Input Validation**: Validate and sanitize all user inputs.\n3. **Least Privilege**: Database accounts should have minimal necessary permissions.\n4. **Web Application Firewall**: Deploy a WAF to filter malicious requests.\n\nWould you like to practice identifying SQL injection vulnerabilities?',
    relatedChallenges: ['ch_2', 'ch_5'],
  },
  'phishing': {
    reply: 'Phishing is a social engineering attack where attackers impersonate legitimate entities to steal sensitive information. Key indicators include:\n\n1. **Suspicious sender addresses** - Check for misspellings or unusual domains\n2. **Urgent language** - Pressure to act immediately\n3. **Generic greetings** - "Dear Customer" instead of your name\n4. **Suspicious links** - Hover to see the actual URL\n5. **Requests for sensitive info** - Legitimate companies rarely ask for passwords via email\n\nWant to test your phishing detection skills?',
    relatedChallenges: ['ch_1', 'ch_8'],
  },
  'password': {
    reply: 'Strong password practices are essential for security:\n\n1. **Length over complexity** - Use at least 16 characters\n2. **Passphrases** - Combine random words: "correct-horse-battery-staple"\n3. **Unique passwords** - Never reuse passwords across sites\n4. **Password manager** - Use one to generate and store passwords\n5. **Multi-factor authentication** - Enable MFA wherever possible\n\nShall I recommend some password security challenges?',
    relatedChallenges: ['ch_3'],
  },
  'default': {
    reply: 'I\'m here to help you learn about cybersecurity! I can assist with topics like:\n\n- **Phishing detection** - Identifying and avoiding phishing attacks\n- **SQL Injection** - Understanding and preventing database attacks\n- **Password security** - Creating and managing strong passwords\n- **Social engineering** - Recognizing manipulation tactics\n- **Network security** - Protecting your digital infrastructure\n\nWhat would you like to learn about today?',
    relatedChallenges: ['ch_1', 'ch_2', 'ch_3'],
  },
}
