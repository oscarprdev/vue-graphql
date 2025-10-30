<script setup lang="ts">
import { useSubscription } from '@vue/apollo-composable'
import { graphql } from '../gql'
import { reactive } from 'vue'

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const showToast = reactive<{
  type?: 'error' | 'success'
  show?: boolean
  text?: string
}>({})

const { onResult: onTodoAdded, onError } = useSubscription(
  graphql(`
    subscription OnTodoAdded {
      todoAdded {
        id
        text
        done
      }
    }
  `)
)

const setToastAsDefault = () => {
  setTimeout(() => {
    showToast.show = undefined
    showToast.type = undefined
    showToast.text = undefined
  }, 2000)
}

onTodoAdded(data => {
  showToast.type = 'success'
  showToast.show = true
  showToast.text = data.data?.todoAdded.text

  emit('refresh')

  setToastAsDefault()
})

onError(error => {
  showToast.type = 'error'
  showToast.show = true
  showToast.text = error.message

  emit('refresh')

  setToastAsDefault()
})
</script>
<template>
  <div class="absolute top-2 right-2">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <article
        v-if="showToast.show && showToast.type === 'success'"
        class="bg-emerald-400 text-emerald-800 border-emerald-800 p-5 font-bold text-center rounded shadow-lg"
      >
        Action successfully done! Toast has been added with text: {{ showToast.text }}
      </article>
    </Transition>
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <article
        v-if="showToast.show && showToast.type === 'error'"
        class="bg-red-400 text-red-800 border-red-800 p-5 font-bold text-center rounded shadow-lg"
      >
        Something went wrong! Error: {{ showToast.text }}
      </article>
    </Transition>
  </div>
</template>
