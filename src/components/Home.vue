<template>

  <section class="section">
    <div class="container">

      <div class="columns is-vcentered">
        <div class="column has-text-centered">
          <a class="link is-info">Questions</a>
        </div>
        <div class="column has-text-centered">
          <a class="link is-info">Map</a>
        </div>
        <div class="column is-half has-text-centered">
          <h3 class="title is-3">Hidden Tech Challenge</h3>
        </div>
        <div class="column has-text-centered">
          <a class="link is-info">Leaderboard</a>
        </div>
        <div class="column has-text-centered">
          <a class="link is-info">About</a>
        </div>
      </div>

      <hr>

      <h1 class="title">
        Add a question
      </h1>

      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input class="input is-rounded" type="text" v-model="name">
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Question</label>
            <div class="control">
              <textarea
                :value="question"
                @input="updateMarkdownPreview"
                class="textarea"
                placeholder="Markdown supported"
                rows="6"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Preview</label>
            <div class="control">
              <div v-html="compiledMarkdown"></div>
            </div>
          </div>
        </div>
      </div>

      <label class="label">(PNG or JPG)</label>
      <div class="field">
        <picture-input
          @change="onPictureSelected"
          width="250"
          height="150"
          buttonClass="button is-primary is-outlined"
          removeButtonClass="button is-outlined"
          :customStrings="fileUploadCustomTexts"
          :removable="true"
        />
      </div>

      <div class="field">
        <label class="label">Type</label>
        <div class="control">
          <b-field>
            <b-radio-button
              v-for="type of questionTypes" :key="type.code"
              v-model="questionType"
              :native-value="type.code"
              type="is-link"
            >
              <span>
                {{ type.label }}
              </span>
            </b-radio-button>
          </b-field>
        </div>
      </div>

      <div class="field" v-if="questionType === 'free-text'">
        <label class="label">Answer</label>
        <div class="control">
          <input class="input" type="text">
        </div>
      </div>

      <div class="field" v-if="questionType === 'multiple-choices'">
        <label class="label">Possible choices</label>
        <div class="control">
          <b-field v-for="(choice, index) of possibleChoices" :key="index">
            <b-radio-button
              :native-value="index"
              v-model="rightAnswer"
              type="is-success"
              :disabled="choice.value === ''"
            >
              <span>
                 Right answer?
              </span>
            </b-radio-button>
            <b-input
              type="text"
              v-model="choice.value"
              placeholder="Add another option..."
              rounded
              expanded
            >
            </b-input>
          </b-field>
        </div>
      </div>

      <div class="field">
        <label class="label">Points</label>
        <div class="control">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <input class="input is-rounded" type="text">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Difficulty</label>
        <div class="control">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <input class="input is-rounded" type="text">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <b-field label="Release date">
                  <b-datepicker
                    placeholder="Click to select..."
                    icon="calendar-today"
                    v-model="releaseDate"
                    :min-date="minReleaseDate"
                    :first-day-of-week="datePickerFirstDayOfWeek"
                    :focused-date="new Date()"
                  ></b-datepicker>
                </b-field>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Unlocked by default?</label>
        <div class="control">
          <b-field>
            <b-radio-button
              v-model="isUnlocked"
              :native-value="true"
              type="is-link"
            >
              <span>
                Yes
              </span>
            </b-radio-button>
            <b-radio-button
              v-model="isUnlocked"
              :native-value="false"
              type="is-link"
            >
              <span>
                No
              </span>
            </b-radio-button>
          </b-field>
        </div>
      </div>

      <div class="field">
        <label class="label">Number of attempts</label>
        <div class="control">
          <div class="columns is-vcentered">
            <div class="column is-narrow">
              <b-input
                type="number"
                v-model="nbAttempts"
                rounded
              >
              </b-input>
            </div>
            <div class="column is-narrow">
              or
            </div>
            <div class="column">
              <b-radio-button
                :value="isUnlimitedAttempts"
                :native-value="true"
                type="is-link"
              >
                  <span>
                    Unlimited
                  </span>
              </b-radio-button>
            </div>
          </div>
        </div>
      </div>

      <div class="field is-grouped" style="margin-top: 40px;">
        <div class="control">
          <button class="button is-link" @click="submitQuestion">Submit</button>
        </div>
        <div class="control">
          <button class="button is-text">Cancel</button>
        </div>
      </div>

      <div class="level">
        {{ questionJson }}
      </div>

    </div>
  </section>
</template>

<script>
  import debounce from 'lodash.debounce'
  import markownIt from 'markdown-it'
  import emoji from 'markdown-it-emoji'
  import hljs from 'highlightjs'
  import PictureInput from 'vue-picture-input'

  const markown = markownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch (err) {
          console.log('Fail to highlight code snippet... Language:', lang)
        }
      }
      return ''
    }
  }).use(emoji)

  export default {
    name: 'Home',
    components: {
      PictureInput,
    },
    data() {
      const today = new Date()

      return {
        name: '',

        question: '**Markdown** _supported_ with emojis 8-)',

        fileUploadCustomTexts: {
          upload: '<h1>Bummer!</h1>',
          drag: 'Drag your question picture here...'
        },

        questionTypes: [
          {
            code: 'free-text',
            label: 'Free text',
          },
          {
            code: 'multiple-choices',
            label: 'Multiple choices',
          }
        ],
        questionType: 'multiple-choices',
        possibleChoices: [{
          value: '',
        }, {
          value: '',
        }],
        rightAnswer: null,
        isUnlocked: false,

        datePickerFirstDayOfWeek: 1,
        releaseDate: null,
        minReleaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),

        nbAttempts: '',

        questionJson: '',
      }
    },
    computed: {
      compiledMarkdown: function () {
        return markown.render(this.question)
      },
      isUnlimitedAttempts() {
        return this.nbAttempts === ''
      },
    },
    watch: {
      possibleChoices: {
        handler: function (val) {
          if (val[val.length - 1].value) {
            this.possibleChoices.push({value: ''})
          } else if (val.length > 1 && val[val.length - 1].value === '' && val[val.length - 2].value === '') {
            this.possibleChoices.splice(val.length - 1, 1)
          }
          if (this.rightAnswer !== null && this.possibleChoices[this.rightAnswer].value === '') {
            this.rightAnswer = null
          }
        },
        deep: true
      },
    },
    methods: {
      updateMarkdownPreview: debounce(function (e) {
        this.question = e.target.value
      }, 300),
      submitQuestion() {
        const json = {
          name: this.name,
          question: this.question,
          questionType: this.questionType,
          possibleChoices: this.possibleChoices,
          rightAnswer: this.rightAnswer,
          isUnlocked: this.isUnlocked,
          releaseDate: this.releaseDate,
          nbAttempts: this.nbAttempts,
        }
        this.questionJson = JSON.stringify(json)
      },
      onPictureSelected(image) {
        console.log('New picture selected!')
        if (image) {
          console.log('Picture loaded.')
          this.image = image
        }
      },
    },
  }
</script>

<style scoped>

  .picture-input {
    text-align: left !important;
  }

  .picture-input /deep/ .preview-container {
    margin: 0;
  }

</style>
