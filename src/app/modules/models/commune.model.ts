export class CommuneModel {
  comuna: Comuna;

  constructor(_commune: unknown) {
    const commune = _commune as CommuneModel;
    this.comuna = commune.comuna;
  }
}

export interface Comuna {
  name: string;
  code: string;
  contained_in: ContainedIn;
}

export interface ContainedIn {
  provincia: Provincia;
}

export interface Provincia {
  code: string;
}
