declare module '@googlemaps/js-api-loader' {
  export class Loader {
    constructor(options: { apiKey: string; version: string })
    importLibrary(name: string): Promise<any>
  }
}

