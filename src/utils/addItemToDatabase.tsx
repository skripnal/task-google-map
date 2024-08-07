import { get, ref, set, update } from 'firebase/database'
import { database } from '../configFirebase'
import { Timestamp } from 'firebase/firestore'
import Point from '../interfaces/Point'

const addItemToDatabase = async (point: Point) => {
    try {
        await set(ref(database, 'Quests/Quest ' + point.number), {
            Location: point.location,
            Timestamp: Timestamp.now(),
        })
        const itemRef = ref(database, `Quests/Quest ${point.number - 1}`)
        const snapshot = await get(itemRef)
        if (snapshot.exists()) {
            const itemData = snapshot.val()
            await update(itemRef, { ...itemData, Next: point.number })
        }
    } catch (error) {
        console.error('Error adding document: ', error)
    }
}

export default addItemToDatabase
