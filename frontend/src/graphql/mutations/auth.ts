export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        _id
        username
        email
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      _id
      username
      email
    }
  }
`;
