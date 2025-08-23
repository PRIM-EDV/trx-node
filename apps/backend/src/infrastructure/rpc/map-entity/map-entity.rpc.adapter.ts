import { Injectable } from "@nestjs/common";
import { MapEntity } from "@phobos-maptool/models";
import { Request } from "@phobos-maptool/protocol";
import { MapEntityRpcGateway } from "./map-entity.rpc.gateway";
import { fromMapEntityDto } from "@phobos-maptool/dto";

@Injectable()
export class MapEntityRpcAdapter {
    constructor(
        private readonly gateway: MapEntityRpcGateway
    ) {
        console.log('MapEntityRpcAdapter instantiated');
    }

    public async  getAllMapEntities(): Promise<MapEntity[]> {
        const request: Request = {
            getAllMapEntities: {}
        }

        const response = await this.gateway.request(request);
        const entities = response.getAllMapEntities.entities.map(fromMapEntityDto);

        return entities;
    }
}