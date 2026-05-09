export const GET_TRANSACTIONS = `
  query GetTransactions($type: String, $sort: String, $month: Float, $year: Float) {
    myTransactions(type: $type, sort: $sort, month: $month, year: $year) {
      _id
      type
      amount
      date
      description
      store
      isRecurring
      categoryId
    }
  }
`;

export const GET_MONTHLY_SUMMARY = `
  query GetMonthlySummary($month: Float!, $year: Float!) {
    monthlySummary(month: $month, year: $year) {
      income
      expenses
      savings
      balance
    }
  }
`;
