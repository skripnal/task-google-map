import { child, get, ref } from 'firebase/database'
import Point from '../interfaces/Point'
import { database } from '../configFirebase'

const fetchData = (): Promise<Point[]> => {
    const databaseRef = ref(database)
    const data: Point[] = []
    return get(child(databaseRef, 'Quests'))
        .then((snapshot) => {
            snapshot.forEach((snapshotElement) => {
                const element = snapshotElement.val()
                const point: Point = {
                    number: Number(snapshotElement.key.split(' ')[1]),
                    location: element.Location,
                    next: element?.next,
                }
                data.push(point)
            })
            return data
        })
        .catch((error) => {
            console.log(error)
            return []
        })
}

export default fetchData
