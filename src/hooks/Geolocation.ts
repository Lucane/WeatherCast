import { useState, useEffect } from 'react'

interface LocationState {
    latitude: number | null
    longitude: number | null
    error: string | null
}

/**
 * Custom hook to obtain the user's geolocation.
 *
 * @returns {LocationState} An object containing the current `location` state (`latitude`, `longitude` and `error`).
 * 
 * @remarks
 * - The hook uses the Geolocation API to watch the user's position, and automatically updates the location state.
 * - If an error occurs while retrieving location, `location.error` will contain the relevant error message.
 * 
 * @example
 * const location = useLocationState()
 * 
 * if (location.error) {
 *     console.error("Geolocation error:", location.error)
 * } else {
 *     console.log("Current location:", location.latitude, location.longitude)
 * }
 * 
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 */
export const useLocationState = () => {
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        error: null,
    })

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prevState => ({
                ...prevState,
                error: "geolocation not supported",
            }))

            return
        }

        const handleSuccess = (position: GeolocationPosition) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
            })
        }

        const handleError = (error: GeolocationPositionError) => {
            setLocation(prevState => ({
                ...prevState,
                error: error.message,
            }))
        }

        const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError)

        return () => {
            navigator.geolocation.clearWatch(watcher)
        }
    }, [])

    return location
}

export enum LocationPermissionStatus {
    GRANTED = 'granted',
    DENIED = 'denied',
    PROMPT = 'prompt',
}

/**
 * Custom hook to retrieve the geolocation permission status of the browser.
 *
 * @returns {LocationPermissionStatus | null} The current geolocation permission status (`granted`, `denied` or `prompt`).
 * 
 * @remarks
 * - The hook automatically updates the permission status if the user changes it.
 * - Returns `null` if the Permissions API is not available or if the status cannot be determined.
 * 
 * @example
 * const permissionStatus = useLocationPermissionStatus()
 * 
 * if (permissionStatus === LocationPermissionStatus.GRANTED) {
 *     console.log("Permission granted")
 * } else if (permissionStatus === LocationPermissionStatus.DENIED) {
 *     console.log("Permission denied")
 * } else {
 *     console.log("Permission prompt or unknown")
 * }
 * 
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
 */
export const useLocationPermissionStatus = () => {
    const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus | null>(null)

    const updatePermissionStatus = async (result: PermissionStatus) => {
        setPermissionStatus(
            LocationPermissionStatus[
            result.state.toUpperCase() as keyof typeof LocationPermissionStatus
            ]
        )
    }

    if (!navigator.permissions) return null

    navigator.permissions.query({ name: 'geolocation' })
        .then(result => {
            result.onchange = () => {
                updatePermissionStatus(result)
            }

            updatePermissionStatus(result)
        })

    return permissionStatus
}