<template>
  <section class="section">
    <div class="container">

      <h1 class="title">
        Add a question
      </h1>

      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input class="input is-rounded" type="text">
        </div>
      </div>

      <div class="field">
        <label class="label">Question</label>
        <div class="control">
          <!-- TODO Need Markdown here, qnd bigger input...-->
          <input class="input is-rounded" type="text">
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
              type="is-success"
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
          <div class="level" v-for="(choice, index) of possibleChoices" :key="index">
            <div class="level-left">
              <div style="margin: 10px 15px 10px 5px;">
                <input type="radio" name="choices" disabled>
              </div>
            </div>
            <div class="level-item">
              <input class="input is-rounded" type="text" v-model="choice.value" placeholder="Add another option...">
            </div>
          </div>
        </div>
      </div>

      <div class="field" v-if="questionType === 'multiple-choices'">
        <label class="label">Right choice</label>
        <div class="control">
          <div class="level" v-for="(choice, index) of possibleChoices" :key="index" v-if="choice.value !== ''">
            <div class="level-left">
              <label class="radio">
                <input type="radio" name="answer">
                {{ choice.value }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="field is-grouped">
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

  export default {
    name: 'Home',
    data() {
      return {
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
      }
    },
    watch: {
      possibleChoices: {
        handler: function (val) {
          console.log('toto', val)
          if (val[val.length - 1].value) {
            this.possibleChoices.push({value: ''})
          } else if (val.length > 1 && val[val.length - 1].value === '' && val[val.length - 2].value === '') {
            this.possibleChoices.splice(val.length - 1, 1)
          }
        },
        deep: true
      }
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
