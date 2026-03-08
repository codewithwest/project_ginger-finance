export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type Asset {
    id: ID!
    userId: ID!
    name: String!
    type: String!
    status: String!
    store: String
    plannedDate: String
    boughtDate: String
    cost: Float!
    createdAt: String!
    updatedAt: String!
  }

  type Transaction {
    id: ID!
    userId: ID!
    type: String!
    category: String!
    store: String
    amount: Float!
    date: String!
    description: String
    isRecurring: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type DashboardStats {
    totalIncome: Float!
    totalExpenses: Float!
    totalSavings: Float!
    currentBalance: Float!
    totalAssetsValue: Float!
  }

  type Query {
    getDashboardStats: DashboardStats!
    getAssets(status: String): [Asset!]!
    getTransactions(type: String, isRecurring: Boolean): [Transaction!]!
    searchTransactions(query: String!): [Transaction!]!
    getProfile: User!
  }

  type Mutation {
    createAsset(name: String!, type: String!, status: String!, store: String, plannedDate: String, boughtDate: String, cost: Float!): Asset!
    updateAsset(id: ID!, name: String, type: String, status: String, store: String, plannedDate: String, boughtDate: String, cost: Float): Asset!
    deleteAsset(id: ID!): Boolean!

    createTransaction(type: String!, category: String!, store: String, amount: Float!, date: String!, description: String, isRecurring: Boolean): Transaction!
    updateTransaction(id: ID!, type: String, category: String, store: String, amount: Float, date: String, description: String, isRecurring: Boolean): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;
