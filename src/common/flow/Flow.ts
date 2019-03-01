import {FormConfig} from './FormConfig';

export interface Flows {
  [name: string]: Flow;
}

export interface Flow {
  id: string;
  startPoint: string;
  storage?: any;
  env?: any;
  resources?: any;
  forms: FormConfig[];
}
