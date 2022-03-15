import { GluegunToolbox } from 'gluegun'

export interface customGluegunToolbox extends GluegunToolbox {
  invertHex: (hex: string) => string
}
