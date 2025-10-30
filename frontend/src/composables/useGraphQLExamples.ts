import { ref } from 'vue'
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

/**
 * Example 1: Basic Query
 * Use this pattern for simple data fetching
 */
export function useBasicQuery() {
  const GET_DATA = gql`
    query GetData {
      # Replace with your actual query
      # Example: users { id, name }
    }
  `

  const { result, loading, error, refetch } = useQuery(GET_DATA)

  return {
    data: result,
    loading,
    error,
    refetch,
  }
}

/**
 * Example 2: Query with Variables
 * Use this pattern when you need to pass parameters to your query
 */
export function useQueryWithVariables(userId: string) {
  const GET_USER = gql`
    query GetUser($id: ID!) {
      # Replace with your actual query
      # user(id: $id) {
      #   id
      #   name
      #   email
      # }
    }
  `

  const { result, loading, error } = useQuery(GET_USER, {
    id: userId,
  })

  return {
    user: result,
    loading,
    error,
  }
}

/**
 * Example 3: Reactive Query with Variables
 * Use this pattern when variables can change during component lifecycle
 */
export function useReactiveQuery() {
  const searchTerm = ref('')

  const SEARCH_QUERY = gql`
    query Search($term: String!) {
      # Replace with your actual query
      # search(term: $term) {
      #   id
      #   title
      # }
    }
  `

  const { result, loading, error } = useQuery(
    SEARCH_QUERY,
    () => ({
      term: searchTerm.value,
    }),
    {
      enabled: () => searchTerm.value.length > 0,
    }
  )

  return {
    searchTerm,
    results: result,
    loading,
    error,
  }
}

/**
 * Example 4: Mutation
 * Use this pattern for creating, updating, or deleting data
 */
export function useCreateItem() {
  const CREATE_ITEM = gql`
    mutation CreateItem($input: CreateItemInput!) {
      # Replace with your actual mutation
      # createItem(input: $input) {
      #   id
      #   name
      #   createdAt
      # }
    }
  `

  const { mutate, loading, error, onDone } = useMutation(CREATE_ITEM)

  const createItem = async (input: any) => {
    try {
      await mutate({
        input,
      })
    } catch (e) {
      console.error('Error creating item:', e)
    }
  }

  return {
    createItem,
    loading,
    error,
    onDone,
  }
}

/**
 * Example 5: Mutation with Cache Update
 * Use this pattern when you want to update the cache after a mutation
 */
export function useCreateItemWithCacheUpdate() {
  const CREATE_ITEM = gql`
    mutation CreateItem($input: CreateItemInput!) {
      # createItem(input: $input) {
      #   id
      #   name
      # }
    }
  `

  const GET_ITEMS = gql`
    query GetItems {
      # items {
      #   id
      #   name
      # }
    }
  `

  const { mutate, loading, error } = useMutation(CREATE_ITEM, {
    update: (cache, { data }) => {
      // Read the current cache
      const existingData: any = cache.readQuery({ query: GET_ITEMS })

      // Write the new data to cache
      if (existingData && data?.createItem) {
        cache.writeQuery({
          query: GET_ITEMS,
          data: {
            items: [...existingData.items, data.createItem],
          },
        })
      }
    },
  })

  const createItem = async (input: any) => {
    await mutate({ input })
  }

  return {
    createItem,
    loading,
    error,
  }
}

/**
 * Example 6: Subscription (requires WebSocket setup)
 * Use this pattern for real-time data updates
 */
export function useRealtimeSubscription() {
  const MESSAGE_SUBSCRIPTION = gql`
    subscription OnMessageAdded {
      # messageAdded {
      #   id
      #   content
      #   createdAt
      # }
    }
  `

  const { result, loading, error } = useSubscription(MESSAGE_SUBSCRIPTION)

  return {
    message: result,
    loading,
    error,
  }
}

/**
 * Example 7: Polling Query
 * Use this pattern for data that should refresh periodically
 */
export function usePollingQuery() {
  const GET_STATUS = gql`
    query GetStatus {
      # status {
      #   isOnline
      #   lastUpdated
      # }
    }
  `

  const { result, loading, error, refetch } = useQuery(GET_STATUS, null, {
    pollInterval: 5000, // Poll every 5 seconds
  })

  return {
    status: result,
    loading,
    error,
    refetch,
  }
}

/**
 * Example 8: Lazy Query
 * Use this pattern when you want to execute a query manually (e.g., on button click)
 */
export function useLazyQuery() {
  const GET_DATA = gql`
    query GetData($id: ID!) {
      # data(id: $id) {
      #   id
      #   value
      # }
    }
  `

  const { load, result, loading, error } = useQuery(
    GET_DATA,
    null,
    { enabled: false }
  )

  const fetchData = (id: string) => {
    load(GET_DATA, { id })
  }

  return {
    fetchData,
    data: result,
    loading,
    error,
  }
}
