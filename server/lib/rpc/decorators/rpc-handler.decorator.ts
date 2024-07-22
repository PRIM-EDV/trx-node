import { RPC_HANDLER_METADATA, RPC_HANDLER_GATEWAY_METADATA } from "../constants";

export function RpcHandler(gateway: any) {
  return function (target: any) {
    Reflect.defineMetadata(RPC_HANDLER_METADATA, true, target);
    Reflect.defineMetadata(RPC_HANDLER_GATEWAY_METADATA, gateway, target);
  }
}