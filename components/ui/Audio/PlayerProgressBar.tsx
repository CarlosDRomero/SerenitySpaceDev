import { formatSecondsToMinutes } from '@/utils/format'
import { Audio } from 'expo-av'
import { useState } from 'react'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import { Slider } from 'react-native-awesome-slider'
import { useSharedValue } from 'react-native-reanimated'

interface PlayerProgressBarProps extends ViewProps{
	duration: number
	position: number
	sound: Audio.Sound
}

export const PlayerProgressBar = ({ style, duration, position, sound }: PlayerProgressBarProps) => {

	const isSliding = useSharedValue(false)
	const progress = useSharedValue(0)
	const min = useSharedValue(0)
	const max = useSharedValue(1)

	const [playOnComplete, setPlayOnComplete] = useState<boolean>(false)
	const trackElapsedTime = formatSecondsToMinutes(position)
	const trackRemainingTime = formatSecondsToMinutes(duration)

	if (!isSliding.get()) {
		progress.set(duration > 0 ? position / duration : 0)
	}

	return (
		<View style={style}>
			<Slider
				progress={progress}
				minimumValue={min}
				maximumValue={max}
				containerStyle={styles.slider}
				thumbWidth={0}
				renderBubble={() => null}
				theme={{
					minimumTrackTintColor: 'rgba(255,255,255,0.6)',
					maximumTrackTintColor: 'rgba(255,255,255,0.4)',
				}}
				onSlidingStart={async () => {
					const status = await sound.getStatusAsync()
					setPlayOnComplete(status.isLoaded && status.isPlaying)
					await sound.pauseAsync()
					isSliding.set(true)
				}}
				onValueChange={async (value) => {
					await sound.setPositionAsync(value * duration)
				}}
				onSlidingComplete={async (value) => {
					// if the user is not sliding, we should not update the position
					if (!isSliding.get()) return

					isSliding.set(false)
					if (playOnComplete)
						await sound.playAsync()
					await sound.setPositionAsync(value * duration)
				}}
			/>

			<View style={styles.timeRow}>
				<Text style={styles.timeText}>{trackElapsedTime}</Text>

				<Text style={styles.timeText}>
					{trackRemainingTime}
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
  slider: {
		height: 7,
		borderRadius: 16,
	},
	timeRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'baseline',
		marginTop: 20,
	},
	timeText: {
		color: "white",
		opacity: 0.75,
		fontSize: 12,
		letterSpacing: 0.7,
		fontWeight: '500',
	},
})