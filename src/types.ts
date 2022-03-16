import { GluegunToolbox } from 'gluegun'
import puppeteer from 'puppeteer'

export interface customGluegunToolbox extends GluegunToolbox {
  invertHex: (hex: string) => string
  getPage: (URL: string) => Promise<[puppeteer.Browser, puppeteer.Page]>
}
