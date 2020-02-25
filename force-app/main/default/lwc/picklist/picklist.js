import { LightningElement, api, track, wire } from 'lwc'
import { getPicklistValues } from 'lightning/uiObjectInfoApi'

const VARIANTS = [
  'standard',
  'label-hidden',
  'label-inline',
  'label-stacked'
]

export default class Picklist extends LightningElement {
  @api fieldDescribe
  @api recordTypeId
  @api default

  @api label
  @api fieldLevelHelp
  @api disabled = false
  @api required = false

  @track errors = []
  @track _variant
  @api
  get variant () { return this._variant }
  set variant (val) {
    if (!VARIANTS.includes(val)) throw new Error('Property variant expects values of ', VARIANTS.join(', '))

    this._variant = val
  }

  @track selected
  @track options

  @wire(getPicklistValues, { recordTypeId: '$recordTypeId', fieldApiName: '$fieldDescribe' })
  wiredPicklistValues ({ error, data }) {
    if (error) {
      this.errors.push(error)
      console.error('Error', error)
    } else if (data) {
      this.options = data.values.map(({ label, value }) => ({ label, value }))
      this.setDefaultSelected(data)
    }
  }

  setDefaultSelected ({ defaultValue }) {
    if (this.default) {
      this.selected = this.default
    } else if (defaultValue) {
      this.selected = defaultValue.value
    } else {
      this.selected = this.options[0].value
    }
  }

  onChange (event) {
    this.selected = event.target.value
    const selected = new CustomEvent('selected', {
      detail: this.selected
    })
    this.dispatchEvent(selected)
  }
}