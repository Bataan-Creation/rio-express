// ====================================================================
// RIOEXPRESS RIDER GEOFENCE & ANTI-SCAM PROOF ENGINE
// Developed & Powered by: Bataan Creation
// Developer & Owner: Reynold P. Rio (bataancreation@gmail.com)
// ====================================================================

const RioRider = {

  activeJob: null,

  /**
   * 1. CHECK RIDER COD CASH LIMIT (PREVENTS EXCESS CASH LOSS)
   */
  canAcceptNewJob(riderCashHeld) {
    const maxLimit = RIO_CONFIG.ANTI_SCAM.RIDER_MAX_CASH_HELD_LIMIT;
    if (riderCashHeld >= maxLimit) {
      return {
        allowed: false,
        message: `⚠️ COD Limit Reached: You currently hold ₱${riderCashHeld.toFixed(2)} in COD cash. Please remit platform fees to GCash 09365810610 to accept new orders.`
      };
    }
    return { allowed: true };
  },

  /**
   * 2. SET ACTIVE JOB & VERIFY DOWNPAYMENT STATUS
   */
  setActiveJob(order) {
    this.activeJob = order;
    return {
      orderId: order.id,
      itemCost: order.item_cost,
      deliveryFee: order.delivery_fee,
      totalAmount: order.total_amount,
      isDownpaymentVerified: order.payment_status === 'PARTIAL_DOWNPAYMENT' || order.payment_status === 'FULLY_PAID',
      requiredDownpayment: order.required_downpayment,
      remainingBalanceToCollect: order.remaining_balance
    };
  },

  /**
   * 3. VERIFY 50m GEOFENCE DISTANCE TO DROPOFF
   */
  verifyGeofenceToDropoff(currentRiderLat, currentRiderLng) {
    if (!this.activeJob) {
      return { isValid: false, message: 'Error: No active delivery job selected.' };
    }

    const { dropoff_lat, dropoff_lng } = this.activeJob;

    // Use Master Engine Haversine Formula & Geofence Check
    return RioEngine.validateRiderGeofence(
      currentRiderLat, 
      currentRiderLng, 
      dropoff_lat, 
      dropoff_lng
    );
  },

  /**
   * 4. COMPLETE DELIVERY WITH ANTI-SCAM 3-PHOTO PROOF & OTP
   */
  verifyAndCompleteDelivery(inputOtp, storePhotoUrl, receiptPhotoUrl, dropoffPhotoUrl, currentRiderLat, currentRiderLng) {
    if (!this.activeJob) {
      return { success: false, message: 'No active order found.' };
    }

    // A. OTP Verification Check
    if (this.activeJob.delivery_otp !== inputOtp) {
      return {
        success: false,
        message: '❌ Invalid OTP: The 4-digit code provided does not match the customer verification OTP.'
      };
    }

    // B. Geofence Distance Check
    const geofenceCheck = this.verifyGeofenceToDropoff(currentRiderLat, currentRiderLng);
    if (!geofenceCheck.isValid) {
      return {
        success: false,
        message: geofenceCheck.message
      };
    }

    // C. 3-Point Photo Proof Check
    if (!storePhotoUrl || !receiptPhotoUrl || !dropoffPhotoUrl) {
      return {
        success: false,
        message: '📷 Photo Proof Missing: You must upload Store Pickup, Official Receipt, and Drop-off Landmark photos.'
      };
    }

    // Return completed payload ready for Supabase database update
    return {
      success: true,
      orderId: this.activeJob.id,
      status: 'DELIVERED',
      paymentStatus: 'FULLY_PAID',
      storePhotoUrl,
      receiptPhotoUrl,
      dropoffPhotoUrl,
      message: '🎉 Delivery Successfully Verified & Completed! Transaction is secured.'
    };
  }
};

// Freeze object to prevent external code tampering
Object.freeze(RioRider);