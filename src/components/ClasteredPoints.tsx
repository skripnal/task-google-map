import { Marker, MarkerClusterer } from '@googlemaps/markerclusterer'
import { AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'
import Point from '../interfaces/Point'

type Props = {
    points: Point[]
    pointDrugHandler: (e: google.maps.MapMouseEvent, id: number) => void
    deletePointHandler: (id: number) => void
}

const ClasteredPoints = ({
    points,
    pointDrugHandler,
    deletePointHandler,
}: Props) => {
    const map = useMap()
    const markersRef = useRef<{ [id: number]: Marker }>({})
    const clasterer = useRef<MarkerClusterer | null>(null)

    useEffect(() => {
        if (map && !clasterer.current) {
            clasterer.current = new MarkerClusterer({ map })
        }
    }, [map])

    useEffect(() => {
        if (clasterer.current) {
            clasterer.current.clearMarkers()
            clasterer.current.addMarkers(Object.values(markersRef.current))
        }
    }, [points])

    const setMarkerRef = (marker: Marker | null, id: number) => {
        if (marker) {
            markersRef.current[id] = marker
        } else {
            delete markersRef.current[id]
        }
    }

    return (
        <>
            {points.map((point) => (
                <AdvancedMarker
                    style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'white',
                    }}
                    ref={(marker) => setMarkerRef(marker, point.number)}
                    onClick={() => deletePointHandler(point.number)}
                    onDragEnd={(e) => pointDrugHandler(e, point.number)}
                    key={point.number}
                    position={point.location}
                >
                    <Pin glyphColor={'white'} background={'red'}>
                        {point.number}
                    </Pin>
                </AdvancedMarker>
            ))}
        </>
    )
}

export default ClasteredPoints
