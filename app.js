const { ref, computed, onMounted } = Vue

const _game = Vue.createApp({
	setup() {
		// DATA
		const skoy = ref(new Skoy())
		const isLoading = ref(true)
		const data = ref('')
		const storyLength = ref(5)
		const currentStory = ref('')
		const userTranslation = ref('')
		const modalContentCorrent = ref('')
		const modalContentInput = ref('')
		const modalPercentage = ref(0.0)

		// REFS
		const solutionModal = ref(null)
		const aboutModal = ref(null)

		// COMPUTED
		const dataLength = computed(() => data.value.length)
		const skoyStory = computed(() => skoy.value.convert(currentStory.value))
		const modalPercentageColor = computed(() => ({
			color: ['red', 'orange', 'green', 'green'][Math.floor(modalPercentage.value / (100 / 3))],
		}))
		const modalPercentageShowOriginal = computed(
			() => modalPercentage.value > 0 && modalPercentage.value < 100
		)

		// METHODS
		const toggleSolutionModal = () => {
			solutionModal.value.click()
		}
		const toggleAboutModal = () => {
			aboutModal.value.click()
		}
		const generateStory = () => {
			const startingIndex = Math.floor(Math.random() * (dataLength.value - storyLength.value))
			currentStory.value = data.value
				.slice(startingIndex, startingIndex + storyLength.value)
				.join(' ')
			userTranslation.value = ''
		}
		const checkStory = () => {
			const storyDifferences = Diff.diffChars(
				currentStory.value,
				userTranslation.value.replace(/\s+/g, ' ')
			)
			let diffReal = '',
				diffInput = '',
				charLength = 0,
				charCorrect = 0
			storyDifferences.forEach(function (part) {
				if (part.added) {
					diffInput += "<span style='color:red'>" + part.value + '</span>'
				} else if (part.removed) {
					charLength += part.value.length
					diffReal += "<span style='color:green'>" + part.value + '</span>'
				} else {
					diffInput += part.value
					diffReal += part.value
					charCorrect += part.value.length
					charLength += part.value.length
				}
			})
			modalContentCorrent.value = diffReal
			modalContentInput.value = diffInput
			modalPercentage.value = Math.round((charCorrect / charLength) * 1e4) / 1e2
			toggleSolutionModal()
		}
		const newStory = () => {
			generateStory()
			toggleSolutionModal()
		}

		// ON MOUNTED
		onMounted(() => {
			fetch('./assets/story.txt')
				.then((res) => res.text())
				.then((text) => {
					data.value = text.split(' ')
					isLoading.value = false
					generateStory()
				})
		})

		return {
			isLoading,
			generateStory,

			skoyStory,
			userTranslation,

			checkStory,
			solutionModal,
			modalPercentageColor,
			modalPercentage,
			modalPercentageShowOriginal,
			modalContentCorrent,
			modalContentInput,
			newStory,

			aboutModal,
			toggleAboutModal,
		}
	},
}).mount('#app')
