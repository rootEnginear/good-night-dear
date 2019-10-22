var app = new Vue({
  el: "#app",
  mounted: function() {
    axios.get("assets/story.txt").then(
      function(res) {
        this.data = res.data.split(" ");
        this.dataLength = this.data.length;
        this.isLoading = false;
        this.generateStory();
      }.bind(this)
    );
  },
  data: function() {
    return {
      isLoading: true,
      // Data
      data: "",
      dataLength: 0,
      // Story
      storyLength: 5,
      currentStory: "กำลังโหลด...",
      userTranslation: "",
      // Modal
      modalContentCorrent: "",
      modalContentInput: "",
      modalPercentage: 0.0
    };
  },
  computed: {
    skoyStory: function() {
      return this.currentStory.toSkoy();
    }
  },
  methods: {
    toggleModal: function(ref) {
      this.$refs[ref].click();
    },
    generateStory: function() {
      var startingIndex = Math.floor(
        Math.random() * (this.dataLength - this.storyLength)
      );
      this.currentStory = this.data
        .slice(startingIndex, startingIndex + this.storyLength)
        .join(" ");
      this.userTranslation = "";
    },
    checkStory: function() {
      var storyDifferences = Diff.diffChars(
          this.currentStory,
          this.userTranslation.trim().replace(/\s+/g, " ")
        ),
        diffReal = "",
        diffInput = "",
        charLength = 0,
        charCorrect = 0;
      storyDifferences.forEach(function(part) {
        if (part.added) {
          diffInput += "<span style='color:red'>" + part.value + "</span>";
        } else if (part.removed) {
          charLength += part.value.length;
          diffReal += "<span style='color:green'>" + part.value + "</span>";
        } else {
          diffInput += part.value;
          diffReal += part.value;
          charCorrect += part.value.length;
          charLength += part.value.length;
        }
      });
      this.modalContentCorrent = diffReal;
      this.modalContentInput = diffInput;
      this.modalPercentage = Math.round((charCorrect / charLength) * 1e4) / 1e2;
      this.toggleModal("solutionModal");
    },
    newStory: function() {
      this.generateStory();
      this.toggleModal("solutionModal");
    }
  }
});
