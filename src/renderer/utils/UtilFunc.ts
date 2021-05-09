export class UtilFunc {
  /**
   * join space
   * @param names
   */
  static joinSpace(...names: string[]) {
    return names.join(' ');
  }

  /**
   * 特定の要素の子要素をクラスで検索
   * @param target
   * @param className
   * @returns
   */
  static getChildrenByClass<T extends Element>(target: T | null | undefined, className: string) {
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
}
