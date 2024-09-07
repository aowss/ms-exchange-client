import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useContactsStore = defineStore('contacts', () => {
  const contacts = ref([
    {
      name: 'Emma Johnson',
      email: 'emma.johnson@example.com'
    },
    {
      name: 'Liam Wilson',
      email: 'liam.wilson@example.com'
    },
    {
      name: 'Olivia Davis',
      email: 'olivia.davis@example.com'
    },
    {
      name: 'Noah Martinez',
      email: 'noah.martinez@example.com'
    },
    {
      name: 'Ava Taylor',
      email: 'ava.taylor@example.com'
    },
    {
      name: 'Lucas Brown',
      email: 'lucas.brown@example.com'
    },
    {
      name: 'Sophia Smith',
      email: 'sophia.smith@example.com'
    },
    {
      name: 'Ethan Wilson',
      email: 'ethan.wilson@example.com'
    },
    {
      name: 'Isabella Jackson',
      email: 'isabella.jackson@example.com'
    },
    {
      name: 'Mia Clark',
      email: 'mia.clark@example.com'
    },
    {
      name: 'Mason Lee',
      email: 'mason.lee@example.com'
    },
    {
      name: 'Layla Harris',
      email: 'layla.harris@example.com'
    },
    {
      name: 'William Anderson',
      email: 'william.anderson@example.com'
    },
    {
      name: 'Ella White',
      email: 'ella.white@example.com'
    },
    {
      name: 'James Thomas',
      email: 'james.thomas@example.com'
    },
    {
      name: 'Harper Lewis',
      email: 'harper.lewis@example.com'
    },
    {
      name: 'Benjamin Moore',
      email: 'benjamin.moore@example.com'
    },
    {
      name: 'Aria Hall',
      email: 'aria.hall@example.com'
    },
    {
      name: 'Henry Turner',
      email: 'henry.turner@example.com'
    },
    {
      name: 'Scarlett Adams',
      email: 'scarlett.adams@example.com'
    }
  ])

  return { contacts }
})
