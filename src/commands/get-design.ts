import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'get-design',
  run: async (toolbox) => {
    const { print } = toolbox

    print.info(
      'Welcome to get-design\nRun get-design --help for more information'
    )
  },
}

module.exports = command
