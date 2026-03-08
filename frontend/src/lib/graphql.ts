export async function graphqlFetch<T>({
  query,
  variables = {},
  headers = {},
}: {
  query: string;
  variables?: Record<string, any>;
  headers?: Record<string, string>;
}): Promise<{ data: T; errors?: any[] }> {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GraphQL request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}
