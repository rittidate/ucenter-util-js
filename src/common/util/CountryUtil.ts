import * as country_en from '../resources/country/country_en.json';
import * as country_th from '../resources/country/country_th.json';

export class CountryUtil {

    private static country = {
        en: country_en,
        th: country_th
    }

    public static getCountry(country: string): any {
        return this.country[country.toLowerCase()];
    }
}