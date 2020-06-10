export class #[enum.component,PascalCase]#Enum {
  static #[enum.component,PascalCase]# = [
@[enum.values]@
    { value: ?[!enum.isNumeric]?'?[end]?#[value]#?[!enum.isNumeric]?'?[end]?, label: '#[value]# - #[label]#' },
@[end]@
  ];

  static getDescription(value) {
    let _item = this.#[enum.component,PascalCase]#.find(item => item.value == value);
    if (_item)
        return _item.label;
    return '';
  }
}
