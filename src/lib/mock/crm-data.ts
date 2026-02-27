export type MockLeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Won' | 'Lost';
export type MockClientStatus = 'Prospect' | 'Invited' | 'Active' | 'Inactive';

export type MockLead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  primaryGoal: 'lose_weight' | 'build_muscle' | 'general_fitness' | 'other';
  mealInterest: 'yes' | 'no' | 'tell_me_more';
  referralSource: string;
  sourceForm: 'mid-page' | 'contact' | 'booking';
  submittedAt: string;
  status: MockLeadStatus;
  nextFollowUp: string;
  assignedTo: string;
  note: string;
};

export type MockClient = {
  id: string;
  fullName: string;
  email: string;
  status: MockClientStatus;
  packageName: string;
  billingStatus: 'Paid' | 'Past Due' | 'Trial' | 'Canceled' | 'Open';
  nextSession: string;
  adherenceScore: number;
  joinDate: string;
};

export type MockWorkoutExercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  tempo: string;
  demoLink: string;
};

export type MockWorkoutProgram = {
  id: string;
  name: string;
  goal: string;
  durationWeeks: number;
  updatedAt: string;
  days: Array<{
    dayLabel: string;
    focus: string;
    exercises: MockWorkoutExercise[];
  }>;
};

export type MockMealItem = {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  weeklyOrders: number;
  available: boolean;
};

export type MockInvoice = {
  id: string;
  clientName: string;
  amount: number;
  type: 'Training' | 'Meals' | 'Add-on';
  status: 'Paid' | 'Open' | 'Failed';
  dueDate: string;
};

export type MockKpiCard = {
  id: string;
  label: string;
  value: string;
  change: string;
  tone: 'neutral' | 'positive' | 'warning';
};

export type MockTimelineEvent = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'note' | 'status' | 'booking' | 'payment' | 'assignment';
};

export const mockKpis: MockKpiCard[] = [
  { id: 'active_clients', label: 'Active Clients', value: '18', change: '+2 this month', tone: 'positive' },
  { id: 'mrr', label: 'MRR', value: '$12,840', change: '+9.5%', tone: 'positive' },
  { id: 'new_leads', label: 'New Leads', value: '34', change: '7 this week', tone: 'neutral' },
  { id: 'followups', label: 'Pending Follow-Ups', value: '9', change: '3 due today', tone: 'warning' },
  { id: 'meal_orders', label: 'Meal Orders This Week', value: '126', change: 'Prep starts Wed', tone: 'neutral' },
];

export const mockLeadFunnel = [
  { stage: 'Website Visitors', value: 1204, color: '#3a3a3a' },
  { stage: 'Form Submits', value: 86, color: '#666' },
  { stage: 'Booked Calls', value: 42, color: '#8f3328' },
  { stage: 'Qualified', value: 25, color: '#b63a2c' },
  { stage: 'Won Clients', value: 12, color: '#c0392b' },
];

export const mockRevenueBreakdown = [
  { label: 'Training', value: 8640, share: 67 },
  { label: 'Meals', value: 3320, share: 26 },
  { label: 'Add-ons', value: 880, share: 7 },
];

export const mockSessionsToday = [
  { time: '7:00 AM', client: 'Marcus T.', focus: 'Lower Body Strength' },
  { time: '9:30 AM', client: 'Alicia R.', focus: 'Conditioning + Core' },
  { time: '12:30 PM', client: 'Derek W.', focus: 'Upper Body Power' },
  { time: '5:30 PM', client: 'Naomi C.', focus: 'Beginner Full Body' },
];

export const mockAlerts = [
  { id: 'alert_1', title: 'Payment failed: Chris B.', detail: 'Card retry scheduled tomorrow at 8:00 AM.', level: 'critical' },
  { id: 'alert_2', title: 'Overdue check-ins', detail: '4 active clients missed their weekly check-in.', level: 'warning' },
  { id: 'alert_3', title: 'Meal cutoff in 18 hrs', detail: 'Reminder email scheduled tonight at 7:00 PM.', level: 'info' },
];

export const mockActivity: MockTimelineEvent[] = [
  {
    id: 'event_1',
    title: 'New lead captured',
    description: 'Jordan K. submitted the mid-page form from Instagram ad.',
    timestamp: 'Today · 10:12 AM',
    type: 'status',
  },
  {
    id: 'event_2',
    title: 'Booking confirmed',
    description: 'Discovery call booked for Thursday 12:30 PM with Sam R.',
    timestamp: 'Today · 9:05 AM',
    type: 'booking',
  },
  {
    id: 'event_3',
    title: 'Client converted',
    description: 'Alicia R. moved to Active and onboarding invite sent.',
    timestamp: 'Yesterday · 7:42 PM',
    type: 'assignment',
  },
  {
    id: 'event_4',
    title: 'Payment received',
    description: 'Invoice INV-1044 paid ($620).',
    timestamp: 'Yesterday · 1:18 PM',
    type: 'payment',
  },
];

export const mockLeads: MockLead[] = [
  {
    id: 'lead_001',
    firstName: 'Jordan',
    lastName: 'King',
    email: 'jordan.king@email.com',
    phone: '(256) 555-0112',
    primaryGoal: 'lose_weight',
    mealInterest: 'yes',
    referralSource: 'Instagram Reel',
    sourceForm: 'mid-page',
    submittedAt: 'Feb 22, 2026 · 10:12 AM',
    status: 'New',
    nextFollowUp: 'Feb 22 · 4:00 PM',
    assignedTo: 'Justin Robinson',
    note: 'Requested evening sessions only.',
  },
  {
    id: 'lead_002',
    firstName: 'Sam',
    lastName: 'Rivers',
    email: 'sam.rivers@email.com',
    phone: '(256) 555-0191',
    primaryGoal: 'build_muscle',
    mealInterest: 'tell_me_more',
    referralSource: 'Referral - Marcus T.',
    sourceForm: 'booking',
    submittedAt: 'Feb 22, 2026 · 9:05 AM',
    status: 'Contacted',
    nextFollowUp: 'Feb 23 · 1:00 PM',
    assignedTo: 'Justin Robinson',
    note: 'Booked discovery call for Thursday.',
  },
  {
    id: 'lead_003',
    firstName: 'Naomi',
    lastName: 'Clark',
    email: 'naomi.clark@email.com',
    phone: '(256) 555-0180',
    primaryGoal: 'general_fitness',
    mealInterest: 'no',
    referralSource: 'Google Search',
    sourceForm: 'contact',
    submittedAt: 'Feb 21, 2026 · 6:44 PM',
    status: 'Qualified',
    nextFollowUp: 'Feb 24 · 10:30 AM',
    assignedTo: 'Justin Robinson',
    note: 'Interested in 3x weekly in-person sessions.',
  },
  {
    id: 'lead_004',
    firstName: 'Chris',
    lastName: 'Bryant',
    email: 'chris.bryant@email.com',
    phone: '(256) 555-0166',
    primaryGoal: 'lose_weight',
    mealInterest: 'yes',
    referralSource: 'Facebook',
    sourceForm: 'mid-page',
    submittedAt: 'Feb 20, 2026 · 11:31 AM',
    status: 'Won',
    nextFollowUp: 'N/A',
    assignedTo: 'Justin Robinson',
    note: 'Converted to training + meals bundle.',
  },
  {
    id: 'lead_005',
    firstName: 'Erin',
    lastName: 'Moore',
    email: 'erin.moore@email.com',
    phone: '(256) 555-0108',
    primaryGoal: 'other',
    mealInterest: 'tell_me_more',
    referralSource: 'Walk-in',
    sourceForm: 'contact',
    submittedAt: 'Feb 19, 2026 · 3:17 PM',
    status: 'Lost',
    nextFollowUp: 'N/A',
    assignedTo: 'Justin Robinson',
    note: 'Paused due to relocation.',
  },
];

export const mockLeadTimeline: Record<string, MockTimelineEvent[]> = {
  lead_001: [
    {
      id: 'lt_11',
      title: 'Lead created',
      description: 'Mid-page form submitted with goal: lose weight.',
      timestamp: 'Feb 22 · 10:12 AM',
      type: 'status',
    },
    {
      id: 'lt_12',
      title: 'Auto-response sent',
      description: 'Confirmation email delivered with booking CTA.',
      timestamp: 'Feb 22 · 10:13 AM',
      type: 'note',
    },
  ],
  lead_002: [
    {
      id: 'lt_21',
      title: 'Discovery call booked',
      description: 'Call set for Feb 24 at 12:30 PM.',
      timestamp: 'Feb 22 · 9:05 AM',
      type: 'booking',
    },
    {
      id: 'lt_22',
      title: 'Contacted',
      description: 'Justin texted prep instructions for the call.',
      timestamp: 'Feb 22 · 9:18 AM',
      type: 'status',
    },
  ],
};

export const mockClients: MockClient[] = [
  {
    id: 'client_001',
    fullName: 'Marcus Thompson',
    email: 'marcus.t@email.com',
    status: 'Active',
    packageName: 'Training + Meals Bundle',
    billingStatus: 'Paid',
    nextSession: 'Tue · 7:00 AM',
    adherenceScore: 92,
    joinDate: 'Nov 18, 2025',
  },
  {
    id: 'client_002',
    fullName: 'Alicia Reed',
    email: 'alicia.r@email.com',
    status: 'Active',
    packageName: 'Training + Meals Bundle',
    billingStatus: 'Paid',
    nextSession: 'Wed · 9:30 AM',
    adherenceScore: 88,
    joinDate: 'Dec 10, 2025',
  },
  {
    id: 'client_003',
    fullName: 'Derek Woods',
    email: 'derek.w@email.com',
    status: 'Invited',
    packageName: 'Training Only',
    billingStatus: 'Trial',
    nextSession: 'Pending onboarding',
    adherenceScore: 0,
    joinDate: 'Feb 20, 2026',
  },
  {
    id: 'client_004',
    fullName: 'Naomi Clark',
    email: 'naomi.c@email.com',
    status: 'Prospect',
    packageName: 'Training Only',
    billingStatus: 'Open',
    nextSession: 'Not scheduled',
    adherenceScore: 0,
    joinDate: '—',
  },
];

export const mockClientTimeline: Record<string, MockTimelineEvent[]> = {
  client_001: [
    {
      id: 'ct_11',
      title: 'Week 8 check-in submitted',
      description: 'Energy 8/10, adherence 9/10, weight trend stable.',
      timestamp: 'Feb 21 · 7:04 PM',
      type: 'note',
    },
    {
      id: 'ct_12',
      title: 'Meal delivery completed',
      description: '12 meals delivered and confirmed.',
      timestamp: 'Feb 20 · 5:45 PM',
      type: 'assignment',
    },
  ],
};

export const mockWorkoutPrograms: MockWorkoutProgram[] = [
  {
    id: 'prog_001',
    name: '12-Week Lean Rebuild',
    goal: 'Fat loss + strength retention',
    durationWeeks: 12,
    updatedAt: 'Updated 2 days ago',
    days: [
      {
        dayLabel: 'Day 1',
        focus: 'Lower Body Strength',
        exercises: [
          { name: 'Back Squat', sets: 4, reps: '6-8', rest: '90s', tempo: '3110', demoLink: 'youtube.com/demo-1' },
          { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: '75s', tempo: '3011', demoLink: 'youtube.com/demo-2' },
          { name: 'Walking Lunge', sets: 3, reps: '12/side', rest: '60s', tempo: '2010', demoLink: 'youtube.com/demo-3' },
        ],
      },
      {
        dayLabel: 'Day 2',
        focus: 'Upper Push + Core',
        exercises: [
          { name: 'DB Incline Press', sets: 4, reps: '8-10', rest: '75s', tempo: '2111', demoLink: 'youtube.com/demo-4' },
          { name: 'Cable Fly', sets: 3, reps: '12-15', rest: '60s', tempo: '2020', demoLink: 'youtube.com/demo-5' },
        ],
      },
    ],
  },
  {
    id: 'prog_002',
    name: '8-Week Muscle Accelerator',
    goal: 'Lean mass gain',
    durationWeeks: 8,
    updatedAt: 'Updated yesterday',
    days: [
      {
        dayLabel: 'Day 1',
        focus: 'Upper Pull',
        exercises: [
          { name: 'Weighted Pull-up', sets: 5, reps: '5', rest: '120s', tempo: '20X1', demoLink: 'youtube.com/demo-6' },
          { name: 'Chest Supported Row', sets: 4, reps: '8', rest: '90s', tempo: '2011', demoLink: 'youtube.com/demo-7' },
        ],
      },
    ],
  },
];

export const mockMealItems: MockMealItem[] = [
  {
    id: 'meal_001',
    name: 'Chipotle Chicken Rice Bowl',
    category: 'Lunch',
    protein: 52,
    carbs: 64,
    fats: 12,
    calories: 596,
    weeklyOrders: 28,
    available: true,
  },
  {
    id: 'meal_002',
    name: 'Salmon + Roasted Veg',
    category: 'Dinner',
    protein: 44,
    carbs: 18,
    fats: 22,
    calories: 462,
    weeklyOrders: 22,
    available: true,
  },
  {
    id: 'meal_003',
    name: 'Greek Yogurt Protein Parfait',
    category: 'Breakfast',
    protein: 30,
    carbs: 34,
    fats: 7,
    calories: 311,
    weeklyOrders: 16,
    available: false,
  },
  {
    id: 'meal_004',
    name: 'Lean Beef Burrito Bowl',
    category: 'Lunch',
    protein: 48,
    carbs: 58,
    fats: 15,
    calories: 578,
    weeklyOrders: 25,
    available: true,
  },
];

export const mockMealPrepSummary = [
  { label: 'Chicken bowls', qty: 38 },
  { label: 'Salmon trays', qty: 26 },
  { label: 'Beef bowls', qty: 32 },
  { label: 'Snack packs', qty: 41 },
];

export const mockInvoices: MockInvoice[] = [
  { id: 'INV-1044', clientName: 'Alicia Reed', amount: 620, type: 'Training', status: 'Paid', dueDate: 'Feb 20, 2026' },
  { id: 'INV-1045', clientName: 'Marcus Thompson', amount: 340, type: 'Meals', status: 'Paid', dueDate: 'Feb 21, 2026' },
  { id: 'INV-1046', clientName: 'Chris Bryant', amount: 620, type: 'Training', status: 'Failed', dueDate: 'Feb 22, 2026' },
  { id: 'INV-1047', clientName: 'Naomi Clark', amount: 299, type: 'Add-on', status: 'Open', dueDate: 'Feb 24, 2026' },
];

export const mockIntegrations = [
  {
    id: 'int_1',
    name: 'Stripe Billing',
    status: 'Connected',
    detail: 'Webhooks healthy · Last sync 4 min ago',
    tone: 'success' as const,
  },
  {
    id: 'int_2',
    name: 'GHL Booking',
    status: 'Connected',
    detail: 'Widget active · 42 bookings this month',
    tone: 'success' as const,
  },
  {
    id: 'int_3',
    name: 'Google Calendar',
    status: 'Needs Attention',
    detail: 'Token expires in 2 days',
    tone: 'warning' as const,
  },
  {
    id: 'int_4',
    name: 'Email Automations',
    status: 'Connected',
    detail: 'Sequence A/B/C queued and ready',
    tone: 'success' as const,
  },
];

export function getLeadById(id: string): MockLead {
  return mockLeads.find((lead) => lead.id === id) ?? mockLeads[0];
}

export function getClientById(id: string): MockClient {
  return mockClients.find((client) => client.id === id) ?? mockClients[0];
}
