export const GET_DASHBOARD_DATA = `
  query GetDashboardData($userId: ID!) {
    me {
      _id
      username
      email
    }
    myAssets(userId: $userId) {
      _id
      name
      category
      currentValue
      purchasePrice
    }
    mySavingsAccounts(userId: $userId) {
      _id
      accountName
      balance
      currency
    }
    myTransactions(userId: $userId) {
      _id
      type
      amount
      date
      description
      tags
    }
  }
`;
