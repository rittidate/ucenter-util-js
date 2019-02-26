export class MaskUtil {
  public static accountFormatNo = (accountNo) => {
    return accountNo.toString().substring(0, 3) + '-' + accountNo.charAt(3) + '-' + accountNo.substring(4, 9) + '-' + accountNo.substring(9);
  }

  public static maskAccountNo = (accountNo) => {
    // sample out put xxx-x-x8888-x
    let result = accountNo.slice(5, 9);
    result = 'xxx-x-x' + result + '-x';
    return result;
  }
}
