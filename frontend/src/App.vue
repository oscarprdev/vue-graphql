<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { graphql } from './gql'
import Todo from './components/todo.vue'
import './style.css'
import CreateTodoForm from './components/create-todo-form.vue'
import SubscriptionNotifications from './components/subscription-notifications.vue'

const { result, loading, error, refetch } = useQuery(
  graphql(`
    query GetTodos {
      todos {
        id
        text
        done
      }
    }
  `)
)

const refreshScreen = () => {
  refetch()
}
</script>

<template>
  <div class="size-screen">
    <SubscriptionNotifications @refresh="refreshScreen" />
    <CreateTodoForm />
    <p v-if="loading">is loading...</p>
    <p v-else-if="error">{{ error.message }}</p>
    <ul v-else class="flex flex-col space-y-6 items-center">
      <Todo
        v-for="todo in result?.todos"
        :key="todo.id"
        :todo="todo"
        @action-completed="refreshScreen"
      />
    </ul>
  </div>
</template>
