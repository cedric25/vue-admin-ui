<template>
  <section class="section">
    <div class="container">

      <h1 class="title">
        Add a question
      </h1>

      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input class="input is-rounded" type="text">
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

      <!-- TODO Location, picture upload, points, difficulty, release date, force unlock -->
      <!-- Later: Number of allowed attempts? -->

      <div class="field is-grouped" style="margin-top: 40px;">
        <div class="control">
          <button class="button is-link">Submit</button>
        </div>
        <div class="control">
          <button class="button is-text">Cancel</button>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
  import debounce from 'lodash.debounce'
  import markownIt from 'markdown-it'
  import emoji from 'markdown-it-emoji'
  import hljs from 'highlightjs'

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
    data() {
      return {
        question: '**Markdown** _supported_ with emojis 8-)',
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
      }
    },
    computed: {
      compiledMarkdown: function () {
        return markown.render(this.question)
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
    },
  }
</script>

<style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
