/**
 * Formate une date au format lisible français.
 * @param {string | Date} dateInput 
 * @returns {string}
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formate l'empreinte carbone consolidée en kg CO2.
 * @param {number} value 
 * @returns {string}
 */
export const formatCarbonImpact = (value) => {
  if (typeof value !== 'number') return '0.00 kg CO2';
  return `${value.toFixed(2)} kg CO2`;
};