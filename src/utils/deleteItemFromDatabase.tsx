import { ref, remove } from 'firebase/database'
import { database } from '../configFirebase'

const deleteItemFromDatabase = async (number: number) => {
    try {
        const itemRef = ref(database, `Quests/Quest ${number}`)
        await remove(itemRef)
    } catch (error) {
        console.error(error)
    }
}

export default deleteItemFromDatabase
