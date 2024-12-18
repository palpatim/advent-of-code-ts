export class TreeNode<T> {
  children: TreeNode<T>[];

  constructor(
    public value: T,
    public parent: TreeNode<T> | undefined = undefined
  ) {
    this.value = value;
    this.children = [];
  }

  getPathToRoot = (): T[] => {
    const path: T[] = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: TreeNode<T> | undefined = this;
    while (current) {
      path.unshift(current.value);
      current = current.parent;
    }
    return path;
  };
}
