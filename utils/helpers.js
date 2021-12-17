module.exports = {
  format_date_for_input: (date) => {
    // Format date as MM/DD/YYYY
    return date.toISOString().slice(0, 10);
  },
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
};
