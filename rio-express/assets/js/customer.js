// ====================================================================
// RIOEXPRESS CUSTOMER ENGINE & BOOKING HUB
// Developed & Powered by: Bataan Creation
// Official GCash: 09365810610 (Reynold P. / Bataan Creation)
// ====================================================================

const RioCustomer = {

  activeBookingState: null,

  /**
   * 1. COMPUTE FARE & DOWNPAYMENT BREAKDOWN
   */
  calculateCheckout(itemCost, pickupLat, pickupLng, dropoffLat, dropoffLng) {
    const user = RioAuth.getCurrentUser();
    const canBook = RioAuth.canCustomerBook(user);

    if (!canBook.allowed) {
      alert(canBook.message);
      return null;
    }

    // Compute Haversine distance
    const { distanceKm } = RioEngine.calculateHaversineDistance(
      pickupLat, 
      pickupLng, 
      dropoffLat, 
      dropoffLng
    );

    // Compute complete payment breakdown using Master Engine
    const breakdown = RioEngine.calculatePaymentBreakdown(itemCost, distanceKm);

    this.activeBookingState = {
      user,
      distanceKm,
      breakdown,
      pickup: { lat: pickupLat, lng: pickupLng },
      dropoff: { lat: dropoffLat, lng: dropoffLng }
    };

    return breakdown;
  },

  /**
   * 2. GENERATE ORDER DATA PAYLOAD
   */
  prepareOrderPayload(pickupAddress, dropoffAddress, dropoffBarangay, merchantId = null, receiptUrl = null) {
    if (!this.activeBookingState) {
      alert('Error: Please compute fare calculation before proceeding.');
      return null;
    }

    const { user, distanceKm, breakdown, pickup, dropoff } = this.activeBookingState;

    // Generate 4-digit OTP code for anti-scam delivery verification
    const deliveryOtp = RioEngine.generateDeliveryOtp();

    const orderPayload = {
      customer_id: user.id,
      merchant_id: merchantId,
      pickup_address: pickupAddress,
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      dropoff_address: dropoffAddress,
      dropoff_barangay: dropoffBarangay,
      dropoff_lat: dropoff.lat,
      dropoff_lng: dropoff.lng,
      distance_km: distanceKm,
      item_cost: breakdown.itemCost,
      delivery_fee: breakdown.deliveryFee,
      total_amount: breakdown.totalAmount,
      payment_method: 'GCASH',
      payment_status: breakdown.requiresDownpayment ? 'PARTIAL_DOWNPAYMENT' : 'UNPAID',
      required_downpayment: breakdown.requiredDownpayment,
      remaining_balance: breakdown.remainingBalance,
      downpayment_receipt_url: receiptUrl,
      delivery_otp: deliveryOtp,
      status: breakdown.requiresDownpayment ? 'PENDING_DOWNPAYMENT' : 'SEARCHING_RIDER'
    };

    return orderPayload;
  },

  /**
   * 3. DISPLAY DOWNPAYMENT SUMMARY CARD DATA
   */
  renderDownpaymentSummary(breakdown) {
    return {
      title: breakdown.requiresDownpayment 
        ? '⚠️ 50% REQUIRED DOWNPAYMENT' 
        : '💵 STANDARD CASH ON DELIVERY',
      instruction: breakdown.requiresDownpayment 
        ? `Please transfer ₱${breakdown.requiredDownpayment.toFixed(2)} to GCash: 09365810610 (${breakdown.gcashName}) and upload the receipt screenshot.` 
        : `Pay full amount ₱${breakdown.totalAmount.toFixed(2)} to rider upon arrival.`,
      gcashNumber: breakdown.gcashNumber,
      gcashName: breakdown.gcashName,
      requiredAmount: breakdown.requiredDownpayment,
      remainingAmount: breakdown.remainingBalance
    };
  }
};

// Freeze object to prevent external code tampering
Object.freeze(RioCustomer);