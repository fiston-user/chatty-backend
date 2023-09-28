export class Helpers {
  static firstLetterUppercase(str: string): string {
    const valueString = str.toLowerCase();
    return valueString
      .split(' ')
      .map((word: string) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
      .join(' ');
  }

  static lowercase(st: string): string {
    return st.toLowerCase();
  }

  static generateRandomIntegers(length: number): number {
    const characters = '0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return parseInt(result, 10);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static parseJson(json: string): any {
    try {
      JSON.parse(json);
    } catch (e) {
      return json;
    }
    return JSON.parse(json);
  }

  static isDataURL(value: string): boolean {
    const dataUrlRegex = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
    return dataUrlRegex.test(value);
  }
}
