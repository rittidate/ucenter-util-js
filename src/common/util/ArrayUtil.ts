export class ArrayUtil {
    public static sortByText(a, b): number {
        const textA = a.text.toUpperCase();
        const textB = b.text.toUpperCase();

        let comparison = 0;
        if (textA > textB) {
        comparison = 1;
        } else if (textA < textB) {
        comparison = -1;
        }
        return comparison;
    }

    public static sortByCountryName(array: any, name: string): any {
        const result = array.sort((x, y) => {
        return x.value === name ? -1 : y.value === name ? 1 : 0;
        });
        return result;
    }

    removeItem(item: any, list: any[]) {
        const index = list.indexOf(item);
        if (index !== -1) {
        list.splice(index, 1);
        }
    }
}