// Mock data for UI preview — controlled by VITE_MOCK_DATA=true
// To remove: vercel env rm VITE_MOCK_DATA production && git push

export const MOCK = import.meta.env.VITE_MOCK_DATA?.trim() === 'true'

export const mockSyndic = {
  building: { id: 'mock-1', name: 'Résidence Al-Andalus' },
  stats: { totalUnits: 24, occupancy: 87, revenue: 72000, openTasks: 5 },
  tasks: [
    { id: 't1', title: 'Fix lobby lighting', status: 'in_progress' as const, priority: 'high', createdAt: '2026-03-28T09:00:00Z' },
    { id: 't2', title: 'Elevator inspection',  status: 'pending' as const,     priority: 'high', createdAt: '2026-03-30T11:00:00Z' },
    { id: 't3', title: 'Repaint stairwell B',  status: 'approved' as const,    priority: 'low',  createdAt: '2026-03-25T08:00:00Z' },
  ],
}

// Phase 2 — Syndic Units
export const mockBuildings = [
  {
    id: 'b1',
    name: 'Résidence Al Andalus',
    address: '12 Rue Ibn Battouta',
    city: 'Casablanca',
    totalUnits: 6,
    occupancy: 67,
    revenue: 72000,
    openTasks: 5,
  },
  {
    id: 'b2',
    name: 'Résidence Les Orangers',
    address: '44 Avenue Hassan II',
    city: 'Rabat',
    totalUnits: 4,
    occupancy: 0,
    revenue: 0,
    openTasks: 0,
  },
]

export const mockApartments = [
  { id: 'a1', number: '1A', floor: 1, status: 'occupied' as const, buildingId: 'b1', resident: { name: 'Ahmed Resident' } },
  { id: 'a2', number: '1B', floor: 1, status: 'occupied' as const, buildingId: 'b1', resident: { name: 'Sara Benali' } },
  { id: 'a3', number: '2A', floor: 2, status: 'vacant' as const,   buildingId: 'b1', resident: null },
  { id: 'a4', number: '2B', floor: 2, status: 'vacant' as const,   buildingId: 'b1', resident: null },
  { id: 'a5', number: '3A', floor: 3, status: 'maintenance' as const, buildingId: 'b1', resident: null },
  { id: 'a6', number: '3B', floor: 3, status: 'vacant' as const,   buildingId: 'b1', resident: null },
  { id: 'a7', number: '1A', floor: 1, status: 'vacant' as const,   buildingId: 'b2', resident: null },
  { id: 'a8', number: '1B', floor: 1, status: 'vacant' as const,   buildingId: 'b2', resident: null },
  { id: 'a9', number: '2A', floor: 2, status: 'vacant' as const,   buildingId: 'b2', resident: null },
  { id: 'a10', number: '2B', floor: 2, status: 'vacant' as const,  buildingId: 'b2', resident: null },
]

// Phase 2 — Syndic Tasks (full list)
export const mockAllTasks = [
  {
    id: 'st1',
    title: 'Nettoyage hall entrée',
    description: 'Nettoyage complet du hall d\'entrée principal.',
    status: 'pending' as const,
    priority: 'medium' as const,
    assignedTo: null,
    createdAt: '2026-04-01T08:00:00Z',
  },
  {
    id: 'st2',
    title: 'Sortie poubelles',
    description: 'Sortir les poubelles tous les mardis et vendredis.',
    status: 'assigned' as const,
    priority: 'low' as const,
    assignedTo: { name: 'Karim Gardien' },
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 'st3',
    title: 'Remplacement ampoule',
    description: 'Remplacer l\'ampoule grillée au 2ème étage, cage B.',
    status: 'in_progress' as const,
    priority: 'medium' as const,
    assignedTo: { name: 'Karim Gardien' },
    createdAt: '2026-04-02T08:00:00Z',
  },
  {
    id: 'st4',
    title: 'Vérification interphone',
    description: 'Vérifier et tester le système interphone de la résidence.',
    status: 'submitted_for_approval' as const,
    priority: 'high' as const,
    assignedTo: { name: 'Karim Gardien' },
    createdAt: '2026-03-31T10:00:00Z',
  },
  {
    id: 'st5',
    title: 'Nettoyage parking',
    description: 'Nettoyage et organisation du parking souterrain.',
    status: 'approved' as const,
    priority: 'low' as const,
    assignedTo: { name: 'Karim Gardien' },
    createdAt: '2026-03-28T08:00:00Z',
  },
]

// Phase 2 — Syndic Finance
export const mockFinanceStats = {
  totalRevenue: 72000,
  monthlyExpenses: 12400,
  netBalance: 59600,
  pendingPayments: 2,
}

export const mockCharges = [
  { id: 'c1', apartment: 'Apt 1A', title: 'Cotisation Avril 2026', amount: 800, status: 'pending' as const, dueDate: '2026-04-30T00:00:00Z' },
  { id: 'c2', apartment: 'Apt 1A', title: 'Cotisation Mars 2026',  amount: 800, status: 'paid' as const,    dueDate: '2026-03-31T00:00:00Z' },
  { id: 'c3', apartment: 'Apt 1A', title: 'Eau Mars 2026',         amount: 120, status: 'paid' as const,    dueDate: '2026-03-31T00:00:00Z' },
  { id: 'c4', apartment: 'Apt 1B', title: 'Cotisation Fév 2026',   amount: 800, status: 'overdue' as const, dueDate: '2026-02-28T00:00:00Z' },
  { id: 'c5', apartment: 'Apt 1B', title: 'Sécurité Avril 2026',   amount: 200, status: 'pending' as const, dueDate: '2026-04-30T00:00:00Z' },
]

// Phase 2 — Resident Ledger
export const mockResidentCharges = [
  { id: 'rc1', title: 'Cotisation Avril 2026', type: 'maintenance',  amount: 800, status: 'pending' as const, dueDate: '2026-04-30T00:00:00Z' },
  { id: 'rc2', title: 'Cotisation Mars 2026',  type: 'maintenance',  amount: 800, status: 'paid' as const,    dueDate: '2026-03-31T00:00:00Z' },
  { id: 'rc3', title: 'Eau Mars 2026',         type: 'utilities',    amount: 120, status: 'paid' as const,    dueDate: '2026-03-31T00:00:00Z' },
]

export const mockPaymentHistory = [
  { id: 'p1', amount: 800, method: 'bank_transfer', status: 'completed', createdAt: '2026-03-28T10:00:00Z', charge: { title: 'Cotisation Mars 2026' } },
  { id: 'p2', amount: 120, method: 'cash',          status: 'completed', createdAt: '2026-03-25T14:00:00Z', charge: { title: 'Eau Mars 2026' } },
  { id: 'p3', amount: 800, method: 'bank_transfer', status: 'pending',   createdAt: '2026-04-01T09:00:00Z', charge: { title: 'Cotisation Avril 2026' } },
]

// Phase 2 — Resident Support (Complaints)
export const mockComplaints = [
  {
    id: 'cp1',
    subject: 'Bruit excessif',
    description: 'Bruit excessif provenant de l\'appartement au-dessus entre 23h et 2h du matin.',
    category: 'noise',
    priority: 'high',
    status: 'in_progress' as const,
    createdAt: '2026-04-01T09:00:00Z',
    response: 'Nous avons contacté le résident concerné. Un médiateur a été désigné.',
  },
  {
    id: 'cp2',
    subject: 'Fuite d\'eau',
    description: 'Fuite d\'eau dans la salle de bains, taches au plafond visibles.',
    category: 'maintenance',
    priority: 'urgent',
    status: 'open' as const,
    createdAt: '2026-04-03T11:00:00Z',
    response: null,
  },
  {
    id: 'cp3',
    subject: 'Éclairage défaillant',
    description: 'Les lumières du couloir du 2ème étage ne fonctionnent plus depuis 3 jours.',
    category: 'safety',
    priority: 'high',
    status: 'resolved' as const,
    createdAt: '2026-03-28T08:00:00Z',
    response: 'Réparé le 30 mars. Ampoules remplacées par le gardien.',
  },
]

// Phase 2 — Resident Properties
export const mockResidentApartment = {
  id: 'a1',
  number: '1A',
  floor: 1,
  area: 72,
  rooms: 3,
  status: 'occupied',
  building: {
    name: 'Résidence Al Andalus',
    address: '12 Rue Ibn Battouta',
    city: 'Casablanca',
    gardien: 'Karim Gardien',
    totalUnits: 6,
  },
}

export const mockResident = {
  charges: [
    { id: 'c1', amount: 2400, dueDate: '2026-04-15T00:00:00Z', status: 'pending' as const },
    { id: 'c2', amount: 1200, dueDate: '2026-03-15T00:00:00Z', status: 'overdue' as const },
  ],
  announcements: [
    {
      id: 'a1',
      title: 'Water shutoff – Saturday 8h–12h',
      content: 'Scheduled maintenance on the main water supply. Please store water in advance.',
      type: 'urgent',
      createdAt: '2026-03-31T07:00:00Z',
    },
    {
      id: 'a2',
      title: 'Residents meeting – April 10th',
      content: 'Annual co-ownership meeting in the ground floor hall at 18:00. All owners invited.',
      type: 'event',
      createdAt: '2026-03-29T10:00:00Z',
    },
    {
      id: 'a3',
      title: 'New intercom system installed',
      content: 'The new digital intercom is now active. Contact reception to register your phone number.',
      type: 'info',
      createdAt: '2026-03-27T14:00:00Z',
    },
  ],
}

export const mockGardien = {
  stats: { total: 8, pending: 3, inProgress: 2, completed: 3 },
  tasks: [
    {
      id: 'g1',
      title: 'Fix lobby lighting',
      description: 'Two ceiling fixtures in the main lobby are out. Replace bulbs and check wiring.',
      status: 'in_progress' as const,
      scheduledAt: '2026-04-02T09:00:00Z',
      createdAt: '2026-04-01T08:00:00Z',
    },
    {
      id: 'g2',
      title: 'Elevator inspection',
      description: 'Monthly safety inspection of Elevator A. Check cables, doors, and emergency button.',
      status: 'pending' as const,
      scheduledAt: '2026-04-02T14:00:00Z',
      createdAt: '2026-04-01T09:00:00Z',
    },
    {
      id: 'g3',
      title: 'Clean rooftop terrace',
      description: 'Sweep and clear the rooftop terrace ahead of the residents meeting on April 10.',
      status: 'approved' as const,
      scheduledAt: undefined,
      createdAt: '2026-03-30T10:00:00Z',
    },
  ],
}
