// TERMS, GUIDELINES, AND RESPONSIBILITIES ENGINE
const RioGuidelines = {
  CUSTOMER: [
    "1. Exact drop-off location and barangay must be provided in Morong.",
    "2. 50% required downpayment applies for orders >= ₱500 or routes >= 8KM.",
    "3. Keep your 4-digit OTP code secret until order arrival."
  ],
  RIDER: [
    "1. 3-Point photo proof (Store, Receipt, Drop-off) is mandatory.",
    "2. Verification requires presence within the 50m GPS geofence.",
    "3. Remit COD collections exceeding limit to GCash 09365810610."
  ],
  MERCHANT: [
    "1. Ensure order items match app menu listings and pricing.",
    "2. Update store open/closed status accurately."
  ]
};

function showGuidelinesModal(role) {
  const rules = RioGuidelines[role] || RioGuidelines.CUSTOMER;
  alert(`📋 RIOEXPRESS ${role} GUIDELINES:\n\n` + rules.join("\n"));
}