# vue-admin-ui

## Style

[Bulma](https://bulma.io/documentation/)
[Buefy](https://buefy.github.io/#/documentation/)

## Markdown support

marked: Doesn't support syntax highlighting in code snippets?
vue-markdown: Not compatible with Babel 7, and project looks a bit dead

Chosen: [markdown-it](https://github.com/markdown-it/markdown-it)
Demo [here](https://markdown-it.github.io/)

## Picture upload

Encode image in base64 and send it to our lambda with the rest
of the question fields?
Lambda uploads it to S3, get the link and update the question
imgSrc?

## TODO

Add remaining fields:
 - location

Add vue-router

Call lambda that would add question to S3?

Review style of Markdown preview (titles, ul/li, etc...)
