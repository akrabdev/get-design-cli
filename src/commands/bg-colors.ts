import chalk from 'chalk'
import convert from 'color-convert'
import { customGluegunToolbox } from '../types'

module.exports = {
  name: 'bg-colors',
  alias: 'bgc',
  run: async (toolbox: customGluegunToolbox) => {
    // no url provided
    if (!toolbox.parameters.first) {
      toolbox.print.info('pass page URL!')
      return
    }
    const URL = toolbox.parameters.first

    const [browser, page] = await toolbox.getPage(URL)

    /**
     * Fetch the styles from the page for a given property
     * @param property - The CSS property to get the values of.
     */
    const getStyles = async (property: string) =>
      await page.evaluate((property: string) => {
        const domNodes = Array.from(document.querySelectorAll('*'))
        return [
          ...new Set(
            domNodes.map((element) =>
              getComputedStyle(element).getPropertyValue(property)
            )
          ),
        ]
      }, property)

    // Format the page styles
    const styles = {
      background: (await getStyles('background-color')).map(
        (color) =>
          `#${convert.rgb.hex(
            color
              // Add # and remove rgb and () and split by ,
              .replace('rgb', '')
              .replace(/\(/, '')
              .replace(/\)/, '')
              .split(',')
          )}`
      ),
    }

    await browser.close()

    // Output the styles
    toolbox.print.info(
      `
      background-colors:
      ${styles.background
        .map(
          (background) =>
            `${chalk.bgHex(background).hex(toolbox.invertHex(background))(
              background
            )}`
        )
        .join(`    `)}
      `
    )
  },
}
