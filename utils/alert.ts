import { Alert, AlertButton, AlertOptions, Platform } from 'react-native'

const alertPolyfill = (title: string, description?: string, options?: AlertButton[], extra?: AlertOptions) => {
    const result = window.confirm([title, description].filter(Boolean).join('\n'))
    if (!options) return
    if (result) {
        const confirmOption = options.find(({ style }) => style !== 'cancel')
        confirmOption?.onPress && confirmOption.onPress()
    } else {
        const cancelOption = options.find(({ style }) => style === 'cancel')
        cancelOption?.onPress && cancelOption.onPress()
    }
}

const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert
export default alert