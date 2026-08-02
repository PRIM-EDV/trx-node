import { Injectable } from "@nestjs/common";
import { MapEntity } from "@phobos-maptool/models";
import { Request, SetMapEntity_Response } from "@phobos-maptool/protocol";
import { fromMapEntityDto, toMapEntityDto } from "@phobos-maptool/dto";



import { MaptoolRpcGateway } from "./maptool.rpc.gateway";
import { IMaptoolRpcAdapter } from "src/core/map-entity/interfaces/maptool.rpc.adapter.interface";


@Injectable()
export class MaptoolRpcAdapter implements IMaptoolRpcAdapter {
    constructor(
        private readonly gateway: MaptoolRpcGateway
    ) {
        console.log('MaptoolRpcAdapter instantiated');
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