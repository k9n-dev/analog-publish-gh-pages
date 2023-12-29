import * as fs from 'fs'
import { load } from 'js-yaml'

// Read the contents of the actions.yml file
const actionsYamlPath = './action.yml'
const actionsYamlContent = fs.readFileSync(actionsYamlPath, 'utf8')

// Parse YAML content
const actionsData = load(actionsYamlContent)

// Generate Markdown table
const generateMarkdownTable = data => {
  const headers = ['input', 'required', 'default', 'description']
  const rows = Object.entries(data).map(([key, item]) => [
    key,
    `\`${item.required}\``,
    item.default ? `\`${item.default}\`` : '-',
    item.description
  ])

  const table = [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => ' --- ').join(' | ')} |`,
    ...rows.map(row => `| ${row.join(' | ')} |`)
  ]

  return table.join('\n')
}

// Insert/Update the generated table in README.md
const readmePath = './README.md'
const readmeContent = fs.readFileSync(readmePath, 'utf8')

const startComment = '<!-- START: table generated from actions.yml -->'
const endComment = '<!-- END: table generated from actions.yml -->'

const startIndex = readmeContent.indexOf(startComment)
const endIndex = readmeContent.indexOf(endComment) + endComment.length

const table = generateMarkdownTable(actionsData.inputs)
const updatedReadmeContent = `${readmeContent.slice(
  0,
  startIndex
)}${startComment}\n${table}\n${endComment}${readmeContent.slice(endIndex)}`

// Write the updated content back to README.md
fs.writeFileSync(readmePath, updatedReadmeContent, 'utf8')
console.log('Markdown table generated and updated in README.md')
