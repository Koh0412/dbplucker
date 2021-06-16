export class UtilFunc {
  /**
   * join space
   * @param names
   */
  static joinSpace(...names: string[]): string {
    return names.join(' ');
  }

  /**
   * 特定の要素の子要素をクラスで検索
   * @param target
   * @param className
   * @returns
   */
  static getChildrenByClass<T extends Element>(target: T | null | undefined, className: string): T[] {
    const elements = [];

    if (target) {
      for (let i = 0; i < target.childElementCount; i++) {
        const isContain = target.children[i].classList.contains(className);

        if (isContain) {
          elements.push(target.children[i]);
        }
      }
    }

    return elements as T[];
  }

  /**
   * yyyy-mm-dd hh:ii:ss方式の日付を返す
   * @param value
   * @returns
   */
  static getStandardDateTime(value: string | number | Date): string {
    const date = new Date(value);
    const dateOption: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    const timeOption: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    return `${date.toLocaleDateString(undefined, dateOption).replace(/\//gi, '-')} ${date.toLocaleTimeString(undefined, timeOption)}`;
  }
}
