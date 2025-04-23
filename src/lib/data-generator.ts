import type { Employee } from '../types'

const jobTitles = [
    'Software Engineer',
    'Product Manager',
    'UX Designer',
    'Marketing Specialist',
    'Customer Support',
    'Sales Representative',
    'HR Manager',
    'Data Scientist',
    'DevOps Engineer',
    'Content Writer'
]

const firstNames = [
    'John', 'Jane', 'Michael', 'Emma'
]

const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown'
]

const nicknames = [
    'Ace', 'Buddy', 'Chief', 'Doc'
]

export function generateRandomEmployee(id: number | string): Employee {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)]
    const age = Math.floor(Math.random() * 40) + 20 // 20-60 age range
    const useNickname = Math.random() > 0.4
    const nickname = useNickname ? nicknames[Math.floor(Math.random() * nicknames.length)] : ''
    const isEmployee = Math.random() > 0.3

    return {
        id: id.toString(),
        name,
        jobTitle,
        age,
        nickname,
        isEmployee
    }
}

export function generateEmployees(count: number, startId = 1): Employee[] {
    return Array.from({ length: count }, (_, index) =>
        generateRandomEmployee(startId + index)
    )
} 