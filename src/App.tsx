import {
    APIProvider,
    ControlPosition,
    Map,
    MapControl,
    MapMouseEvent,
} from '@vis.gl/react-google-maps'
import { FC, useEffect, useState } from 'react'
import ClasteredPoints from './components/ClasteredPoints'
import { database } from './configFirebase'

import { ref, get, remove, update } from 'firebase/database'
import Point from './interfaces/Point'
import addItemToDatabase from './utils/addItemToDatabase'
import deleteItemFromDatabase from './utils/deleteItemFromDatabase'
import fetchData from './utils/fetchData'

const App: FC = () => {
    const [points, setPoints] = useState<Point[]>([])
    const [count, setCount] = useState<number>(1)

    useEffect(() => {
        fetchData().then((data) => {
            setPoints(data)
            if (data.length > 0) {
                setCount(Math.max(...data.map((el) => el.number)) + 1)
            }
        })
    }, [])

    useEffect(() => {
        if (points.length === 0) {
            setCount(1)
        }
    }, [points])

    const mapClickHandler = (event: MapMouseEvent) => {
        if (event.detail.latLng) {
            const newPoint: Point = {
                number: count,
                location: {
                    lat: event.detail.latLng.lat,
                    lng: event.detail.latLng.lng,
                },
            }
            setPoints([...points, newPoint])
            setCount(count + 1)
            addItemToDatabase(newPoint)
        }
    }

    const pointDrugHandler = async (
        event: google.maps.MapMouseEvent,
        number: number
    ) => {
        const filteredMarkers = points.filter((el) => el.number !== number)
        const lat = event.latLng?.lat() ? event.latLng?.lat() : 0
        const lng = event.latLng?.lng() ? event.latLng?.lng() : 0
        const itemRef = ref(database, `Quests/Quest ${number}`)
        const snapshot = await get(itemRef)
        if (snapshot.exists()) {
            const itemData = snapshot.val()
            await update(itemRef, { ...itemData, Location: { lat, lng } })
        }
        setPoints([
            ...filteredMarkers,
            { number, location: { lat: lat, lng: lng }, next: number + 1 },
        ])
    }

    const deletePointHandler = async (number: number) => {
        setPoints((prevPoints) =>
            prevPoints.filter((el) => el.number !== number)
        )

        if (number === count - 1) {
            setCount((prevCount) => prevCount - 1)
        }

        await deleteItemFromDatabase(number)
        if (number === count - 1) {
            setCount(count - 1)
        }
    }

    const deleteAllPointer = async () => {
        setPoints([])
        setCount(1)
        try {
            const dataRef = ref(database, 'Quests')
            await remove(dataRef)
        } catch (error) {
            console.log(error)
        }
    }

    console.log(process.env.REACT_APP_FIREBASE_CONFIG)

    return (
        <APIProvider apiKey={String(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)}>
            <div style={{ width: '100%', height: '100vh' }}>
                <Map
                    onClick={mapClickHandler}
                    defaultCenter={{ lat: 53.54992, lng: 10.00678 }}
                    defaultZoom={3}
                    mapId={'4504f8b37365c3d0'}
                >
                    <MapControl position={ControlPosition.RIGHT_TOP}>
                        <div
                            style={{
                                backgroundColor: 'white',
                                fontSize: '20px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                marginRight: '10px',
                            }}
                            onClick={deleteAllPointer}
                        >
                            Delete All Markers
                        </div>
                    </MapControl>
                    <ClasteredPoints
                        points={points}
                        pointDrugHandler={pointDrugHandler}
                        deletePointHandler={deletePointHandler}
                    />
                </Map>
            </div>
        </APIProvider>
    )
}

export default App
