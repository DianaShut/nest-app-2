export class TransformHelper {
  public static trim({ value }) {
    return value ? value.trim() : value;
  } // трансформер для обрізання пробілів

  public static toLowerCase({ value }) {
    return value ? value.toLowerCase() : value;
  } // змінює регістр на нижній
}
