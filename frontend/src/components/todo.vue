<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import type {
  Todo,
  ToggleTodoMutation,
  ToggleTodoMutationVariables,
  RemoveTodoMutation,
  RemoveTodoMutationVariables,
} from '../gql/graphql'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (e: 'action-completed'): void
}>()

const { mutate: toggleTodo, loading: toggleLoading } = useMutation<
  ToggleTodoMutation,
  ToggleTodoMutationVariables
>(gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id) {
      id
    }
  }
`)

const { mutate: removeTodo, loading: removeLoading } = useMutation<
  RemoveTodoMutation,
  RemoveTodoMutationVariables
>(gql`
  mutation RemoveTodo($id: ID!) {
    removeTodo(id: $id)
  }
`)

const onToggleClick = async () => {
  await toggleTodo({ id: props.todo.id })
  emit('action-completed')
}

const onRemoveClick = async () => {
  await removeTodo({ id: props.todo.id })
  emit('action-completed')
}
</script>

<template>
  <li :id="todo.id" class="p-10 flex gap-4 items-center border-gray-400 border">
    {{ todo.text }}
    <p v-if="todo.done">Done!</p>
    <button v-else @click="onToggleClick" :disabled="toggleLoading" class="bg-white text-black">
      {{ toggleLoading ? 'Updating...' : 'Done' }}
    </button>
    <button class="bg-red-800" :disabled="removeLoading" @click="onRemoveClick">
      {{ removeLoading ? 'Removing...' : 'Remove' }}
    </button>
  </li>
</template>
