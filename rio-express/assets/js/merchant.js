// ====================================================================
// RIOEXPRESS BUSINESS PARTNER STORE & MENU MANAGER
// Developed & Powered by: Bataan Creation
// Developer & Owner: Reynold P. Rio (bataancreation@gmail.com)
// ====================================================================

const RioMerchant = {

  activeStore: null,

  /**
   * 1. SET ACTIVE STORE CONTEXT
   */
  setActiveStore(storeData) {
    this.activeStore = storeData;
    return {
      storeId: storeData.id,
      storeName: storeData.store_name,
      isOpen: storeData.is_open,
      isConciergeManaged: storeData.is_concierge_managed
    };
  },

  /**
   * 2. FORMAT PRODUCT PAYLOAD (ADD / EDIT ULAM & ITEMS)
   */
  formatProductPayload(merchantId, name, description, price, imageUrl, isAvailable = true) {
    if (!name || price <= 0) {
      return { success: false, message: 'Please enter a valid product name and price.' };
    }

    return {
      success: true,
      data: {
        merchant_id: merchantId,
        name: name.trim(),
        description: description ? description.trim() : '',
        price: Number(Number(price).toFixed(2)),
        image_url: imageUrl || null,
        is_available: isAvailable
      }
    };
  },

  /**
   * 3. TOGGLE STORE OPEN / CLOSED STATUS
   */
  toggleStoreStatus(currentStatus) {
    const newStatus = !currentStatus;
    return {
      isOpen: newStatus,
      statusLabel: newStatus ? 'STORE IS OPEN' : 'STORE IS CLOSED',
      message: newStatus 
        ? '🟢 Store is now OPEN. Customers in Morong can place orders.' 
        : '🔴 Store is now CLOSED. Menu items hidden from customer catalog.'
    };
  },

  /**
   * 4. TOGGLE PRODUCT AVAILABILITY (SOLD OUT SWITCH)
   */
  toggleProductAvailability(productId, currentAvailability) {
    const newAvailability = !currentAvailability;
    return {
      productId,
      isAvailable: newAvailability,
      statusLabel: newAvailability ? 'AVAILABLE' : 'SOLD OUT',
      message: newAvailability 
        ? '✅ Product marked as Available.' 
        : '⚠️ Product marked as Sold Out.'
    };
  }
};

// Freeze object to prevent external code tampering
Object.freeze(RioMerchant);