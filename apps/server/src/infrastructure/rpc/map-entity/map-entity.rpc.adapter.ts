import { Injectable } from "@nestjs/common";

@Injectable()
export class MapEntityRpcAdapter {
    constructor() {
        console.log('MapEntityRpcAdapter instantiated');
    }
}