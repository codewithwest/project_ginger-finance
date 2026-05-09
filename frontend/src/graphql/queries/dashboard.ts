export const GET_DASHBOARD_DATA = `
  query GetDashboardData($month: Int, $year: Int) {
    me {
      _id
      username
      email
    }
    myAssets {
      _id
      name
      category
      currentValue
      purchasePrice
      purchaseDate
      hasLoan
      loanBalance
      loanTerm
      monthlyPayment
      interestRate
    }
    mySavingsAccounts {
      _id
      accountName
      balance
      currency
    }
    myTransactions {
      _id
      type
      amount
      date
      description
      tags
    }
    monthlySummary(month: $month, year: $year) {
      income
      expenses
      savings
      balance
    }
  }
`;
