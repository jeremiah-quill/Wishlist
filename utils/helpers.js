module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toISOString().slice(0, 10);
  },
};
