import { extendArrayMetadata } from "@nestjs/common/utils/extend-metadata.util";
import { RPC_METADATA } from "../constants";

export function Rpc(): MethodDecorator {
    return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {
        extendArrayMetadata(RPC_METADATA, [descriptor.value], descriptor.value);
        return descriptor;
    };
}