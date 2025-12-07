export const flagLink = (id: string) => {
    switch(id) {
        case 'vi':
            return flagMapping['vi'];
        case 'ja':
            return flagMapping['ja'];
        case 'en':
            return flagMapping['en'];
        case 'ko':
            return flagMapping['ko'];
        case 'zh':
            return flagMapping['zh'];
        case 'ru':
            return flagMapping['ru'];
        case 'zh-CN':
            return flagMapping['zh-CN'];
        default:
            return flagMapping['vi'];
    }
};

export const flagMapping = {
    'vi': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/50px-Flag_of_Vietnam.svg.png",
    'ja': "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/50px-Flag_of_Japan.svg.png",
    'ru': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/50px-Flag_of_Russia.svg.png",
    'ko': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/50px-Flag_of_South_Korea.svg.png",
    'en': "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/50px-Flag_of_the_United_States.svg.png",
    'zh': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/50px-Flag_of_the_People%27s_Republic_of_China.svg.png",
    'zh-CN': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Flag_of_the_Republic_of_China.svg/50px-Flag_of_the_Republic_of_China.svg.png",
}
