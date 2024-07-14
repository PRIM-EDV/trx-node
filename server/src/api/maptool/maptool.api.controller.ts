import { Injectable } from "@nestjs/common";
import { Rpc, RpcHandler } from "src/core/rpc/decorators";
import { WebsocketService } from "src/core/websocket/websocket.service";

 @RpcHandler(WebsocketService)
 export class MaptoolApiController {
     constructor() {
     }

     @Rpc()
     SetMapEntity() {
     }
 }