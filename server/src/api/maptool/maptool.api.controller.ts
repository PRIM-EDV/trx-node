import { Injectable } from "@nestjs/common";
import { AppGateway } from "src/app.gateway";
import { RpcHandler } from "src/core/rpc/decorators";

 @RpcHandler(AppGateway)
 export class MaptoolApiController {
     constructor(private readonly appGateway: AppGateway) {
     }
 }