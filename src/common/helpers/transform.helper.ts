export class TransformHelper {
  public static trim({ value }) {
    return value ? value.trim() : value;
  } // трансформер для обрізання пробілів

  public static trimArray({ value }) {
    return value ? value.map((item) => item.trim()) : value;
  } // видаляє пробіли з початку та кінця кожного елемента масиву рядків.

  public static toLowerCase({ value }) {
    return value ? value.toLowerCase() : value;
  } // змінює регістр на нижній

  public static uniqueItems({ value }) {
    return value ? Array.from(new Set(value)) : value;
  } // видаляє дублікати з масиву

  public static toLowerCaseArray({ value }) {
    return value ? value.map((item) => item.toLowerCase()) : value;
  } // приводить до нижнього регістру кожен елемент в масиві
}
