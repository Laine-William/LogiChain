const user_roles = ['superadmin', 'admin', 'operator', 'viewer', 'user'];
const user_accountStatus = ['active', 'suspended', 'pending'];
const user_availabilityStatus = ['online', 'busy', 'offline', 'out of office', 'absent'];

const item_types = ['metal structure', 'sound system', 'lighting', 'video', 'genrator', 'barrier', 'cables / accessories'];
const item_status = ['available', 'in_use', 'maintenance', 'reserved', 'archived'];

const anomaly_reasons = ['Breakdown', 'Material damage', 'Scanner problem', 'Problem quantity', 'Other'];
const anomaly_severities = ['low', 'medium', 'high', 'critical'];
const anomaly_status = ['open', 'in_progress', 'resolved', 'closed', 'archived'];

const notification_types = ['system', 'alert', 'info', 'warning'];

const event_status = ['active', 'closed', 'archived'];

const logistic_status = ['starting', 'in_preparation', 'in_transit', 'delivered', 'on_hold', 'cancelled', 'archived'];
const logistic_step_status = ['to_do', 'in_progress', 'completed', 'blocked', 'delayed', 'cancelled', 'archived'];
const logistic_vehicle_types = ['truck', 'ship', 'plane', 'train'];

export {
  user_roles,
  user_accountStatus,
  user_availabilityStatus,
  item_types,
  item_status,
  anomaly_reasons,
  anomaly_severities,
  anomaly_status,
  notification_types,
  event_status,
  logistic_status,
  logistic_step_status,
  logistic_vehicle_types
};