<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import type { AddTodoMutation, AddTodoMutationVariables } from '../gql/graphql'
import { reactive } from 'vue'

const formState = reactive({ text: '' })

const { mutate: addTodo, loading } = useMutation<AddTodoMutation, AddTodoMutationVariables>(gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      done
    }
  }
`)

const onSubmit = async (e: Event) => {
  e.preventDefault()

  if (formState.text.trim()) {
    await addTodo({ text: formState.text })
    formState.text = ''
  }
}

const onInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  formState.text = target.value
}
</script>

<template>
  <form @submit="onSubmit" class="flex flex-col gap-4 mb-10">
    <input
      id="text"
      placeholder="Enter todo text"
      class="border border-stale-200 p-2"
      :value="formState.text"
      @change="onInputChange"
    />
    <button type="submit" :disabled="loading">{{ loading ? 'Loading...' : 'Add todo' }}</button>
  </form>
</template>
