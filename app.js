var _game = new Vue({
	el: '#app',
	mounted: function () {
		fetch('./assets/story.txt')
			.then((res) => res.text())
			.then((text) => {
				this.data = text.split(' ')
				this.isLoading = false
				this.generateStory()
			})
	},
	data: function () {
		return {
			skoy: new Skoy(),
			isLoading: true,
			// Data
			data: '',
			// Story
			storyLength: 5,
			currentStory: 'กำลังโหลด...',
			userTranslation: '',
			// Modal
			modalContentCorrent: '',
			modalContentInput: '',
			modalPercentage: 0.0,
		}
	},
	computed: {
		dataLength: function () {
			return this.data.length
		},
		skoyStory: function () {
			return this.skoy.convert(this.currentStory)
		},
		modalPercentageColor: function () {
			return {
				color: ['red', 'orange', 'green', 'green'][Math.floor(this.modalPercentage / (100 / 3))],
			}
		},
		modalPercentageShowOriginal: function () {
			return this.modalPercentage > 0 && this.modalPercentage < 100
		},
	},
	methods: {
		toggleModal: function (ref) {
			this.$refs[ref].click()
		},
		generateStory: function () {
			var startingIndex = Math.floor(Math.random() * (this.dataLength - this.storyLength))
			this.currentStory = this.data.slice(startingIndex, startingIndex + this.storyLength).join(' ')
			this.userTranslation = ''
		},
		checkStory: function () {
			var storyDifferences = Diff.diffChars(
					this.currentStory,
					this.userTranslation.replace(/\s+/g, ' ')
				),
				diffReal = '',
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
			this.modalContentCorrent = diffReal
			this.modalContentInput = diffInput
			this.modalPercentage = Math.round((charCorrect / charLength) * 1e4) / 1e2
			this.toggleModal('solutionModal')
		},
		newStory: function () {
			this.generateStory()
			this.toggleModal('solutionModal')
		},
	},
})
