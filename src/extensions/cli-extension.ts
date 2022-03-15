import { customGluegunToolbox } from '../types'
// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: customGluegunToolbox) => {
  /**
   * Invert a hexadecimal color.
   * @param {string} hex - the hexadecimal value to be inverted.
   * @returns {string} - result of inversion.
   */
  toolbox.invertHex = (hex: string) =>
    (Number(`0x1${hex.substring(1)}`) ^ 0xffffff)
      .toString(16)
      .substring(1)
      .toUpperCase()

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "get-design" property),
  // get-design.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig("get-design", process.cwd())
  // }
}
