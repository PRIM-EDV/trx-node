import { Injectable } from "@nestjs/common";
import { MapEntity } from "@phobos-maptool/models";
import { Request, SetMapEntity_Response } from "@phobos-maptool/protocol";
import { fromMapEntityDto, toMapEntityDto } from "@phobos-maptool/dto";



import { MapEntityRpcGateway } from "./map-entity.rpc.gateway";
import { IMapEntityRpcAdapter } from "src/core/map-entity/interfaces/map-entity.rpc.adapter.interface";


@Injectable()
export class MapEntityRpcAdapter implements IMapEntityRpcAdapter {
    constructor(
        private readonly gateway: MapEntityRpcGateway
    ) {
        console.log('MapEntityRpcAdapter instantiated');
    }

    public async setEntity(entity: MapEntity): Promise<void> {
        const request: Request = {
            setMapEntity: { entity: toMapEntityDto(entity) }
        };
        await this.gateway.request(request);
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