export const GET_DASHBOARD_DATA = `
  query GetDashboardData {
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
  }
`;
