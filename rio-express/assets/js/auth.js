// ====================================================================
// RIOEXPRESS CROSS-PLATFORM AUTHENTICATION & SECURITY ENGINE
// Developed & Powered by: Bataan Creation
// Developer & Owner: Reynold P. Rio (bataancreation@gmail.com)
// ====================================================================

const RioAuth = {
  
  /**
   * SESSION KEYS
   */
  STORAGE_KEY_USER: 'rio_user_session',
  STORAGE_KEY_TOKEN: 'rio_auth_token',

  /**
   * 1. GET CURRENT LOGGED IN USER
   */
  getCurrentUser() {
    const userData = localStorage.getItem(this.STORAGE_KEY_USER);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch (e) {
      this.logout();
      return null;
    }
  },

  /**
   * 2. SAVE USER SESSION
   */
  saveSession(user, token) {
    localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(this.STORAGE_KEY_TOKEN, token);
  },

  /**
   * 3. LOGOUT & CLEAR SESSION
   */
  logout() {
    localStorage.removeItem(this.STORAGE_KEY_USER);
    localStorage.removeItem(this.STORAGE_KEY_TOKEN);
    window.location.href = 'index.html';
  },

  /**
   * 4. ROLE-BASED DASHBOARD DISPATCHER
   * Automatically redirects users to their appropriate dashboard based on Role.
   */
  dispatchUserToDashboard(user) {
    if (!user) {
      window.location.href = 'index.html';
      return;
    }

    const currentPath = window.location.pathname.split('/').pop();

    switch (user.role) {
      case 'SUPER_ADMIN':
        if (currentPath !== 'admin.html') window.location.href = 'admin.html';
        break;
      case 'MERCHANT':
        if (currentPath !== 'merchant.html') window.location.href = 'merchant.html';
        break;
      case 'RIDER':
        if (currentPath !== 'rider.html') window.location.href = 'rider.html';
        break;
      case 'CUSTOMER':
      default:
        if (currentPath !== 'customer.html') window.location.href = 'customer.html';
        break;
    }
  },

  /**
   * 5. PAGE SECURITY GUARD & KYC ENFORCER
   * Enforces page access rules and checks identity verification status.
   */
  enforcePageGuard(requiredRole = null) {
    const user = this.getCurrentUser();

    // If no user is logged in, redirect to Gateway Index
    if (!user) {
      if (window.location.pathname.split('/').pop() !== 'index.html') {
        window.location.href = 'index.html';
      }
      return false;
    }

    // Role Validation
    if (requiredRole && user.role !== requiredRole && user.role !== 'SUPER_ADMIN') {
      alert(`Access Restricted: This dashboard is reserved for ${requiredRole} users.`);
      this.dispatchUserToDashboard(user);
      return false;
    }

    // Banned Account Guard
    if (user.is_banned) {
      alert('⚠️ Account Suspended: Your account has been permanently banned due to policy violations. Contact Bataan Creation support.');
      this.logout();
      return false;
    }

    return true;
  },

  /**
   * 6. CHECK IF CUSTOMER CAN PLACE ORDERS (KYC & BALANCE CHECK)
   */
  canCustomerBook(user) {
    if (!user) return { allowed: false, reason: 'NOT_LOGGED_IN' };

    // Unpaid Balance Check
    if (user.unpaid_balance && user.unpaid_balance > 0) {
      return {
        allowed: false,
        reason: 'UNPAID_BALANCE',
        message: ` You have an unpaid cancellation balance of ₱${user.unpaid_balance.toFixed(2)}. Please settle this via GCash 09365810610 to continue booking.`
      };
    }

    // KYC Verification Check
    if (user.kyc_status !== 'VERIFIED' && user.role !== 'SUPER_ADMIN') {
      return {
        allowed: false,
        reason: 'UNVERIFIED_KYC',
        message: '🛡️ Identity Verification Required: Please submit your Valid ID and Selfie for review before placing orders.'
      };
    }

    return { allowed: true };
  },

  /**
   * 7. GENERATE DEVICE FINGERPRINT (ANTI-CLONING / ANTI-BOT)
   */
  getDeviceFingerprint() {
    const nav = window.navigator;
    const screen = window.screen;
    let fingerprint = nav.mimeTypes.length;
    fingerprint += nav.userAgent.replace(/\D+/g, '');
    fingerprint += nav.plugins.length;
    fingerprint += screen.height || '';
    fingerprint += screen.width || '';
    fingerprint += screen.pixelDepth || '';
    return fingerprint;
  }
};

// Freeze object to prevent external code tampering
Object.freeze(RioAuth);