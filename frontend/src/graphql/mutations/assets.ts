export const CREATE_ASSET = `
  mutation CreateAsset($input: CreateAssetInput!) {
    createAsset(input: $input) {
      _id
      name
    }
  }
`;

export const UPDATE_ASSET = `
  mutation UpdateAsset($input: UpdateAssetInput!) {
    updateAsset(input: $input) {
      _id
      name
      category
      currentValue
      hasLoan
      loanBalance
      loanTerm
      monthlyPayment
      interestRate
    }
  }
`;

export const DELETE_ASSET = `
  mutation DeleteAsset($id: ID!) {
    deleteAsset(id: $id)
  }
`;
