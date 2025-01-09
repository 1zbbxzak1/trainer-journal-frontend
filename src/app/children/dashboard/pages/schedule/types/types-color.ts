export type ColorKey = 'blue' | 'purple' | 'green' | 'orange' | 'mint' | 'blueLight' | 'yellow' | 'red';

export class ColorSchedule {
    public colorGroups: Record<ColorKey, ColorGroup> = {
        blue: {
            background: '#DDE6FF',
            hoverActive: '#9FB8FF',
            sideRectangle: '#366AF3',
            time: '#366AF3',
            nameTeam: '#2E5AD1',
        },
        purple: {
            background: '#F7D7FF',
            hoverActive: '#DEA3EC',
            sideRectangle: '#B750D1',
            time: '#B750D1',
            nameTeam: '#913CA6',
        },
        green: {
            background: '#C7F9CC',
            hoverActive: '#87E39A',
            sideRectangle: '#26AD50',
            time: '#26AD50',
            nameTeam: '#1C8A3F',
        },
        orange: {
            background: '#FFE0C3',
            hoverActive: '#FFC17D',
            sideRectangle: '#FC7630',
            time: '#FC7630',
            nameTeam: '#D46421',
        },
        mint: {
            background: '#C6F5EC',
            hoverActive: '#8BE7D8',
            sideRectangle: '#00BEA2',
            time: '#00A58D',
            nameTeam: '#00957F',
        },
        blueLight: {
            background: '#CDEDFF',
            hoverActive: '#8FCDFF',
            sideRectangle: '#2291FF',
            time: '#2291FF',
            nameTeam: '#1874CF',
        },
        yellow: {
            background: '#FFEEC2',
            hoverActive: '#FDD481',
            sideRectangle: '#FECA42',
            time: '#FDA70C',
            nameTeam: '#EF8B17',
        }
        ,
        red: {
            background: '#FFEBEB',
            hoverActive: '#FFABAB',
            sideRectangle: '#FE4C4C',
            time: '#FE4C4C',
            nameTeam: '#CC2626',
        }
    }
}

export interface ColorGroup {
    background: string;
    hoverActive: string;
    sideRectangle: string;
    time: string;
    nameTeam: string;
}
