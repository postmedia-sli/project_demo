import { AdBase } from './ad-base'
import { WithSticky } from './sticky/sticky'

export class Ad extends WithSticky(AdBase) { }
