import { GluegunToolbox } from 'gluegun'

const jsdom = require('jsdom')
const { JSDOM } = jsdom

const chalk = require('chalk')

module.exports = {
  name: 'bg-colors',
  alias: 'bgc',
  run: async (toolbox: GluegunToolbox) => {
    // no url provided
    if (!toolbox.parameters.first) {
      toolbox.print.info('pass page URL!')
      return
    }
    toolbox.print.info(chalk.blue('hi'))
    const url = toolbox.parameters.first
    const api = toolbox.http.create({ baseURL: url })
    const response = await api.get(api.getBaseURL())
    const dom = new JSDOM(response.data)
    const window = dom.window
    const document = window.document
    const elements = document.getElementsByTagName('*')
    const getComputedStyle = window.getComputedStyle

    for (let i = 0; i < elements.length; i++) {
      const background = getComputedStyle(elements[i])._values.background

      if (background && background.substring(0, 3) === 'rgb') {
        const rgb = background
          .substring(4, background.length - 1)
          .replace(/ /g, '')
          .split(',')
        console.log(chalk.bgHex('#FFFFFF').rgb(...rgb)(...rgb))
      }
    }
  },
}
