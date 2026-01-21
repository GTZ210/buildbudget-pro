import React from 'react';

export const BASE_COSTS: Record<string, number> = {
  'Ground up': 200,
  'Renovation': 120,
  'Rehab': 80
};

export const SCENARIO_MULTIPLIER: Record<string, number> = {
  'Low': 0.8,
  'Mid': 1.0,
  'High': 1.5
};

export const CATEGORY_DISTRIBUTION = [
  { name: 'Site Prep & Foundation', pct: 0.12, details: ['Excavation', 'Concrete', 'Footings'] },
  { name: 'Framing & Structure', pct: 0.18, details: ['Lumber', 'Steel', 'Sheathing'] },
  { name: 'Exterior Finishes', pct: 0.15, details: ['Roofing', 'Siding', 'Windows', 'Doors'] },
  { name: 'Plumbing & HVAC', pct: 0.14, details: ['Pipes', 'Fixtures', 'Ducting', 'AC Unit'] },
  { name: 'Electrical & Lighting', pct: 0.10, details: ['Wiring', 'Panels', 'Fixtures', 'Smart Home'] },
  { name: 'Interior Finishes', pct: 0.20, details: ['Drywall', 'Paint', 'Flooring', 'Trim'] },
  { name: 'Cabinetry & Countertops', pct: 0.08, details: ['Kitchen', 'Bathrooms', 'Laundry'] },
  { name: 'Permits & Misc', pct: 0.03, details: ['Inspections', 'Fees', 'Insurance'] }
];