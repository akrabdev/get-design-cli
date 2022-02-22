import chalk from 'chalk'
import convert from 'color-convert'
import { GluegunToolbox } from 'gluegun'
import puppeteer from 'puppeteer'

/**
 * Invert a hexadecimal color.
 * @param {string} hex - the hexadecimal value to be inverted.
 */
const invertHex = (hex: string) =>
  (Number(`0x1${hex.substring(1)}`) ^ 0xffffff)
    .toString(16)
    .substring(1)
    .toUpperCase()

module.exports = {
  name: 'bg-colors',
  alias: 'bgc',
  run: async (toolbox: GluegunToolbox) => {
    // no url provided
    if (!toolbox.parameters.first) {
      toolbox.print.info('pass page URL!')
      return
    }
    const url = toolbox.parameters.first

    // Launch puppeteer instance and go to the URL
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url, {
      waitUntil: 'networkidle2',
    })

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
      font: await getStyles('font-family'),
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
      color: await getStyles('color'),
    }

    await browser.close()

    // Output the styles
    toolbox.print.info(
      `
      background-colors:
      ${styles.background
        .map(
          (background) =>
            `${chalk.bgHex(background).hex(invertHex(background))(background)}`
        )
        .join(`    `)}
      `
    )
  },
}
