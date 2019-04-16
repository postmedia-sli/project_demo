import { CommonUtils } from './common-utils'

describe('./common-utils.ts', () => {

    it('should decamleize a camelCase string', () => {
        const str = 'laCroix'
        expect(CommonUtils.deCamelizedName(str)).toBe('la Croix')
    })

    it('should alter the camelCase object keys', () => {
        const obj: object = {
            WidgetName: 'Name of the widget',
            WidgetPosition: 'Middle',
            WidgetType: 'Type of Widget'
        }

        expect(CommonUtils.processEventAttributes(obj)).toEqual(
            {
                'Widget Name': 'Name of the widget',
                'Widget Position': 'Middle',
                'Widget Type': 'Type of Widget'
            }
        )
    })
})
