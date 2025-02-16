const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}

export const api = {
  auth: {
    signIn: (data: any) => fetchApi('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    signUp: (data: any) => fetchApi('/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  users: {
    getProfile: (userId: string) => fetchApi(`/users/${userId}`),
    updateProfile: (userId: string, data: any) => fetchApi(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },
  posts: {
    create: (data: any) => fetchApi('/posts', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getAll: () => fetchApi('/posts'),
    getById: (id: string) => fetchApi(`/posts/${id}`)
  }
};