<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

// Define your GraphQL query
// Replace this with your actual query from your schema
const EXAMPLE_QUERY = gql`
  query GetExample {
    # Replace with your actual query fields
    # Example:
    # users {
    #   id
    #   name
    # }
  }
`

// Execute the query
const { result, loading, error } = useQuery(EXAMPLE_QUERY)
</script>

<template>
  <div class="graphql-example">
    <h2>GraphQL Query Example</h2>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error">
      Error: {{ error.message }}
    </div>

    <!-- Data display -->
    <div v-else-if="result" class="result">
      <h3>Query Result:</h3>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>

    <!-- No data -->
    <div v-else>
      No data available
    </div>
  </div>
</template>

<style scoped>
.graphql-example {
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
}

h2 {
  margin-top: 0;
  color: #42b883;
}

.loading {
  color: #646cff;
  font-weight: bold;
}

.error {
  color: #ff4444;
  padding: 1rem;
  background-color: #ffeeee;
  border-radius: 4px;
}

.result {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
}

pre {
  text-align: left;
  overflow-x: auto;
  margin: 0;
}
</style>
